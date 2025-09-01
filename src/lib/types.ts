// Core types for TuFinanza PWA - Enhanced Version

export type Currency = 'ARS' | 'USD' | 'USDT' | 'COP' | 'MXN' | 'CLP' | 'PEN' | 'UYU' | 'BRL' | 'EUR' | 'GBP';

export type MovementType = 'income' | 'expense' | 'saving';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  country: string;
  currency: Currency;
  createdAt: Date;
  isOnboarded: boolean;
  // New: Display preferences
  preferredBalanceCurrency: Currency; // USD or local currency
}

export interface Movement {
  id: string;
  type: MovementType;
  amount: number;
  currency: Currency;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: Currency;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

export interface SavingTransaction {
  id: string;
  goalId: string;
  amount: number;
  currency: Currency;
  type: 'deposit' | 'withdrawal';
  description?: string;
  date: Date;
  createdAt: Date;
}

export interface USDTQuote {
  price: number;
  timestamp: Date;
  source: 'binance' | 'simulation';
}

// New: Exchange rates interface
export interface ExchangeRates {
  base: 'USD';
  rates: Record<Currency, number>;
  timestamp: Date;
  source: 'simulation' | 'api';
}

export interface AppState {
  // User data
  userProfile: UserProfile | null;
  isOnboarded: boolean;
  
  // Financial data
  movements: Movement[];
  savingGoals: SavingGoal[];
  savingTransactions: SavingTransaction[];
  
  // Market data
  usdtQuote: USDTQuote | null;
  exchangeRates: ExchangeRates | null;
  lastQuoteUpdate: Date | null;
  
  // UI state
  currentPage: string;
  isLoading: boolean;
  notifications: Notification[];
  
  // New: Display preferences
  balanceDisplayCurrency: Currency;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  createdAt: Date;
}

// Categories for movements
export interface Category {
  id: string;
  name: string;
  type: MovementType;
  icon: string;
  color: string;
}

// Filter types
export interface MovementFilter {
  type?: MovementType;
  category?: string;
  currency?: Currency;
  dateFrom?: Date;
  dateTo?: Date;
}

// Statistics
export interface BalanceStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  netBalance: number;
  currency: Currency;
  period: 'day' | 'week' | 'month' | 'year' | 'all';
}

export interface SavingStats {
  totalGoals: number;
  completedGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  currency: Currency;
}

// New: Country interface with flag
export interface Country {
  code: string;
  name: string;
  currency: Currency;
  flag: string;
}