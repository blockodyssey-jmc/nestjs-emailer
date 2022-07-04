import { Module } from '@nestjs/common';
import { ConsumerService } from './services/consumer.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageHandlerErrorBehavior } from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { MockRedisService } from './services/redis.service';
import { MockUserRedisService } from './services/userRedis.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'email',
          type: 'topic',
        },
        {
          name: 'push',
          type: 'topic',
        },
      ],
      uri: 'amqp://user:password@localhost:5672',
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
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.MAILDEV_INCOMING_USER,
          pass: process.env.MAILDEV_INCOMING_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      preview: true,
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
