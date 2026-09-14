import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { coerceNumericFields, getDb } from '../../lib/db';
import { Product } from '../../lib/types';
import { CartService } from '../../lib/cart.service';
import { CartModalService } from '../../lib/cart-modal.service';

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
      const db = await getDb();
      const { data, error } = await db.from('products').select('*').eq('is_supply', true).order('supply_type').order('name');
      if (error) throw error;
      this.supplies.set(coerceNumericFields<Product>(data));
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
