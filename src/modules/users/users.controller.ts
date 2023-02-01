import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  UpdatePasswordDto,
  User,
  CreateUserDto,
  UserToFront,
} from './models/user.entity';
import { UsersService } from './users.service';
import { isUUID } from 'class-validator';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<UserToFront[]> {
    const users = this.usersService.findAll();
    return users.map((item: User): UserToFront => {
      delete item.password;
      return item;
    });
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param() params): Promise<UserToFront> {
    if (!isUUID(params.id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }
    const user = this.usersService.findOne(params.id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserToFront> {
    if (
      createUserDto.login === undefined ||
      createUserDto.login?.length === 0 ||
      createUserDto.password === undefined ||
      createUserDto.password?.length === 0
    ) {
      throw new HttpException(
        'You need to fill both login and password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.usersService.create(createUserDto);
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserToFront> {
    if (!isUUID(id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }

    if (
      updatePasswordDto.oldPassword === undefined ||
      updatePasswordDto.newPassword === undefined
    ) {
      throw new HttpException(
        'You need to fill both login and password',
        HttpStatus.BAD_REQUEST,
      );
    }
    let user = this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    try {
      user = this.usersService.update(id, updatePasswordDto);
    } catch {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<UserToFront> {
    if (!isUUID(id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }
    const user = this.usersService.remove(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
