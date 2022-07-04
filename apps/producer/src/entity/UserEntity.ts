export class UserEntity {
  constructor(email, nickname) {
    this.email = email;
    this.nickname = nickname;
  }

  public email: string;
  public nickname: string;
}
