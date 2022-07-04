import { IAuthContext, IBlockContext } from '../interface/interfaces';

export class Mail {
  protected _to: Array<string>;
  protected _subject: string;
  protected _template: string;
  protected _context;

  constructor(to: string) {
    this._to = [to];
  }

  get to() {
    return this._to;
  }

  get subject(): string {
    return this._subject;
  }

  get template(): string {
    return this._template;
  }
}

export class AuthMail extends Mail {
  _subject = '[Revitu] 이메일 인증';
  _template = 'auth';
  _context: IAuthContext;

  constructor(to: string, nickname: string) {
    super(to);
    this._context = this.setContext(nickname);
  }

  get context(): IAuthContext {
    return this._context;
  }

  private setContext(nickname: string): IAuthContext {
    const authCode = Math.floor(Math.random() * 900000) + 100000;

    return {
      nickname: nickname,
      authCode: authCode,
    };
  }
}

export class BlockUserMail extends Mail {
  _subject = '[Revitu] 신고 알림';
  _template = 'block-notify';
  _context: IBlockContext;

  constructor(to: string, nickname: string) {
    super(to);
    this._context = this.setContext(nickname);
  }

  get context(): IBlockContext {
    return this._context;
  }

  private setContext(nickname: string): IBlockContext {
    return {
      nickname: nickname,
      url: 'something URL',
      name: 'dummy nft',
      table: [
        {
          user: 'user',
          type: 'type',
          content: '신고내용!!',
          updatedAt: new Date(),
        },
        {
          user: 'user1',
          type: 'type1',
          content: '신고내용2!!',
          updatedAt: new Date(),
        },
      ],
    };
  }
}
