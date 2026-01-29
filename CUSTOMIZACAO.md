# 🎨 Guia de Customização

## Nome do Site Configurável

O sistema permite personalizar o nome exibido em headers, footers e títulos através de variáveis de ambiente, mantendo a identidade do jogo separada.

### Variáveis de Ambiente

Configure no arquivo `.env`:

```bash
# Nome do Site (aparece em headers, footers, títulos, admin)
SITE_NAME=Meu Site Educacional

# Nome do Jogo (usado dentro do contexto do jogo)
GAME_NAME=IA ou Não?
```

### Diferença entre SITE_NAME e GAME_NAME

- **`SITE_NAME`**: Usado em toda a navegação pública, admin, headers, footers e meta tags
  - Header público
  - Footer público  
  - Painel administrativo
  - Títulos de páginas
  - Meta descriptions

- **`GAME_NAME`**: Usado exclusivamente nas telas do jogo
  - Tela de host (facilitador)
  - Tela de entrada (join)
  - Tela de jogo (play)
  - Tela de projeção (screen)
  - Dashboard do jogo

### Exemplos de Uso

#### 1. Site com marca própria, mantendo o jogo original

```bash
SITE_NAME=Escola Digital
GAME_NAME=IA ou Não?
```

Resultado:
- Header mostra: "Escola Digital"
- Jogo mostra: "IA ou Não?"

#### 2. Renomeando completamente

```bash
SITE_NAME=Plataforma Educacional XYZ
GAME_NAME=Quiz IA
```

Resultado:
- Todo o site usa: "Plataforma Educacional XYZ"
- Dentro do jogo: "Quiz IA"

#### 3. Mantendo nome original (padrão)

```bash
SITE_NAME=IA ou Não?
GAME_NAME=IA ou Não?
```

Resultado:
- Comportamento idêntico ao original

### Como Testar

1. Edite o arquivo `.env`:
```bash
nano .env
```

2. Adicione ou modifique as variáveis:
```bash
SITE_NAME=Seu Nome Aqui
GAME_NAME=IA ou Não?
```

3. Reinicie a aplicação:
```bash
npm run dev
# ou
docker compose restart
```

4. Acesse o site e veja as mudanças:
   - Header: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Jogo: http://localhost:3000/host

### Arquivos Afetados

#### Templates usando `siteName`:
- `views/admin/partials/header.ejs`
- `views/admin/layouts/main.ejs`
- `views/admin/error.ejs`
- `views/partials/head.ejs`
- `views/partials/public-header.ejs`
- `views/partials/public-footer.ejs`
- `views/layouts/public.ejs`
- `views/layouts/game-minimal.ejs`
- `views/error.ejs`

#### Templates usando `gameName`:
- `views/host.ejs`
- `views/host-create.ejs`
- `views/join.ejs`
- `views/play.ejs`
- `views/screen.ejs`
- `views/dashboard.ejs`
- `views/game-dashboard.ejs`

### Implementação Técnica

As variáveis são injetadas globalmente em todas as views através de um middleware no `src/server.ts`:

```typescript
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.siteName = process.env.SITE_NAME || 'IA ou Não?';
  res.locals.gameName = process.env.GAME_NAME || 'IA ou Não?';
  next();
});
```

Isso torna as variáveis `siteName` e `gameName` disponíveis em todos os templates EJS sem precisar passá-las manualmente em cada renderização.

### Valores Padrão

Se as variáveis não forem definidas no `.env`, o sistema usa "IA ou Não?" como padrão para ambas.

### Produção

No Docker, adicione as variáveis no `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      - SITE_NAME=Seu Site
      - GAME_NAME=IA ou Não?
```

Ou crie um arquivo `.env` no mesmo diretório do `docker-compose.yml`.
