import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../lib/cart.service';
import { RouterLink } from '@angular/router';
import { getDb } from '../../lib/db';

const US_ZIP_PATTERN = /^\d{5}(-\d{4})?$/;

type Region = { code: string; name: string };

const COUNTRIES = [
  'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark',
  'Finland', 'France', 'Germany', 'Greece', 'India', 'Ireland', 'Italy',
  'Japan', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Poland',
  'Portugal', 'Singapore', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'United Kingdom', 'United States',
];

const REGIONS: Record<string, Region[]> = {
  'United States': [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' }, { code: 'DC', name: 'Washington D.C.' },
    { code: 'WV', name: 'West Virginia' }, { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
  ],
  'Canada': [
    { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' }, { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' }, { code: 'NS', name: 'Nova Scotia' },
    { code: 'NT', name: 'Northwest Territories' }, { code: 'NU', name: 'Nunavut' },
    { code: 'ON', name: 'Ontario' }, { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' },
    { code: 'YT', name: 'Yukon' },
  ],
  'United Kingdom': [
    { code: 'ENG', name: 'England' }, { code: 'NIR', name: 'Northern Ireland' },
    { code: 'SCT', name: 'Scotland' }, { code: 'WLS', name: 'Wales' },
  ],
  'Australia': [
    { code: 'ACT', name: 'Australian Capital Territory' },
    { code: 'NSW', name: 'New South Wales' }, { code: 'NT', name: 'Northern Territory' },
    { code: 'QLD', name: 'Queensland' }, { code: 'SA', name: 'South Australia' },
    { code: 'TAS', name: 'Tasmania' }, { code: 'VIC', name: 'Victoria' },
    { code: 'WA', name: 'Western Australia' },
  ],
};

const STATE_LABELS: Record<string, string> = {
  'United States': 'State',
  'Canada': 'Province',
  'United Kingdom': 'Nation / Region',
  'Australia': 'State / Territory',
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cart = inject(CartService);
  items = this.cart.items;
  subtotal = this.cart.subtotal;
  discountTotal = this.cart.discountTotal;
  total = this.cart.total;
  appliedCoupons = this.cart.appliedCoupons;

  countries = COUNTRIES;
  stateOptions: Region[] = [];
  stateLabel = 'State / Province';
  zipLabel = 'ZIP / Postal Code';
  hasRegions = false;

  submitting = signal(false);
  orderSuccess = signal(false);
  errorMessage = signal('');

  form = {
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  };

  onCountryChange(): void {
    const country = this.form.country;
    this.stateOptions = REGIONS[country] ?? [];
    this.hasRegions = this.stateOptions.length > 0;
    this.stateLabel = STATE_LABELS[country] ?? 'State / Province';
    this.zipLabel = country === 'United States' ? 'ZIP Code' : 'Postal Code';
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage.set('');

    if (
      !this.form.fullName ||
      !this.form.email ||
      !this.form.address ||
      !this.form.city ||
      !this.form.state ||
      !this.form.zip ||
      !this.form.country
    ) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    if (!US_ZIP_PATTERN.test(this.form.zip)) {
      this.errorMessage.set('Invalid ZIP code. Please enter a valid 5-digit US ZIP code.');
      return;
    }

    this.submitting.set(true);

    try {
      const db = await getDb();

      const { data: order, error: orderError } = await db
        .from('orders')
        .insert({
          email: this.form.email,
          full_name: this.form.fullName,
          address: this.form.address,
          city: this.form.city,
          state: this.form.state,
          zip: this.form.zip,
          subtotal: this.subtotal(),
          discount_amount: this.discountTotal(),
          total: this.total(),
          status: 'pending',
        })
        .select('id')
        .single();
      if (orderError) throw orderError;

      const { error: itemsError } = await db.from('order_items').insert(
        this.items().map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }))
      );
      if (itemsError) throw itemsError;

      const coupons = this.appliedCoupons();
      if (coupons.length > 0) {
        const { error: couponsError } = await db.from('order_coupons').insert(
          coupons.map(applied => ({
            order_id: order.id,
            coupon_id: applied.coupon.id,
            code: applied.coupon.code,
            discount_amount: this.cart.getCouponDiscount(applied.coupon),
          }))
        );
        if (couponsError) throw couponsError;
      }

      this.cart.clear();
      this.orderSuccess.set(true);
    } catch (err: any) {
      this.errorMessage.set(
        err.message || 'Failed to place order. Please try again.'
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
