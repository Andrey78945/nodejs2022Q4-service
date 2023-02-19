import { Injectable } from '@nestjs/common';
import { User, CreateUserDto, UpdatePasswordDto } from './models/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(userDto: CreateUserDto): User {
    const date: number = Date.now();
    const user = {
      id: uuidv4(),
      login: userDto.login,
      password: userDto.password,
      version: 1,
      createdAt: date,
      updatedAt: date,
    };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user: User | undefined = this.users.find(
      (item: User): boolean => item.id === id,
    );
    return user;
  }

  remove(id: string): User {
    const user: User | undefined = this.users.find(
      (item: User): boolean => item.id === id,
    );
    if (user) {
      const index = this.users.indexOf(user);
      this.users.splice(index, 1);
    }
    return user;
  }

  update(id: string, newPasswordDto: UpdatePasswordDto): User {
    const user: User | undefined = this.users.find(
      (item: User): boolean => item.id === id,
    );

    if (user?.password !== newPasswordDto.oldPassword) {
      throw new Error();
    }
    if (user) {
      user.password = newPasswordDto.newPassword;
      user.updatedAt = Date.now();
      user.version++;
    }
    return user;
  }
}
