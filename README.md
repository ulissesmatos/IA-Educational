# 🤖 IA ou Não?

Ferramenta gamificada para oficina "IA na Educação" - um quiz interativo onde participantes tentam distinguir conteúdo gerado por IA de conteúdo criado por humanos.

## 📋 Características

- **4 tipos de questões**:
  - 🖼️ **IMAGE_CLASSIFY**: Imagem feita por IA ou por humano?
  - 📝 **TEXT_CLASSIFY**: Texto de IA ou humano?
  - 🔍 **HALLUCINATION_DETECT**: Tem erro/alucinação? (Sim/Não/Precisa checar)
  - 🚦 **LGPD_TRAFFIC_LIGHT**: Pode/Depende/Não pode (situações escolares)

- **Tempo real** via Socket.io
- **Sem login** - apenas nickname
- **Privacidade** - sem e-mail, sem IP registrado
- **Responsivo** - funciona em celular e desktop

## 🚀 Início Rápido

### Pré-requisitos

- Docker e Docker Compose instalados
- Porta 3000 disponível

### Executar

```bash
# Clonar ou copiar o projeto
cd ia-ou-nao

# Subir com Docker Compose
docker compose up --build
```

Aguarde as mensagens:
```
✅ Conexão com PostgreSQL estabelecida
✅ Servidor rodando em http://localhost:3000
```

### Acessar

- **Host (Facilitador)**: http://localhost:3000/host
- **Participantes**: http://localhost:3000/join
- **Projetor**: http://localhost:3000/screen/CODIGO

## 🎮 Como Usar

### Para o Facilitador

1. Acesse `/host` no navegador
2. Clique em "Criar Sala"
3. Compartilhe o código da sala com os participantes
4. Abra `/screen/CODIGO` em outra aba para projetar
5. Quando todos entrarem, clique "Iniciar Jogo"
6. Use "Próxima Pergunta" e "Revelar Resultado" para controlar o ritmo

### Para Participantes

1. Acesse o link fornecido pelo facilitador (ou `/join`)
2. Digite o código da sala e um apelido
3. Aguarde o facilitador iniciar
4. Responda as perguntas no tempo!

## 📁 Estrutura do Projeto

```
ia-ou-nao/
├── docker-compose.yml     # Orquestração Docker
├── Dockerfile             # Build da aplicação
├── package.json           # Dependências Node.js
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── seed.ts            # Seed de perguntas
├── public/
│   ├── css/custom.css     # Estilos extras
│   └── images/            # Imagens das perguntas
├── src/
│   ├── server.ts          # Servidor principal
│   ├── db.ts              # Conexão PostgreSQL
│   ├── types.ts           # Tipos TypeScript
│   ├── routes/
│   │   ├── api.ts         # API REST
│   │   └── pages.ts       # Rotas de páginas
│   ├── services/
│   │   └── gameService.ts # Lógica do jogo
│   └── realtime/
│       └── socketHandler.ts # Socket.io
└── views/                 # Templates EJS
    ├── host.ejs           # Painel do host
    ├── join.ejs           # Entrada
    ├── play.ejs           # Tela do player
    └── screen.ejs         # Projetor
```

## 🖼️ Substituir Imagens

As imagens placeholder estão em `/public/images/`. Para substituir:

1. Mantenha os mesmos nomes de arquivo:
   - `img_01_ia_paisagem.jpg`
   - `img_02_ia_retrato.jpg`
   - `img_03_humano_abstrato.jpg`
   - `img_04_humano_natureza.jpg`
   - `img_05_ia_gato.jpg`
   - `img_06_humano_comida.jpg`
   - `img_07_ia_cidade.jpg`
   - `img_08_humano_desenho.jpg`

2. Ou edite o arquivo `prisma/seed.ts` para usar novos nomes/URLs

3. Execute o seed novamente:
   ```bash
   docker compose exec app npx prisma db seed
   ```

## ✏️ Adicionar/Editar Perguntas

Edite o arquivo `prisma/seed.ts`:

```typescript
{
  type: 'IMAGE_CLASSIFY',  // ou TEXT_CLASSIFY, HALLUCINATION_DETECT, LGPD_TRAFFIC_LIGHT
  prompt: 'Sua pergunta aqui',
  imageUrl: '/images/sua_imagem.jpg',  // ou null para perguntas de texto
  options: ['Opção A', 'Opção B', 'Opção C'],  // alternativas
  correctOption: 0,  // índice da resposta correta (0-based)
  explanation: 'Explicação mostrada após revelar',
}
```

Depois execute:
```bash
docker compose exec app npx prisma db seed
```

## 🔧 Desenvolvimento Local (sem Docker)

```bash
# Instalar dependências
npm install

# Configurar banco (precisa ter PostgreSQL rodando)
cp .env.example .env
# Edite .env com sua DATABASE_URL

# Rodar migrations
npx prisma migrate dev

# Seed
npx prisma db seed

# Rodar em dev
npm run dev
```

## 📊 API REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/rooms` | Criar sala |
| POST | `/api/rooms/:code/join` | Entrar na sala |
| POST | `/api/rooms/:code/start` | Iniciar jogo |
| POST | `/api/rooms/:code/next` | Próxima pergunta |
| POST | `/api/rooms/:code/reveal` | Revelar resultado |
| POST | `/api/rooms/:code/end` | Encerrar sala |
| GET | `/api/rooms/:code/state` | Estado da sala |
| GET | `/api/rooms/:code/exists` | Verificar se existe |

## 🔒 Privacidade e Segurança

- Nenhum login ou autenticação é necessário
- Apenas nicknames são armazenados (sem nomes completos)
- Nenhum e-mail é coletado
- IPs não são registrados
- Salas expiram automaticamente em 24 horas
- Dados são apagados ao encerrar a sala

## 🐛 Troubleshooting

### "Sala não encontrada"
- Verifique se digitou o código corretamente (maiúsculas)
- A sala pode ter expirado (24h) ou sido encerrada

### Banco não conecta
- Verifique se o PostgreSQL está rodando
- Confirme a DATABASE_URL no .env

### Websocket não conecta
- Verifique se está usando http:// e não https:// localmente
- Certifique-se de que a porta 3000 não está bloqueada

## 📝 Licença

MIT

---

Desenvolvido para oficinas de formação em IA na Educação 🎓
