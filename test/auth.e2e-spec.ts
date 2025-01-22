import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { loginDto, registerDto } from 'src/auth/dtos/auth.dto';
import * as request from 'supertest';
import 'dotenv/config';
import { app } from './constants';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  await mongoose.connection.db.dropDatabase();
});
afterAll(async () => {
  await mongoose.disconnect();
});
describe('AUTH', () => {
  const user: registerDto | loginDto = {
    username: 'yuri',
    password: 'nada',
  };
  const sellerRegister: registerDto = {
    username: 'seller',
    password: 'nada',
    seller: true,
  };
  const sellerLogin: loginDto = {
    username: 'seller',
    password: 'nada',
  };
  let sellerToken: string;
  let userToken: string;
  it('should register seller', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'Application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('seller');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(201);
  });
  it('should register user', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'Application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('yuri');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeFalsy();
      })
      .expect(201);
  });
  it('should login seller', () => {
    return request(app)
      .post('/auth/login')
      .set('Accept', 'Application/json')
      .send(user)
      .expect(({ body }) => {
        sellerToken = body.token;
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('seller');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(201);
  });
  it('should login user', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'Application/json')
      .send(user)
      .expect(({ body }) => {
        userToken = body.token;
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('yuri');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeFalsy();
      })
      .expect(201);
  });
  it('should not register the same user', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'Application/json')
      .send(user)
      .expect(({ body }) => {
        console.log(body);
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
  it('should login', () => {
    return request(app)
      .post('/auth/login')
      .set('Accept', 'Application/json')
      .send(user)
      .expect(HttpStatus.OK);
  });
});
