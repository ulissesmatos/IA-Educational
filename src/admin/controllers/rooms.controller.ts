import { Request, Response } from 'express';
import { prisma } from '../../db.js';
import { gameService } from '../../services/gameService.js';

/**
 * Controller para gerenciamento de salas
 */
export class RoomsController {
  /**
   * GET /admin/rooms
   * Lista todas as salas ativas
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const now = new Date();
      
      // Buscar salas que não expiraram ainda
      const rooms = await prisma.room.findMany({
        where: {
          expiresAt: {
            gte: now
          }
        },
        include: {
          players: {
            select: {
              id: true,
              nickname: true,
              score: true
            }
          },
          roomQuestions: {
            select: {
              id: true
            }
          },
          answers: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Calcular informações adicionais
      const roomsWithInfo = rooms.map((room: any) => ({
        ...room,
        playerCount: room.players.length,
        questionCount: room.roomQuestions.length,
        answerCount: room.answers.length,
        timeRemaining: Math.max(0, Math.floor((room.expiresAt.getTime() - now.getTime()) / 1000 / 60))
      }));

      res.render('admin/rooms/list', {
        title: 'Gerenciar Salas',
        rooms: roomsWithInfo,
        currentPage: 'rooms'
      });
    } catch (error) {
      console.error('❌ Erro ao listar salas:', error);
      res.status(500).render('admin/error', {
        title: 'Erro',
        message: 'Erro ao carregar lista de salas',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }

  /**
   * POST /admin/rooms/:code/end
   * Encerra uma sala específica
   */
  static async endRoom(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      
      await gameService.endGame(code.toUpperCase());
      
      res.json({
        success: true,
        message: `Sala ${code.toUpperCase()} encerrada com sucesso`
      });
    } catch (error: any) {
      console.error('❌ Erro ao encerrar sala:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao encerrar sala'
      });
    }
  }

  /**
   * POST /admin/rooms/end-all
   * Encerra todas as salas ativas
   */
  static async endAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const now = new Date();
      
      // Buscar todas as salas ativas
      const rooms = await prisma.room.findMany({
        where: {
          expiresAt: {
            gte: now
          }
        },
        select: {
          code: true
        }
      });

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Encerrar cada sala
      for (const room of rooms) {
        try {
          await gameService.endGame(room.code);
          successCount++;
        } catch (error: any) {
          errorCount++;
          errors.push(`${room.code}: ${error.message}`);
        }
      }

      res.json({
        success: true,
        message: `${successCount} sala(s) encerrada(s) com sucesso`,
        details: {
          total: rooms.length,
          success: successCount,
          errors: errorCount,
          errorMessages: errors
        }
      });
    } catch (error: any) {
      console.error('❌ Erro ao encerrar todas as salas:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao encerrar todas as salas'
      });
    }
  }

  /**
   * POST /admin/rooms/cleanup-expired
   * Remove salas expiradas do banco
   */
  static async cleanupExpired(req: Request, res: Response): Promise<void> {
    try {
      const now = new Date();
      
      // Deletar salas expiradas
      const result = await prisma.room.deleteMany({
        where: {
          expiresAt: {
            lt: now
          }
        }
      });

      res.json({
        success: true,
        message: `${result.count} sala(s) expirada(s) removida(s) com sucesso`
      });
    } catch (error: any) {
      console.error('❌ Erro ao limpar salas expiradas:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao limpar salas expiradas'
      });
    }
  }
}
