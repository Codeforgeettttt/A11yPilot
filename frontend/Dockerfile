FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY index.html vite.config.js ./
COPY public/ ./public/
COPY src/ ./src/

# El usuario sin privilegios necesita escribir el cache de Vite.
RUN chown -R node:node /app

EXPOSE 5173
USER node
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
