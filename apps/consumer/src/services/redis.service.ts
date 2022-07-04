import { Injectable } from '@nestjs/common';

export type KeyType = string | Buffer;
export type ValueType = string | Buffer | number;
export type ExpireType = number | string;

interface RedisService {
  get();
  set(key: KeyType, value: ValueType, expire: ExpireType);
  del(key: KeyType);
}

@Injectable()
export class MockRedisService implements RedisService {
  async get() {
    return 'test-key';
  }
  async set(
    key: KeyType,
    value: ValueType,
    expire: ExpireType,
  ): Promise<string> {
    return 'OK';
  }
  async del(key: KeyType) {
    return 'DELETE';
  }
}
