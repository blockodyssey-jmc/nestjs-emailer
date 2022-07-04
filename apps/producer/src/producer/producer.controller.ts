import { Body, Controller, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { MailRequestDto } from '../dto/mail.request.dto';
import { UserEntity } from '../entity/UserEntity';

@Controller()
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('')
  sendEmail(@Body() mailRequestDto: MailRequestDto) {
    const anUser = new UserEntity('ming@blockodyssey.io', '+대상 유저+');

    return this.producerService.sendMail(mailRequestDto, anUser);
  }
}
