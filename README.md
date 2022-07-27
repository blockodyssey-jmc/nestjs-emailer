
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Docker rising

```bash
### create network ###
$ docker network create mq-to-server

### Message Queue 생성 ###
$ docker run -d --hostname my-rabbit --name some-rabbit --network mq-to-server -p 5672:5672 -p 15672:15672  -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management

### consumer 실행 ###

# 1. 파일 빌드
$ npm run build:consumer

# 2. consumer build
$ docker build -t consumer:1.0.0 .

# 3. consumer run 
$ docker run -d consumer:1.0.0  --network mq-to-server

```

## Running producer app

```bash
# development mode
$ npm run start:dev

# production mode
$ npm run start:prod

```