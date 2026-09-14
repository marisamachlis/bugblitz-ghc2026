import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, UrlSerializer, RouterOutlet, withInMemoryScrolling } from '@angular/router';
import { HeaderComponent } from './app/components/header/header.component';
import { HomeComponent } from './app/components/home/home.component';
import { ShopComponent } from './app/components/shop/shop.component';
import { CartComponent } from './app/components/cart/cart.component';
import { CheckoutComponent } from './app/components/checkout/checkout.component';
import { CareComponent } from './app/components/care/care.component';
import { PlantsComponent } from './app/components/plants/plants.component';
import { CartModalComponent } from './app/components/cart-modal/cart-modal.component';
import { WelcomeOfferComponent } from './app/components/welcome-offer/welcome-offer.component';
import { SessionUrlSerializer } from './app/workshop-setup/session-url-serializer';
import { ConfirmationDialogService } from './app/services/confirmation-dialog.service';
import { ConfirmationDialogComponent } from './app/components/confirmation-dialog/confirmation-dialog.component';
import { OrdersComponent } from './app/components/orders/orders.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CartModalComponent, WelcomeOfferComponent, ConfirmationDialogComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-cart-modal />
    <app-welcome-offer />
    @if (confirmationDialogService.isPromptOpen()) {
      <app-confirmation-dialog
        [clearCart]="true"
        (confirmed)="confirmationDialogService.confirmClear()"
        (cancelled)="confirmationDialogService.cancelClear()"
      />
    }
  `,
  styles: [
    `
    main {
      min-height: calc(100vh - 64px);
      background: #f8f6f3;
    }
  `,
  ],
})
export class App {
  protected confirmationDialogService = inject(ConfirmationDialogService);
}

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'plants', component: PlantsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'care', component: CareComponent },
    ], withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    {
      provide: UrlSerializer,
      useFactory: () => new SessionUrlSerializer(window.location.search),
    },
  ],
});
