export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export type CreateUserDto = Pick<User, 'login' | 'password'>;

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export type UserToFront = Omit<User, 'password'>;
