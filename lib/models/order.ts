// models/Order.ts
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String },
  size: { type: String },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  slug: { type: String },
  image: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      email: { type: String },
      name: { type: String },
    },
    paymentMethod: { type: String },
    shippingAddress: {
      fullName: { type: String },
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    items: [orderItemSchema],
    itemsPrice: { type: Number },
    taxPrice: { type: Number },
    shippingPrice: { type: Number },
    totalPrice: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    paymentId: { type: String },
    paymentAmount: { type: Number },
    paymentDate: { type: Date },
    paymentFrom: { type: String },
  },
  {
    timestamps: true, // createdAt aur updatedAt auto handle karega
    collection: 'orderfinals' // ← Yeh sabse important line! Collection name set kar diya
  }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);