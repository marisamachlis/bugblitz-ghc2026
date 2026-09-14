import { Injectable, inject, signal } from '@angular/core';
import { StoreDataService } from './store-data.service';
import { Category, Product } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private storeData = inject(StoreDataService);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async loadCategories() {
    try {
      this.categories.set(await this.storeData.categories());
    } catch (err) {
      console.error('loadCategories:', err);
    }
  }

  async loadProducts() {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.products.set(await this.storeData.products());
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
      this.products.set(await this.storeData.products({ featured: true }));
    } catch (err: any) {
      console.error('loadFeatured:', err);
      this.error.set(err.message ?? 'Failed to load featured products');
    } finally {
      this.loading.set(false);
    }
  }
}
