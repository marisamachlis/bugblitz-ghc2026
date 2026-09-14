import { Component, inject, APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Router, NavigationEnd, RouterOutlet, withInMemoryScrolling } from '@angular/router';
import { HeaderComponent } from './app/header/header.component';
import { HomeComponent } from './app/home/home.component';
import { ShopComponent } from './app/shop/shop.component';
import { CartComponent } from './app/cart/cart.component';
import { CheckoutComponent } from './app/checkout/checkout.component';
import { CareComponent } from './app/care/care.component';
import { PlantsComponent } from './app/plants/plants.component';
import { CartModalComponent } from './app/cart-modal/cart-modal.component';
import { WelcomeOfferComponent } from './app/welcome-offer/welcome-offer.component';
import { environment } from './environments/environment';
import { ConfirmationDialogService } from './lib/confirmation-dialog.service';
import { ConfirmationDialogComponent } from './app/confirmation-dialog/confirmation-dialog.component';

const TEAM_ID = (() => {
  const envTeam = environment.team;
  if (envTeam !== undefined && envTeam !== null && String(envTeam).trim() !== '') {
    return String(envTeam);
  }

  if (typeof window === 'undefined') return null;

  return new URLSearchParams(window.location.search).get('team');
})();

function preserveTeamParam() {
  return () => {
    if (!TEAM_ID) return;
    const router = inject(Router);
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = new URL(window.location.href);
        if (!url.searchParams.has('team')) {
          url.searchParams.set('team', TEAM_ID);
          window.history.replaceState(null, '', url.toString());
        }
      }
    });
  };
}

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
      { path: 'care', component: CareComponent },
    ], withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    {
      provide: APP_INITIALIZER,
      useFactory: preserveTeamParam,
      multi: true,
    },
  ],
});
