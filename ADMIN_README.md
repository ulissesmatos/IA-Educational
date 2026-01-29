# Painel Administrativo - IA ou Não?

## Visão Geral

O painel administrativo oferece uma interface moderna e minimalista para gerenciar todo o conteúdo do jogo "IA ou Não?".

## Funcionalidades

- ✅ **Autenticação Segura**: Sistema de login com bcrypt e sessões no PostgreSQL
- ✅ **Gerenciamento de Perguntas**: CRUD completo para as perguntas do quiz
- ✅ **Gerenciamento de Ferramentas IA**: Catálogo de ferramentas com recursos, prós, contras
- ✅ **Dashboard com Estatísticas**: Visão geral do sistema
- ✅ **Design Ultra Minimalista**: Interface moderna com cores neutras

## Configuração Inicial

### 1. Instalar Dependências

As dependências de segurança já foram instaladas:
- bcrypt (hash de senhas)
- express-session (gerenciamento de sessões)
- connect-pg-simple (armazenamento de sessões no PostgreSQL)
- helmet (headers de segurança)
- express-validator (validação de entrada)

### 2. Configurar Variável de Ambiente

Adicione ao seu arquivo `.env`:

```bash
SESSION_SECRET="sua-string-secreta-aleatoria-aqui"
```

**IMPORTANTE**: Em produção, use uma string aleatória forte e nunca compartilhe.

### 3. Inicializar Banco de Dados

Para desenvolvimento, use o comando completo que faz tudo automaticamente:

```bash
npm run db:init
```

Este comando executa:
- Geração do cliente Prisma
- Migrações do banco
- Verificação e correção de tabelas
- Seed dos dados iniciais

**Ou execute individualmente:**
```bash
npm run db:generate    # Gerar cliente Prisma
npm run db:migrate     # Executar migrações
npm run db:check       # Verificar/corrigir tabelas
npm run db:seed        # Popular dados iniciais
npm run db:status      # Ver estatísticas do banco
```

### 4. Criar Primeiro Usuário Admin

Execute o script de setup:

```bash
npm run admin:setup
```

O script irá solicitar:
- Nome do administrador
- Email
- Senha (mínimo 8 caracteres)

## Acessar o Painel

1. Inicie o servidor:
```bash
npm run dev
```

2. Acesse:
```
http://localhost:3000/admin/login
```

3. Faça login com as credenciais criadas

## Estrutura de Rotas

### Rotas Públicas
- `GET /admin/login` - Página de login

### Rotas Protegidas (requerem autenticação)
- `GET /admin` - Dashboard principal
- `GET /admin/quiz` - Lista de perguntas
- `GET /admin/quiz/new` - Criar nova pergunta
- `GET /admin/quiz/:id/edit` - Editar pergunta
- `POST /admin/quiz` - Salvar nova pergunta
- `POST /admin/quiz/:id` - Atualizar pergunta
- `POST /admin/quiz/:id/toggle` - Ativar/desativar pergunta
- `POST /admin/quiz/:id/delete` - Excluir pergunta
- `GET /admin/ai-tools` - Lista de ferramentas IA
- `GET /admin/ai-tools/new` - Criar nova ferramenta
- `GET /admin/ai-tools/:id/edit` - Editar ferramenta
- `POST /admin/ai-tools` - Salvar nova ferramenta
- `POST /admin/ai-tools/:id` - Atualizar ferramenta
- `POST /admin/ai-tools/:id/toggle` - Ativar/desativar ferramenta
- `POST /admin/ai-tools/:id/toggle-featured` - Destacar ferramenta
- `POST /admin/ai-tools/:id/delete` - Excluir ferramenta
- `POST /admin/logout` - Fazer logout

## Arquitetura

### Estrutura de Pastas

```
src/admin/
├── middleware/
│   └── auth.middleware.ts          # Guards de autenticação
├── services/
│   └── auth.service.ts             # Lógica de autenticação
├── controllers/
│   ├── auth.controller.ts          # Login/logout
│   ├── dashboard.controller.ts     # Dashboard
│   ├── quiz.controller.ts          # Perguntas do quiz
│   └── ai-tools.controller.ts      # Ferramentas IA
└── routes/
    ├── auth.routes.ts              # Rotas de autenticação
    └── admin.routes.ts             # Rotas protegidas

views/admin/
├── auth/
│   └── login.ejs                   # Página de login
├── layouts/
│   └── main.ejs                    # Layout base
├── dashboard/
│   └── index.ejs                   # Dashboard
├── quiz/
│   ├── list.ejs                    # Lista de perguntas
│   └── edit.ejs                    # Formulário pergunta
└── ai-tools/
    ├── list.ejs                    # Lista de ferramentas
    └── edit.ejs                    # Formulário ferramenta

public/admin/
└── css/
    └── admin.css                   # Estilos do admin

scripts/
└── setup-admin.ts                  # Script para criar admin
```

