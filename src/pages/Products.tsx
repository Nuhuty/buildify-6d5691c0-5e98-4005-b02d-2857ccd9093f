
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, businesses(business_name)')
          .eq('is_active', true);

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // For now, we'll use a placeholder list of products
  const placeholderProducts: Product[] = [
    {
      id: '1',
      business_id: '1',
      name: 'Premium Laptop',
      description: 'High-performance laptop for professionals',
      price: 250000,
      stock_quantity: 10,
      category: 'Electronics',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    },
    {
      id: '2',
      business_id: '1',
      name: 'Office Desk',
      description: 'Ergonomic office desk for your workspace',
      price: 45000,
      stock_quantity: 5,
      category: 'Furniture',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    },
    {
      id: '3',
      business_id: '2',
      name: 'Wireless Headphones',
      description: 'Noise-cancelling wireless headphones',
      price: 35000,
      stock_quantity: 20,
      category: 'Electronics',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    },
    {
      id: '4',
      business_id: '2',
      name: 'Leather Sofa',
      description: 'Luxurious leather sofa for your living room',
      price: 150000,
      stock_quantity: 3,
      category: 'Furniture',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    },
    {
      id: '5',
      business_id: '3',
      name: 'Smartphone',
      description: 'Latest smartphone with advanced features',
      price: 120000,
      stock_quantity: 15,
      category: 'Electronics',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    },
    {
      id: '6',
      business_id: '3',
      name: 'Coffee Table',
      description: 'Modern coffee table for your living room',
      price: 25000,
      stock_quantity: 8,
      category: 'Furniture',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    },
  ];

  const filteredProducts = placeholderProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Electronics', 'Furniture'];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading products...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-2 mb-2">{product.description}</p>
              <p className="font-bold text-lg">₦{product.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to={`/products/${product.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
              <Button>Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Products;