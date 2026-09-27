import { describe, expect, it } from 'vitest';
import {
  applyDiscount,
  bulkDiscountPercent,
  cartTotal,
  lineTotal,
  withVat,
} from '../../src/pricing.js';

describe('lineTotal', () => {
  it('multiplies unit price by quantity', () => {
    expect(lineTotal(9.99, 3)).toBe(29.97);
  });

  it('rejects negative prices', () => {
    expect(() => lineTotal(-1, 1)).toThrow(TypeError);
  });

  it('rejects fractional quantities', () => {
    expect(() => lineTotal(10, 1.5)).toThrow(TypeError);
  });

  it('rejects zero quantity', () => {
    expect(() => lineTotal(10, 0)).toThrow(TypeError);
  });
});

describe('applyDiscount', () => {
  it('reduces the total by the given percentage', () => {
    expect(applyDiscount(200, 15)).toBe(170);
  });

  it('returns the total unchanged at zero percent', () => {
    expect(applyDiscount(200, 0)).toBe(200);
  });

  it('rejects percentages above 100', () => {
    expect(() => applyDiscount(100, 101)).toThrow(RangeError);
  });
});

describe('withVat', () => {
  it('adds 20 percent VAT', () => {
    expect(withVat(100)).toBe(120);
  });
});

describe('cartTotal', () => {
  it('sums lines, applies discount, then adds VAT', () => {
    const items = [
      { unitPrice: 10, quantity: 2 },
      { unitPrice: 5, quantity: 4 },
    ];

    expect(cartTotal(items, 10)).toBe(43.2);
  });

  it('handles a single line with no discount', () => {
    expect(cartTotal([{ unitPrice: 50, quantity: 1 }])).toBe(60);
  });
});

describe('bulkDiscountPercent', () => {
  it.each([
    [0, 0],
    [9, 0],
    [10, 5],
    [19, 5],
    [20, 10],
    [99, 10],
    [100, 15],
    [500, 15],
  ])('gives %i units a %i percent discount', (units, expected) => {
    expect(bulkDiscountPercent(units)).toBe(expected);
  });

  it('rejects a negative unit count', () => {
    expect(() => bulkDiscountPercent(-1)).toThrow(TypeError);
  });
});
