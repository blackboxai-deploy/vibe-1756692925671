import { Currency, USDTQuote, ExchangeRates } from './types';
import { CURRENCIES, USD_EXCHANGE_RATES, USDT_PRICE_RANGE, QUOTE_CACHE_DURATION } from './constants';

// Format number with locale-specific formatting
export function formatCurrency(
  amount: number,
  currency: Currency,
  options: {
    showDecimals?: boolean;
    showSymbol?: boolean;
    locale?: string;
  } = {}
): string {
  const {
    showDecimals = true,
    showSymbol = true,
    locale = getLocaleForCurrency(currency)
  } = options;

  const currencyInfo = CURRENCIES[currency];
  
  // Format with appropriate locale
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  if (showSymbol) {
    return `${currencyInfo.symbol} ${formatted}`;
  }
  
  return formatted;
}

// Get appropriate locale for currency
function getLocaleForCurrency(currency: Currency): string {
  const localeMap: Record<Currency, string> = {
    ARS: 'es-AR',
    USD: 'en-US',
    USDT: 'en-US',
    COP: 'es-CO',
    MXN: 'es-MX',
    CLP: 'es-CL',
    PEN: 'es-PE',
    UYU: 'es-UY',
    BRL: 'pt-BR',
    EUR: 'es-ES',
    GBP: 'en-GB',
  };
  return localeMap[currency] || 'en-US';
}

// Format for balance display (no decimals)
export function formatBalance(amount: number, currency: Currency): string {
  return formatCurrency(amount, currency, { 
    showDecimals: false, 
    showSymbol: true 
  });
}

// Format for movement details (with decimals)
export function formatMovementAmount(amount: number, currency: Currency): string {
  return formatCurrency(amount, currency, { 
    showDecimals: true, 
    showSymbol: true 
  });
}

// Convert any currency to USD using exchange rates
export function convertToUSD(amount: number, fromCurrency: Currency): number {
  if (fromCurrency === 'USD') return amount;
  
  const rate = USD_EXCHANGE_RATES[fromCurrency];
  if (!rate) {
    console.warn(`Exchange rate not found for ${fromCurrency}, using 1:1`);
    return amount;
  }
  
  return amount * rate;
}

// Convert from USD to any currency
export function convertFromUSD(usdAmount: number, toCurrency: Currency): number {
  if (toCurrency === 'USD') return usdAmount;
  
  const rate = USD_EXCHANGE_RATES[toCurrency];
  if (!rate) {
    console.warn(`Exchange rate not found for ${toCurrency}, using 1:1`);
    return usdAmount;
  }
  
  return usdAmount / rate;
}

// Convert between any two currencies via USD
export function convertCurrency(
  amount: number, 
  fromCurrency: Currency, 
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = convertToUSD(amount, fromCurrency);
  return convertFromUSD(usdAmount, toCurrency);
}

// Convert ARS to USDT using current quote
export function convertARSToUSDT(arsAmount: number, usdtQuote: USDTQuote): number {
  return arsAmount / usdtQuote.price;
}

// Convert USDT to ARS using current quote
export function convertUSDTToARS(usdtAmount: number, usdtQuote: USDTQuote): number {
  return usdtAmount * usdtQuote.price;
}

// Convert any currency to USDT (via USD)
export function convertToUSDT(
  amount: number, 
  fromCurrency: Currency, 
  usdtQuote?: USDTQuote
): number {
  switch (fromCurrency) {
    case 'ARS':
      if (usdtQuote) {
        return convertARSToUSDT(amount, usdtQuote);
      }
      // Fallback to USD conversion
      return convertToUSD(amount, fromCurrency);
    case 'USD':
    case 'USDT':
      return amount; // Assume 1 USD = 1 USDT
    default:
      // Convert via USD
      return convertToUSD(amount, fromCurrency);
  }
}

// Convert USDT to any currency
export function convertFromUSDT(
  usdtAmount: number,
  toCurrency: Currency,
  usdtQuote?: USDTQuote
): number {
  switch (toCurrency) {
    case 'ARS':
      if (usdtQuote) {
        return convertUSDTToARS(usdtAmount, usdtQuote);
      }
      // Fallback to USD conversion
      return convertFromUSD(usdtAmount, toCurrency);
    case 'USD':
    case 'USDT':
      return usdtAmount; // Assume 1 USD = 1 USDT
    default:
      // Convert via USD
      return convertFromUSD(usdtAmount, toCurrency);
  }
}

// Generate simulated USDT quote (realistic price fluctuation)
export function generateUSDTQuote(): USDTQuote {
  const now = new Date();
  
  // Generate price with small random fluctuation around base price
  const fluctuation = (Math.random() - 0.5) * 40; // ±20 ARS fluctuation
  const price = Math.round((USDT_PRICE_RANGE.base + fluctuation) * 100) / 100;
  
  return {
    price,
    timestamp: now,
    source: 'simulation'
  };
}

// Generate simulated exchange rates
export function generateExchangeRates(): ExchangeRates {
  const now = new Date();
  
  // Add small random fluctuations to base rates
  const rates: Record<Currency, number> = { ...USD_EXCHANGE_RATES };
  
  Object.keys(rates).forEach(currency => {
    if (currency !== 'USD') {
      const baseRate = USD_EXCHANGE_RATES[currency as Currency];
      const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
      rates[currency as Currency] = baseRate * (1 + fluctuation);
    }
  });
  
  return {
    base: 'USD',
    rates,
    timestamp: now,
    source: 'simulation'
  };
}

