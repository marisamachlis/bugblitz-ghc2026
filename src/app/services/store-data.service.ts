import { Injectable, inject } from '@angular/core';
import { ApiModeService } from '../workshop/services/api-mode.service';
import { Category, Coupon, Product, OrderWithItems } from '../models/types';
import { MockApiStoreDataSource } from '../workshop/services/mock-store.service';
import { SupabaseStoreDataSource } from '../data/supabase-store.service';

export interface CreateOrder {
  email: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  items: Array<{ product: Product; quantity: number }>;
  coupons: Array<{ coupon: Coupon; discountAmount: number }>;
}

export interface StoreDataSource {
  categories(): Promise<Category[]>;
  products(options?: { featured?: boolean; supplies?: boolean }): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  findCoupon(code: string): Promise<Coupon | undefined>;
  createOrder(order: CreateOrder): Promise<void>;
  findOrders(email: string): Promise<OrderWithItems[]>;
}

@Injectable({ providedIn: 'root' })
export class StoreDataService {
  readonly mock = inject(ApiModeService).mock;

  private readonly source: StoreDataSource = this.mock()
    ? new MockApiStoreDataSource()
    : new SupabaseStoreDataSource();

  categories() {
    return this.source.categories();
  }

  products(options?: { featured?: boolean; supplies?: boolean }) {
    return this.source.products(options);
  }

  searchProducts(query: string) {
    return this.source.searchProducts(query);
  }

  findCoupon(code: string) {
    return this.source.findCoupon(code);
  }

  findOrders(email: string) {
    return this.source.findOrders(email);
  }

  createOrder(order: CreateOrder) {
    return this.source.createOrder(order);
  }
}