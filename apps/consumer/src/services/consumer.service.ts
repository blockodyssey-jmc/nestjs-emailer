import { BadRequestException, Injectable } from '@nestjs/common';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MockUserRedisService } from './userRedis.service';
import { AuthMail, BlockUserMail } from '../class/Mail';
import { EmailType } from '../../../producer/src/class/emailType';
import { Msg } from '../interface/interfaces';
import { MailerService } from '@nestjs-modules/mailer';

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
  async sendEmail(msg: Msg) {
    const emailStatement = await this.createEmailData(msg);

    await this.userRedisService.storeRedisKey(msg.type, emailStatement.context);

    await this.mailerService
      .sendMail({
        to: emailStatement.to.join(', '),
        subject: emailStatement.subject,
        template: `${emailStatement.template}.ejs`,
        context: emailStatement.context,
      })
      .catch((e) => {
        new Nack(true);
        throw new BadRequestException(e);
      });
  }
}
