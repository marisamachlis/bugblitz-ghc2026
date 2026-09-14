// ============================================================================
// ℹ️ WORKSHOP SETUP: Mock fallback for Supabase backend.
// ⚠️ DO NOT LOOK HERE FOR BUGS: This file is part of the workshop setup, not the exercise challenges!
// ============================================================================

import { coerceNumericFields } from '../../data/db';
import { Category, Coupon, Product, OrderWithItems } from '../../models/types';
import type { CreateOrder, StoreDataSource } from '../../services/store-data.service';

export class MockApiStoreDataSource implements StoreDataSource {
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const { headers, ...rest } = init ?? {};
    const response = await fetch(`/api${path}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    });

    if (!response.ok) {
      throw new Error(`Mock API request failed (${response.status})`);
    }

    return response.json() as Promise<T>;
  }

  async categories(): Promise<Category[]> {
    return this.request('/categories');
  }

  async products(options: { featured?: boolean; supplies?: boolean } = {}): Promise<Product[]> {
    const params = new URLSearchParams();
    if (options.featured !== undefined) params.set('featured', String(options.featured));
    if (options.supplies !== undefined) params.set('supplies', String(options.supplies));
    return coerceNumericFields<Product>(await this.request(`/products?${params}`));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return coerceNumericFields<Product>(
      await this.request(`/products/search?q=${encodeURIComponent(query)}`)
    );
  }

  async findCoupon(code: string): Promise<Coupon | undefined> {
    const result = await this.request<Coupon | null>(`/coupons/${encodeURIComponent(code)}`);
    return result ?? undefined;
  }

  async findOrders(email: string): Promise<OrderWithItems[]> {
    return this.request(`/orders?email=${encodeURIComponent(email.trim())}`);
  }

  async createOrder(order: CreateOrder): Promise<void> {
    await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }
}