// Check if quotes need update (cache expired)
export function shouldUpdateQuotes(lastUpdate: Date | null): boolean {
  if (!lastUpdate) return true;
  
  const now = new Date();
  const timeDiff = now.getTime() - lastUpdate.getTime();
  
  return timeDiff >= QUOTE_CACHE_DURATION;
}

// Get cached USDT quote from localStorage
export function getCachedUSDTQuote(): USDTQuote | null {
  try {
    const cached = localStorage.getItem('tufinanza_usdt_quote');
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const quote: USDTQuote = {
      ...data,
      timestamp: new Date(data.timestamp)
    };
    
    // Check if cache is still valid
    if (shouldUpdateQuotes(quote.timestamp)) {
      return null;
    }
    
    return quote;
  } catch (error) {
    console.error('Error reading cached USDT quote:', error);
    return null;
  }
}

// Get cached exchange rates from localStorage
export function getCachedExchangeRates(): ExchangeRates | null {
  try {
    const cached = localStorage.getItem('tufinanza_exchange_rates');
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const rates: ExchangeRates = {
      ...data,
      timestamp: new Date(data.timestamp)
    };
    
    // Check if cache is still valid
    if (shouldUpdateQuotes(rates.timestamp)) {
      return null;
    }
    
    return rates;
  } catch (error) {
    console.error('Error reading cached exchange rates:', error);
    return null;
  }
}

// Save USDT quote to localStorage
export function saveUSDTQuoteToCache(quote: USDTQuote): void {
  try {
    localStorage.setItem('tufinanza_usdt_quote', JSON.stringify(quote));
  } catch (error) {
    console.error('Error saving USDT quote to cache:', error);
  }
}

// Save exchange rates to localStorage
export function saveExchangeRatesToCache(rates: ExchangeRates): void {
  try {
    localStorage.setItem('tufinanza_exchange_rates', JSON.stringify(rates));
  } catch (error) {
    console.error('Error saving exchange rates to cache:', error);
  }
}

// Get current USDT quote (from cache or generate new)
export function getCurrentUSDTQuote(): USDTQuote {
  const cached = getCachedUSDTQuote();
  if (cached) {
    return cached;
  }
  
  const newQuote = generateUSDTQuote();
  saveUSDTQuoteToCache(newQuote);
  return newQuote;
}

// Get current exchange rates (from cache or generate new)
export function getCurrentExchangeRates(): ExchangeRates {
  const cached = getCachedExchangeRates();
  if (cached) {
    return cached;
  }
  
  const newRates = generateExchangeRates();
  saveExchangeRatesToCache(newRates);
  return newRates;
}

// Format time ago string
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 30) return `Hace ${days} días`;
  
  return date.toLocaleDateString(getLocaleForCurrency('USD'));
}

// Parse number from user input (handle different locale formats)
export function parseNumber(input: string): number {
  // Remove currency symbols and spaces
  let cleaned = input.replace(/[$€£S\/R\s]/g, '');
  
  // Handle different locale formats
  const lastDotIndex = cleaned.lastIndexOf('.');
  const lastCommaIndex = cleaned.lastIndexOf(',');
  
  if (lastCommaIndex > lastDotIndex) {
    // Comma is the decimal separator (European style)
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (lastDotIndex !== -1) {
    // Check if dot is decimal (has 1-2 digits after it)
    const afterDot = cleaned.slice(lastDotIndex + 1);
    if (afterDot.length <= 2) {
      // Dot is decimal separator, remove other dots
      const beforeDot = cleaned.slice(0, lastDotIndex).replace(/\./g, '');
      cleaned = beforeDot + '.' + afterDot;
    } else {
      // Dot is thousands separator
      cleaned = cleaned.replace(/\./g, '');
    }
  }
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Validate currency amount
export function validateAmount(amount: number): { isValid: boolean; error?: string } {
  if (isNaN(amount) || amount < 0) {
    return { isValid: false, error: 'El monto debe ser un número positivo' };
  }
  
  if (amount === 0) {
    return { isValid: false, error: 'El monto debe ser mayor a cero' };
  }
  
  if (amount > 999999999) {
    return { isValid: false, error: 'El monto es demasiado grande' };
  }
  
  return { isValid: true };
}

// Get exchange rate between two currencies
export function getExchangeRate(from: Currency, to: Currency): number {
  if (from === to) return 1;
  
  // Convert via USD
  const fromToUSD = USD_EXCHANGE_RATES[from] || 1;
  const usdToTarget = 1 / (USD_EXCHANGE_RATES[to] || 1);
  
  return fromToUSD * usdToTarget;
}

// Format exchange rate for display
export function formatExchangeRate(from: Currency, to: Currency): string {
  const rate = getExchangeRate(from, to);
  const fromSymbol = CURRENCIES[from]?.symbol || from;
  const toSymbol = CURRENCIES[to]?.symbol || to;
  
  if (rate >= 1) {
    return `1 ${fromSymbol} = ${rate.toFixed(2)} ${toSymbol}`;
  } else {
    const inverseRate = 1 / rate;
    return `${inverseRate.toFixed(2)} ${fromSymbol} = 1 ${toSymbol}`;
  }
}