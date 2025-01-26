import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { AuthGuard } from '@nestjs/passport';
import { sellerGuard } from 'src/guards/seller.guard';
import { User } from 'src/utilities/user.decorator';
import { User as userDocument } from '../types/user';
import { Product } from 'src/types/product';
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  listAll() {
    this.productService.findAll();
  }
  @Get('/mine')
  @UseGuards(AuthGuard('jwt'), sellerGuard)
  async listmine(@User() user: userDocument): Promise<Product[]> {
    const { id } = user;
    return await this.productService.findByOwner(id);
  }
  @Get('/seller/:id')
  async listBySeller(@Param('id') id: string): Promise<Product[]> {
    return await this.productService.findByOwner(id);
  }
  @Post()
  @UseGuards(AuthGuard('jwt'), sellerGuard)
  async create(@Body() product: CreateProductDto, @User() user: userDocument) {
    return await this.productService.create(product, user);
  }

  @Get(':id')
  async read(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), sellerGuard)
  async update(
    @Param('id') id: string,
    @Body() productUpdate: UpdateProductDto,
    @User() user: userDocument,
  ) {
    const { id: userId } = user;
    return await this.productService.update(id, productUpdate, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), sellerGuard)
  async delete(@Param('id') id: string, @User() user: userDocument) {
    const { id: userId } = user;
    return await this.productService.delete(id, userId);
  }
}
