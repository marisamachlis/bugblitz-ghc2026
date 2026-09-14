import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../lib/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

interface FilterGroup {
  label: string;
  key: string;
  expanded: boolean;
  options: { value: string; label: string }[];
}

@Component({
  selector: 'app-plants',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './plants.component.html',
  styleUrl: './plants.component.scss',
})
export class PlantsComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = this.productService.loading;
  error = this.productService.error;

  sidebarCollapsed = signal(false);
  searchQuery = signal('');
  sortMode = signal<'default' | 'new' | 'popular' | 'sale'>('default');

  activeFilters = signal<Record<string, Set<string>>>({
    env: new Set(),
    light: new Set(),
    lifestyle: new Set(),
    type: new Set(),
    size: new Set(),
  });

  filterGroups: FilterGroup[] = [
    {
      label: 'Shop by Environment', key: 'env', expanded: true,
      options: [
        { value: 'indoor', label: 'Indoor Houseplants' },
        { value: 'outdoor', label: 'Outdoor & Garden' },
        { value: 'office', label: 'Office Plants' },
        { value: 'patio', label: 'Patio & Balcony' },
      ]
    },
    {
      label: 'Shop by Light Level', key: 'light', expanded: true,
      options: [
        { value: 'low-light', label: 'Low Light' },
        { value: 'bright-indirect', label: 'Bright Indirect' },
        { value: 'full-sun', label: 'Full Sun' },
      ]
    },
    {
      label: 'Shop by Lifestyle & Care', key: 'lifestyle', expanded: true,
      options: [
        { value: 'pet-friendly', label: 'Pet-Friendly' },
        { value: 'beginner-friendly', label: 'Beginner-Friendly' },
        { value: 'drought-tolerant', label: 'Drought-Tolerant' },
        { value: 'air-purifying', label: 'Air Purifying' },
      ]
    },
    {
      label: 'Shop by Plant Type', key: 'type', expanded: true,
      options: [
        { value: 'foliage', label: 'Foliage Plants' },
        { value: 'succulent', label: 'Succulents & Cacti' },
        { value: 'flowering', label: 'Flowering Plants' },
        { value: 'trailing', label: 'Trailing & Climbing' },
      ]
    },
    {
      label: 'Shop by Size', key: 'size', expanded: true,
      options: [
        { value: 'small', label: 'Small (2"–4" pots)' },
        { value: 'medium', label: 'Medium (6"–8" pots)' },
        { value: 'large', label: 'Large (10"+ pots)' },
      ]
    },
  ];

  filteredProducts = computed(() => {
    const products = this.productService.products().filter(p => !p.is_supply);
    const filters = this.activeFilters();
    const q = this.searchQuery().toLowerCase().trim();
    const sort = this.sortMode();

    let base = products.filter(p => {
      if (sort === 'popular' && !p.featured) return false;
      if (sort === 'sale' && !p.compare_at_price) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) {
        return false;
      }
      if (filters['env'].size > 0) {
        const matches = [...filters['env']].some(v => p.environment?.includes(v));
        if (!matches) return false;
      }
      if (filters['light'].size > 0) {
        if (!p.light_level || !filters['light'].has(p.light_level)) return false;
      }
      if (filters['lifestyle'].size > 0) {
        const matches = [...filters['lifestyle']].some(v => p.lifestyle?.includes(v));
        if (!matches) return false;
      }
      if (filters['type'].size > 0) {
        if (!p.plant_type || !filters['type'].has(p.plant_type)) return false;
      }
      if (filters['size'].size > 0) {
        if (!p.pot_size || !filters['size'].has(p.pot_size)) return false;
      }
      return true;
    });

    if (sort === 'new') {
      base = base.slice(0, 12);
    } else {
      base = [...base].sort((a, b) => a.name.localeCompare(b.name));
    }
    return base;
  });

  activeChips = computed(() => {
    const filters = this.activeFilters();
    const chips: { key: string; value: string; label: string }[] = [];
    const labelMap: Record<string, string> = {
      'indoor': 'Indoor Houseplants', 'outdoor': 'Outdoor & Garden',
      'office': 'Office Plants', 'patio': 'Patio & Balcony',
      'low-light': 'Low Light', 'bright-indirect': 'Bright Indirect', 'full-sun': 'Full Sun',
      'pet-friendly': 'Pet-Friendly', 'beginner-friendly': 'Beginner-Friendly',
      'drought-tolerant': 'Drought-Tolerant', 'air-purifying': 'Air Purifying',
      'foliage': 'Foliage Plants', 'succulent': 'Succulents & Cacti',
      'flowering': 'Flowering Plants', 'trailing': 'Trailing & Climbing',
      'small': 'Small (2"–4")', 'medium': 'Medium (6"–8")', 'large': 'Large (10"+)',
    };
    for (const [key, set] of Object.entries(filters)) {
      for (const value of set) {
        chips.push({ key, value, label: labelMap[value] ?? value });
      }
    }
    return chips;
  });

  hasActiveFilters = computed(() => {
    if (this.searchQuery()) return true;
    return Object.values(this.activeFilters()).some(s => s.size > 0);
  });

  async ngOnInit() {
    await this.productService.loadProducts();

    this.route.queryParams.subscribe(params => {
      if (params['env']) {
        this.setFilter('env', params['env']);
      }
      this.searchQuery.set(params['q'] ?? '');
      const sort = params['sort'];
      this.sortMode.set(sort === 'new' ? 'new' : sort === 'popular' ? 'popular' : sort === 'sale' ? 'sale' : 'default');
    });
  }

  get pageHeading(): string {
    const mode = this.sortMode();
    if (mode === 'new') return 'NEW ARRIVALS';
    if (mode === 'popular') return 'POPULAR PICKS';
    if (mode === 'sale') return 'ON SALE';
    return 'ALL PLANTS';
  }

  isActive(key: string, value: string): boolean {
    return this.activeFilters()[key]?.has(value) ?? false;
  }

  toggleFilter(key: string, value: string) {
    const current = this.activeFilters();
    const updated: Record<string, Set<string>> = {};
    for (const [k, v] of Object.entries(current)) {
      updated[k] = new Set(v);
    }
    if (updated[key].has(value)) {
      updated[key].delete(value);
    } else {
      updated[key].add(value);
    }
    this.activeFilters.set(updated);
  }

  setFilter(key: string, value: string) {
    const current = this.activeFilters();
    const updated: Record<string, Set<string>> = {};
    for (const [k, v] of Object.entries(current)) {
      updated[k] = new Set(v);
    }
    updated[key] = new Set([value]);
    this.activeFilters.set(updated);
  }

  clearAll() {
    this.searchQuery.set('');
    this.activeFilters.set({
      env: new Set(),
      light: new Set(),
      lifestyle: new Set(),
      type: new Set(),
      size: new Set(),
    });
    const team = new URLSearchParams(window.location.search).get('team');
    this.router.navigate([], { queryParams: team ? { team } : {}, replaceUrl: true });
  }
}
