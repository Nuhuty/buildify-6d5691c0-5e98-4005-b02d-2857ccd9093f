
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Mock order data
  const order = {
    id,
    date: '2025-07-10',
    total: 285000,
    status: 'completed',
    paymentMethod: 'Card Payment',
    paymentStatus: 'paid',
    items: [
      {
        id: '1',
        name: 'Premium Laptop',
        price: 250000,
        quantity: 1,
      },
      {
        id: '3',
        name: 'Wireless Headphones',
        price: 35000,
        quantity: 1,
      },
    ],
    shipping: {
      address: '123 Main Street',
      city: 'Lagos',
      state: 'Lagos State',
      postalCode: '100001',
      phone: '+2348012345678',
    },
    shippingFee: 2000,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-500">Unpaid</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-500">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/orders" className="text-blue-600 hover:underline">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order #{id}</h1>
        <div className="flex items-center gap-2">
          <span>Status: {getStatusBadge(order.status)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-right py-3 px-4">Price</th>
                      <th className="text-right py-3 px-4">Quantity</th>
                      <th className="text-right py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4 text-right">₦{item.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">₦{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">Address:</span> {order.shipping.address}</p>
                  <p><span className="font-medium">City:</span> {order.shipping.city}</p>
                  <p><span className="font-medium">State:</span> {order.shipping.state}</p>
                  <p><span className="font-medium">Postal Code:</span> {order.shipping.postalCode}</p>
                  <p><span className="font-medium">Phone:</span> {order.shipping.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                  <p>
                    <span className="font-medium">Payment Status:</span> {getPaymentStatusBadge(order.paymentStatus)}
                  </p>
                  <p><span className="font-medium">Order Date:</span> {new Date(order.date).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>₦{order.shippingFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₦{order.total.toLocaleString()}</span>
                </div>

                {order.status === 'completed' && (
                  <Button className="w-full mt-4">Download Invoice</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;