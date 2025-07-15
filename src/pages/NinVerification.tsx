
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  virtualNin: z.string()
    .min(16, 'Virtual NIN must be 16 digits')
    .max(16, 'Virtual NIN must be 16 digits')
    .regex(/^\d+$/, 'Virtual NIN must contain only digits'),
});

type FormData = z.infer<typeof formSchema>;

const NinVerification = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      virtualNin: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Call the Supabase Edge Function for NIN verification
      const { data: responseData, error: functionError } = await supabase.functions.invoke('verify-nin', {
        body: {
          userId: user.id,
          virtualNin: data.virtualNin,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!responseData.success) {
        setError(responseData.error || 'NIN verification failed');
        return;
      }

      // Update local user state
      await updateUser({ nin_verified: true });
      
      setSuccess('NIN verification successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Error verifying NIN:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">NIN Verification</CardTitle>
          <CardDescription className="text-center">
            Verify your identity with your National Identification Number
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
            <p className="font-medium mb-2">How to get your Virtual NIN:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Download the NIMC Mobile ID App from your app store</li>
              <li>Register and verify your identity</li>
              <li>Generate a Virtual NIN (valid for 72 hours)</li>
              <li>Enter the 16-digit Virtual NIN below</li>
            </ol>
            <p className="mt-2 text-xs">
              Alternatively, dial <strong>*346*3*00000000000#</strong> (replace with your NIN) on your registered phone number to get a virtual NIN via SMS.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="virtualNin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Virtual NIN</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your 16-digit Virtual NIN" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your Virtual NIN is a temporary, tokenized version of your actual NIN
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify NIN'}
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

export default NinVerification;