import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { loginDto, registerDto } from '../auth/dtos/auth.dto';
import { UserService } from '../shared/user.service';
import { AuthService } from './auth.service';
import { Payload } from 'src/types/payload';
import { User } from 'src/utilities/user.decorator';
import { sellerGuard } from 'src/guards/seller.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private UserService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() userDto: loginDto) {
    const user = await this.UserService.findByLogin(userDto);
    const payload: Payload = {
      username: user.username,
      seller: user.seller,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('register')
  async register(@Body() userDto: registerDto) {
    const user = await this.UserService.create(userDto);
    const payload = {
      username: user.username,
      seller: user.seller,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
}
