// app/test-products/page.tsx
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export default async function TestProducts() {
  await dbConnect();
  
  // Test database connection and products
  const totalProducts = await ProductModel.countDocuments({});
  const products = await ProductModel.find({}).limit(5).lean();
  const categories = await ProductModel.find().distinct('category');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      <div className="grid gap-4">
        <div>
          <strong>Total Products:</strong> {totalProducts}
        </div>
        <div>
          <strong>Categories:</strong> {JSON.stringify(categories)}
        </div>
        <div>
          <strong>Sample Products:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}