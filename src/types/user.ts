import { Document } from 'mongoose';

interface Address {
  add1: string;
  add2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface User extends Document {
  name: string;
  readonly password: string;
  seller: boolean;
  address: Address;
  created: Date;
}
