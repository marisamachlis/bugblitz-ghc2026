import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../lib/cart.service';
import { RouterLink } from '@angular/router';
import { ConfirmationDialogService } from '../../lib/confirmation-dialog.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cart = inject(CartService);
  items = this.cart.items;
  subtotal = this.cart.subtotal;
  discountTotal = this.cart.discountTotal;
  total = this.cart.total;
  appliedCoupons = this.cart.appliedCoupons;

  promoCode = '';
  applying = signal(false);
  couponMessage = signal('');
  couponError = signal(false);
  confirmationDialog = inject(ConfirmationDialogService);

  async applyPromoCode() {
    if (this.applying()) return;

    this.couponMessage.set('');
    this.couponError.set(false);
    this.applying.set(true);

    const result = await this.cart.applyCoupon(this.promoCode);
    this.couponMessage.set(result.message);
    this.couponError.set(!result.success);

    if (result.success) {
      this.promoCode = '';
    }

    this.applying.set(false);
  }

  clearCart() {
    this.confirmationDialog.openPrompt();
  }
}
