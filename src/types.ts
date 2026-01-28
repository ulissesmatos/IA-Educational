/**
 * Tipos TypeScript para IA ou Não?
 */

// Status possíveis de uma sala
export type RoomStatus = 'lobby' | 'asking' | 'revealed' | 'ended';

// Tipos de questões
export type QuestionType = 
  | 'IMAGE_CLASSIFY' 
  | 'TEXT_CLASSIFY' 
  | 'HALLUCINATION_DETECT' 
  | 'LGPD_TRAFFIC_LIGHT';

// Player simplificado para transmissão
export interface PlayerInfo {
  id: string;
  nickname: string;
  score: number;
  hasAnswered?: boolean;
}

// Questão para transmissão (sem resposta correta até revelar)
export interface QuestionInfo {
  id: string;
  type: QuestionType;
  prompt: string;
  imageUrl: string | null;
  options: string[];
  index: number;
  total: number;
}

// Questão revelada (com resposta e explicação)
export interface RevealedQuestion extends QuestionInfo {
  correctOption: number;
  explanation: string;
  stats: OptionStats[];
}

// Estatísticas de respostas por opção
export interface OptionStats {
  option: number;
  count: number;
  percentage: number;
}

// Estado completo da sala para transmissão
export interface RoomState {
  code: string;
  status: RoomStatus;
  players: PlayerInfo[];
  currentQuestion: QuestionInfo | null;
  revealedQuestion: RevealedQuestion | null;
  questionStartedAt: number | null; // timestamp
  ranking: PlayerInfo[];
  answeredCount: number;
  totalPlayers: number;
}

// Resposta do player
export interface PlayerAnswer {
  roomCode: string;
  playerId: string;
  questionId: string;
  selectedOption: number;
  timeMs: number;
}

// Ações do host
export type HostAction = 'start' | 'next' | 'reveal' | 'end';

// Eventos Socket.io - Cliente para Servidor
export interface ClientToServerEvents {
  'join:room': (data: { roomCode: string; playerId: string }) => void;
  'player:answer': (data: PlayerAnswer) => void;
  'host:action': (data: { roomCode: string; action: HostAction }) => void;
  'host:join': (data: { roomCode: string }) => void;
}

// Eventos Socket.io - Servidor para Cliente
export interface ServerToClientEvents {
  'room:state': (state: RoomState) => void;
  'player:joined': (player: PlayerInfo) => void;
  'player:answered': (data: { answeredCount: number; totalPlayers: number }) => void;
  'question:revealed': (question: RevealedQuestion) => void;
  'game:ended': (data: { ranking: PlayerInfo[] }) => void;
  'error': (data: { message: string }) => void;
}

// Dados inter-server (não usado neste MVP, mas útil para escalar)
export interface InterServerEvents {
  ping: () => void;
}

// Dados do socket
export interface SocketData {
  roomCode?: string;
  playerId?: string;
  isHost?: boolean;
}

// Request de criar sala
export interface CreateRoomRequest {
  questionIds?: string[]; // IDs específicos ou usa todas ativas
}

// Request de entrar na sala
export interface JoinRoomRequest {
  nickname: string;
}

// Response de sala criada
export interface CreateRoomResponse {
  code: string;
  expiresAt: string;
}

// Response de player criado
export interface JoinRoomResponse {
  playerId: string;
  roomCode: string;
  nickname: string;
}
