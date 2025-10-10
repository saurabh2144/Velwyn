// components/FeaturedCategories.tsx
import Image from 'next/image';

const FeaturedCategories = () => {
  const categories = [
    { name: 'T-shirts', count: '150+ items' },
    { name: 'Shirts', count: '120+ items' },
    { name: 'Joggers', count: '80+ items' },
    { name: 'Shorts', count: '60+ items' },
    { name: 'Trousers', count: '90+ items' },
    { name: 'Sweatshirts & Hoodies', count: '70+ items' },
    { name: 'Sweaters', count: '50+ items' },
    { name: 'Bags', count: '40+ items' },
    { name: 'Accessories', count: '30+ items' },
    { name: 'Belts', count: '25+ items' },
    { name: 'Blazers', count: '35+ items' },
    { name: 'Boxers', count: '45+ items' },
    { name: 'Cargo Pants', count: '55+ items' },
    { name: 'Chinos', count: '65+ items' },
    { name: 'Co-ords', count: '20+ items' },
    { name: 'Hoodies', count: '75+ items' },
    { name: 'Jackets', count: '40+ items' },
    { name: 'Jeans', count: '85+ items' },
    { name: 'Night Suit & Pyjamas', count: '15+ items' },
    { name: 'Overshirt', count: '25+ items' },
    { name: 'Perfumes', count: '20+ items' },
    { name: 'Shoes', count: '60+ items' },
    { name: 'Sunglasses', count: '35+ items' },
  ];

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          TOP CATEGORIES
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs font-medium">
                    {category.name.split(' ')[0].charAt(0)}
                  </span>
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-600">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500">{category.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;