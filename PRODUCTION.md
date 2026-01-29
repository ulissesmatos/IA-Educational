# 🚀 Deploy em Produção - IA nas Escolas

## 📋 Pré-requisitos

- VPS Ubuntu ARM com Docker instalado
- Domínio configurado na Cloudflare (ia.nuveasy.com)
- Acesso SSH ao servidor

## 🏗️ Estrutura de Produção

```
ia-nas-escolas/
├── docker-compose.prod.yml    # Configuração produção
├── Dockerfile.prod           # Build otimizado
├── .env.prod                 # Variáveis produção
├── deploy.sh                 # Script de deploy
├── Makefile                  # Comandos manutenção
├── nginx/
│   └── nginx.conf           # Configuração nginx
└── logs/                    # Logs aplicação
```

## 🚀 Deploy Inicial

### 1. No seu computador local

```bash
# Clonar projeto
git clone https://github.com/SEU_USERNAME/SEU_REPO.git ia-nas-escolas
cd ia-nas-escolas

# Configurar variáveis de produção
cp .env.prod .env
nano .env
```

**Configure estas variáveis:**
```bash
DATABASE_URL=postgresql://ia_user:SUA_SENHA_FORTE@localhost:5432/iaounao
SESSION_SECRET=SUA_STRING_ALEATORIA_SEGURA_64_CHARS_MINIMO
DB_USER=ia_user
DB_PASSWORD=SUA_SENHA_FORTE
```

### 2. No servidor VPS

```bash
# Conectar via SSH
ssh ubuntu@SEU_IP_VPS

# Criar diretório do projeto
sudo mkdir -p /opt/ia-nas-escolas
sudo chown ubuntu:ubuntu /opt/ia-nas-escolas
cd /opt/ia-nas-escolas

# Upload dos arquivos (use scp, rsync ou git)
git clone https://github.com/SEU_USERNAME/SEU_REPO.git .
```

### 3. Configurar produção no servidor

```bash
# Copiar arquivo de produção
cp .env.prod .env

# Editar variáveis (use as mesmas do passo 1)
nano .env

# Executar deploy
make deploy
```

## 🔧 Comandos de Manutenção

```bash
# Ver status
make status

# Ver logs
make logs

# Backup do banco
make backup

# Reiniciar aplicação
make restart

# Parar aplicação
make stop

# Health check
make health
```

## 🌐 Configuração do Domínio

### Cloudflare DNS

1. **Acesse seu painel Cloudflare** para `nuveasy.com`
2. **DNS → Records → Add record:**
   - **Type:** A
   - **Name:** ia
   - **Content:** SEU_IP_VPS
   - **Proxy status:** Proxied (laranja)

### SSL (Opcional)

1. **SSL/TLS → Overview**
   - **SSL/TLS encryption mode:** Full (strict)
2. **Edge Certificates**
   - Ative "Always Use HTTPS"

## 🔒 Segurança

### Firewall (UFW)

```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

### Primeiro Acesso Admin

- **URL:** http://ia.nuveasy.com/admin/login
- **Email:** ulisses99@live.com
- **Senha:** 4130uMA@!

⚠️ **IMPORTANTE:** Mude a senha após o primeiro login!

## 📊 Monitoramento

- **Aplicação:** http://ia.nuveasy.com
- **Health Check:** http://ia.nuveasy.com/health
- **Admin:** http://ia.nuveasy.com/admin
- **Logs:** `make logs`

## 🔄 Atualizações

```bash
# No servidor
cd /opt/ia-nas-escolas
git pull origin main
make deploy
```

## 🆘 Troubleshooting

### Aplicação não inicia
```bash
# Ver logs detalhados
docker compose -f docker-compose.prod.yml logs app

# Verificar containers
docker ps
```

### Banco não conecta
```bash
# Verificar se PostgreSQL está rodando
docker compose -f docker-compose.prod.yml logs postgres

# Resetar banco se necessário
docker compose -f docker-compose.prod.yml down -v
make deploy
```

### Nginx não responde
```bash
# Verificar configuração
docker compose -f docker-compose.prod.yml exec nginx nginx -t

# Reiniciar nginx
docker compose -f docker-compose.prod.yml restart nginx
```

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs da aplicação: `make logs`
2. Status dos containers: `make status`
3. Health check: `make health`
4. Conectividade: `curl http://localhost/health`