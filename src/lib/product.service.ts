import { Injectable, signal } from '@angular/core';
import { coerceNumericFields, getDb } from './db';
import { Category, Product } from './types';

@Injectable({ providedIn: 'root' })
export class ProductService {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async loadCategories() {
    try {
      const db = await getDb();
      const { data, error } = await db.from('categories').select('*').order('name');
      if (error) throw error;
      this.categories.set(data ?? []);
    } catch (err) {
      console.error('loadCategories:', err);
    }
  }

  async loadProducts() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const db = await getDb();
      const { data, error } = await db.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      this.products.set(coerceNumericFields<Product>(data));
    } catch (err: any) {
      console.error('loadProducts:', err);
      this.error.set(err.message ?? 'Failed to load products');
    } finally {
      this.loading.set(false);
    }
  }

  async loadFeatured() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const db = await getDb();
      const { data, error } = await db.from('products').select('*').eq('featured', true).order('created_at', { ascending: false });
      if (error) throw error;
      this.products.set(coerceNumericFields<Product>(data));
    } catch (err: any) {
      console.error('loadFeatured:', err);
      this.error.set(err.message ?? 'Failed to load featured products');
    } finally {
      this.loading.set(false);
    }
  }
}
