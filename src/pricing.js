export const VAT_RATE = 0.2;

export function lineTotal(unitPrice, quantity) {
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    throw new TypeError('unitPrice must be a non-negative number');
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new TypeError('quantity must be a positive integer');
  }

  return round(unitPrice * quantity);
}

export function applyDiscount(total, percent) {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new RangeError('percent must be between 0 and 100');
  }

  return round(total * (1 - percent / 100));
}

export function withVat(total) {
  return round(total * (1 + VAT_RATE));
}

export function bulkDiscountPercent(totalUnits) {
  if (!Number.isInteger(totalUnits) || totalUnits < 0) {
    throw new TypeError('totalUnits must be a non-negative integer');
  }

  if (totalUnits >= 100) {
    return 15;
  }

  if (totalUnits >= 20) {
    return 10;
  }

  if (totalUnits >= 10) {
    return 5;
  }

  return 0;
}

export function cartTotal(items, discountPercent = 0) {
  const subtotal = items.reduce(
    (sum, item) => sum + lineTotal(item.unitPrice, item.quantity),
    0,
  );

  return withVat(applyDiscount(round(subtotal), discountPercent));
}

function round(value) {
  return Math.round(value * 100) / 100;
}
