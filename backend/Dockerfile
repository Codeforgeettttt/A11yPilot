# La versión de Chromium debe coincidir con Playwright del package-lock.json.
FROM node:22-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Instala Chromium y bibliotecas del sistema necesarias para análisis reales.
# El navegador se instala en una ruta compartida accesible al usuario node.
RUN npx playwright install --with-deps chromium     && chmod -R a+rX /ms-playwright

COPY src/ ./src/
COPY scripts/ ./scripts/

EXPOSE 3001

USER node
CMD ["node", "src/server.js"]
