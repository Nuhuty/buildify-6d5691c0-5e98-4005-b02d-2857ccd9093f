
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Business } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  cacNumber: z.string()
    .min(8, 'CAC number must be at least 8 characters')
    .regex(/^[A-Z0-9]+$/, 'CAC number must contain only uppercase letters and numbers'),
});

type FormData = z.infer<typeof formSchema>;

const CacVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);

  const businessId = location.state?.businessId;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cacNumber: '',
    },
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!user) return;

      try {
        let query = supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id);

        if (businessId) {
          query = query.eq('id', businessId);
        }

        const { data, error } = await query.single();

        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
            console.error('Error fetching business:', error);
            setError('Failed to fetch business information');
          } else {
            navigate('/business/register');
          }
        } else {
          setBusiness(data);
        }
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoadingBusiness(false);
      }
    };

    fetchBusiness();
  }, [user, businessId, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!user || !business) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Call the Supabase Edge Function for CAC verification
      const { data: responseData, error: functionError } = await supabase.functions.invoke('verify-cac', {
        body: {
          userId: user.id,
          businessId: business.id,
          cacNumber: data.cacNumber,
          businessName: business.business_name,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!responseData.success) {
        setError(responseData.error || 'CAC verification failed');
        return;
      }

      setSuccess('CAC verification successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Error verifying CAC:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingBusiness) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!business) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Business Found</CardTitle>
            <CardDescription>You need to register a business first</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/business/register')}>Register Business</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">CAC Verification</CardTitle>
          <CardDescription className="text-center">
            Verify your business with your CAC registration number
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="mb-4 p-4 bg-blue-50 rounded-md text-sm">
            <p className="font-medium mb-2">Business Information:</p>
            <div className="space-y-1">
              <p><span className="font-medium">Business Name:</span> {business.business_name}</p>
              <p><span className="font-medium">Business Type:</span> {business.business_type}</p>
            </div>
            <p className="mt-3 text-xs">
              Enter your CAC registration number to verify your business. This helps build trust with customers and unlocks additional features.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cacNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CAC Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. RC123456" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your Corporate Affairs Commission registration number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Business'}
              </Button>
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

export default CacVerification;