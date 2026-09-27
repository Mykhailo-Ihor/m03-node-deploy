import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

describe('quote api', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  it('reports healthy', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns a total for a valid cart', async () => {
    const response = await request(app)
      .post('/quote')
      .send({ items: [{ unitPrice: 10, quantity: 2 }], discountPercent: 10 });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(21.6);
  });

  it('rejects an empty cart', async () => {
    const response = await request(app).post('/quote').send({ items: [] });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/non-empty/);
  });

  it('rejects an invalid discount', async () => {
    const response = await request(app)
      .post('/quote')
      .send({ items: [{ unitPrice: 10, quantity: 1 }], discountPercent: 250 });

    expect(response.status).toBe(400);
  });

  it('rejects a malformed line item', async () => {
    const response = await request(app)
      .post('/quote')
      .send({ items: [{ unitPrice: 10, quantity: 0 }] });

    expect(response.status).toBe(400);
  });
});
