import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { redirectIfAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Rotas de autenticação (não requerem login)
router.get('/login', redirectIfAuth, AuthController.showLoginForm);
router.post('/login', AuthController.loginValidators, AuthController.processLogin);
router.post('/logout', AuthController.logout);

export default router;
