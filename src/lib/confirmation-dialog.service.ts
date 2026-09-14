import { Injectable, signal, inject } from '@angular/core';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private cart = inject(CartService);
  
  isPromptOpen = signal(false);

  openPrompt() {
    if (this.cart.items().length > 0) {
      this.isPromptOpen.set(true);
    }
  }

  confirmClear() {
    this.cart.clear();
    this.closePrompt();
  }

  cancelClear() {
    this.closePrompt();
  }

  private closePrompt() {
    this.isPromptOpen.set(false);
  }
}