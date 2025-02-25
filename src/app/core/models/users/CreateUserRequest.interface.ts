export interface CreateUserRequest {
  name: string;
  firstSurname: string;
  secondSurname: string;
  email: string;
  password: string;
  birthday: Date;
  roles: string[];
}
