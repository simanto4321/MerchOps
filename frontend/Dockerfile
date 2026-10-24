# MerchOps Frontend — Next.js UI
FROM node:22-alpine AS deps
WORKDIR /app
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY package.json ./
COPY backend/prisma ./backend/prisma
WORKDIR /app/frontend
RUN npm install --prefix /app || true

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
COPY frontend ./frontend
COPY backend ./backend
WORKDIR /app/frontend
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate --schema=../backend/prisma/schema.prisma \
  && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4317
COPY --from=build /app/frontend/.next ./frontend/.next
COPY --from=build /app/frontend/public ./frontend/public
COPY --from=build /app/frontend/package.json ./frontend/package.json
COPY --from=build /app/frontend/node_modules ./frontend/node_modules
COPY --from=build /app/backend/prisma ./backend/prisma
WORKDIR /app/frontend
EXPOSE 4317
CMD ["npx", "next", "start", "--port", "4317", "--hostname", "0.0.0.0"]
