import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class sellerGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && user.seller) {
      return true;
    }
    throw new HttpException('Unauthorized access',HttpStatus.UNAUTHORIZED)
  }
}
