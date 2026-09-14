export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  category_id: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  category?: Category;
  light_level: string | null;
  environment: string[] | null;
  lifestyle: string[] | null;
  plant_type: string | null;
  pot_size: string | null;
  is_supply: boolean;
  supply_type: 'tool' | 'pot' | 'soil' | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  active: boolean;
  max_uses: number | null;
  times_used: number;
  expires_at: string | null;
}

export interface AppliedCoupon {
  coupon: Coupon;
}

export interface Order {
  id: string;
  email: string;
  full_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  subtotal: number | null;
  discount_amount: number;
  total: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}
