import * as mongoose from 'mongoose';
import axios from 'axios';
import * as request from 'supertest';
import { registerDto } from 'src/auth/dtos/auth.dto';
import { app } from './constants';
import { CreateProductDto } from 'src/product/product.dto';
import { HttpStatus } from '@nestjs/common';
import { title } from 'process';
import { Product } from 'src/types/product';

let sellerToken: string;
let buyerToken: string;
let boughtProducts: Product[];
const orderBuyer: registerDto = {
  seller: false,
  username: 'calvo',
  password: 'calvino',
};
let orderSeller: registerDto = {
  seller: true,
  password: 'nothing',
  username: 'username',
};
let soldProducts: CreateProductDto[] = [
  {
    title: 'newer phone',
    image: 'n/a',
    description: 'description',
    price: 10,
  },
  {
    title: 'bald',
    image: 'n/a',
    description: 'description',
    price: 20,
  },
];
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  await mongoose.connection.db.dropDatabase();
  ({
    data: { token: sellerToken },
  } = await axios.post(`${app})/auth/register`, orderSeller));
  ({
    data: { token: sellerToken },
  } = await axios.post(`${app}/auth/register`, orderBuyer));
  const [{ data: data1 }, { data: data2 }] = await Promise.all(
    soldProducts.map((product) =>
      axios.post(`${app}/product`, product, {
        headers: {
          Authorization: `Bearer ${sellerToken}`,
        },
      }),
    ),
  );
  boughtProducts = [data1, data2];
});
afterAll(async () => {
  await mongoose.disconnect();
});
describe('ORDER', () => {
  const orderDto = {
    products: boughtProducts.map((product) => ({
      product: product._id,
      quantity: 1,
    })),
  };
  it('should create order products', () => {
    return request(app)
      .post('order')
      .set('Authorization', `Bearer ${buyerToken}`)
      .set('Accept', 'application/json')
      .send(orderDto)
      .expect((res) => {
        const body = res.body;
        expect(body.owner.username).toEqual(orderBuyer.username);
        expect(body.products.length).toEqual(boughtProducts.length);
        expect(
          boughtProducts
            .map((product) => product._id)
            .includes(body.products[0]._id),
        ).toBeTruthy();
        expect(body.totalPrice).toEqual(
          boughtProducts.reduce(
            (acc, product) => acc + Number(product.price),
            0,
          ),
        );
      })
      .expect(201);
  });
  it('should list all orders of buyers', () => {
    return request(app)
      .get('order')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect((res) => {
        const body = res.body;
        expect(body.length).toEqual(1);
        expect(body[0].products.length).toEqual(boughtProducts.length);
        expect(
          boughtProducts
            .map((product) => product._id)
            .includes(body[0].products[0]._id),
        ).toBeTruthy();
      })
      .expect(200);
  });
});
