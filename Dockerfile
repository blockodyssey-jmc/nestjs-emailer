FROM arm64v8/node:16-alpine

ENV TZ Asia/Seoul

WORKDIR /usr/src/app

COPY package*.json ./

# 실행전 npm run build:consumer
RUN npm ci --only=production

COPY . .

ARG ARG_ENV=production
ENV NODE_ENV=$ARG_ENV}

CMD ["npm", "run", "start:consumer:prod"]