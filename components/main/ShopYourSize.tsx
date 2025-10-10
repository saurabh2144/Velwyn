// components/ShopYourSize.tsx
import Image from 'next/image';

const ShopYourSize = () => {
  const sizes = [
    { id: 1, name: 'XS', description: 'Extra Small' },
    { id: 2, name: 'S', description: 'Small' },
    { id: 3, name: 'M', description: 'Medium' },
    { id: 4, name: 'L', description: 'Large' },
    { id: 5, name: 'XL', description: 'Extra Large' },
    { id: 6, name: 'XXL', description: 'Double Extra Large' },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          SHOP YOUR SIZE
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sizes.map((size) => (
            <div
              key={size.id}
              className="group cursor-pointer text-center"
            >
              <div className="aspect-square bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex items-center justify-center group-hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {size.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{size.description}</p>
                </div>
              </div>
              
              <button className="w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Shop Now
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            *Find your perfect fit with our size guide
          </p>
          <button className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Size Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopYourSize;