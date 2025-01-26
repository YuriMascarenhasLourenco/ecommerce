import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
}

export class UpdateProductDto implements Partial<CreateProductDto> {}
