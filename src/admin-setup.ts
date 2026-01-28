/**
 * Configuração do painel admin
 * Sessões, segurança e rotas
 */

import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import helmet from 'helmet';
import { Express, Request, Response } from 'express';
import { Pool } from 'pg';
import authRoutes from './admin/routes/auth.routes.js';
import adminRoutes from './admin/routes/admin.routes.js';
import { addUserToLocals } from './admin/middleware/auth.middleware.js';

const PgSession = connectPgSimple(session);

// Pool de conexões PostgreSQL para sessões
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Configura o painel admin no Express app
 */
export function setupAdmin(app: Express): void {
  // Helmet para segurança (CSP, XSS, etc)
  app.use('/admin', helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
  }));

  // Configurar sessões com PostgreSQL
  const sessionStore = new PgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: false
  });

  app.use('/admin', session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'ia-educacao-super-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    name: 'admin.sid', // Nome customizado para o cookie
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS em produção
      sameSite: 'strict'
    }
  }));

  // Middleware para adicionar dados do usuário às views
  app.use('/admin', addUserToLocals);

  // Rotas admin
  app.use('/admin', authRoutes);
  app.use('/admin', adminRoutes);

  // 404 handler para rotas admin não encontradas
  app.use('/admin/*', (_req: Request, res: Response) => {
    res.status(404).render('admin/error', {
      statusCode: 404,
      title: 'Página não encontrada',
      message: 'A página que você está procurando não existe no painel admin.'
    });
  });

  console.log('✅ Painel admin configurado');
}
