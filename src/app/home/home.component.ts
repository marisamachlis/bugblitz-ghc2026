import { Component, OnInit, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { coerceNumericFields, getDb } from '../../lib/db';
import { ProductService } from '../../lib/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../lib/types';
import { CartService } from '../../lib/cart.service';
import { CartModalService } from '../../lib/cart-modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private cartModal = inject(CartModalService);

  plants = signal<Product[]>([]);
  supplies = signal<Product[]>([]);
  plantsLoading = signal(true);
  suppliesLoading = signal(true);

  @ViewChild('plantsTrack') private plantsTrackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('careTrack') private careTrackRef!: ElementRef<HTMLDivElement>;

  async ngOnInit() {
    const db = await getDb();
    const [plantsResult, suppliesResult] = await Promise.all([
      db.from('products').select('*').eq('is_supply', false).order('created_at', { ascending: false }),
      db.from('products').select('*').eq('is_supply', true).order('supply_type').order('name'),
    ]);

    if (plantsResult.error) throw plantsResult.error;
    if (suppliesResult.error) throw suppliesResult.error;

    this.plants.set(coerceNumericFields<Product>(plantsResult.data));
    this.supplies.set(coerceNumericFields<Product>(suppliesResult.data));

    this.plantsLoading.set(false);
    this.suppliesLoading.set(false);
  }

  scrollPlants(dir: 1 | -1) {
    this.plantsTrackRef?.nativeElement.scrollBy({ left: dir * 900, behavior: 'smooth' });
  }

  scrollCare(dir: 1 | -1) {
    this.careTrackRef?.nativeElement.scrollBy({ left: dir * 900, behavior: 'smooth' });
  }

  onPlantsScroll() {}
  onCareScroll() {}

  addSupplyToCart(item: Product) {
    this.cart.addItem(item);
    this.cartModal.open();
  }
}
