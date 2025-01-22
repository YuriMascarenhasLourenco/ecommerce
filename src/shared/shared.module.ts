import { Module } from '@nestjs/common';
import { UserService } from './user.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../models/user.schema';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { httpExceptionFilter } from './http-exception.filter';
import { DetailedLoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: httpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DetailedLoggingInterceptor,
    },
  ],
  exports: [UserService],
})
export class SharedModule {}
