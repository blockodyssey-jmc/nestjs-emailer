import { Body, Controller, Post } from '@nestjs/common';
import { ProducerService } from '../services/producer.service';
import { MailRequestDto } from '../dto/mail.request.dto';
import { UserEntity } from '../entity/UserEntity';

@Controller()
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('')
  sendEmail(@Body() mailRequestDto: MailRequestDto) {
    const email = '임의의 이메일 주소';
    const anUser = new UserEntity(email, '+대상 유저+');

    return this.producerService.sendMail(mailRequestDto, anUser);
  }
}
