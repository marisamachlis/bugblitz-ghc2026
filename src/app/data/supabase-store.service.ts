import { coerceNumericFields, getDb } from './db';
import { Category, Coupon, Product, Order, OrderItem, OrderWithItems } from '../models/types';
import type { CreateOrder, StoreDataSource } from '../services/store-data.service';

export class SupabaseStoreDataSource implements StoreDataSource {
  async categories(): Promise<Category[]> {
    const db = await getDb();
    const { data, error } = await db.from('categories').select('*').order('name');
    if (error) throw error;
    return data as Category[];
  }

  async products(options: { featured?: boolean; supplies?: boolean } = {}): Promise<Product[]> {
    const db = await getDb();
    let query = db.from('products').select('*');
    if (options.featured !== undefined) query = query.eq('featured', options.featured);
    if (options.supplies !== undefined) query = query.eq('is_supply', options.supplies);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return coerceNumericFields<Product>(data);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const db = await getDb();
    const { data, error } = await db
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name')
      .limit(5);
    if (error) throw error;
    return coerceNumericFields<Product>(data);
  }

  async findCoupon(code: string): Promise<Coupon | undefined> {
    const db = await getDb();
    const { data, error } = await db
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .limit(1);
    if (error) throw error;
    return data?.[0] as Coupon | undefined;
  }

  async findOrders(email: string): Promise<OrderWithItems[]> {
    const db = await getDb();
    const { data: orderRows, error: orderError } = await db
      .from('orders')
      .select('*')
      .ilike('email', email)
      .order('created_at', { ascending: false });
    if (orderError) throw orderError;

    const orders = coerceNumericFields<Order>(orderRows);
    if (orders.length === 0) return [];

    const { data: itemRows, error: itemError } = await db
      .from('order_items')
      .select('*')
      .in('order_id', orders.map(order => order.id));
    if (itemError) throw itemError;

    const itemsByOrder = new Map<string, OrderItem[]>();
    for (const item of coerceNumericFields<OrderItem>(itemRows)) {
      const items = itemsByOrder.get(item.order_id) ?? [];
      items.push(item);
      itemsByOrder.set(item.order_id, items);
    }

    return orders.map(order => ({ ...order, items: itemsByOrder.get(order.id) ?? [] }));
  }

  async createOrder(order: CreateOrder): Promise<void> {
    const db = await getDb();
    const { data: created, error } = await db
      .from('orders')
      .insert({
        email: order.email,
        full_name: order.fullName,
        address: order.address,
        city: order.city,
        state: order.state,
        zip: order.zip,
        subtotal: order.subtotal,
        discount_amount: order.discountAmount,
        total: order.total,
        status: 'pending',
      })
      .select('id')
      .single();
    if (error) throw error;

    const { error: itemsError } = await db.from('order_items').insert(
      order.items.map((item) => ({
        order_id: created.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }))
    );
    if (itemsError) throw itemsError;

    if (order.coupons.length) {
      const { error: couponsError } = await db.from('order_coupons').insert(
        order.coupons.map(({ coupon, discountAmount }) => ({
          order_id: created.id,
          coupon_id: coupon.id,
          code: coupon.code,
          discount_amount: discountAmount,
        }))
      );
      if (couponsError) throw couponsError;
    }
  }
}