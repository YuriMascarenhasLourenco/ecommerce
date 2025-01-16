import { loginInterface } from './login.interface';

export interface registerInterface extends loginInterface {
  seller?: boolean;
}
