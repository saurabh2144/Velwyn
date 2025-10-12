// ProductPage.tsx (Server Component)
import { notFound } from 'next/navigation';
import productService from '@/lib/services/productService';
import ProductDisplay from '@/components/ProductDisplay/ProductDisplay';


const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const product = await productService.getBySlug(params.slug);
  if (!product) return notFound();

  return <ProductDisplay product={product} />;
};

export default ProductPage;
