// ============================================================================
// ℹ️ WORKSHOP SETUP: Mock fallback for Supabase backend.
// ⚠️ DO NOT LOOK HERE FOR BUGS: This file is part of the workshop setup, not the exercise challenges!
// ============================================================================
import { createServer } from 'node:http';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_COUPONS } from './mock-data.mjs'; 

const products = MOCK_PRODUCTS.map(seed => ({
  id: `mock-${seed.slug}`,
  image_url: '',
  created_at: '2026-01-01T00:00:00.000Z',
  ...seed
}));

const categories = MOCK_CATEGORIES;
const coupons = MOCK_COUPONS;
const orders = [];

function send(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(value));
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:4300');
  if (request.method === 'GET' && url.pathname === '/api/categories') return send(response, 200, categories);
  if (request.method === 'GET' && url.pathname === '/api/products') {
    let result = [...products];
    for (const key of ['featured', 'supplies']) {
      if (url.searchParams.has(key)) result = result.filter(product => product[key === 'supplies' ? 'is_supply' : key] === (url.searchParams.get(key) === 'true'));
    }
    return send(response, 200, result);
  }
  if (request.method === 'GET' && url.pathname === '/api/products/search') {
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    return send(response, 200, products.filter(product => product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q)).slice(0, 5));
  }
  if (request.method === 'GET' && url.pathname.startsWith('/api/coupons/')) {
    const code = decodeURIComponent(url.pathname.slice('/api/coupons/'.length)).toUpperCase();
    return send(response, 200, coupons.find(coupon => coupon.code === code && coupon.active) ?? null);
  }
  if (request.method === 'GET' && url.pathname === '/api/orders') {
    const email = (url.searchParams.get('email') ?? '').trim().toLowerCase();
    const matches = email
      ? orders.filter(order => order.email.trim().toLowerCase() === email).slice().reverse()
      : [];
    return send(response, 200, matches);
  }
  if (request.method === 'POST' && url.pathname === '/api/orders') {
    let body = '';
    for await (const chunk of request) body += chunk;
    const input = JSON.parse(body);
    const id = `mock-${crypto.randomUUID()}`;
    const order = {
      id,
      email: input.email,
      full_name: input.fullName,
      address: input.address,
      city: input.city,
      state: input.state,
      zip: input.zip,
      subtotal: input.subtotal,
      discount_amount: input.discountAmount,
      total: input.total,
      status: 'pending',
      created_at: new Date().toISOString(),
      items: input.items.map(item => ({
        id: `mock-${crypto.randomUUID()}`,
        order_id: id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };
    orders.push(order);
    return send(response, 201, { id: order.id });
  }
  return send(response, 404, { error: 'Not found' });
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.log('Mock API already listening at http://127.0.0.1:4300');
    process.exit(0);
  }
  throw error;
});

server.listen(4300, '127.0.0.1', () => console.log('Mock API listening at http://127.0.0.1:4300'));