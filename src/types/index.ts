
export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  nin_verified: boolean;
  nin_token?: string;
  nin_data?: any;
  created_at: string;
  updated_at: string;
  user_type: 'customer' | 'business' | 'admin';
  profile_image_url?: string;
  is_active: boolean;
}

export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  cac_number?: string;
  cac_verified: boolean;
  business_type?: string;
  business_address?: string;
  business_description?: string;
  business_logo_url?: string;
  created_at: string;
  updated_at: string;
  verification_documents?: {
    urls: string[];
  };
  is_active: boolean;
}

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category?: string;
  images?: {
    urls: string[];
  };
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shipping_address: {
    full_name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  payment_method?: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  product?: Product;
}

export interface VerificationLog {
  id: string;
  user_id: string;
  verification_type: 'nin' | 'cac';
  verification_id: string;
  status: string;
  response_data: any;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}