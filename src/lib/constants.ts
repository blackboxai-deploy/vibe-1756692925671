import { Category, Currency, Country } from './types';

// Supported currencies - Expanded to include Latin American and European currencies
export const CURRENCIES: Record<Currency, { symbol: string; name: string; code: Currency }> = {
  ARS: { symbol: '$', name: 'Peso Argentino', code: 'ARS' },
  USD: { symbol: '$', name: 'Dólar Americano', code: 'USD' },
  USDT: { symbol: 'USDT', name: 'Tether USD', code: 'USDT' },
  COP: { symbol: '$', name: 'Peso Colombiano', code: 'COP' },
  MXN: { symbol: '$', name: 'Peso Mexicano', code: 'MXN' },
  CLP: { symbol: '$', name: 'Peso Chileno', code: 'CLP' },
  PEN: { symbol: 'S/', name: 'Sol Peruano', code: 'PEN' },
  UYU: { symbol: '$', name: 'Peso Uruguayo', code: 'UYU' },
  BRL: { symbol: 'R$', name: 'Real Brasileño', code: 'BRL' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'Libra Esterlina', code: 'GBP' }
};

// Countries with their default currencies and flags
export const COUNTRIES: Country[] = [
  { code: 'AR', name: 'Argentina', currency: 'ARS', flag: '🇦🇷' },
  { code: 'US', name: 'Estados Unidos', currency: 'USD', flag: '🇺🇸' },
  { code: 'MX', name: 'México', currency: 'MXN', flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', currency: 'COP', flag: '🇨🇴' },
  { code: 'CL', name: 'Chile', currency: 'CLP', flag: '🇨🇱' },
  { code: 'PE', name: 'Perú', currency: 'PEN', flag: '🇵🇪' },
  { code: 'UY', name: 'Uruguay', currency: 'UYU', flag: '🇺🇾' },
  { code: 'BR', name: 'Brasil', currency: 'BRL', flag: '🇧🇷' },
  { code: 'ES', name: 'España', currency: 'EUR', flag: '🇪🇸' },
  { code: 'GB', name: 'Reino Unido', currency: 'GBP', flag: '🇬🇧' },
];

// Exchange rates to USD (simulated - in real app would come from API like exchangerate-api.com)
export const USD_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  USDT: 1, // Assume 1:1 with USD
  ARS: 0.0011, // 1 USD = ~900 ARS (approximate)
  COP: 0.00025, // 1 USD = ~4000 COP (approximate)
  MXN: 0.059, // 1 USD = ~17 MXN (approximate)
  CLP: 0.0011, // 1 USD = ~900 CLP (approximate)
  PEN: 0.27, // 1 USD = ~3.7 PEN (approximate)
  UYU: 0.026, // 1 USD = ~38 UYU (approximate)
  BRL: 0.20, // 1 USD = ~5 BRL (approximate)
  EUR: 1.10, // 1 USD = ~0.91 EUR (approximate)
  GBP: 1.27, // 1 USD = ~0.79 GBP (approximate)
};

// Categories for different movement types
export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salario', type: 'income', icon: '💰', color: '#10B981' },
  { id: 'freelance', name: 'Freelance', type: 'income', icon: '💻', color: '#059669' },
  { id: 'sales', name: 'Ventas', type: 'income', icon: '🛒', color: '#0D9488' },
  { id: 'investment', name: 'Inversiones', type: 'income', icon: '📈', color: '#0891B2' },
  { id: 'bonus', name: 'Bonus', type: 'income', icon: '🎁', color: '#7C3AED' },
  { id: 'rental', name: 'Alquileres', type: 'income', icon: '🏠', color: '#059669' },
  { id: 'other-income', name: 'Otros', type: 'income', icon: '💎', color: '#6366F1' },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Alimentación', type: 'expense', icon: '🍕', color: '#EF4444' },
  { id: 'transport', name: 'Transporte', type: 'expense', icon: '🚗', color: '#DC2626' },
  { id: 'utilities', name: 'Servicios', type: 'expense', icon: '⚡', color: '#B91C1C' },
  { id: 'entertainment', name: 'Entretenimiento', type: 'expense', icon: '🎬', color: '#991B1B' },
  { id: 'health', name: 'Salud', type: 'expense', icon: '🏥', color: '#7F1D1D' },
  { id: 'education', name: 'Educación', type: 'expense', icon: '📚', color: '#F97316' },
  { id: 'shopping', name: 'Compras', type: 'expense', icon: '🛍️', color: '#EA580C' },
  { id: 'rent', name: 'Alquiler', type: 'expense', icon: '🏠', color: '#C2410C' },
  { id: 'insurance', name: 'Seguros', type: 'expense', icon: '🛡️', color: '#B91C1C' },
  { id: 'other-expense', name: 'Otros', type: 'expense', icon: '📝', color: '#C2410C' },
];

