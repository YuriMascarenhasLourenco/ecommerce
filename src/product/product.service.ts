import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/types/product';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { User } from 'src/types/user';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    const allProducts = await this.productModel.find({}).populate('owner');
    return allProducts;
  }
  async findByOwner(userId: string) {
    return this.productModel.find({ owner: userId }).populate('owner');
  }
  async findOne(id: string) {
    return await this.productModel.findById(id).populate('owner');
  }
  async create(productDto: CreateProductDto, user: User): Promise<Product> {
    const product = await this.productModel.create({
      ...productDto,
      owner: user,
    });
    await product.save();
    return product.populate('owner');
  }
  async update(
    id: string,
    productDto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (userId !== product.owner.toString()) {
      throw new HttpException(
        'you do not have this product',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await product.updateOne(productDto);
    return product.populate('owner');
  }
  async delete(id: string, userId: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (userId !== product.owner.toString()) {
      throw new HttpException(
        'you do not own this product',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await product.deleteOne();
    return product.populate('owner');
  }
}
