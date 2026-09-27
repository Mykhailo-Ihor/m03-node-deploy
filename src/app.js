import express from 'express';
import { cartTotal } from './pricing.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/quote', (req, res) => {
    const { items, discountPercent = 0 } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array' });
    }

    try {
      return res.status(200).json({ total: cartTotal(items, discountPercent) });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  return app;
}
