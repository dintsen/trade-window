import { TradeAsset } from '../trade/assets';

export type RoomState = 'lobby' | 'active' | 'locked_countdown' | 'ready_to_sign' | 'cancelled' | 'completed' | 'expired';

export interface RoomData {
  id: string;
  state: RoomState;
  partyA: string;
  partyB: string;
  offerA: TradeAsset[];
  offerB: TradeAsset[];
  lockA: boolean;
  lockB: boolean;
  countdownAt: string;
}

export type WSServerEvent = 
  | { type: 'room:state'; payload: RoomData }
  | { type: 'system:log'; payload: { message: string } }
  | { type: 'chat:message'; payload: { sender: string; message: string } }
  | { type: 'trade:error'; payload: { code: string; message: string; recoverable: boolean } }
  | { type: 'countdown:tick'; payload: { seconds: number } }
  | { type: 'trade:ready_to_sign'; payload: { intentHash: string } };

export type WSClientEvent =
  | { type: 'room:create'; payload?: never }
  | { type: 'room:join'; payload: { roomId: string } }
  | { type: 'offer:add'; payload: { asset: TradeAsset } }
  | { type: 'trade:lock'; payload?: never }
  | { type: 'trade:cancel'; payload?: never }
  | { type: 'chat:message'; payload: { message: string } };
