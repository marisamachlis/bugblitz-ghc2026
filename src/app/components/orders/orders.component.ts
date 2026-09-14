import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StoreDataService } from '../../services/store-data.service';
import { OrderWithItems } from '../../models/types';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private storeData = inject(StoreDataService);
  email = '';
  orders = signal<OrderWithItems[]>([]);
  searched = signal(false);
  loading = signal(false);
  errorMessage = signal('');

  async findOrders(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set('');
    this.orders.set([]);

    const email = this.email.trim();
    if (!email) {
      this.errorMessage.set('Enter the email address you used at checkout.');
      return;
    }

    this.loading.set(true);
    this.searched.set(false);

    try {
      this.orders.set(await this.storeData.findOrders(email));
    } catch (err: any) {
      this.errorMessage.set(err.message || 'We could not load your orders. Please try again.');
    } finally {
      this.loading.set(false);
      this.searched.set(true);
    }
  }
}
