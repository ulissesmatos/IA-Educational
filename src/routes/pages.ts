/**
 * Rotas de páginas (views EJS) — Quiz de Redes CEBRASPE
 */

import { Router, Request, Response } from 'express';
import { gameService } from '../services/gameService.js';
import { prisma } from '../db.js';

const router = Router();

const GAME_NAME = 'Quiz de Redes — CEBRASPE';

/**
 * GET / - Redireciona para criar sala
 */
router.get('/', (_req: Request, res: Response) => {
  res.redirect('/host');
});

/**
 * GET /host - Página para criar nova sala
 */
router.get('/host', (_req: Request, res: Response) => {
  res.render('host-create', {
    title: `Criar Sala — ${GAME_NAME}`,
    gameName: GAME_NAME,
  });
});

/**
 * POST /host - Cria sala e redireciona para /host/:room_code
 */
router.post('/host', async (_req: Request, res: Response) => {
  try {
    const result = await gameService.createRoom();
    res.redirect(`/host/${result.code}`);
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    res.render('host-create', {
      title: `Criar Sala — ${GAME_NAME}`,
      gameName: GAME_NAME,
      error: 'Erro ao criar sala. Tente novamente.',
    });
  }
});

/**
 * GET /host/:room_code - Painel do facilitador para sala específica
 */
router.get('/host/:room_code', async (req: Request, res: Response) => {
  const { room_code } = req.params;
  const code = room_code.toUpperCase();

  try {
    const exists = await gameService.roomExists(code);
    if (!exists) {
      res.render('host-create', {
        title: `Criar Sala — ${GAME_NAME}`,
        gameName: GAME_NAME,
        error: 'Sala não encontrada ou expirada. Crie uma nova sala.',
      });
      return;
    }

    res.render('host', {
      title: `Host — ${GAME_NAME}`,
      gameName: GAME_NAME,
      roomCode: code,
    });
  } catch {
    res.render('host-create', {
      title: `Criar Sala — ${GAME_NAME}`,
      gameName: GAME_NAME,
      error: 'Erro ao acessar sala',
    });
  }
});

/**
 * GET /join - Tela de entrada do jogador
 */
router.get('/join', (_req: Request, res: Response) => {
  res.render('join', {
    title: `Entrar — ${GAME_NAME}`,
    gameName: GAME_NAME,
  });
});

/**
 * GET /play/:room_code - Tela do jogador
 */
router.get('/play/:room_code', async (req: Request, res: Response) => {
  const { room_code } = req.params;
  const code = room_code.toUpperCase();

  try {
    const exists = await gameService.roomExists(code);
    if (!exists) {
      res.render('join', {
        title: `Entrar — ${GAME_NAME}`,
        gameName: GAME_NAME,
        error: 'Sala não encontrada ou expirada',
      });
      return;
    }

    res.render('play', {
      title: `Jogar — ${GAME_NAME}`,
      gameName: GAME_NAME,
      roomCode: code,
    });
  } catch {
    res.render('join', {
      title: `Entrar — ${GAME_NAME}`,
      gameName: GAME_NAME,
      error: 'Erro ao acessar sala',
    });
  }
});

/**
 * GET /screen/:room_code - Tela do projetor
 */
router.get('/screen/:room_code', async (req: Request, res: Response) => {
  const { room_code } = req.params;
  const code = room_code.toUpperCase();

  try {
    const exists = await gameService.roomExists(code);
    if (!exists) {
      res.render('join', {
        title: `Entrar — ${GAME_NAME}`,
        gameName: GAME_NAME,
        error: 'Sala não encontrada ou expirada',
      });
      return;
    }

    res.render('screen', {
      title: `Projetor — ${GAME_NAME}`,
      gameName: GAME_NAME,
      roomCode: code,
    });
  } catch {
    res.render('join', {
      title: `Entrar — ${GAME_NAME}`,
      gameName: GAME_NAME,
      error: 'Erro ao acessar sala',
    });
  }
});

/**
 * GET /health - Health check endpoint
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.room.count();
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
