import { Component, Input, inject } from '@angular/core';
import { Product } from '../../lib/types';
import { CartService } from '../../lib/cart.service';
import { CartModalService } from '../../lib/cart-modal.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  cart = inject(CartService);
  private cartModal = inject(CartModalService);

  get visibleTags(): { label: string; color: string }[] {
    const tags: { label: string; color: string }[] = [];

    const lightLabels: Record<string, string> = {
      'low-light': 'Low Light',
      'bright-indirect': 'Bright Indirect',
      'full-sun': 'Full Sun',
    };
    if (this.product.light_level && lightLabels[this.product.light_level]) {
      tags.push({ label: lightLabels[this.product.light_level], color: 'green' });
    }

    const lifestyleLabels: Record<string, { label: string; color: string }> = {
      'pet-friendly':      { label: 'Pet-Friendly', color: 'amber' },
      'beginner-friendly': { label: 'Beginner-Friendly', color: 'blue' },
      'drought-tolerant':  { label: 'Drought-Tolerant', color: 'blue' },
      'air-purifying':     { label: 'Air Purifying', color: 'blue' },
    };
    for (const trait of (this.product.lifestyle ?? [])) {
      if (lifestyleLabels[trait] && tags.length < 3) {
        tags.push(lifestyleLabels[trait]);
      }
    }

    return tags.slice(0, 3);
  }

  addToCart() {
    this.cart.addItem(this.product);
    this.cartModal.open();
  }
}
