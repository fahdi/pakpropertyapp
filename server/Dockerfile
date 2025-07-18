FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server/ ./server/
EXPOSE 5001
CMD ["node", "server/index.js"] 