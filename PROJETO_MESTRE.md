# IA ou Não? - Arquivo Mestre do Projeto

## 📋 Visão Geral

Ferramenta online gamificada para oficina "IA na Educação" que permite participantes responderem quizzes interativos sobre inteligência artificial.

## 🎯 Funcionalidades Principais

### Tipos de Questões
1. **IMAGE_CLASSIFY**: "Imagem feita por IA ou por humano?"
2. **TEXT_CLASSIFY**: "Texto de IA ou humano?"
3. **HALLUCINATION_DETECT**: "Tem erro/alucinação?" (Sim/Não/Precisa checar)
4. **LGPD_TRAFFIC_LIGHT**: "Pode/Depende/Não pode" (situações escolares)

### Fluxo do Jogo
1. Host cria sala → gera código (ex: ABC123)
2. Players entram com código + nickname
3. Host inicia o jogo
4. Host libera perguntas uma a uma
5. Players respondem no celular
6. Host revela resultados e ranking
7. Ao final, top 5 é exibido

## 🏗️ Arquitetura

```
ia-ou-nao/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
├── PROJETO_MESTRE.md
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── images/
│   │   └── (placeholders)
│   └── css/
│       └── custom.css
├── src/
│   ├── server.ts
│   ├── db.ts
│   ├── types.ts
│   ├── routes/
│   │   ├── api.ts
│   │   └── pages.ts
│   ├── services/
│   │   └── gameService.ts
│   └── realtime/
│       └── socketHandler.ts
└── views/
    ├── partials/
    │   └── head.ejs
    ├── host.ejs
    ├── join.ejs
    ├── play.ejs
    └── screen.ejs
```

## 📊 Modelo de Dados

### Tabelas
- **rooms**: Salas de jogo (id, code, status, created_at, expires_at)
- **players**: Jogadores (id, room_id, nickname, score, joined_at)
- **questions**: Perguntas do quiz (id, type, prompt, image_url, options_json, correct_option, explanation, order_index, is_active)
- **room_questions**: Associação sala-pergunta (id, room_id, question_id, order_index)
- **answers**: Respostas dos jogadores (id, room_id, player_id, question_id, selected_option, is_correct, time_ms, created_at)

### Status da Sala
- `lobby`: Aguardando jogadores
- `asking`: Pergunta liberada, aguardando respostas
- `revealed`: Resultado revelado
- `ended`: Sala encerrada

## 🔌 API REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/rooms | Cria nova sala |
| POST | /api/rooms/:code/start | Inicia a sala |
| POST | /api/rooms/:code/next | Avança para próxima pergunta |
| POST | /api/rooms/:code/reveal | Revela resultado da pergunta |
| POST | /api/rooms/:code/end | Encerra e limpa dados da sala |
| GET | /api/rooms/:code/state | Retorna estado atual da sala |

## 🔄 Eventos Socket.io

### Cliente → Servidor
- `join:room` - Player entra na sala
- `player:answer` - Player envia resposta
- `host:action` - Host executa ação (start/next/reveal/end)

### Servidor → Cliente
- `room:state` - Estado atualizado da sala
- `player:joined` - Novo player entrou
- `player:answered` - Player respondeu (só contador)
- `question:revealed` - Resultado da pergunta
- `game:ended` - Jogo encerrado
- `error` - Erro

## 🎨 Rotas de Páginas

| Rota | Descrição |
|------|-----------|
| GET /host | Painel do facilitador |
| GET /join | Tela de entrada (código + nickname) |
| GET /play/:room_code | Tela do jogador |
| GET /screen/:room_code | Tela do projetor (data-show) |

## 📝 Pontuação

- **Acerto**: +100 pontos
- **Bônus de tempo**: Máximo +50 pontos (decresce linearmente em 20s)
  - Fórmula: `bonus = Math.max(0, 50 - (tempo_ms / 400))`

## 🐳 Docker

```bash
# Subir todo o ambiente
docker compose up --build

# Apenas o banco
docker compose up postgres -d

# Executar migrations
docker compose exec app npx prisma migrate deploy

# Executar seed
docker compose exec app npx prisma db seed
```

## ✅ Checklist de Implementação

- [x] Estrutura de pastas criada
- [x] Configuração TypeScript (tsconfig.json)
- [x] Docker Compose configurado (app + postgres)
- [x] Schema Prisma com todas as tabelas
- [x] Migration inicial
- [x] Servidor Express + Socket.io (server.ts)
- [x] Conexão PostgreSQL (db.ts)
- [x] Rotas API REST completas (api.ts)
- [x] Rotas de páginas (pages.ts)
- [x] Socket.io handler com todos os eventos
- [x] GameService com lógica completa do jogo
- [x] View Host (painel do facilitador)
- [x] View Join (entrada de participantes)
- [x] View Play (tela do jogador mobile)
- [x] View Screen (projetor para data-show)
- [x] Seed com 16 perguntas
- [x] 8 placeholders de imagem SVG
- [x] README completo com instruções
- [x] Arquivo mestre de documentação

## 🔧 Variáveis de Ambiente

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/iaounao
PORT=3000
NODE_ENV=development
```

## 📅 Expiração de Salas

- Salas expiram automaticamente em 24 horas
- Job de limpeza roda a cada hora
- Host pode encerrar manualmente a qualquer momento

## 🔒 Privacidade

- Sem login/autenticação
- Sem e-mail ou nome completo
- Apenas nickname (anônimo)
- Sem registro de IP
- Dados mínimos, apagados ao encerrar sala
