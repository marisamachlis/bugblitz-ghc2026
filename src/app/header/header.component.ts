import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../lib/cart.service';
import { RouterLink, RouterLinkActive, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { coerceNumericFields, getDb } from '../../lib/db';
import { Product } from '../../lib/types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CurrencyPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  cart = inject(CartService);
  cartCount = this.cart.count;
  searchValue = '';
  searchResults = signal<Product[]>([]);
  searchLoading = signal(false);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isActive(sort: string): boolean {
    return this.route.snapshot.queryParams['sort'] === sort;
  }

  onSearchEnter() {
    if (this.searchValue.trim()) {
      this.router.navigate(['/shop'], { queryParams: { q: this.searchValue.trim() }, queryParamsHandling: 'merge' });
    }
  }

  async onSearchChange(query: string) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      this.searchResults.set([]);
      this.searchLoading.set(false);
      return;
    }

    this.searchLoading.set(true);
    try {
      const db = await getDb();
      const { data, error } = await db
        .from('products')
        .select('*')
        .or(`name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`)
        .order('name')
        .limit(5);
      if (error) throw error;
      this.searchResults.set(coerceNumericFields<Product>(data));
    } catch (err) {
      console.error('search products:', err);
      this.searchResults.set([]);
    } finally {
      this.searchLoading.set(false);
    }
  }

  selectSearchResult(product: Product) {
    this.searchValue = product.name;
    this.searchResults.set([]);
    this.router.navigate(['/shop'], { queryParams: { q: product.name } });
  }
}
