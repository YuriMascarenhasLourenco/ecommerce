import * as mongoose from 'mongoose';
import { User } from 'src/types/user';
import * as bcrypt from 'bcrypt';
export const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  seller: {
    type: Boolean,
    default: false,
  },
  address: {
    add1: String,
    add2: String,
    city: String,
    state: String,
    country: String,
    zip: Number,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.pre<User>('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hash = await bcrypt.hash(this['password'], 10);
  } catch {}
});
