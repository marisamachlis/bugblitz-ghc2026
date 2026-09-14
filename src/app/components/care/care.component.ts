import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { StoreDataService } from '../../services/store-data.service';
import { Product } from '../../models/types';
import { CartService } from '../../services/cart.service';
import { CartModalService } from '../../services/cart-modal.service';

const SECTION_META: Record<string, { label: string; description: string }> = {
  tool: { label: 'Planting Tools', description: 'The right tool makes every task easier.' },
  pot: { label: 'Pots & Planters', description: 'Give your plants a beautiful home.' },
  soil: { label: 'Soil & Nutrients', description: 'Healthy roots start with quality mix.' },
};

@Component({
  selector: 'app-care',
  standalone: true,
  imports: [],
  templateUrl: './care.component.html',
  styleUrl: './care.component.scss',
})
export class CareComponent implements OnInit {
  private cart = inject(CartService);
  private cartModal = inject(CartModalService);
  private storeData = inject(StoreDataService);

  loading = signal(true);
  error = signal<string | null>(null);
  supplies = signal<Product[]>([]);

  sections = computed(() => {
    const all = this.supplies();
    return (['tool', 'pot', 'soil'] as const).map(type => ({
      type,
      label: SECTION_META[type].label,
      description: SECTION_META[type].description,
      items: all.filter(s => s.supply_type === type),
    })).filter(s => s.items.length > 0);
  });

  async ngOnInit() {
    try {
      this.supplies.set(await this.storeData.products({ supplies: true }));
    } catch (err: any) {
      this.error.set(err.message ?? 'Failed to load care supplies');
    }
    this.loading.set(false);
  }

  addToCart(item: Product) {
    if (!item.in_stock) return;
    this.cart.addItem({
      ...item,
      is_supply: true,
      supply_type: item.supply_type ?? null,
    });
    this.cartModal.open();
  }
}
