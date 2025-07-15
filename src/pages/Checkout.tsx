
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  phone: z.string().min(11, 'Phone number is required'),
  paymentMethod: z.enum(['card', 'bank_transfer', 'ussd']),
});

type FormData = z.infer<typeof formSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Mock cart items
  const cartItems = [
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
      quantity: 2,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 2000;
  const total = subtotal + shippingFee;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
      paymentMethod: 'card',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to a success page or order confirmation
      navigate('/orders');
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Lagos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Lagos State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="100001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+2348012345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-4"
                      >
                        <Tabs defaultValue="card" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="card" onClick={() => form.setValue('paymentMethod', 'card')}>
                              Card Payment
                            </TabsTrigger>
                            <TabsTrigger value="bank_transfer" onClick={() => form.setValue('paymentMethod', 'bank_transfer')}>
                              Bank Transfer
                            </TabsTrigger>
                            <TabsTrigger value="ussd" onClick={() => form.setValue('paymentMethod', 'ussd')}>
                              USSD
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="card" className="mt-4">
                            <div className="space-y-4">
                              <div>
                                <FormLabel>Card Number</FormLabel>
                                <Input placeholder="1234 5678 9012 3456" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <Input placeholder="MM/YY" />
                                </div>
                                <div>
                                  <FormLabel>CVV</FormLabel>
                                  <Input placeholder="123" />
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="bank_transfer" className="mt-4">
                            <div className="p-4 bg-blue-50 rounded-md">
                              <p className="font-medium mb-2">Bank Transfer Instructions:</p>
                              <p>1. Transfer the exact amount to the account below</p>
                              <p>2. Use your order number as reference</p>
                              <div className="mt-4">
                                <p><span className="font-medium">Bank:</span> First Bank</p>
                                <p><span className="font-medium">Account Name:</span> NUT Global Service Ltd</p>
                                <p><span className="font-medium">Account Number:</span> 1234567890</p>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="ussd" className="mt-4">
                            <div className="p-4 bg-blue-50 rounded-md">
                              <p className="font-medium mb-2">USSD Payment Instructions:</p>
                              <p>1. Dial the USSD code for your bank</p>
                              <p>2. Select Pay Merchant</p>
                              <p>3. Enter Merchant Code: 123456</p>
                              <p>4. Enter Amount: ₦{total.toLocaleString()}</p>
                              <p>5. Confirm payment</p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>₦{shippingFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>

                <Button 
                  className="w-full mt-4" 
                  size="lg" 
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;