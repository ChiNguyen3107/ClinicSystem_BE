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

/**
 * Calculate VAT amount
 * @param amount - Amount before VAT
 * @param vatRate - VAT rate (default 10%)
 * @returns VAT amount
 */
export function calculateVAT(amount: number, vatRate = 10): number {
  return Math.round((amount * vatRate) / 100);
}

/**
 * Calculate total with VAT
 * @param amount - Amount before VAT
 * @param vatRate - VAT rate (default 10%)
 * @returns Total amount including VAT
 */
export function calculateTotalWithVAT(amount: number, vatRate = 10): number {
  return amount + calculateVAT(amount, vatRate);
}

/**
 * Calculate billing totals
 * @param subtotal - Subtotal amount
 * @param discountAmount - Discount amount
 * @param vatRate - VAT rate (default 10%)
 * @returns Object with calculated amounts
 */
export function calculateBillingTotals(
  subtotal: number,
  discountAmount = 0,
  vatRate = 10
) {
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const vatAmount = calculateVAT(afterDiscount, vatRate);
  const total = afterDiscount + vatAmount;

  return {
    subtotal,
    discountAmount,
    afterDiscount,
    vatAmount,
    vatRate,
    total
  };
}

/**
 * Format currency for display in tables
 * @param amount - Amount to format
 * @param compact - Whether to use compact format
 * @returns Formatted currency string
 */
export function formatCurrencyCompact(amount: number, compact = false): string {
  if (compact && amount >= 1000000) {
    const millions = Math.floor(amount / 1000000);
    const remainder = amount % 1000000;
    if (remainder === 0) {
      return `${millions}M ${CURRENCY_SYMBOL}`;
    }
    const thousands = Math.floor(remainder / 1000);
    return `${millions}.${thousands}M ${CURRENCY_SYMBOL}`;
  }
  
  if (compact && amount >= 1000) {
    const thousands = Math.floor(amount / 1000);
    const remainder = amount % 1000;
    if (remainder === 0) {
      return `${thousands}K ${CURRENCY_SYMBOL}`;
    }
    return `${thousands}.${Math.floor(remainder / 100)}K ${CURRENCY_SYMBOL}`;
  }
  
  return formatCurrency(amount);
}

/**
 * Calculate percentage discount
 * @param originalAmount - Original amount
 * @param discountedAmount - Amount after discount
 * @returns Discount percentage
 */
export function calculateDiscountPercentage(originalAmount: number, discountedAmount: number): number {
  if (originalAmount === 0) return 0;
  const discountAmount = originalAmount - discountedAmount;
  return Math.round((discountAmount / originalAmount) * 100);
}