import { IsNumber, IsString } from 'class-validator';

class ProductOrderDto {
  @IsString()
  product: string;

  @IsNumber()
  quantity: number;
}
export class createOrderDto {
  products: ProductOrderDto[];
}
