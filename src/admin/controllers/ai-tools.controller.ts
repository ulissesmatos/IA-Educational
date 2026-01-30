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
  // Validators for create (all required)
  static createValidators = [
    body('name').trim().notEmpty().withMessage('Nome obrigatório'),
    body('slug').trim().notEmpty().withMessage('Slug obrigatório'),
    body('shortDesc').trim().notEmpty().withMessage('Descrição curta obrigatória'),
    body('description').optional(),
    body('url').trim().isURL().withMessage('URL inválida'),
    body('categoryId').notEmpty().withMessage('Categoria obrigatória'),
    body('pricingType').isIn(Object.values(PricingType)).withMessage('Tipo de preço inválido')
  ];

  // Validators for update: fields optional to avoid false-positive "Nome obrigatório" on multipart requests
  // Use checkFalsy to treat empty strings as absent (use existing values on update)
  static updateValidators = [
    body('name').optional({ checkFalsy: true }).trim().notEmpty().withMessage('Nome obrigatório'),
    body('slug').optional({ checkFalsy: true }).trim().notEmpty().withMessage('Slug obrigatório'),
    body('shortDesc').optional({ checkFalsy: true }).trim().notEmpty().withMessage('Descrição curta obrigatória'),
    body('description').optional(),
    body('url').optional({ checkFalsy: true }).trim().isURL().withMessage('URL inválida'),
    body('categoryId').optional({ checkFalsy: true }),
    body('pricingType').optional({ checkFalsy: true }).isIn(Object.values(PricingType)).withMessage('Tipo de preço inválido')
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

      // If the client expects JSON (AJAX/API), return a concise JSON error
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
        return;
      }

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

      // Handle uploaded file (multer)
      const file = (req as any).file;
      const uploadedLogo = file ? `/uploads/${file.filename}` : (logoUrl || null);

      await prisma.aiTool.create({
        data: {
          name,
          slug,
          shortDesc,
          description,
          url,
          logoUrl: uploadedLogo,
          categoryId,
          pricingType,
          pricingDetails: pricingDetails || null,
          features: features ? features.split('\n').map((f: string) => f.trim()).filter((f: string) => f) : [],
          pros: pros ? pros.split('\n').map((p: string) => p.trim()).filter((p: string) => p) : [],
          cons: cons ? cons.split('\n').map((c: string) => c.trim()).filter((c: string) => c) : [],
          useCases: useCases ? useCases.split('\n').map((u: string) => u.trim()).filter((u: string) => u) : [],
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

    // Log method and id for easier debugging in prod
    console.log(`📝 Update request: method=${req.method}, id=${req.params.id}`);

    if (!errors.isEmpty()) {
      const tool = await prisma.aiTool.findUnique({
        where: { id: req.params.id },
        include: { category: true }
      });

      const categories = await prisma.aiCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      // If the client expects JSON (AJAX/API), return a concise JSON error
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
        return;
      }

      res.render('admin/ai-tools/edit', {
        title: `Editar ${tool?.name || 'Ferramenta'}`,
        currentPage: 'ai-tools',
        tool,
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

      // Get current tool to preserve logo if no new file uploaded
      const currentTool = await prisma.aiTool.findUnique({
        where: { id: req.params.id }
      });

      if (!currentTool) {
        res.status(404).json({ error: 'Ferramenta não encontrada' });
        return;
      }

      // Debug info to help diagnose missing fields
      console.log('📝 Update body:', Object.keys(req.body).reduce((acc, k) => ({ ...acc, [k]: typeof (req.body as any)[k] === 'string' ? (req.body as any)[k].substring(0, 100) : '[object]'}), {}));
      console.log('📝 Update file present:', !!(req as any).file);

      // Handle uploaded file (multer)
      const file = (req as any).file;
      const uploadedLogo = file ? `/uploads/${file.filename}` : currentTool.logoUrl;

      // Fallbacks: if required fields weren't sent (multipart oddities), preserve current values
      const finalName = name && String(name).trim() ? String(name).trim() : currentTool.name;
      const finalSlug = slug && String(slug).trim() ? String(slug).trim() : currentTool.slug;
      const finalShortDesc = shortDesc && String(shortDesc).trim() ? String(shortDesc).trim() : currentTool.shortDesc;

      await prisma.aiTool.update({
        where: { id: req.params.id },
        data: {
          name: finalName,
          slug: finalSlug,
          shortDesc: finalShortDesc,
          description,
          url,
          logoUrl: uploadedLogo,
          categoryId,
          pricingType,
          pricingDetails: pricingDetails || null,
          features: features ? features.split('\n').map((f: string) => f.trim()).filter((f: string) => f) : [],
          pros: pros ? pros.split('\n').map((p: string) => p.trim()).filter((p: string) => p) : [],
          cons: cons ? cons.split('\n').map((c: string) => c.trim()).filter((c: string) => c) : [],
          useCases: useCases ? useCases.split('\n').map((u: string) => u.trim()).filter((u: string) => u) : [],
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
