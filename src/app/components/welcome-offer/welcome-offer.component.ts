import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome-offer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome-offer.component.html',
  styleUrl: './welcome-offer.component.scss',
})
export class WelcomeOfferComponent {
  isOpen = signal(true);
  cookiesVisible = signal(true);

  closeOffer() {
    this.isOpen.set(false);
  }

  acceptCookies() {
    this.cookiesVisible.set(false);
  }
}
