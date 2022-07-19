import { Logger, ConflictException, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MailRequestDto } from '../dto/mail.request.dto';
import { UserEntity } from '../entity/UserEntity';
import { Email, EmailBuilder } from '../class/email';

@Injectable()
export class ProducerService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  publishToEmailSendServer(publishInfo: Email, anUser: UserEntity) {
    const message = {
      target: anUser,
      type: publishInfo.type,
    };
    try {
      this.amqpConnection.publish(
        publishInfo.exchange,
        publishInfo.routingKey,
        message,
      );

      Logger.log(`이메일 전송 완료.. Message :  ${JSON.stringify(message)}`);
      return '이메일 전송 완료';
    } catch (e) {
      Logger.log(`이메일 전송 실패 - data : ${JSON.stringify(message)} : ${e}`);
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
