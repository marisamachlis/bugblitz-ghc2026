// ============================================================================
// ℹ️ WORKSHOP SETUP: Mock fallback for Supabase backend.
// ⚠️ DO NOT LOOK HERE FOR BUGS: This file is part of the workshop setup, not the exercise challenges!
// ============================================================================
import assert from 'node:assert/strict';
import http from 'node:http';
import { test } from 'node:test';

// Use an ephemeral port so the participant's running mock server is untouched.
test('order lookup returns local checkout orders by email, newest first', async () => {
  const listen = http.Server.prototype.listen;
  let server;
  http.Server.prototype.listen = function (_port, host, callback) {
    server = this;
    return listen.call(this, 0, host, callback);
  };
  try {
    await import('./mock-api-server.mjs');
    if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}/api/orders`;
    const lookup = async email => {
      const response = await fetch(`${base}?${new URLSearchParams({ email })}`);
      assert.equal(response.status, 200);
      return response.json();
    };
    const email = 'Participant+workshop@example.test';
    assert.deepEqual(await lookup(email), []);
    const input = {
      email, fullName: 'Workshop Participant', address: '123 Main St',
      city: 'Boston', state: 'MA', zip: '02101', subtotal: 40,
      discountAmount: 4, total: 36,
      items: [{ product: { id: 'plant-1', name: 'Fern', price: 20 }, quantity: 2 }],
      coupons: [],
    };
    const create = async order => {
      const response = await fetch(base, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      assert.equal(response.status, 201);
      return (await response.json()).id;
    };
    const first = await create(input);
    await create({ ...input, email: 'someone-else@example.test' });
    const second = await create(input);
    const orders = await lookup(`  ${email.toUpperCase()}  `);
    assert.deepEqual(orders.map(order => order.id), [second, first]);
    const order = orders[0];
    assert.equal(order.full_name, input.fullName);
    assert.equal(order.discount_amount, 4);
    assert.equal(order.total, 36);
    assert.equal(order.status, 'pending');
    assert.ok(Number.isFinite(Date.parse(order.created_at)));
    assert.deepEqual(order.items[0], {
      id: order.items[0].id, order_id: second, product_id: 'plant-1',
      product_name: 'Fern', quantity: 2, price: 20,
    });
    assert.ok(order.items[0].id);
    assert.notEqual(order.items[0].id, orders[1].items[0].id);
    assert.deepEqual(await lookup('missing@example.test'), []);
    assert.deepEqual(await lookup(''), []);
    assert.deepEqual(await lookup('%'), []);
    assert.deepEqual(await (await fetch(base)).json(), []);
  } finally {
    http.Server.prototype.listen = listen;
    if (server) {
      server.close();
      server.closeAllConnections();
    }
  }
});
