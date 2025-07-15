
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  businessName: z.string().min(3, 'Business name must be at least 3 characters'),
  businessType: z.string().min(1, 'Please select a business type'),
  businessAddress: z.string().min(5, 'Business address must be at least 5 characters'),
  businessDescription: z.string().min(10, 'Business description must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

const BusinessRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      businessType: '',
      businessAddress: '',
      businessDescription: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Create business record in Supabase
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
          user_id: user.id,
          business_name: data.businessName,
          business_type: data.businessType,
          business_address: data.businessAddress,
          business_description: data.businessDescription,
        })
        .select()
        .single();

      if (businessError) {
        throw new Error(businessError.message);
      }

      // Update user type to business
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ user_type: 'business' })
        .eq('id', user.id);

      if (userUpdateError) {
        console.error('Error updating user type:', userUpdateError);
      }

      navigate('/verification/cac', { state: { businessId: business.id } });
    } catch (err: any) {
      console.error('Error registering business:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Register Your Business</CardTitle>
          <CardDescription>
            Provide your business details to start selling on our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Business Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the official registered name of your business
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="limited_liability">Limited Liability Company</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="nonprofit">Non-profit Organization</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your business address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your business, products, and services" 
                        {...field} 
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register Business'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BusinessRegister;