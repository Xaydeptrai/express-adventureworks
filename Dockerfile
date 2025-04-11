FROM node:23-slim

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY . .

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD /bin/sh -c "curl -f http://localhost:${PORT}/api/${REGION}/health || exit 1"

CMD ["npm", "start"]