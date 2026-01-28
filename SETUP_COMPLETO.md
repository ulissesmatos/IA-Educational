# ✅ Painel Admin - Instalação Completa

## O que foi implementado

✅ **Sistema de Autenticação Seguro**
- Login com email e senha
- Senhas com hash bcrypt (12 salt rounds)
- Sessões armazenadas no PostgreSQL
- Middleware de autenticação e autorização
- Proteção com Helmet (headers de segurança)

✅ **Estrutura Modular**
```
src/admin/
├── middleware/auth.middleware.ts  ✅
├── services/auth.service.ts       ✅
├── controllers/
│   ├── auth.controller.ts         ✅
│   ├── dashboard.controller.ts    ✅
│   ├── quiz.controller.ts         ✅
│   └── ai-tools.controller.ts     ✅
└── routes/
    ├── auth.routes.ts             ✅
    └── admin.routes.ts            ✅
```

✅ **Views Admin Completas**
- Layout base com sidebar                ✅
- Página de login                        ✅
- Dashboard com estatísticas             ✅
- Lista e formulário de perguntas        ✅
- Lista e formulário de ferramentas IA   ✅

✅ **Design Ultra Minimalista**
- Paleta de cores neutras
- Sem emojis (apenas heroicons)
- Interface moderna e limpa
- Responsivo

✅ **Banco de Dados**
- Tabelas AdminUser e Session criadas    ✅
- Migração aplicada                      ✅
- Primeiro usuário admin criado          ✅

## 🔐 Credenciais de Acesso

**URL**: http://localhost:3000/admin/login

**Usuário criado**:
- Email: `admin@iaounao.com`
- Senha: `admin123456`

⚠️ **IMPORTANTE**: Altere esta senha após o primeiro login em produção!

## 🚀 Como usar

### 1. Acessar o Painel Admin

```bash
# Certifique-se que o Docker está rodando
docker ps

# Se não estiver, inicie:
cd /home/ubuntu/projects/ia-educational/IA-Educational
docker-compose up -d

# Acesse no navegador:
# http://localhost:3000/admin/login
```

### 2. Fazer Login

1. Abra http://localhost:3000/admin/login
2. Digite: admin@iaounao.com
3. Senha: admin123456
4. Clique em "Entrar"

### 3. Gerenciar Conteúdo

**Dashboard** (`/admin`)
- Visualize estatísticas gerais
- Acesso rápido para criar perguntas/ferramentas
- Link para iniciar o jogo

**Perguntas do Quiz** (`/admin/quiz`)
- Liste todas as perguntas
- Crie novas perguntas com o botão "Nova Pergunta"
- Edite perguntas existentes
- Ative/desative perguntas
- Exclua perguntas

**Ferramentas IA** (`/admin/ai-tools`)
- Liste todas as ferramentas do catálogo
- Adicione novas ferramentas
- Edite informações das ferramentas
- Destaque ferramentas principais
- Ative/desative ferramentas

## 📝 Próximos Passos

### Para Criar Mais Admins

Você tem duas opções:

#### Opção 1: Via Script (Recomendado)
```bash
# Copie o script para o container
docker cp scripts/setup-admin.ts ia-educational-app-1:/app/setup-admin.ts

# Execute no container
docker exec -it ia-educational-app-1 npx tsx /app/setup-admin.ts
```

#### Opção 2: Via SQL Direto
```sql
-- 1. Gere o hash da senha em https://bcrypt-generator.com/ (rounds: 12)
-- 2. Execute no banco:
INSERT INTO "AdminUser" (id, email, "passwordHash", name, "isActive", "createdAt", "updatedAt") 
VALUES (
    'novo-id-unico', 
    'novo@email.com', 
    '$2b$12$HASH_GERADO_AQUI', 
    'Nome do Admin', 
    true, 
    NOW(), 
    NOW()
);
```

### Para Alterar Senha de Admin

```sql
-- Gere novo hash em https://bcrypt-generator.com/
-- Atualize no banco:
UPDATE "AdminUser" 
SET "passwordHash" = '$2b$12$NOVO_HASH_AQUI', 
    "updatedAt" = NOW() 
WHERE email = 'admin@iaounao.com';
```

### Para Desativar Admin

```sql
UPDATE "AdminUser" 
SET "isActive" = false, 
    "updatedAt" = NOW() 
WHERE email = 'admin@iaounao.com';
```

## 🔒 Segurança em Produção

Antes de colocar em produção, certifique-se de:

- [ ] Alterar a senha padrão do admin
- [ ] Definir `SESSION_SECRET` forte no .env
- [ ] Definir `NODE_ENV=production`
- [ ] Habilitar HTTPS
- [ ] Configurar firewall
- [ ] Implementar rate limiting
- [ ] Configurar backups automáticos
- [ ] Revisar logs regularmente

## 🎨 Personalizar Design

O design do admin é totalmente personalizável editando:

**CSS**: `public/admin/css/admin.css`

Variáveis principais:
```css
--admin-bg: #FAFAFA          /* Fundo */
--admin-accent: #2563EB      /* Cor primária */
--admin-text: #1F2937        /* Texto */
--admin-border: #E5E7EB      /* Bordas */
```

## 📚 Arquivos de Referência

- `ADMIN_README.md` - Documentação completa do admin
- `.env.example` - Exemplo de variáveis de ambiente
- `prisma/schema.prisma` - Modelos do banco de dados
- `src/admin-setup.ts` - Configuração de segurança e rotas

## 🐛 Troubleshooting

### "Não consigo fazer login"
1. Verifique se o banco está rodando: `docker ps`
2. Verifique se as tabelas existem: `docker exec ia-educational-postgres-1 psql -U postgres -d iaounao -c '\dt'`
3. Verifique se o usuário foi criado: `docker exec ia-educational-postgres-1 psql -U postgres -d iaounao -c 'SELECT * FROM "AdminUser"'`

### "Erro 404 no /admin"
1. Verifique se o servidor está rodando: `docker logs ia-educational-app-1`
2. Reinicie o container: `docker-compose restart app`
3. Verifique se o código foi compilado: `docker exec ia-educational-app-1 ls dist/admin`

### "Sessão expira rapidamente"
Ajuste o `maxAge` em `src/admin-setup.ts` (padrão: 24 horas)

### "Página de erro ao criar pergunta"
Verifique se todos os campos obrigatórios foram preenchidos e se o formulário está enviando os dados corretamente.

## 🎉 Pronto!

Seu painel admin está totalmente funcional! Acesse agora:

🌐 http://localhost:3000/admin/login

Credenciais: admin@iaounao.com / admin123456

Divirta-se gerenciando seu conteúdo! 🚀

---

**Desenvolvido por:** GitHub Copilot (Claude Sonnet 4.5)
**Data:** Janeiro 2024
**Versão:** 1.0.0
