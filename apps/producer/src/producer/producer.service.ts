import { ConflictException, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MailRequestDto } from '../dto/mail.request.dto';
import { UserEntity } from '../entity/UserEntity';
import { Email, EmailBuilder } from '../class/email';

@Injectable()
export class ProducerService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  publishToEmailSendServer(publishInfo: Email, anUser: UserEntity) {
    try {
      this.amqpConnection.publish(
        publishInfo.exchange,
        publishInfo.routingKey,
        {
          target: anUser,
          type: publishInfo.type,
        },
      );
      return '이메일 전송 완료';
    } catch (e) {
      console.log(e);
      throw new ConflictException();
    }
  }

  sendMail(mailRequestDto: MailRequestDto, anUser: UserEntity) {
    const publishInfo = new EmailBuilder()
      .setExchange('email')
      .setRoutingKey(
        'email'.concat('.').concat(mailRequestDto.emailType.toLowerCase()),
      )
      .setType(mailRequestDto.emailType)
      .build();

    return this.publishToEmailSendServer(publishInfo, anUser);
  }
}
