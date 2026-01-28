import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service.js';

/**
 * Controller de autenticação do painel admin
 */
export class AuthController {
  /**
   * GET /admin/login
   * Exibe formulário de login
   */
  static showLoginForm(req: Request, res: Response): void {
    res.render('admin/auth/login', {
      title: 'Login - Painel Admin',
      error: null,
      redirect: req.query.redirect || '/admin/dashboard'
    });
  }

  /**
   * Validadores para login
   */
  static loginValidators = [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Senha obrigatória')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres')
  ];

  /**
   * POST /admin/login
   * Processa login
   */
  static async processLogin(req: Request, res: Response): Promise<void> {
    // Valida dados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('admin/auth/login', {
        title: 'Login - Painel Admin',
        error: errors.array()[0].msg,
        redirect: req.body.redirect || '/admin/dashboard'
      });
      return;
    }

    const { email, password, redirect } = req.body;

    try {
      // Autentica usuário
      const user = await AuthService.authenticate(email, password);

      if (!user) {
        res.render('admin/auth/login', {
          title: 'Login - Painel Admin',
          error: 'Email ou senha incorretos',
          redirect: redirect || '/admin/dashboard'
        });
        return;
      }

      // Cria sessão
      req.session.adminUserId = user.id;
      req.session.adminEmail = user.email;
      req.session.adminName = user.name;

      // Salva sessão e redireciona
      req.session.save((err) => {
        if (err) {
          console.error('Erro ao salvar sessão:', err);
          res.render('admin/auth/login', {
            title: 'Login - Painel Admin',
            error: 'Erro ao processar login',
            redirect: redirect || '/admin/dashboard'
          });
          return;
        }

        res.redirect(redirect || '/admin/dashboard');
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.render('admin/auth/login', {
        title: 'Login - Painel Admin',
        error: 'Erro ao processar login',
        redirect: redirect || '/admin/dashboard'
      });
    }
  }

  /**
   * POST /admin/logout
   * Faz logout do usuário
   */
  static logout(req: Request, res: Response): void {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao destruir sessão:', err);
      }
      res.redirect('/admin/login');
    });
  }
}
