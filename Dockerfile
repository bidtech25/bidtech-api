# ═══════════════════════════════════════════
# BIDTECH API - DOCKERFILE (DEBIAN SLIM)
# Prisma + Puppeteer + BullMQ - Production Ready
# ═══════════════════════════════════════════

# ═══════════════════════════════════════════
# STAGE 1: DEPENDENCIES
# ═══════════════════════════════════════════
FROM node:20-slim AS deps

WORKDIR /app

# Instalar OpenSSL e dependências do Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar TODAS as dependências
RUN pnpm install --frozen-lockfile

# ═══════════════════════════════════════════
# STAGE 2: BUILD
# ═══════════════════════════════════════════
FROM node:20-slim AS builder

WORKDIR /app

# Instalar OpenSSL
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte completo
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação NestJS
RUN pnpm run build

# Remover dependências de desenvolvimento
RUN CI=true pnpm prune --prod

# ═══════════════════════════════════════════
# STAGE 3: PRODUCTION RUNNER
# ═══════════════════════════════════════════
FROM node:20-slim AS runner

WORKDIR /app

# Instalar dependências do sistema (Prisma + Puppeteer)
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Variáveis de ambiente para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    CHROME_BIN=/usr/bin/chromium \
    CHROME_CRASHPAD_PIPE_NAME=/dev/null

# Criar usuário não-root para segurança
RUN groupadd -r nodejs --gid=1001 && \
    useradd -r -g nodejs --uid=1001 nestjs

# Copiar arquivos necessários do stage builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

# Mudar para usuário não-root
USER nestjs

# Expor porta da aplicação
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3333/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicialização
CMD ["node", "dist/main"]