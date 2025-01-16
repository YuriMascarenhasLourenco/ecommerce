import { Body, Controller, Post } from '@nestjs/common';
import { loginDto, registerDto } from 'src/auth/dtos/auth.dto';
import { UserService } from 'src/shared/user.service';

@Controller('auth')
export class AuthController {
  constructor(private UserService: UserService) {}

  @Post('login')
  async login(@Body() userDto: loginDto) {
    return this.UserService.findByLogin(userDto);
  }

  @Post('register')
  async register(@Body() userDto: registerDto) {
    return this.UserService.create(userDto);
  }
}
