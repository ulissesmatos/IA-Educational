import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include session
declare module 'express-session' {
  interface SessionData {
    adminUserId?: string;
    adminEmail?: string;
    adminName?: string;
  }
}

/**
 * Middleware para proteger rotas admin
 * Verifica se o usuário está autenticado via sessão
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.adminUserId) {
    return next();
  }

  // Se for requisição AJAX/API, retorna 401
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    res.status(401).json({ error: 'Não autenticado' });
    return;
  }

  // Caso contrário, redireciona para login
  res.redirect('/admin/login?redirect=' + encodeURIComponent(req.originalUrl));
}

/**
 * Middleware para redirecionar usuários autenticados
 * Usado na página de login para não permitir acesso se já estiver logado
 */
export function redirectIfAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.adminUserId) {
    res.redirect('/admin/dashboard');
    return;
  }
  next();
}

/**
 * Helper para adicionar dados do usuário ao locals (disponível nas views)
 */
export function addUserToLocals(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.adminUserId) {
    res.locals.adminUserId = req.session.adminUserId;
    res.locals.adminEmail = req.session.adminEmail;
    res.locals.adminName = req.session.adminName;
  }
  next();
}
