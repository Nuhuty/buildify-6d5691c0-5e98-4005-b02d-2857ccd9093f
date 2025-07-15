
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Business } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is the error code for no rows returned
          console.error('Error fetching business:', error);
          setError('Failed to fetch business information');
        } else {
          setBusiness(data || null);
        }
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusiness();
  }, [user]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details and verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {user?.full_name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user?.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {user?.phone}
              </div>
              <div>
                <span className="font-medium">NIN Verification:</span>{' '}
                {user?.nin_verified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-red-600">Not Verified</span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {!user?.nin_verified && (
              <Link to="/verification/nin">
                <Button>Verify NIN</Button>
              </Link>
            )}
            <Link to="/profile" className="ml-auto">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Your business details and verification status</CardDescription>
          </CardHeader>
          <CardContent>
            {business ? (
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Business Name:</span> {business.business_name}
                </div>
                <div>
                  <span className="font-medium">Business Type:</span> {business.business_type || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">CAC Verification:</span>{' '}
                  {business.cac_verified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Not Verified</span>
                  )}
                </div>
                <div>
                  <span className="font-medium">CAC Number:</span> {business.cac_number || 'Not provided'}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4">You haven't registered a business yet.</p>
                <Link to="/business/register">
                  <Button>Register Business</Button>
                </Link>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {business && !business.cac_verified && (
              <Link to="/verification/cac">
                <Button>Verify CAC</Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="sales">My Sales</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your recent purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>No orders yet</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/orders" className="ml-auto">
                <Button variant="outline">View All Orders</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Products</CardTitle>
              <CardDescription>Products you've listed for sale</CardDescription>
            </CardHeader>
            <CardContent>
              {business ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No products listed yet</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Register a business to list products</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {business && (
                <Link to="/products/add" className="ml-auto">
                  <Button>Add New Product</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Orders for your products</CardDescription>
            </CardHeader>
            <CardContent>
              {business ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No sales yet</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Register a business to track sales</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;