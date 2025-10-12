import mongoose from 'mongoose';

// Product Type
export type Product = {
  _id?: string;
  name: string;
  slug: string;
  image: string; // primary image
  otherImages?: string[]; // new field
  banner?: string;
  price: number;
  brand: string;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  colors?: string[];
  sizes?: string[];
};

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // primary image
    otherImages: [{ type: String }], // new field for extra images
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
    colors: [{ type: String }],
    sizes: [{ type: String }],
  },
  { timestamps: true }
);

const ProductModel =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;
