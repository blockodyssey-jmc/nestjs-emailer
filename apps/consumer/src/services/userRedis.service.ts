import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailType } from '../../../producer/src/class/emailType';
import { MockRedisService } from './redis.service';

interface UserRedisService {
  getRedisKeyForAuthMail(name: string);
}

@Injectable()
export class MockUserRedisService implements UserRedisService {
  constructor(private readonly redis: MockRedisService) {}

  getRedisKeyForAuthMail(nickname: string) {
    return `mail-auth-${nickname}`;
  }

  async storeRedisKey(emailType: EmailType, context: any) {
    const redisKey = this.getRedisKeyForAuthMail(context.nickname);

    try {
      switch (emailType) {
        case EmailType.AUTH:
          return await this.redis.set(redisKey, context.authCode, 60 * 30);
        case EmailType.BLOCK:
          return console.log('STORE BLOCK REDIS KEY');
      }
    } catch (e) {
      await this.redis.del(redisKey);
      throw new InternalServerErrorException(e.response);
    }
  }
}
