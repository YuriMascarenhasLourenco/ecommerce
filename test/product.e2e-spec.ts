import * as mongoose from 'mongoose';
import axios from 'axios';
import * as request from 'supertest';
import { registerDto } from 'src/auth/dtos/auth.dto';
import { app } from './constants';
import { CreateProductDto } from 'src/product/product.dto';
import { HttpStatus } from '@nestjs/common';
import { title } from 'process';

let sellerToken: string;
let productId: string;
let productSeller: registerDto = {
  seller: true,
  password: 'nothing',
  username: 'username',
};
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  await mongoose.connection.db.dropDatabase();
  const {
    data: { token },
  } = await axios.post(`${app})/auth/register`, productSeller);
  sellerToken = token;
});
afterAll(async () => {
  await mongoose.disconnect();
});
describe('PRODUCT', () => {
  const product: CreateProductDto = {
    title: 'new phone',
    description: 'description',
    price: 10,
    image: 'n/a',
  };
  it('should list all products', () => {});
  it('should list my products', () => {
    return request(app)
      .get('/product/mine')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);
  });
  it('should create product', () => {
    return request(app)
      .post('/product')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(product)
      .expect((res) => {
        const body = res.body;
        expect(body._id).toBeDefined();
        productId = body._id;
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.image).toEqual(product.image);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(HttpStatus.CREATED);
  });
  it('should delete product', async () => {
    await axios.delete(`${app}/product/${productId}`, {
      headers: { Authorization: `Bearer ${sellerToken}` },
    });
    return request(app)
      .get(`/product/${productId}`)
      .expect(HttpStatus.NO_CONTENT);
  });
  it('should update product', () => {
    return request(app)
      .get(`/product/${productId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ title: 'new title' })
      .expect((res) => {
        const body = res.body;
        expect(body._id).toEqual(productId);
        expect(body.title).not.toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.image).toEqual(product.image);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(HttpStatus.OK);
  });
  it('should get product', () => {
    return request(app)
      .get(`/product/${productId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(product)
      .expect((res) => {
        const body = res.body;
        expect(body._id).toEqual(productId);
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.image).toEqual(product.image);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(HttpStatus.OK);
  });
});
