
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  // In a real app, we would fetch the product details from the API
  // For now, we'll use a placeholder product
  const product = {
    id,
    name: 'Premium Laptop',
    description: 'High-performance laptop for professionals. Features include a powerful processor, ample RAM, and a high-resolution display. Perfect for developers, designers, and business professionals who need reliable performance.',
    price: 250000,
    stock_quantity: 10,
    category: 'Electronics',
    business: {
      name: 'Tech Solutions Ltd',
      verified: true,
    },
    images: ['/placeholder.svg'],
    specifications: [
      { name: 'Processor', value: 'Intel Core i7' },
      { name: 'RAM', value: '16GB' },
      { name: 'Storage', value: '512GB SSD' },
      { name: 'Display', value: '15.6" 4K' },
      { name: 'Battery', value: '8 hours' },
    ],
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock_quantity) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = () => {
    // In a real app, we would add the product to the cart
    alert(`Added ${quantity} ${product.name}(s) to cart`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg mb-4">
            <span className="text-gray-500">Product Image</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-24 flex items-center justify-center rounded-lg">
                <span className="text-gray-500 text-sm">Image {i}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-gray-600 mr-2">Sold by: {product.business.name}</span>
            {product.business.verified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                CAC Verified
              </span>
            )}
          </div>
          <p className="text-2xl font-bold mb-4">₦{product.price.toLocaleString()}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity:</h3>
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={decreaseQuantity}>-</Button>
              <Input
                type="number"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 mx-2 text-center"
              />
              <Button variant="outline" size="sm" onClick={increaseQuantity}>+</Button>
              <span className="ml-4 text-gray-600">
                {product.stock_quantity} available
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="w-full" size="lg" onClick={addToCart}>
              Add to Cart
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Specifications</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <tbody>
                {product.specifications.map((spec, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 font-medium">{spec.name}</td>
                    <td className="py-3 px-4">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No reviews yet</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;