export const SAVING_CATEGORIES: Category[] = [
  { id: 'general', name: 'Meta General', type: 'saving', icon: '🎯', color: '#3B82F6' },
  { id: 'emergency', name: 'Emergencias', type: 'saving', icon: '🆘', color: '#2563EB' },
  { id: 'vacation', name: 'Vacaciones', type: 'saving', icon: '✈️', color: '#1D4ED8' },
  { id: 'big-purchase', name: 'Compra Grande', type: 'saving', icon: '🏠', color: '#1E40AF' },
  { id: 'investment', name: 'Inversión', type: 'saving', icon: '💹', color: '#1E3A8A' },
  { id: 'retirement', name: 'Jubilación', type: 'saving', icon: '🌅', color: '#6366F1' },
  { id: 'education', name: 'Educación', type: 'saving', icon: '🎓', color: '#4F46E5' },
];

// All categories combined
export const ALL_CATEGORIES: Category[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
  ...SAVING_CATEGORIES
];

// Cache duration for quotes (1 hour in milliseconds)
export const QUOTE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Simulated USDT price range (for realistic simulation)
export const USDT_PRICE_RANGE = {
  min: 1180,
  max: 1220,
  base: 1200
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'tufinanza_user_profile',
  MOVEMENTS: 'tufinanza_movements',
  SAVING_GOALS: 'tufinanza_saving_goals',
  SAVING_TRANSACTIONS: 'tufinanza_saving_transactions',
  USDT_QUOTE: 'tufinanza_usdt_quote',
  EXCHANGE_RATES: 'tufinanza_exchange_rates',
  ONBOARDING: 'tufinanza_onboarding',
  APP_STATE: 'tufinanza_app_state',
  BALANCE_DISPLAY_CURRENCY: 'tufinanza_balance_display_currency'
};

// Default values
export const DEFAULT_CURRENCY: Currency = 'USD';
export const DEFAULT_COUNTRY = COUNTRIES[0]; // Argentina

// Navigation items
export const NAVIGATION_ITEMS = [
  { id: 'dashboard', name: 'Inicio', icon: '🏠', path: '/dashboard' },
  { id: 'calendar', name: 'Calendario', icon: '📅', path: '/calendar' },
  { id: 'movements', name: 'Movimientos', icon: '💸', path: '/movements' },
  { id: 'savings', name: 'Alcancía', icon: '🐷', path: '/savings' },
  { id: 'settings', name: 'Ajustes', icon: '⚙️', path: '/settings' },
];

// Animation durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Toast notification defaults
export const TOAST_DEFAULTS = {
  duration: 4000,
  position: 'bottom-right' as const,
};

// PWA Configuration
export const PWA_CONFIG = {
  APP_NAME: 'TuFinanza',
  APP_DESCRIPTION: 'Tu asistente personal de finanzas con soporte para múltiples divisas',
  THEME_COLOR: '#3B82F6',
  BACKGROUND_COLOR: '#ffffff',
  DISPLAY: 'standalone',
  ORIENTATION: 'portrait-primary',
  START_URL: '/',
  SCOPE: '/',
};