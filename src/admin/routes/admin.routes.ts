import { Router, Request, Response } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { QuizController } from '../controllers/quiz.controller.js';
import { AiToolsController } from '../controllers/ai-tools.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Todas as rotas admin requerem autenticação
router.use(requireAuth);

// Redireciona /admin para /admin/dashboard
router.get('/', (_req: Request, res: Response) => {
  res.redirect('/admin/dashboard');
});

// Dashboard
router.get('/dashboard', DashboardController.index);

// Questões do Quiz
router.get('/quiz', QuizController.list);
router.get('/quiz/new', QuizController.showCreateForm);
router.post('/quiz', QuizController.validators, QuizController.create);
router.get('/quiz/:id/edit', QuizController.showEditForm);
router.post('/quiz/:id', QuizController.validators, QuizController.update);
router.delete('/quiz/:id', QuizController.delete);
router.post('/quiz/:id/toggle', QuizController.toggle);

// Ferramentas IA
router.get('/ai-tools', AiToolsController.list);
router.get('/ai-tools/new', AiToolsController.showCreateForm);
router.post('/ai-tools', AiToolsController.validators, AiToolsController.create);
router.get('/ai-tools/:id/edit', AiToolsController.showEditForm);
router.put('/ai-tools/:id', AiToolsController.validators, AiToolsController.update);
// Backward compatibility: accept POST from forms that don't use method-override
router.post('/ai-tools/:id', AiToolsController.validators, AiToolsController.update);
router.delete('/ai-tools/:id', AiToolsController.delete);
router.post('/ai-tools/:id/toggle', AiToolsController.toggle);
router.post('/ai-tools/:id/toggle-featured', AiToolsController.toggleFeatured);

export default router;