### Segurança

#### Autenticação
- Senhas armazenadas com bcrypt (12 salt rounds)
- Sessões armazenadas no PostgreSQL via connect-pg-simple
- Sessões expiram após 24 horas de inatividade
- Cookies httpOnly e secure (em produção)

#### Proteção de Headers
- Helmet configurado com CSP
- HSTS habilitado
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

#### Validação
- Express-validator em todos os formulários
- Sanitização de entrada
- Proteção contra XSS e SQL injection

#### Middleware
- `requireAuth`: Protege rotas (redireciona para login se não autenticado)
- `redirectIfAuth`: Redireciona usuários logados (para evitar re-login)
- `addUserToLocals`: Adiciona dados do usuário aos templates

## Design

### Paleta de Cores

```css
--admin-bg: #FAFAFA          /* Fundo geral */
--admin-card-bg: #FFFFFF     /* Cards e formulários */
--admin-accent: #2563EB      /* Azul primário */
--admin-text: #1F2937        /* Texto principal */
--admin-text-secondary: #6B7280  /* Texto secundário */
--admin-border: #E5E7EB      /* Bordas */
--admin-success: #10B981     /* Verde */
--admin-danger: #EF4444      /* Vermelho */
--admin-warning: #F59E0B     /* Laranja */
```

### Princípios de Design

1. **Minimalismo**: Apenas o essencial, sem decorações desnecessárias
2. **Cores Neutras**: Palette monocromática com acentos sutis
3. **Hierarquia Clara**: Tipografia bem definida
4. **Espaçamento Generoso**: Respiro visual entre elementos
5. **Zero Emojis**: Apenas Heroicons quando necessário
6. **Responsivo**: Funciona em desktop e tablet

## Desenvolvimento

### Adicionar Novo Recurso Admin

1. **Controller**: Criar em `src/admin/controllers/`
2. **Routes**: Adicionar em `src/admin/routes/admin.routes.ts`
3. **Views**: Criar em `views/admin/`
4. **Middleware**: Usar `requireAuth` para proteger rotas

### Exemplo de Novo Controller

```typescript
import { Request, Response } from 'express';
import { prisma } from '../../db.js';

export class MyController {
  static async list(req: Request, res: Response): Promise<void> {
    const items = await prisma.myModel.findMany();
    res.render('admin/my-resource/list', {
      title: 'Meu Recurso',
      currentPage: 'my-resource',
      items
    });
  }
}
```

### Exemplo de Nova Rota

```typescript
import { Router } from 'express';
import { MyController } from '../controllers/my.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/my-resource', requireAuth, MyController.list);

export default router;
```

## Troubleshooting

### Erro: "Cannot find module 'bcrypt'"
```bash
npm install
```

### Erro: "SESSION_SECRET não definido"
Adicione `SESSION_SECRET` ao arquivo `.env`

### Erro ao criar admin: "Prisma Client validation error"
Execute as migrações:
```bash
npx prisma migrate dev
```

### Não consigo fazer login
1. Verifique se o email está correto
2. Verifique se a senha tem no mínimo 8 caracteres
3. Verifique os logs do servidor para erros

### Sessão expira muito rápido
Ajuste `maxAge` em `src/admin-setup.ts` (padrão: 24 horas)

## Segurança em Produção

### Checklist

- [ ] `NODE_ENV=production` no `.env`
- [ ] `SESSION_SECRET` forte e único
- [ ] HTTPS habilitado (para cookies secure)
- [ ] Firewall configurado
- [ ] Rate limiting implementado
- [ ] Logs de acesso monitorados
- [ ] Backup regular do banco de dados
- [ ] Senhas dos admins fortes
- [ ] 2FA implementado (recomendado)

## Manutenção

### Criar Novo Admin

```bash
npm run admin:setup
```

### Desativar Admin

No banco de dados:
```sql
UPDATE "AdminUser" SET "isActive" = false WHERE email = 'admin@example.com';
```

### Ver Sessões Ativas

```sql
SELECT * FROM "Session";
```

### Limpar Sessões Expiradas

```sql
DELETE FROM "Session" WHERE expire < NOW();
```

## Suporte

Para problemas ou dúvidas sobre o painel admin, consulte:
1. Este README
2. Código-fonte comentado
3. Documentação do Prisma
4. Documentação do Express

---

**Desenvolvido com TypeScript, Express, Prisma e muito ☕**
