import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MockUserRedisService } from './userRedis.service';
import { AuthMail, BlockUserMail } from '../class/Mail';
import { Msg } from '../interface/interfaces';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailType } from '../class/emailType';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly userRedisService: MockUserRedisService,
    private readonly mailerService: MailerService,
  ) {}

  async createEmailData(msg: Msg) {
    switch (msg.type) {
      case EmailType.AUTH:
        return new AuthMail(msg.target.email, msg.target.nickname);
      case EmailType.BLOCK:
        return new BlockUserMail(msg.target.email, msg.target.nickname);
      default:
        throw Error();
    }
  }

  @RabbitSubscribe({
    exchange: 'email',
    routingKey: 'email.*',
    queue: 'mailer-queue',
  })
  async sendEmail(message: Msg) {
    Logger.log(`email data received - data : ${JSON.stringify(message)}`);

    const emailStatement = await this.createEmailData(message);

    await this.userRedisService.storeRedisKey(
      message.type,
      emailStatement.context,
    );

    await this.mailerService
      .sendMail({
        to: emailStatement.to.join(', '),
        subject: emailStatement.subject,
        template: `${emailStatement.template}.ejs`,
        context: emailStatement.context,
      })
      .catch((e) => {
        Logger.error(
          `failed to process mq - requeuing data : ${JSON.stringify(
            message,
          )}  error : ${e}`,
        );
        new Nack(true);
        throw new BadRequestException(e);
      });
  }
}
