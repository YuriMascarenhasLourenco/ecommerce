import { Document } from 'mongoose';
import { User } from './user';
import { Product } from './product';
interface Products {
  product: Product;
  quantity: number;
}
export interface Order extends Document {
  owner: User;
  totalPrice: number;
  products: Products[];
  created: Date;
}
