import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderFinal extends Document {
  userId?: {
    email  :string,
    name: string
  };
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    name: string;
    color?: string;
    size?: string;
    qty: number;
    price: number;
    slug: string;
    image: string;
  }[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paid: boolean;
  paymentId?: string | null;
  paymentAmount?: number | null;
  paymentDate?: Date | null;
  paymentFrom?: string | null;
  createdAt?: Date;
}

const orderFinalSchema = new Schema<IOrderFinal>(
  {
    userId : {
      email : { type: String},
      name : { type: String}
    },
    paymentMethod: { type: String, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: [
      {
        name: String,
        color: String,
        size: String,
        qty: Number,
        price: Number,
        slug: String,
        image: String,
      },
    ],
    itemsPrice: Number,
    taxPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    paid: { type: Boolean, default: false },
    paymentId: { type: String, default: null },
    paymentAmount: { type: Number, default: null },
    paymentDate: { type: Date, default: null },
    paymentFrom: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.OrderFinal ||
  mongoose.model<IOrderFinal>('OrderFinal', orderFinalSchema);
