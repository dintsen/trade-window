import { useState, useEffect, useRef, useCallback } from 'react';
import { RoomData, WSClientEvent, WSServerEvent } from '../lib/websocket/types';
import { TradeAsset } from '../lib/trade/assets';
import { config } from '../lib/config';

export interface LogEntry {
  id: string;
  type: 'system' | 'chat' | 'error';
  message: string;
  timestamp: Date;
}

export function useTradeRoom(walletAddress: string) {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [intentHash, setIntentHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(() => {
    const wsUrl = config.wsUrl || (process.env.NODE_ENV === 'development' ? 'ws://localhost:8080/ws' : null);
    return !wsUrl;
  });

  const wsRef = useRef<WebSocket | null>(null);

  const addLog = useCallback((type: 'system' | 'chat' | 'error', message: string) => {
    setLogs(prev => [...prev, { id: Math.random().toString(), type, message, timestamp: new Date() }]);
  }, []);

  useEffect(() => {
    if (!walletAddress) return;

    // Use deployed URL or local fallback if explicitly in dev, otherwise default to offline
    const wsUrl = config.wsUrl || (process.env.NODE_ENV === 'development' ? 'ws://localhost:8080/ws' : null);

    if (!wsUrl) {
      // eslint-disable-next-line
      setError("Backend unavailable. Offline Visual Demo mode.");
      addLog('error', 'Backend WebSocket URL not configured. Running in visual offline mode.');
      return;
    }

    const ws = new WebSocket(`${wsUrl}?wallet=${encodeURIComponent(walletAddress)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
      setIsOfflineMode(false);
      addLog('system', `Connected to backend as ${walletAddress}`);
    };

    ws.onclose = () => {
      setConnected(false);
      setError("Connection lost to backend.");
      addLog('error', 'WebSocket connection closed.');
    };

    ws.onerror = () => {
      setError("WebSocket connection error.");
      setIsOfflineMode(true); // Fallback to offline visuals if it completely fails
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSServerEvent = JSON.parse(event.data);
        switch (msg.type) {
          case 'room:state':
            setRoomData(msg.payload);
            break;
          case 'system:log':
            addLog('system', msg.payload.message);
            break;
          case 'chat:message':
            addLog('chat', `${msg.payload.sender}: ${msg.payload.message}`);
            break;
          case 'trade:error':
            setError(msg.payload.message);
            addLog('system', `Error [${msg.payload.code}]: ${msg.payload.message}`);
            break;
          case 'countdown:tick':
            setCountdown(msg.payload.seconds);
            break;
          case 'trade:ready_to_sign':
            setIntentHash(msg.payload.intentHash);
            break;
        }
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      addLog('system', 'Disconnected from backend.');
    };

    return () => {
      ws.close();
    };
  }, [walletAddress, addLog]);

  const sendMessage = useCallback((msg: WSClientEvent) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else if (isOfflineMode) {
      // Mock local actions for Vercel deployment without backend
      if (msg.type === 'room:create') {
        setRoomData({
          id: 'mock-offline-' + Math.floor(Math.random()*10000).toString(16),
          state: 'active',
          partyA: walletAddress,
          partyB: 'mock-counterparty-xyz',
          offerA: [],
          offerB: [],
          lockA: false,
          lockB: false,
          countdownAt: ''
        });
        addLog('system', `Created offline mock room`);
      } else if (msg.type === 'room:join') {

        const roomId = msg.payload?.roomId || 'joined';
        setRoomData({
          id: roomId,
          state: 'active',
          partyA: 'mock-counterparty-xyz',
          partyB: walletAddress,
          offerA: [],
          offerB: [],
          lockA: false,
          lockB: false,
          countdownAt: ''
        });
        addLog('system', `Joined offline mock room: ${roomId}`);
      } else if (msg.type === 'offer:add') {
        setRoomData(prev => {
          if (!prev) return prev;
          const isA = prev.partyA === walletAddress;

          const asset = msg.payload.asset;
          addLog('system', `Added ${asset.amount} ${asset.displayDenom}`);
          return {
            ...prev,
            offerA: isA ? [...prev.offerA, asset] : prev.offerA,
            offerB: !isA ? [...prev.offerB, asset] : prev.offerB,
            lockA: false,
            lockB: false
          };
        });
      } else if (msg.type === 'trade:lock') {
        addLog('system', `You locked the trade`);
        setRoomData(prev => {
          if (!prev) return prev;
          const isA = prev.partyA === walletAddress;
          const newRoom = {
            ...prev,
            lockA: isA ? true : prev.lockA,
            lockB: !isA ? true : prev.lockB
          };
          
          // Auto-lock the counterparty in offline mode to simulate success
          setTimeout(() => {
            addLog('system', `Mock counterparty locked the trade`);
            setRoomData(r => {
              if (!r) return r;
              const r2 = { ...r, lockA: true, lockB: true, state: 'locked_countdown' as const };
              setCountdown(10);
              let count = 10;
              const interval = setInterval(() => {
                count--;
                setCountdown(count);
                if (count <= 0) {
                  clearInterval(interval);
                  setRoomData(r3 => r3 ? { ...r3, state: 'ready_to_sign' } : r3);
                  setIntentHash('0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2));
                  addLog('system', `Hash generated. Ready to sign.`);
                }
              }, 1000);
              return r2;
            });
          }, 1500);

          return newRoom;
        });
      } else if (msg.type === 'chat:message') {
        
        addLog('chat', `${walletAddress}: ${msg.payload.message}`);
        setTimeout(() => {
          addLog('chat', `mock-counterparty-xyz: Got it!`);
        }, 1000);
      }
    }
  }, [isOfflineMode, walletAddress, addLog]);

  const actions = {
    createRoom: () => sendMessage({ type: 'room:create' }),
    joinRoom: (roomId: string) => sendMessage({ type: 'room:join', payload: { roomId } }),
    addOffer: (asset: TradeAsset) => sendMessage({ type: 'offer:add', payload: { asset } }),
    lockTrade: () => sendMessage({ type: 'trade:lock' }),
    cancelTrade: () => sendMessage({ type: 'trade:cancel' }),
    sendMessage: (message: string) => sendMessage({ type: 'chat:message', payload: { message } }),
  };

  return {
    connected,
    isOfflineMode,
    roomData,
    logs,
    countdown,
    intentHash,
    error,
    actions
  };
}
