import { Role } from '../roles/Role.model';

export interface User {
  userId: string;
  email: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  birthday: Date;
  creationDate: Date;
  updatedDate: Date;
  roles: Role[];
}
