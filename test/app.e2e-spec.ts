import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { loginDto, registerDto } from 'src/auth/dtos/auth.dto';
import * as request from 'supertest';
const app = 'http://localhost:3000';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  await mongoose.connection.db.dropDatabase();
});
afterAll(async () => {
  await mongoose.disconnect();
});
describe('ROOT', () => {
  it('/ (GET)', () => {
    return request(app).get('/').expect(200).expect('Hello World!');
  });
});
describe('AUTH', () => {
  it('should register', () => {
    const user: registerDto = {
      username: 'yuri',
      password: 'nada',
    };
    return request(app)
      .post('/auth/register')
      .set('Accept', 'Application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('yuri');
        expect(body.user.password).toBeUndefined();
      })
      .expect(201);
  });

  it('should not register the same user', () => {
    const user: registerDto = {
      username: 'yuri',
      password: 'nada',
    };
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
    const user: loginDto = {
      username: 'yuri',
      password: 'nada',
    };
    return request(app)
      .post('/auth/login')
      .set('Accept', 'Application/json')
      .send(user)
      .expect(HttpStatus.OK);
  });
});
