import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink, RouterLinkActive, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { StoreDataService } from '../../services/store-data.service';
import { Product } from '../../models/types';
import { WorkshopModeToggleComponent } from '../../workshop-setup/components/workshop-mode-toggle/workshop-mode-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CurrencyPipe, WorkshopModeToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cart = inject(CartService);
  cartCount = this.cart.count;
  mobileMenuOpen = signal(false);
  mobileSearchOpen = signal(false);
  @ViewChild('menuButton') menuButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('searchButton') searchButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  private elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationEnd) this.closeMobilePanels();
    });
  }

  toggleMobileMenu(): void {
    this.mobileSearchOpen.set(false);
    this.mobileMenuOpen.update(open => !open);
  }

  toggleMobileSearch(): void {
    this.mobileMenuOpen.set(false);
    this.mobileSearchOpen.update(open => !open);
    if (this.mobileSearchOpen()) {
      // Wait for Angular to reveal the search field before focusing it.
      setTimeout(() => this.searchInput?.nativeElement.focus());
    }
  }

  closeMobilePanels(): void {
    this.mobileMenuOpen.set(false);
    this.mobileSearchOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.mobileMenuOpen()) this.menuButton?.nativeElement.focus();
    else if (this.mobileSearchOpen()) this.searchButton?.nativeElement.focus();
    this.closeMobilePanels();
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) this.closeMobilePanels();
  }

  searchValue = '';
  searchResults = signal<Product[]>([]);
  searchLoading = signal(false);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storeData = inject(StoreDataService);
  mock = this.storeData.mock;

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
      this.searchResults.set(await this.storeData.searchProducts(trimmedQuery));
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
