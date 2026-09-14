import { Component, OnInit, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { StoreDataService } from '../../services/store-data.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/types';
import { CartService } from '../../services/cart.service';
import { CartModalService } from '../../services/cart-modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private storeData = inject(StoreDataService);
  private cart = inject(CartService);
  private cartModal = inject(CartModalService);

  plants = signal<Product[]>([]);
  supplies = signal<Product[]>([]);
  plantsLoading = signal(true);
  suppliesLoading = signal(true);

  @ViewChild('plantsTrack') private plantsTrackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('careTrack') private careTrackRef!: ElementRef<HTMLDivElement>;

  async ngOnInit() {
    const [plants, supplies] = await Promise.all([
      this.storeData.products({ supplies: false }),
      this.storeData.products({ supplies: true }),
    ]);
    this.plants.set(plants);
    this.supplies.set(supplies);

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
