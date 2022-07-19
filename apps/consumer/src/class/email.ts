import { EmailType } from './emailType';

export class Email {
  _exchange: string;
  _routingKey: string;
  _type: EmailType;

  get exchange(): string {
    return this._exchange;
  }

  get routingKey(): string {
    return this._routingKey;
  }

  get type(): EmailType {
    return this._type;
  }
}

export class EmailBuilder {
  object: Email;

  constructor() {
    this.object = new Email();
  }

  setExchange(value: string) {
    this.object._exchange = value;
    return this;
  }

  setRoutingKey(value: string) {
    this.object._routingKey = value;
    return this;
  }

  setType(value: EmailType) {
    this.object._type = value;
    return this;
  }

  build() {
    return this.object;
  }
}
