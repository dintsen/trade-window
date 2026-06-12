import { useState, useEffect, useRef, useCallback } from 'react';
import { RoomData, WSClientEvent, WSServerEvent } from '../lib/websocket/types';
import { TradeAsset } from '../lib/trade/assets';
import { config } from '../lib/config';

const MISSING_WS_ERROR = "Backend unavailable. Set NEXT_PUBLIC_WS_URL to enable live room sync.";
const MISSING_WS_LOG = 'Backend WebSocket URL is not configured. Live room sync is unavailable.';

export interface LogEntry {
  id: string;
  type: 'system' | 'chat' | 'error';
  message: string;
  timestamp: Date;
}

export function useTradeRoom(walletAddress: string) {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    config.wsUrl
      ? []
      : [{ id: 'backend-unavailable', type: 'error', message: MISSING_WS_LOG, timestamp: new Date() }]
  );
  const [countdown, setCountdown] = useState<number | null>(null);
  const [intentHash, setIntentHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => (config.wsUrl ? null : MISSING_WS_ERROR));
  const [connected, setConnected] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(() => !config.wsUrl);

  const wsRef = useRef<WebSocket | null>(null);

  const addLog = useCallback((type: 'system' | 'chat' | 'error', message: string) => {
    setLogs(prev => [...prev, { id: Math.random().toString(), type, message, timestamp: new Date() }]);
  }, []);

  useEffect(() => {
    if (!walletAddress) return;

    const wsUrl = config.wsUrl;

    if (!wsUrl) return;

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
      setError("Connection lost to backend. Live room sync is unavailable.");
      addLog('error', 'WebSocket connection closed.');
    };

    ws.onerror = () => {
      setError("WebSocket connection error. Live room sync is unavailable.");
      setIsOfflineMode(true);
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

    return () => {
      ws.close();
    };
  }, [walletAddress, addLog]);

  const sendMessage = useCallback((msg: WSClientEvent) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      setIsOfflineMode(true);
      setError("Backend unavailable. Configure NEXT_PUBLIC_WS_URL and start the Go backend.");
      addLog('error', `Cannot send ${msg.type}: backend is unavailable.`);
    }
  }, [addLog]);

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
