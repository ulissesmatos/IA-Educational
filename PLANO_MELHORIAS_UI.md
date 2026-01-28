# Plano de Melhorias UI - IA ou Não?

## Resumo
Este documento contém o plano de implementação para corrigir problemas de UI/UX identificados no painel admin e nas páginas públicas.

---

## 🔧 Correções Pendentes

### 1. Sidebar Admin - Layout Vertical
- [x] **1.1** Verificar CSS do `.admin-nav` para exibir itens em coluna (flex-direction: column)
- [x] **1.2** Ajustar espaçamento entre itens do menu
- [x] **1.3** Corrigir classe de `.admin-nav-item` para `.admin-nav-link`

### 2. Link do Dashboard Incorreto
- [x] **2.1** Alterar link do Dashboard de `/admin` para `/admin/dashboard` no header.ejs
- [x] **2.2** Criar redirecionamento de `/admin` para `/admin/dashboard` nas rotas
- [x] **2.3** Testar que a navegação funciona corretamente

### 3. Página de Erro Admin (404)
- [x] **3.1** Criar view `views/admin/error.ejs` com design minimalista
- [x] **3.2** Adicionar middleware de 404 específico para rotas `/admin/*`
- [x] **3.3** Estilizar página de erro no admin.css
- [ ] **3.4** Testar acessando rotas inexistentes em /admin

### 4. Header Público (Navegação Geral)
- [x] **4.1** Criar partial `views/partials/public-header.ejs`
- [x] **4.2** Criar partial `views/partials/public-footer.ejs`
- [x] **4.3** Adicionar estilos do header público no custom.css
- [ ] **4.4** Incluir header em todas as views públicas:
  - [ ] join.ejs
  - [ ] play.ejs
  - [ ] host.ejs
  - [ ] host-create.ejs
  - [ ] screen.ejs
  - [ ] dashboard.ejs (público)
  - [ ] game-dashboard.ejs
  - [ ] ias.ejs
  - [ ] ia-detail.ejs
- [ ] **4.5** Testar navegação entre páginas

### 5. Página de Erro Pública (404)
- [x] **5.1** Criar view `views/error.ejs` para erros gerais
- [x] **5.2** Atualizar middleware de 404 no server.ts
- [x] **5.3** Estilizar página de erro no custom.css

---

## 📋 Ordem de Implementação

1. ✅ Começar pelas correções do sidebar (mais rápidas)
2. ✅ Corrigir link do dashboard
3. ✅ Criar páginas de erro (admin e pública)
4. ✅ Implementar header público

---

## 🎨 Especificações de Design

### Sidebar Admin
```
┌─────────────────────┐
│ IA ou Não?          │
│ Painel Admin        │
├─────────────────────┤
│ 🏠 Dashboard        │
│ ❓ Perguntas Quiz   │
│ 🖥️ Ferramentas IA   │
├─────────────────────┤
│ [Avatar] Nome       │
│          Email      │
│ [Sair]              │
└─────────────────────┘
```

### Header Público
```
┌────────────────────────────────────────────────────────┐
│ IA ou Não?    [Início] [Catálogo IA] [Jogar]  [Admin]  │
└────────────────────────────────────────────────────────┘
```

### Página de Erro
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                   🔍                                   │
│                                                        │
│            Página não encontrada                       │
│                                                        │
│   A página que você está procurando não existe         │
│   ou foi movida.                                       │
│                                                        │
│              [Voltar ao Início]                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 📝 Notas de Implementação

- Manter design ultra minimalista com cores neutras
- Usar apenas Heroicons quando necessário
- Seguir o padrão de variáveis CSS existente
- Testar em diferentes navegadores

---

## ✅ Progresso

| Tarefa | Status | Data |
|--------|--------|------|
| Sidebar Layout | ✅ Concluído | 28/01/2026 |
| Link Dashboard | ✅ Concluído | 28/01/2026 |
| Erro Admin | ✅ Concluído | 28/01/2026 |
| Header Público | 🔄 Parcial | 28/01/2026 |
| Erro Público | ✅ Concluído | 28/01/2026 |

---

*Última atualização: 28/01/2026*
