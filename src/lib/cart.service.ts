import { AppliedCoupon, CartItem, Coupon, Product } from './types';
import { getDb, getTeamId } from './db';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CartService {
  private currentKey = this.getStorageKey();
  items = signal<CartItem[]>(this.loadFromStorage());
  appliedCoupons = signal<AppliedCoupon[]>(this.loadCouponsFromStorage());

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('current_team');
        localStorage.removeItem('cart');
      } catch {
      }
    }

    const router = inject(Router);
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const newKey = this.getStorageKey();
        if (newKey !== this.currentKey) {
          this.currentKey = newKey;
          this.items.set(this.loadFromStorage());
        }
      }
    });
  }

  private getStorageKey(): string {
    if (typeof window === 'undefined') return 'cart';
    return `cart_team_${getTeamId()}`;
  }

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.currentKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private loadCouponsFromStorage(): AppliedCoupon[] {
    try {
      const stored = localStorage.getItem('cart_coupons');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.currentKey, JSON.stringify(this.items()));
  }

  private saveCouponsToStorage() {
    localStorage.setItem('cart_coupons', JSON.stringify(this.appliedCoupons()));
  }

  count = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  subtotal = computed(() =>
    this.items().reduce(
      (sum, item) =>
        sum + (item.product.compare_at_price || item.product.price) * item.quantity,
      0
    )
  );

  discountTotal = computed(() =>
    this.appliedCoupons().reduce((sum, applied) => {
      return sum + this.getCouponDiscount(applied.coupon);
    }, 0)
  );

  total = computed(() => this.subtotal() - this.discountTotal());

  getCouponDiscount(coupon: Coupon): number {
    if (coupon.discount_type === 'percent') {
      return this.subtotal() * (coupon.discount_value / 100);
    }
    return coupon.discount_value;
  }

  async applyCoupon(
    code: string
  ): Promise<{ success: boolean; message: string }> {
    const trimmed = code.trim();
    if (!trimmed) {
      return { success: false, message: 'Enter a promo code.' };
    }

    const db = await getDb();
    const { data, error } = await db
      .from('coupons')
      .select('*')
      .eq('code', trimmed.toUpperCase())
      .eq('active', true)
      .limit(1);
    if (error) throw error;
    const coupon = data?.[0] as Coupon | undefined;

    if (!coupon) {
      return { success: false, message: 'Invalid promo code.' };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { success: false, message: 'This promo code has expired.' };
    }

    this.appliedCoupons.set([
      ...this.appliedCoupons(),
      { coupon },
    ]);
    this.saveCouponsToStorage();

    return { success: true, message: `${coupon.code} applied!` };
  }

  removeCoupon(index: number) {
    const current = this.appliedCoupons();
    this.appliedCoupons.set(current.filter((_, i) => i !== index));
    this.saveCouponsToStorage();
  }

  addItem(product: Product) {
    const current = this.items();
    const existing = current.find((i) => i.product.id === product.id);
    if (existing) {
      this.items.set(
        current.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      this.items.set([...current, { product, quantity: 1 }]);
    }
    this.saveToStorage();
  }

  removeItem(productId: string) {
    this.items.set(this.items().filter((i) => i.product.id !== productId));
    this.saveToStorage();
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.set(
      this.items().map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
    this.saveToStorage();
  }

  clear() {
    this.items.set([]);
    this.appliedCoupons.set([]);
    localStorage.removeItem(this.currentKey);
    localStorage.removeItem('cart_coupons');
  }
}
  