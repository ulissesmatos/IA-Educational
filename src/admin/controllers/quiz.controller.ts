import { Request, Response } from 'express';
import { PrismaClient, QuestionType } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const prisma = new PrismaClient();

/**
 * Controller para gerenciamento de questões do quiz
 */
export class QuizController {
  /**
   * GET /admin/quiz
   * Lista todas as questões
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const questions = await prisma.question.findMany({
        orderBy: [
          { orderIndex: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      const errorMessage = req.query.error ? 'Questão não encontrada ou já removida.' : null;
      const successMessage = req.query.success ? 'Questão removida com sucesso.' : null;

      res.render('admin/quiz/list', {
        title: 'Perguntas do Quiz',
        currentPage: 'quiz',
        questions,
        errorMessage,
        successMessage
      });
    } catch (error) {
      console.error('Erro ao listar questões:', error);
      res.status(500).send('Erro ao carregar questões');
    }
  }

  /**
   * GET /admin/quiz/new
   * Exibe formulário de nova questão
   */
  static showCreateForm(req: Request, res: Response): void {
    res.render('admin/quiz/edit', {
      title: 'Nova Pergunta',
      currentPage: 'quiz',
      question: null,
      questionTypes: Object.values(QuestionType),
      errors: null,
      formData: null
    });
  }

  /**
   * GET /admin/quiz/:id/edit
   * Exibe formulário de edição
   */
  static async showEditForm(req: Request, res: Response): Promise<void> {
    try {
      const question = await prisma.question.findUnique({
        where: { id: req.params.id }
      });

      if (!question) {
        res.status(404).send('Questão não encontrada');
        return;
      }

      res.render('admin/quiz/edit', {
        title: 'Editar Pergunta',
        currentPage: 'quiz',
        question,
        questionTypes: Object.values(QuestionType),
        errors: null,
        formData: null
      });
    } catch (error) {
      console.error('Erro ao carregar questão:', error);
      res.status(500).send('Erro ao carregar questão');
    }
  }

  /**
   * Validadores
   */
  static validators = [
    body('prompt').trim().notEmpty().withMessage('Texto da pergunta é obrigatório'),
    body('correctOption').isInt({ min: 0, max: 1 }).withMessage('Opção correta inválida'),
    body('explanation').trim().notEmpty().withMessage('Explicação é obrigatória'),
    body('imageUrl').optional({ checkFalsy: true }),
    body('imageUrl2').optional({ checkFalsy: true }),
    body('type').optional().isIn(Object.values(QuestionType)),
    body('isActive').optional()
  ];

  /**
   * POST /admin/quiz
   * Cria nova questão
   */
  static async create(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('admin/quiz/edit', {
        title: 'Nova Pergunta',
        currentPage: 'quiz',
        question: null,
        errors: errors.array(),
        formData: req.body
      });
      return;
    }

    try {
      const { prompt, type, correctOption, explanation, imageUrl, imageUrl2, isActive, options } = req.body;

      // Definir opções baseado no tipo
      let questionOptions = options ? JSON.parse(options) : ['IA', 'Não IA'];
      if (type === 'IMAGE_COMPARE') {
        questionOptions = ['Imagem A', 'Imagem B'];
      }

      await prisma.question.create({
        data: {
          prompt,
          type: (type as QuestionType) || 'IMAGE_CLASSIFY',
          correctOption: parseInt(correctOption),
          optionsJson: questionOptions,
          explanation,
          imageUrl: imageUrl || null,
          imageUrl2: imageUrl2 || null,
          isActive: isActive === 'true'
        }
      });

      res.redirect('/admin/quiz');
    } catch (error) {
      console.error('Erro ao criar questão:', error);
      res.render('admin/quiz/edit', {
        title: 'Nova Pergunta',
        currentPage: 'quiz',
        question: null,
        errors: [{ msg: 'Erro ao salvar pergunta' }],
        formData: req.body
      });
    }
  }

  /**
   * PUT /admin/quiz/:id
   * Atualiza questão
   */
  static async update(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const question = await prisma.question.findUnique({
        where: { id: req.params.id }
      });
      res.render('admin/quiz/edit', {
        title: 'Editar Pergunta',
        currentPage: 'quiz',
        question,
        errors: errors.array(),
        formData: req.body
      });
      return;
    }

    try {
      const { prompt, type, correctOption, explanation, imageUrl, imageUrl2, isActive, options } = req.body;

      // Definir opções baseado no tipo
      let questionOptions = options ? JSON.parse(options) : ['IA', 'Não IA'];
      if (type === 'IMAGE_COMPARE') {
        questionOptions = ['Imagem A', 'Imagem B'];
      }

      await prisma.question.update({
        where: { id: req.params.id },
        data: {
          prompt,
          type: (type as QuestionType) || 'IMAGE_CLASSIFY',
          correctOption: parseInt(correctOption),
          optionsJson: questionOptions,
          explanation,
          imageUrl: imageUrl || null,
          imageUrl2: imageUrl2 || null,
          isActive: isActive === 'true'
        }
      });

      res.redirect('/admin/quiz');
    } catch (error) {
      console.error('Erro ao atualizar questão:', error);
      const question = await prisma.question.findUnique({
        where: { id: req.params.id }
      });
      res.render('admin/quiz/edit', {
        title: 'Editar Pergunta',
        currentPage: 'quiz',
        question,
        errors: [{ msg: 'Erro ao atualizar pergunta' }],
        formData: req.body
      });
    }
  }

  /**
   * DELETE /admin/quiz/:id
   * Deleta questão
   * Also accepts POST /admin/quiz/:id/delete for HTML forms without method-override
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await prisma.question.deleteMany({
        where: { id: req.params.id }
      });

      if (result.count === 0) {
        // Not found
        if (req.method === 'POST' || (req.headers.accept && req.headers.accept.toString().includes('text/html'))) {
          res.redirect('/admin/quiz?error=notfound');
          return;
        }
        res.status(404).json({ error: 'Questão não encontrada' });
        return;
      }

      // Successful delete
      if (req.method === 'POST' || (req.headers.accept && req.headers.accept.toString().includes('text/html'))) {
        res.redirect('/admin/quiz?success=deleted');
        return;
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao deletar questão:', error);
      if (req.method === 'POST' || (req.headers.accept && req.headers.accept.toString().includes('text/html'))) {
        res.status(500).send('Erro ao deletar questão');
        return;
      }
      res.status(500).json({ error: 'Erro ao deletar questão' });
    }
  }

  /**
   * POST /admin/quiz/:id/toggle
   * Ativa/desativa questão
   */
  static async toggle(req: Request, res: Response): Promise<void> {
    try {
      const question = await prisma.question.findUnique({
        where: { id: req.params.id }
      });

      if (!question) {
        res.status(404).json({ error: 'Questão não encontrada' });
        return;
      }

      await prisma.question.update({
        where: { id: req.params.id },
        data: { isActive: !question.isActive }
      });

      res.json({ success: true, isActive: !question.isActive });
    } catch (error) {
      console.error('Erro ao alternar questão:', error);
      res.status(500).json({ error: 'Erro ao alternar questão' });
    }
  }
}
