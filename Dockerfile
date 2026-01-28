FROM node:20-alpine

# Instalar dependências do sistema para Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Copiar views e public para dist
RUN cp -r views dist/ || true

# Expor porta
EXPOSE 3000

# Script de inicialização
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
