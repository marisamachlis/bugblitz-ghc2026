import { Component, inject, HostListener, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../lib/cart.service';
import { CartModalService } from '../../lib/cart-modal.service';
import { ConfirmationDialogService } from '../../lib/confirmation-dialog.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [],
  templateUrl: './cart-modal.component.html',
  styleUrl: './cart-modal.component.scss',
})
export class CartModalComponent {
  cart = inject(CartService);
  modal = inject(CartModalService);
  private router = inject(Router);
  closing = signal(false);
  confirmationDialog = inject(ConfirmationDialogService);

  pendingClearCart = false;

  close() {
    if (this.closing()) return;
    this.closing.set(true);
  }

  onBackdropAnimationEnd(event: AnimationEvent) {
    if (event.target !== event.currentTarget) return;

    if (!this.closing()) return;

    this.closing.set(false);
    this.modal.close();
  }

  goToCart() {
    this.close();
    this.router.navigate(['/cart']);
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.close();
    }
  }

  clearCart() {
    this.confirmationDialog.openPrompt();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.modal.isOpen()) this.close();
  }
  
  removeItem(productId: string) {
    this.cart.removeItem(productId);
  }
}
