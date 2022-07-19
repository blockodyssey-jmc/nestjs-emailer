import { UserEntity } from '../entity/UserEntity';
import { EmailType } from '../class/emailType';

export interface Msg {
  target: UserEntity;
  type: EmailType;
}

export interface EmailContext {
  nickname: string;
}

export interface IAuthContext extends EmailContext {
  authCode: number;
}

export interface IBlockContext extends EmailContext {
  url: string;
  name: string;
  table: Array<ITable>;
}

interface ITable {
  user: string;
  type: string;
  content: string;
  updatedAt: Date;
}
