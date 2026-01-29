/**
 * Rotas de páginas (views EJS)
 */

import { Router, Request, Response } from 'express';
import { gameService } from '../services/gameService.js';
import { aiCatalogService } from '../services/aiCatalogService.js';
import type { PricingType } from '@prisma/client';

const router = Router();

/**
 * GET / - Dashboard principal
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await aiCatalogService.getCategories();
    const featuredTools = await aiCatalogService.getFeaturedTools();
    const stats = await aiCatalogService.getStatsByPricing();
    
    res.render('dashboard', { 
      title: 'IA na Educação - Dashboard',
      currentPath: req.path,
      categories,
      featuredTools,
      stats,
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    res.render('dashboard', { 
      title: 'IA na Educação - Dashboard',
      currentPath: req.path,
      categories: [],
      featuredTools: [],
      stats: { FREE: 0, FREEMIUM: 0, PAID: 0 },
    });
  }
});

/**
 * GET /jogo - Dashboard do jogo IA ou Não
 */
router.get('/jogo', (_req: Request, res: Response) => {
  res.render('game-dashboard', { title: 'IA ou Não? - Jogo' });
});

/**
 * GET /ias - Catálogo de IAs
 */
router.get('/ias', async (req: Request, res: Response) => {
  try {
    const { categoria, preco, busca } = req.query;
    
    const categories = await aiCatalogService.getCategories();
    const tools = await aiCatalogService.getTools({
      categorySlug: categoria as string | undefined,
      pricingType: preco as PricingType | undefined,
      search: busca as string | undefined,
    });
    const stats = await aiCatalogService.getStatsByPricing();
    
    // Categoria selecionada (se houver)
    const currentCategory = categoria 
      ? await aiCatalogService.getCategoryBySlug(categoria as string)
      : null;
    
    res.render('ias', { 
      title: currentCategory 
        ? `${currentCategory.icon} ${currentCategory.name} - Catálogo de IAs`
        : 'Catálogo de IAs - IA na Educação',
      currentPath: req.path,
      categories,
      tools,
      currentCategory,
      stats,
      filters: {
        categorySlug: categoria || '',
        pricingType: preco || '',
        query: busca || '',
      },
    });
  } catch (error) {
    console.error('Erro ao carregar catálogo:', error);
    res.render('ias', { 
      title: 'Catálogo de IAs - IA na Educação',
      currentPath: req.path,
      categories: [],
      tools: [],
      currentCategory: null,
      stats: { FREE: 0, FREEMIUM: 0, PAID: 0 },
      filters: { categorySlug: '', pricingType: '', query: '' },
      error: 'Erro ao carregar catálogo',
    });
  }
});

/**
 * GET /ias/:slug - Detalhes de uma ferramenta
 */
router.get('/ias/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const tool = await aiCatalogService.getToolBySlug(slug);
    
    if (!tool) {
      res.redirect('/ias');
      return;
    }
    
    const relatedTools = await aiCatalogService.getRelatedTools(slug, 4);
    
    res.render('ia-detail', { 
      title: `${tool.name} - IA na Educação`,
      currentPath: req.path,
      tool,
      relatedTools,
    });
  } catch (error) {
    console.error('Erro ao carregar ferramenta:', error);
    res.redirect('/ias');
  }
});

/**
 * GET /host - Página para criar nova sala
 */
router.get('/host', (_req: Request, res: Response) => {
  res.render('host-create', { title: 'Criar Sala - IA ou Não?' });
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
      title: 'Criar Sala - IA ou Não?',
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
        title: 'Criar Sala - IA ou Não?',
        error: 'Sala não encontrada ou expirada. Crie uma nova sala.',
      });
      return;
    }
    
    res.render('host', { 
      title: 'Host - IA ou Não?',
      roomCode: code,
    });
  } catch {
    res.render('host-create', { 
      title: 'Criar Sala - IA ou Não?',
      error: 'Erro ao acessar sala',
    });
  }
});

/**
 * GET /join - Tela de entrada
 */
router.get('/join', (_req: Request, res: Response) => {
  res.render('join', { title: 'Entrar - IA ou Não?' });
});

/**
 * GET /play/:room_code - Tela do player
 */
router.get('/play/:room_code', async (req: Request, res: Response) => {
  const { room_code } = req.params;
  const code = room_code.toUpperCase();
  
  try {
    const exists = await gameService.roomExists(code);
    if (!exists) {
      res.render('join', { 
        title: 'Entrar - IA ou Não?',
        error: 'Sala não encontrada ou expirada',
      });
      return;
    }
    
    res.render('play', { 
      title: 'Jogar - IA ou Não?',
      roomCode: code,
    });
  } catch {
    res.render('join', { 
      title: 'Entrar - IA ou Não?',
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
        title: 'Entrar - IA ou Não?',
        error: 'Sala não encontrada ou expirada',
      });
      return;
    }
    
    res.render('screen', { 
      title: 'Projetor - IA ou Não?',
      roomCode: code,
    });
  } catch {
    res.render('join', { 
      title: 'Entrar - IA ou Não?',
      error: 'Erro ao acessar sala',
    });
  }
});

/**
 * GET /health - Health check endpoint
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    // Verificar conexão com banco
    await gameService.getActiveRooms();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
