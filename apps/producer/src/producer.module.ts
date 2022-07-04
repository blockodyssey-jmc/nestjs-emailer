import { Module } from '@nestjs/common';
import { ProducerController } from './producer/producer.controller';
import { ProducerService } from './producer/producer.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'email',
          type: 'topic',
        },
        {
          name: 'exchange2',
          type: 'topic',
        },
      ],
      uri: 'amqp://user:password@localhost:5672',
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
  ],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}
