import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { loginDto, registerDto } from '../auth/dtos/auth.dto';
import { User } from '../types/user';
import * as bcrypt from 'bcrypt';
import { Payload } from 'src/types/payload';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  private sanitizeUser(user: User) {
    return user.depopulate('password');
  }
  async create(userDto: registerDto) {
    const { username } = userDto;
    const user = await this.userModel.findOne({ username });
    console.log('typeof userDto:', typeof userDto.username);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(userDto);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }
  async findByLogin(userDto: loginDto) {
    const { username, password } = userDto;
    const user = await this.userModel.findOne({ name: username });

    if (!user) {
      throw new HttpException(
        'this user doesn´t exist',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException(
        'Unauthorized credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  async findByPayload(payload: Payload) {
    const { username } = payload;
    return await this.userModel.findOne({ username });
  }
}
