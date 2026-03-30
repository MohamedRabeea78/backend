// ── Auth & Roles ──────────────────────────────
const ROLES = Object.freeze({
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
});

// ── Order ─────────────────────────────────────
const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
});

const PAYMENT_METHOD = Object.freeze({
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
  CARD: 'CARD',
  WALLET: 'WALLET',
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
});

// ── Loyalty ───────────────────────────────────
const LOYALTY_REASON = Object.freeze({
  EARN_ORDER: 'EARN_ORDER',
  REDEEM: 'REDEEM',
  MANUAL_ADJUST: 'MANUAL_ADJUST',
});

// Points earned per EGP spent
const POINTS_PER_EGP = 1;
// EGP discount per loyalty point redeemed
const EGP_PER_POINT = 0.5;

// ── Payment Fees ──────────────────────────────
// Extra % charged when paying by CARD (e.g. 3 = 3%)
const CARD_FEE_PERCENTAGE = 3;

// ── Campaigns ─────────────────────────────────
const CAMPAIGN_SCOPE = Object.freeze({
  PRODUCTS: 'PRODUCTS',
  CATEGORY: 'CATEGORY',
  ALL_ORDERS: 'ALL_ORDERS',
});

// ── Coupons ───────────────────────────────────
const DISCOUNT_TYPE = Object.freeze({
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED',
});

// ── Pagination ────────────────────────────────
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

module.exports = {
  ROLES,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  LOYALTY_REASON,
  POINTS_PER_EGP,
  EGP_PER_POINT,
  CARD_FEE_PERCENTAGE,
  CAMPAIGN_SCOPE,
  DISCOUNT_TYPE,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
