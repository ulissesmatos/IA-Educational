import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { testConnection, prisma } from './db.js';
import { setupSocketHandlers } from './realtime/socketHandler.js';
import apiRoutes from './routes/api.js';
import pageRoutes from './routes/pages.js';
import { gameService } from './services/gameService.js';
import { setupAdmin } from './admin-setup.js';
import { SEED_QUESTIONS } from './seed-data.js';

// ES Module path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garantir que a pasta uploads existe
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Pasta uploads criada:', uploadsDir);
}

// Configuração
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Express app
const app = express();
const httpServer = createServer(app);

// Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: NODE_ENV === 'development' ? '*' : false,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override para formulários HTML
import methodOverride from 'method-override';
app.use(methodOverride('_method'));

// Variáveis globais para views
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.siteName = process.env.SITE_NAME || 'IA ou Não?';
  res.locals.gameName = process.env.GAME_NAME || 'IA ou Não?';
  next();
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Setup Admin (segurança, sessões e rotas admin)
setupAdmin(app);

// Rotas
app.use('/api', apiRoutes);
app.use('/', pageRoutes);

// Middleware de erro
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Erro:', err.message);

  res.status(500).render('error', {
    statusCode: 500,
    title: 'Erro interno',
    message: NODE_ENV === 'development' ? err.message : 'Ocorreu um erro interno no servidor.',
    siteName: process.env.SITE_NAME || 'IA ou Não?',
    gameName: process.env.GAME_NAME || 'IA ou Não?',
  });
});

// 404 - Página não encontrada
app.use((_req: Request, res: Response) => {
  res.status(404).render('error', {
    statusCode: 404,
    title: 'Página não encontrada',
    message: 'A página que você está procurando não existe ou foi movida.',
    siteName: process.env.SITE_NAME || 'IA ou Não?',
    gameName: process.env.GAME_NAME || 'IA ou Não?',
  });
});

// Socket.io handlers
setupSocketHandlers(io);

// Cleanup de salas expiradas (a cada hora)
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hora
setInterval(async () => {
  try {
    await gameService.cleanupExpiredRooms();
  } catch (error) {
    console.error('Erro no cleanup:', error);
  }
}, CLEANUP_INTERVAL);

async function runMigrations(): Promise<void> {
  console.log('🗃️  Executando migrações Prisma...');
  // Tenta via caminho direto primeiro (mais confiável que npx)
  const prismaBin = path.join(__dirname, '../node_modules/.bin/prisma');
  try {
    execSync(`"${prismaBin}" migrate deploy`, { stdio: 'inherit' });
  } catch {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  }
  console.log('✅ Migrações concluídas!');
}

async function seedIfEmpty(): Promise<void> {
  const count = await prisma.question.count();
  if (count > 0) {
    console.log(`🌱 ${count} questões já existem — pulando seed.`);
    return;
  }
  console.log('🌱 Banco vazio — inserindo questões iniciais...');
  for (let i = 0; i < SEED_QUESTIONS.length; i++) {
    const q = SEED_QUESTIONS[i];
    await prisma.question.create({
      data: {
        type: 'TRUE_FALSE' as any, // eslint-disable-line
        prompt: q.prompt,
        imageUrl: null,
        imageUrl2: null,
        optionsJson: ['Verdadeiro', 'Falso'],
        correctOption: q.correctOption,
        explanation: q.explanation,
        orderIndex: i,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${SEED_QUESTIONS.length} questões inseridas!`);
}

// Inicialização
async function start(): Promise<void> {
  console.log('🚀 Iniciando Quiz de Redes — CEBRASPE...');
  console.log(`📍 Ambiente: ${NODE_ENV}`);
  console.log(`📦 GIT_COMMIT: ${process.env.GIT_COMMIT || 'unknown'}`);

  // Em produção: rodar migrations e seed antes de qualquer operação no banco
  if (NODE_ENV === 'production') {
    await runMigrations();
  }

  // Testar conexão com banco
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('❌ Falha ao conectar com o banco. Encerrando...');
    process.exit(1);
  }

  // Em produção: seed automático se banco estiver vazio
  if (NODE_ENV === 'production') {
    await seedIfEmpty();
  }

  // Limpeza inicial de salas expiradas
  await gameService.cleanupExpiredRooms();

  // Iniciar servidor
  httpServer.listen(PORT, () => {
    console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`\n📱 Rotas disponíveis:`);
    console.log(`   - GET  /admin/login    → Login do administrador`);
    console.log(`   - GET  /admin          → Painel admin`);
    console.log(`   - GET  /host           → Painel do facilitador`);
    console.log(`   - GET  /join           → Tela de entrada`);
    console.log(`   - GET  /play/:code     → Tela do jogador`);
    console.log(`   - GET  /screen/:code   → Tela do projetor\n`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n🛑 Recebido SIGTERM. Encerrando...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Recebido SIGINT. Encerrando...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start
start().catch((error) => {
  console.error('❌ Erro fatal ao iniciar:', error);
  process.exit(1);
});
