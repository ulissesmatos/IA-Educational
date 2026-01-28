import { Request, Response } from 'express';
import { PrismaClient, PricingType } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const prisma = new PrismaClient();

/**
 * Controller para gerenciamento de ferramentas IA
 */
export class AiToolsController {
  /**
   * GET /admin/ai-tools
   * Lista todas as ferramentas IA
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const tools = await prisma.aiTool.findMany({
        include: {
          category: true
        },
        orderBy: [
          { orderIndex: 'asc' },
          { name: 'asc' }
        ]
      });

      const categories = await prisma.aiCategory.findMany({
        orderBy: { orderIndex: 'asc' }
      });

      res.render('admin/ai-tools/list', {
        title: 'Ferramentas IA',
        currentPage: 'ai-tools',
        tools
      });
    } catch (error) {
      console.error('Erro ao listar ferramentas:', error);
      res.status(500).send('Erro ao carregar ferramentas');
    }
  }

  /**
   * GET /admin/ai-tools/new
   * Exibe formulário de nova ferramenta
   */
  static async showCreateForm(req: Request, res: Response): Promise<void> {
    try {
      const categories = await prisma.aiCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      res.render('admin/ai-tools/edit', {
        title: 'Nova Ferramenta IA',
        currentPage: 'ai-tools',
        tool: null,
        categories,
        errors: null,
        formData: null
      });
    } catch (error) {
      console.error('Erro ao carregar formulário:', error);
      res.status(500).send('Erro ao carregar formulário');
    }
  }

  /**
   * GET /admin/ai-tools/:id/edit
   * Exibe formulário de edição
   */
  static async showEditForm(req: Request, res: Response): Promise<void> {
    try {
      const tool = await prisma.aiTool.findUnique({
        where: { id: req.params.id },
        include: { category: true }
      });

      if (!tool) {
        res.status(404).send('Ferramenta não encontrada');
        return;
      }

      const categories = await prisma.aiCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      res.render('admin/ai-tools/edit', {
        title: `Editar ${tool.name}`,
        currentPage: 'ai-tools',
        tool,
        categories,
        errors: null,
        formData: null
      });
    } catch (error) {
      console.error('Erro ao carregar ferramenta:', error);
      res.status(500).send('Erro ao carregar ferramenta');
    }
  }

  /**
   * Validadores
   */
  static validators = [
    body('name').trim().notEmpty().withMessage('Nome obrigatório'),
    body('slug').trim().notEmpty().withMessage('Slug obrigatório'),
    body('shortDesc').trim().notEmpty().withMessage('Descrição curta obrigatória'),
    body('description').trim().notEmpty().withMessage('Descrição obrigatória'),
    body('url').trim().isURL().withMessage('URL inválida'),
    body('categoryId').notEmpty().withMessage('Categoria obrigatória'),
    body('pricingType').isIn(Object.values(PricingType)).withMessage('Tipo de preço inválido')
  ];

  /**
   * POST /admin/ai-tools
   * Cria nova ferramenta
   */
  static async create(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await prisma.aiCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      res.render('admin/ai-tools/edit', {
        title: 'Nova Ferramenta IA',
        currentPage: 'ai-tools',
        tool: null,
        categories,
        errors: errors.array(),
        formData: req.body
      });
      return;
    }

