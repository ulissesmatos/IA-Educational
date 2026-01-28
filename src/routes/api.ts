/**
 * Rotas da API REST
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { gameService } from '../services/gameService.js';

const router = Router();

// Schemas de validação
const createRoomSchema = z.object({
  questionIds: z.array(z.string()).optional(),
});

const joinRoomSchema = z.object({
  nickname: z.string().min(1, 'Nickname é obrigatório').max(30, 'Nickname muito longo'),
});

// Middleware de validação
function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors 
        });
        return;
      }
      next(error);
    }
  };
}

// Wrapper para async handlers
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * POST /api/rooms - Criar nova sala
 */
router.post(
  '/rooms',
  validate(createRoomSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { questionIds } = req.body;
    const result = await gameService.createRoom(questionIds);
    
    res.status(201).json({
      code: result.code,
      expiresAt: result.expiresAt.toISOString(),
    });
  })
);

/**
 * POST /api/rooms/:code/join - Entrar na sala
 */
router.post(
  '/rooms/:code/join',
  validate(joinRoomSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    const { nickname } = req.body;
    
    const result = await gameService.joinRoom(code.toUpperCase(), nickname);
    
    res.status(200).json(result);
  })
);

/**
 * POST /api/rooms/:code/start - Iniciar jogo
 */
router.post(
  '/rooms/:code/start',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    await gameService.startGame(code.toUpperCase());
    res.status(200).json({ success: true });
  })
);

/**
 * POST /api/rooms/:code/next - Próxima pergunta
 */
router.post(
  '/rooms/:code/next',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    const hasNext = await gameService.nextQuestion(code.toUpperCase());
    res.status(200).json({ success: true, hasNext });
  })
);

/**
 * POST /api/rooms/:code/reveal - Revelar resultado
 */
router.post(
  '/rooms/:code/reveal',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    await gameService.revealQuestion(code.toUpperCase());
    res.status(200).json({ success: true });
  })
);

/**
 * POST /api/rooms/:code/end - Encerrar sala
 */
router.post(
  '/rooms/:code/end',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    await gameService.endGame(code.toUpperCase());
    res.status(200).json({ success: true, message: 'Sala encerrada e dados removidos' });
  })
);

/**
 * GET /api/rooms/:code/state - Estado da sala
 */
router.get(
  '/rooms/:code/state',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    const state = await gameService.getRoomState(code.toUpperCase());
    res.status(200).json(state);
  })
);

/**
 * GET /api/rooms/:code/exists - Verifica se sala existe
 */
router.get(
  '/rooms/:code/exists',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    const exists = await gameService.roomExists(code.toUpperCase());
    res.status(200).json({ exists });
  })
);

export default router;
