export interface UpdateUserRequest {
  name: string;
  firstSurname: string;
  secondSurname: string;
  email: string;
  password: string;
  birthday: Date;
  roles: string[];
}
