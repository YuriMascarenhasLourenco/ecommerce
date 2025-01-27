import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/types/order';
import { createOrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel('order') private OrderModel: Model<Order>) {}

  async listordersByUser(userId: string) {
    const orders = await this.OrderModel.find({ owner: userId })
      .populate('owner')
      .populate('products.product');
    if (!orders) {
      throw new HttpException('there is no orders', HttpStatus.NO_CONTENT);
    }
  }
  async createOrder(orderDto: createOrderDto, userId: String) {
    const createOrder = {
      owner: userId,
      products: orderDto.products,
    };
    const { _id } = await this.OrderModel.create(createOrder);
    let order = await this.OrderModel.findById(_id)
      .populate('owner')
      .populate('products.product');

    const totalPrice = order.products.reduce((acc, product) => {
      const price = product.quantity * product.product.price;
      return acc + price;
    }, 0);
    order.updateOne({ totalPrice });

    order = await this.OrderModel.findById(_id)
      .populate('owner')
      .populate('products.product');
    return order;
  }
}
