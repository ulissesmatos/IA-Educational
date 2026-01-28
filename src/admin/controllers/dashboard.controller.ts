import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller do dashboard admin
 */
export class DashboardController {
  /**
   * GET /admin/dashboard
   * Exibe dashboard com estatísticas
   */
  static async index(req: Request, res: Response): Promise<void> {
    try {
      // Estatísticas do quiz
      const totalQuestions = await prisma.question.count();
      const activeQuestions = await prisma.question.count({
        where: { isActive: true }
      });

      // Estatísticas de AI Tools
      const totalTools = await prisma.aiTool.count();
      const activeTools = await prisma.aiTool.count({
        where: { isActive: true }
      });
      const featuredTools = await prisma.aiTool.count({
        where: { isFeatured: true }
      });

      // Categorias
      const totalCategories = await prisma.aiCategory.count();

      // Salas recentes (últimas 5)
      const recentRooms = await prisma.room.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { players: true }
          }
        }
      });

      res.render('admin/dashboard/index', {
        title: 'Dashboard',
        currentPage: 'dashboard',
        stats: {
          totalQuestions,
          activeQuestions,
          totalAiTools: totalTools,
          featuredAiTools: featuredTools
        }
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      res.status(500).send('Erro ao carregar dashboard');
    }
  }
}