    try {
      const {
        name, slug, shortDesc, description, url, logoUrl, categoryId,
        pricingType, pricingDetails, features, pros, cons, useCases,
        orderIndex, isActive, isFeatured
      } = req.body;

      await prisma.aiTool.create({
        data: {
          name,
          slug,
          shortDesc,
          description,
          url,
          logoUrl: logoUrl || null,
          categoryId,
          pricingType,
          pricingDetails: pricingDetails || null,
          features: Array.isArray(features) ? features : features ? [features] : [],
          pros: Array.isArray(pros) ? pros : pros ? [pros] : [],
          cons: Array.isArray(cons) ? cons : cons ? [cons] : [],
          useCases: Array.isArray(useCases) ? useCases : useCases ? [useCases] : [],
          orderIndex: orderIndex ? parseInt(orderIndex) : 0,
          isActive: isActive === 'true',
          isFeatured: isFeatured === 'true'
        }
      });

      res.redirect('/admin/ai-tools');
    } catch (error) {
      console.error('Erro ao criar ferramenta:', error);
      
      const categories = await prisma.aiCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      res.render('admin/ai-tools/edit', {
        title: 'Nova Ferramenta IA',
        currentPage: 'ai-tools',
        tool: null,
        categories: [],
        errors: [{ msg: 'Erro ao salvar ferramenta' }],
        formData: req.body
      });
    }
  }

  /**
   * PUT /admin/ai-tools/:id
   * Atualiza ferramenta
   */
  static async update(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
      return;
    }

    try {
      const {
        name, slug, shortDesc, description, url, logoUrl, categoryId,
        pricingType, pricingDetails, features, pros, cons, useCases,
        orderIndex, isActive, isFeatured
      } = req.body;

      await prisma.aiTool.update({
        where: { id: req.params.id },
        data: {
          name,
          slug,
          shortDesc,
          description,
          url,
          logoUrl: logoUrl || null,
          categoryId,
          pricingType,
          pricingDetails: pricingDetails || null,
          features: Array.isArray(features) ? features : features ? [features] : [],
          pros: Array.isArray(pros) ? pros : pros ? [pros] : [],
          cons: Array.isArray(cons) ? cons : cons ? [cons] : [],
          useCases: Array.isArray(useCases) ? useCases : useCases ? [useCases] : [],
          orderIndex: orderIndex ? parseInt(orderIndex) : 0,
          isActive: isActive === 'true',
          isFeatured: isFeatured === 'true'
        }
      });

      res.redirect('/admin/ai-tools');
    } catch (error) {
      console.error('Erro ao atualizar ferramenta:', error);
      res.status(500).json({ error: 'Erro ao atualizar ferramenta' });
    }
  }

  /**
   * DELETE /admin/ai-tools/:id
   * Deleta ferramenta
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      await prisma.aiTool.delete({
        where: { id: req.params.id }
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao deletar ferramenta:', error);
      res.status(500).json({ error: 'Erro ao deletar ferramenta' });
    }
  }

  /**
   * POST /admin/ai-tools/:id/toggle
   * Ativa/desativa ferramenta
   */
  static async toggle(req: Request, res: Response): Promise<void> {
    try {
      const tool = await prisma.aiTool.findUnique({
        where: { id: req.params.id }
      });

      if (!tool) {
        res.status(404).json({ error: 'Ferramenta não encontrada' });
        return;
      }

      await prisma.aiTool.update({
        where: { id: req.params.id },
        data: { isActive: !tool.isActive }
      });

      res.json({ success: true, isActive: !tool.isActive });
    } catch (error) {
      console.error('Erro ao alternar ferramenta:', error);
      res.status(500).json({ error: 'Erro ao alternar ferramenta' });
    }
  }

  /**
   * POST /admin/ai-tools/:id/toggle-featured
   * Marca/desmarca como destaque
   */
  static async toggleFeatured(req: Request, res: Response): Promise<void> {
    try {
      const tool = await prisma.aiTool.findUnique({
        where: { id: req.params.id }
      });

      if (!tool) {
        res.status(404).json({ error: 'Ferramenta não encontrada' });
        return;
      }

      await prisma.aiTool.update({
        where: { id: req.params.id },
        data: { isFeatured: !tool.isFeatured }
      });

      res.json({ success: true, isFeatured: !tool.isFeatured });
    } catch (error) {
      console.error('Erro ao alternar destaque:', error);
      res.status(500).json({ error: 'Erro ao alternar destaque' });
    }
  }
}
