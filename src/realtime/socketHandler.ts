/**
 * Socket.io Handler - Gerencia comunicação em tempo real
 */

import { Server, Socket } from 'socket.io';
import { gameService } from '../services/gameService.js';
import type { 
  ClientToServerEvents, 
  ServerToClientEvents, 
  InterServerEvents, 
  SocketData,
  PlayerAnswer,
  HostAction 
} from '../types.js';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/**
 * Configura handlers do Socket.io
 */
export function setupSocketHandlers(io: TypedServer): void {
  
  io.on('connection', (socket: TypedSocket) => {
    console.log(`🔌 Socket conectado: ${socket.id}`);

    // Player entra na sala
    socket.on('join:room', async ({ roomCode, playerId }) => {
      try {
        const exists = await gameService.roomExists(roomCode);
        if (!exists) {
          socket.emit('error', { message: 'Sala não encontrada' });
          return;
        }

        // Salvar dados no socket
        socket.data.roomCode = roomCode;
        socket.data.playerId = playerId;
        socket.data.isHost = false;

        // Entrar na room do Socket.io
        await socket.join(`room:${roomCode}`);
        await socket.join(`player:${roomCode}`);

        // Buscar estado atualizado
        const state = await gameService.getRoomState(roomCode);
        const player = state.players.find(p => p.id === playerId);
        
        if (player) {
          // Notificar outros na sala sobre o novo player
          socket.to(`room:${roomCode}`).emit('player:joined', player);
        }

        // IMPORTANTE: Enviar estado atualizado para TODA a sala (incluindo host)
        // Isso faz o host atualizar a lista de players e habilitar o botão Iniciar
        io.to(`room:${roomCode}`).emit('room:state', state);

        console.log(`👤 Player ${playerId.slice(-4)} entrou na sala ${roomCode}`);
      } catch (error) {
        console.error('Erro ao entrar na sala:', error);
        socket.emit('error', { message: 'Erro ao entrar na sala' });
      }
    });

    // Host entra na sala (para receber atualizações)
    socket.on('host:join', async ({ roomCode }) => {
      try {
        const exists = await gameService.roomExists(roomCode);
        if (!exists) {
          socket.emit('error', { message: 'Sala não encontrada' });
          return;
        }

        socket.data.roomCode = roomCode;
        socket.data.isHost = true;

        await socket.join(`room:${roomCode}`);
        await socket.join(`host:${roomCode}`);

        const state = await gameService.getRoomState(roomCode);
        socket.emit('room:state', state);

        console.log(`🎮 Host conectado à sala ${roomCode}`);
      } catch (error) {
        console.error('Erro ao host entrar:', error);
        socket.emit('error', { message: 'Erro ao conectar como host' });
      }
    });

    // Player envia resposta
    socket.on('player:answer', async (data: PlayerAnswer) => {
      try {
        const result = await gameService.submitAnswer(data);
        
        // Notificar o player do resultado (pode ser usado para feedback imediato)
        socket.emit('room:state', await gameService.getRoomState(data.roomCode));

        // Notificar sala sobre nova resposta (sem revelar se está correta)
        const state = await gameService.getRoomState(data.roomCode);
        io.to(`room:${data.roomCode}`).emit('player:answered', {
          answeredCount: state.answeredCount,
          totalPlayers: state.totalPlayers,
        });

        console.log(`📝 Resposta recebida: ${result.isCorrect ? '✓' : '✗'} +${result.points}pts`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao enviar resposta';
        console.error('Erro ao processar resposta:', message);
        socket.emit('error', { message });
      }
    });

    // Host executa ação
    socket.on('host:action', async ({ roomCode, action }) => {
      try {
        console.log(`🎯 Host action: ${action} na sala ${roomCode}`);

        switch (action as HostAction) {
          case 'start':
            await gameService.startGame(roomCode);
            break;

          case 'next':
            const hasNext = await gameService.nextQuestion(roomCode);
            if (!hasNext) {
              // Não há mais perguntas - fim do jogo
              const ranking = await gameService.getFinalRanking(roomCode);
              io.to(`room:${roomCode}`).emit('game:ended', { ranking });
            }
            break;

          case 'reveal':
            await gameService.revealQuestion(roomCode);
            break;

          case 'end':
            const finalRanking = await gameService.getFinalRanking(roomCode);
            io.to(`room:${roomCode}`).emit('game:ended', { ranking: finalRanking });
            await gameService.endGame(roomCode);
            return; // Não enviar mais state após deletar
        }

        // Broadcast do novo estado
        const state = await gameService.getRoomState(roomCode);
        io.to(`room:${roomCode}`).emit('room:state', state);

      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro na ação do host';
        console.error('Erro na ação do host:', message);
        socket.emit('error', { message });
      }
    });

    // Desconexão
    socket.on('disconnect', () => {
      console.log(`🔌 Socket desconectado: ${socket.id}`);
    });
  });
}

/**
 * Broadcast de estado para toda a sala
 */
export async function broadcastRoomState(io: TypedServer, roomCode: string): Promise<void> {
  try {
    const state = await gameService.getRoomState(roomCode);
    io.to(`room:${roomCode}`).emit('room:state', state);
  } catch (error) {
    console.error('Erro ao broadcast estado:', error);
  }
}
