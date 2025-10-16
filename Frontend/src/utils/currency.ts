/**
 * Currency utilities for Vietnamese Dong (VND)
 */

export const CURRENCY_SYMBOL = '₫';
export const CURRENCY_CODE = 'VND';

/**
 * Format number as Vietnamese currency
 * @param amount - Amount in VND
 * @param showSymbol - Whether to show currency symbol
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, showSymbol = true): string {
  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return showSymbol ? `${formatted} ${CURRENCY_SYMBOL}` : formatted;
}

/**
 * Parse currency string to number
 * @param currencyString - Currency string to parse
 * @returns Parsed number or 0 if invalid
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString.replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculate discount amount
 * @param subtotal - Subtotal amount
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discount amount
 */
export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return Math.round((subtotal * discountPercent) / 100);
}

/**
 * Calculate total with discount
 * @param subtotal - Subtotal amount
 * @param discount - Discount amount
 * @returns Total amount
 */
export function calculateTotal(subtotal: number, discount: number): number {
  return Math.max(0, subtotal - discount);
}

/**
 * Validate currency input
 * @param value - Input value
 * @returns True if valid currency format
 */
export function isValidCurrency(value: string): boolean {
  const cleaned = value.replace(/[^\d]/g, '');
  const num = parseInt(cleaned, 10);
  return !isNaN(num) && num >= 0;
}
