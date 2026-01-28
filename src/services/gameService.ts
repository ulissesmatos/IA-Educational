/**
 * GameService - Lógica principal do jogo IA ou Não?
 * Gerencia estado das salas, perguntas, respostas e pontuação
 */

import { prisma } from '../db.js';
import type { 
  RoomState, 
  PlayerInfo, 
  QuestionInfo, 
  RevealedQuestion,
  OptionStats,
  PlayerAnswer 
} from '../types.js';

// Constantes do jogo
const ROOM_CODE_LENGTH = 6;
const ROOM_EXPIRY_HOURS = 24;
const MAX_BONUS_POINTS = 50;
const BONUS_TIME_LIMIT_MS = 20000; // 20 segundos
const BASE_POINTS = 100;

/**
 * Gera código aleatório para sala (ex: ABC123)
 */
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem I, O, 0, 1 para evitar confusão
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Calcula bônus por tempo de resposta
 */
function calculateTimeBonus(timeMs: number): number {
  if (timeMs >= BONUS_TIME_LIMIT_MS) return 0;
  return Math.round(MAX_BONUS_POINTS * (1 - timeMs / BONUS_TIME_LIMIT_MS));
}

/**
 * Embaralha array (Fisher-Yates)
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export class GameService {
  
  /**
   * Cria uma nova sala
   */
  async createRoom(questionIds?: string[]): Promise<{ code: string; expiresAt: Date }> {
    // Gerar código único
    let code: string = generateRoomCode();
    let existing = await prisma.room.findUnique({ where: { code } });
    
    while (existing) {
      code = generateRoomCode();
      existing = await prisma.room.findUnique({ where: { code } });
    }

    // Calcular expiração
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + ROOM_EXPIRY_HOURS);

    // Criar sala
    const room = await prisma.room.create({
      data: {
        code,
        status: 'lobby',
        expiresAt,
      },
    });

    // Buscar questões (específicas ou todas ativas)
    let questions;
    if (questionIds && questionIds.length > 0) {
      questions = await prisma.question.findMany({
        where: { id: { in: questionIds }, isActive: true },
        orderBy: { orderIndex: 'asc' },
      });
    } else {
      questions = await prisma.question.findMany({
        where: { isActive: true },
        orderBy: { orderIndex: 'asc' },
      });
    }

    // Embaralhar e associar à sala
    const shuffledQuestions = shuffle(questions);
    for (let i = 0; i < shuffledQuestions.length; i++) {
      await prisma.roomQuestion.create({
        data: {
          roomId: room.id,
          questionId: shuffledQuestions[i].id,
          orderIndex: i,
        },
      });
    }

    console.log(`🎮 Sala criada: ${code} com ${questions.length} perguntas`);
    return { code: room.code, expiresAt: room.expiresAt };
  }

  /**
   * Adiciona player à sala
   */
  async joinRoom(roomCode: string, nickname: string): Promise<{ playerId: string; roomCode: string }> {
    const room = await prisma.room.findUnique({ where: { code: roomCode } });
    
    if (!room) {
      throw new Error('Sala não encontrada');
    }
    
    if (room.status === 'ended') {
      throw new Error('Esta sala já foi encerrada');
    }
    
    if (new Date() > room.expiresAt) {
      throw new Error('Esta sala expirou');
    }

    // Verificar nickname duplicado na sala
    const existingPlayer = await prisma.player.findFirst({
      where: { roomId: room.id, nickname },
    });
    
    if (existingPlayer) {
      // Retornar player existente (reconexão)
      return { playerId: existingPlayer.id, roomCode };
    }

    // Criar novo player
    const player = await prisma.player.create({
      data: {
        roomId: room.id,
        nickname: nickname.trim().substring(0, 30),
        score: 0,
      },
    });

    console.log(`👤 Player "${nickname}" entrou na sala ${roomCode}`);
    return { playerId: player.id, roomCode };
  }

  /**
   * Inicia o jogo (status lobby -> asking)
   */
  async startGame(roomCode: string): Promise<void> {
    const room = await prisma.room.findUnique({ where: { code: roomCode } });
    
    if (!room) throw new Error('Sala não encontrada');
    if (room.status !== 'lobby') throw new Error('Sala já foi iniciada');

    await prisma.room.update({
      where: { code: roomCode },
      data: { status: 'asking', currentQuestionIndex: 0, questionStartedAt: new Date() },
    });

    console.log(`🚀 Jogo iniciado na sala ${roomCode}`);
  }

  /**
   * Avança para próxima pergunta
   */
  async nextQuestion(roomCode: string): Promise<boolean> {
    const room = await prisma.room.findUnique({
      where: { code: roomCode },
      include: { roomQuestions: true },
    });
    
    if (!room) throw new Error('Sala não encontrada');

    const nextIndex = room.currentQuestionIndex + 1;
    
    if (nextIndex >= room.roomQuestions.length) {
      // Não há mais perguntas
      return false;
    }

    await prisma.room.update({
      where: { code: roomCode },
      data: { 
        status: 'asking', 
        currentQuestionIndex: nextIndex,
        questionStartedAt: new Date(),
      },
    });

    console.log(`➡️ Sala ${roomCode}: pergunta ${nextIndex + 1}/${room.roomQuestions.length}`);
    return true;
  }

  /**
   * Revela resultado da pergunta atual
   */
  async revealQuestion(roomCode: string): Promise<void> {
    const room = await prisma.room.findUnique({ where: { code: roomCode } });
    
    if (!room) throw new Error('Sala não encontrada');
    if (room.status !== 'asking') throw new Error('Nenhuma pergunta ativa');

    await prisma.room.update({
      where: { code: roomCode },
      data: { status: 'revealed' },
    });

    console.log(`🎯 Resultado revelado na sala ${roomCode}`);
  }

  /**
   * Encerra sala e limpa dados
   */
  async endGame(roomCode: string): Promise<void> {
    const room = await prisma.room.findUnique({ where: { code: roomCode } });
    
    if (!room) throw new Error('Sala não encontrada');

    // Deletar sala (cascade deleta players, answers, room_questions)
    await prisma.room.delete({ where: { code: roomCode } });

    console.log(`🏁 Sala ${roomCode} encerrada e dados removidos`);
  }

  /**
   * Registra resposta do player
   */
  async submitAnswer(answer: PlayerAnswer): Promise<{ isCorrect: boolean; points: number }> {
    const room = await prisma.room.findUnique({
      where: { code: answer.roomCode },
      include: {
        roomQuestions: {
          orderBy: { orderIndex: 'asc' },
          include: { question: true },
        },
      },
    });

    if (!room) throw new Error('Sala não encontrada');
    if (room.status !== 'asking') throw new Error('Não é momento de responder');

    const currentRoomQuestion = room.roomQuestions[room.currentQuestionIndex];
    if (!currentRoomQuestion) throw new Error('Pergunta não encontrada');

    const question = currentRoomQuestion.question;
    
    // Verificar se já respondeu
    const existingAnswer = await prisma.answer.findUnique({
      where: {
        roomId_playerId_questionId: {
          roomId: room.id,
          playerId: answer.playerId,
          questionId: question.id,
        },
      },
    });

    if (existingAnswer) {
      throw new Error('Você já respondeu esta pergunta');
    }

    // Calcular pontuação
    const isCorrect = answer.selectedOption === question.correctOption;
    let points = 0;
    
    if (isCorrect) {
      points = BASE_POINTS + calculateTimeBonus(answer.timeMs);
    }

    // Salvar resposta
    await prisma.answer.create({
      data: {
        roomId: room.id,
        playerId: answer.playerId,
        questionId: question.id,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeMs: answer.timeMs,
      },
    });

    // Atualizar score do player
    if (points > 0) {
      await prisma.player.update({
        where: { id: answer.playerId },
        data: { score: { increment: points } },
      });
    }

    console.log(`📝 Resposta: Player ${answer.playerId.slice(-4)} | ${isCorrect ? '✓' : '✗'} | +${points}pts`);
    return { isCorrect, points };
  }

  /**
   * Obtém estado completo da sala
   */
  async getRoomState(roomCode: string): Promise<RoomState> {
    const room = await prisma.room.findUnique({
      where: { code: roomCode },
      include: {
        players: { orderBy: { score: 'desc' } },
        roomQuestions: {
          orderBy: { orderIndex: 'asc' },
          include: { question: true },
        },
        answers: true,
      },
    });

    if (!room) throw new Error('Sala não encontrada');

    // Players com info de resposta
    const currentRoomQuestion = room.roomQuestions[room.currentQuestionIndex];
    const playersInfo: PlayerInfo[] = room.players.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      score: p.score,
      hasAnswered: currentRoomQuestion
        ? room.answers.some((a) => a.playerId === p.id && a.questionId === currentRoomQuestion.questionId)
        : false,
    }));

    // Pergunta atual (sem resposta correta)
    let currentQuestion: QuestionInfo | null = null;
    let revealedQuestion: RevealedQuestion | null = null;

    if (currentRoomQuestion && (room.status === 'asking' || room.status === 'revealed')) {
      const q = currentRoomQuestion.question;
      const options = q.optionsJson as string[];

      currentQuestion = {
        id: q.id,
        type: q.type as QuestionInfo['type'],
        prompt: q.prompt,
        imageUrl: q.imageUrl,
        options,
        index: room.currentQuestionIndex,
        total: room.roomQuestions.length,
      };

      // Se revelado, incluir resposta e estatísticas
      if (room.status === 'revealed') {
        const questionAnswers = room.answers.filter((a) => a.questionId === q.id);
        const stats: OptionStats[] = options.map((_, i) => {
          const count = questionAnswers.filter((a) => a.selectedOption === i).length;
          return {
            option: i,
            count,
            percentage: questionAnswers.length > 0 
              ? Math.round((count / questionAnswers.length) * 100) 
              : 0,
          };
        });

        revealedQuestion = {
          ...currentQuestion,
          correctOption: q.correctOption,
          explanation: q.explanation,
          stats,
        };
      }
    }

    // Contagem de respostas
    const answeredCount = currentRoomQuestion
      ? room.answers.filter((a) => a.questionId === currentRoomQuestion.questionId).length
      : 0;

    // Ranking top 5
    const ranking = playersInfo.slice(0, 5);

    return {
      code: room.code,
      status: room.status as RoomState['status'],
      players: playersInfo,
      currentQuestion: room.status === 'revealed' ? null : currentQuestion,
      revealedQuestion,
      questionStartedAt: room.questionStartedAt?.getTime() || null,
      ranking,
      answeredCount,
      totalPlayers: room.players.length,
    };
  }

  /**
   * Verifica e limpa salas expiradas
   */
  async cleanupExpiredRooms(): Promise<number> {
    const result = await prisma.room.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    if (result.count > 0) {
      console.log(`🧹 ${result.count} salas expiradas removidas`);
    }

    return result.count;
  }

  /**
   * Verifica se sala existe e está válida
   */
  async roomExists(roomCode: string): Promise<boolean> {
    const room = await prisma.room.findUnique({ where: { code: roomCode } });
    return !!room && room.status !== 'ended' && new Date() < room.expiresAt;
  }

  /**
   * Obtém ranking final
   */
  async getFinalRanking(roomCode: string): Promise<PlayerInfo[]> {
    const players = await prisma.player.findMany({
      where: { room: { code: roomCode } },
      orderBy: { score: 'desc' },
      take: 10,
    });

    return players.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      score: p.score,
    }));
  }
}

// Exportar instância singleton
export const gameService = new GameService();
