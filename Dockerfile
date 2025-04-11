FROM node:23-slim	

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/master/health && \
      curl -f http://localhost:$PORT/api/na/health && \
      curl -f http://localhost:$PORT/api/eu/health || exit 1

CMD ["npm", "start"]