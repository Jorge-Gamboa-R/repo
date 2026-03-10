FROM node:20-alpine

RUN apk add --no-cache curl

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --chown=app:app package*.json ./

RUN npm install --production

COPY --chown=app:app . .

EXPOSE 3000

USER app

CMD ["node", "server.js"]