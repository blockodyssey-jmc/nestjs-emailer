import { Module } from '@nestjs/common';
import { ConsumerService } from './services/consumer.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageHandlerErrorBehavior } from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { MockRedisService } from './services/redis.service';
import { MockUserRedisService } from './services/userRedis.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as config from 'config';
const rabbitmq: any = config.get('consumerRabbitmq');
const smtp: any = config.get('smtp');

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'email',
          type: 'topic',
        },
        {
          name: 'sms',
          type: 'topic',
        },
      ],
      uri: rabbitmq.uri,
      enableControllerDiscovery: true,
      connectionInitOptions: { wait: false },
      defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.ACK,
      channels: {
        'channel-1': {
          prefetchCount: 1,
          default: true,
        },
        'channel-2': {
          prefetchCount: 10,
        },
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
      },

      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      preview: false,
      template: {
        dir: process.cwd() + '/apps/consumer/src/templates/',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [ConsumerService, MockRedisService, MockUserRedisService],
})
export class ConsumerModule {}
