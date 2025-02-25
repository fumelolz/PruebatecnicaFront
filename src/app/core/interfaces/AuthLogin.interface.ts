export interface AuthLogin {
  token: string;
  expiration: Date;
  account: AuthLoginAccount;
  roles: AuthLoginRole[];
}
export interface AuthLoginAccount {
  userId: number;
  email: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
}

export interface AuthLoginRole {
  roleId: number;
  name: string;
}
