import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utilities/user.decorator';
import { User as userDocument } from 'src/types/user';
import { createOrderDto } from './order.dto';
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listOrders(@User() { id }: userDocument) {
    return await this.orderService.listordersByUser(id);
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createOrders(
    @User() { id: userId }: userDocument,
    @Body() createDto: createOrderDto,
  ) {
    return this.orderService.createOrder(createDto, userId);
  }
}
