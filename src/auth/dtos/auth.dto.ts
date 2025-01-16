import { IsBoolean, IsString } from 'class-validator';
import { loginInterface } from '../interfaces/login.interface';
import { registerInterface } from '../interfaces/register.interface';
export class loginDto implements loginInterface {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class registerDto extends loginDto implements registerInterface {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsBoolean()
  seller?: boolean;
}
