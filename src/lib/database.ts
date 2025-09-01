import { 
  UserProfile, 
  Movement, 
  SavingGoal, 
  SavingTransaction, 
  USDTQuote,
  ExchangeRates,
  Currency
} from './types';
import { STORAGE_KEYS } from './constants';

// Enhanced Database abstraction layer for TuFinanza
// Supports offline functionality with localStorage/IndexedDB fallback

class DatabaseManager {
  // Utility function to safely parse JSON with date handling
  private safeJSONParse<T>(json: string, dateFields: string[] = []): T | null {
    try {
      const data = JSON.parse(json);
      
      // Convert date strings back to Date objects
      dateFields.forEach(field => {
        if (data[field]) {
          data[field] = new Date(data[field]);
        }
      });
      
      return data;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }

  // Utility function to safely stringify JSON with error handling
  private safeJSONStringify(data: any): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error('Error stringifying JSON:', error);
      return '';
    }
  }

  // Generic get method with offline support
  private getFromStorage<T>(key: string, dateFields: string[] = []): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      return this.safeJSONParse<T>(data, dateFields);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  // Generic set method with offline support
  private setToStorage<T>(key: string, data: T): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const json = this.safeJSONStringify(data);
      localStorage.setItem(key, json);
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  }

  // User Profile methods
  getUserProfile(): UserProfile | null {
    return this.getFromStorage<UserProfile>(
      STORAGE_KEYS.USER_PROFILE, 
      ['createdAt']
    );
  }

  saveUserProfile(profile: UserProfile): boolean {
    return this.setToStorage(STORAGE_KEYS.USER_PROFILE, profile);
  }

  updateUserProfile(updates: Partial<UserProfile>): boolean {
    const current = this.getUserProfile();
    if (!current) return false;
    
    const updated = { ...current, ...updates };
    return this.saveUserProfile(updated);
  }

  deleteUserProfile(): boolean {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    return true;
  }

  // Balance display currency preference
  getBalanceDisplayCurrency(): Currency | null {
    return this.getFromStorage<Currency>(STORAGE_KEYS.BALANCE_DISPLAY_CURRENCY);
  }

  setBalanceDisplayCurrency(currency: Currency): boolean {
    return this.setToStorage(STORAGE_KEYS.BALANCE_DISPLAY_CURRENCY, currency);
  }

  // Movements methods
  getMovements(): Movement[] {
    const movements = this.getFromStorage<Movement[]>(
      STORAGE_KEYS.MOVEMENTS, 
      ['date', 'createdAt', 'updatedAt']
    );
    
    if (!movements) return [];
    
    // Ensure date fields are properly converted
    return movements.map(movement => ({
      ...movement,
      date: new Date(movement.date),
      createdAt: new Date(movement.createdAt),
      updatedAt: new Date(movement.updatedAt)
    }));
  }

  saveMovements(movements: Movement[]): boolean {
    return this.setToStorage(STORAGE_KEYS.MOVEMENTS, movements);
  }

  addMovement(movement: Movement): boolean {
    const movements = this.getMovements();
    movements.push(movement);
    return this.saveMovements(movements);
  }

  updateMovement(updatedMovement: Movement): boolean {
    const movements = this.getMovements();
    const index = movements.findIndex(m => m.id === updatedMovement.id);
    
    if (index === -1) return false;
    
    movements[index] = updatedMovement;
    return this.saveMovements(movements);
  }

  deleteMovement(movementId: string): boolean {
    const movements = this.getMovements();
    const filtered = movements.filter(m => m.id !== movementId);
    return this.saveMovements(filtered);
  }

  // Saving Goals methods
  getSavingGoals(): SavingGoal[] {
    const goals = this.getFromStorage<SavingGoal[]>(
      STORAGE_KEYS.SAVING_GOALS,
      ['deadline', 'createdAt', 'updatedAt']
    );
    
    if (!goals) return [];
    
    // Ensure date fields are properly converted
    return goals.map(goal => ({
      ...goal,
      deadline: goal.deadline ? new Date(goal.deadline) : undefined,
      createdAt: new Date(goal.createdAt),
      updatedAt: new Date(goal.updatedAt)
    }));
  }

  saveSavingGoals(goals: SavingGoal[]): boolean {
    return this.setToStorage(STORAGE_KEYS.SAVING_GOALS, goals);
  }

  addSavingGoal(goal: SavingGoal): boolean {
    const goals = this.getSavingGoals();
    goals.push(goal);
    return this.saveSavingGoals(goals);
  }

  updateSavingGoal(updatedGoal: SavingGoal): boolean {
    const goals = this.getSavingGoals();
    const index = goals.findIndex(g => g.id === updatedGoal.id);
    
    if (index === -1) return false;
    
    goals[index] = updatedGoal;
    return this.saveSavingGoals(goals);
  }

  deleteSavingGoal(goalId: string): boolean {
    const goals = this.getSavingGoals();
    const filtered = goals.filter(g => g.id !== goalId);
    return this.saveSavingGoals(filtered);
  }

  // Saving Transactions methods
  getSavingTransactions(): SavingTransaction[] {
    const transactions = this.getFromStorage<SavingTransaction[]>(
      STORAGE_KEYS.SAVING_TRANSACTIONS,
      ['date', 'createdAt']
    );
    
    if (!transactions) return [];
    
    // Ensure date fields are properly converted
    return transactions.map(transaction => ({
      ...transaction,
      date: new Date(transaction.date),
      createdAt: new Date(transaction.createdAt)
    }));
  }

  saveSavingTransactions(transactions: SavingTransaction[]): boolean {
    return this.setToStorage(STORAGE_KEYS.SAVING_TRANSACTIONS, transactions);
  }

  addSavingTransaction(transaction: SavingTransaction): boolean {
    const transactions = this.getSavingTransactions();
    transactions.push(transaction);
    return this.saveSavingTransactions(transactions);
  }

  deleteSavingTransaction(transactionId: string): boolean {
    const transactions = this.getSavingTransactions();
    const filtered = transactions.filter(t => t.id !== transactionId);
    return this.saveSavingTransactions(filtered);
  }

  // USDT Quote methods
  getUSDTQuote(): USDTQuote | null {
    return this.getFromStorage<USDTQuote>(
      STORAGE_KEYS.USDT_QUOTE,
      ['timestamp']
    );
  }

  saveUSDTQuote(quote: USDTQuote): boolean {
    return this.setToStorage(STORAGE_KEYS.USDT_QUOTE, quote);
  }

  // Exchange Rates methods (NEW)
  getExchangeRates(): ExchangeRates | null {
    return this.getFromStorage<ExchangeRates>(
      STORAGE_KEYS.EXCHANGE_RATES,
      ['timestamp']
    );
  }

  saveExchangeRates(rates: ExchangeRates): boolean {
    return this.setToStorage(STORAGE_KEYS.EXCHANGE_RATES, rates);
  }

  // Onboarding status
  getOnboardingStatus(): boolean {
    const status = this.getFromStorage<boolean>(STORAGE_KEYS.ONBOARDING);
    return status ?? false;
  }

  setOnboardingStatus(completed: boolean): boolean {
    return this.setToStorage(STORAGE_KEYS.ONBOARDING, completed);
  }

  // Complete data reset
  resetAllData(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
       Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key as string);
      });
      return true;
    } catch (error) {
      console.error('Error resetting data:', error);
      return false;
    }
  }

  // Reset only financial data (keep user profile)
  resetFinancialData(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.MOVEMENTS);
      localStorage.removeItem(STORAGE_KEYS.SAVING_GOALS);
      localStorage.removeItem(STORAGE_KEYS.SAVING_TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.USDT_QUOTE);
      localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATES);
      return true;
    } catch (error) {
      console.error('Error resetting financial data:', error);
      return false;
    }
  }

  // Get storage usage stats
  getStorageStats(): { 
    totalSize: number; 
    itemCount: number; 
    items: Record<string, number>;
    isOnline: boolean;
  } {
    if (typeof window === 'undefined') {
      return { totalSize: 0, itemCount: 0, items: {}, isOnline: false };
    }
    
    let totalSize = 0;
    let itemCount = 0;
    const items: Record<string, number> = {};
    
     Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const data = localStorage.getItem(key);
      if (data) {
        const size = new Blob([data]).size;
        items[name] = size;
        totalSize += size;
        itemCount++;
      }
    });
    
    return { 
      totalSize, 
      itemCount, 
      items, 
      isOnline: navigator.onLine 
    };
  }

  // Export data for backup
  exportData(): string {
    const data = {
      userProfile: this.getUserProfile(),
      movements: this.getMovements(),
      savingGoals: this.getSavingGoals(),
      savingTransactions: this.getSavingTransactions(),
      balanceDisplayCurrency: this.getBalanceDisplayCurrency(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.userProfile) {
        this.saveUserProfile({
          ...data.userProfile,
          createdAt: new Date(data.userProfile.createdAt)
        });
      }
      
      if (data.movements) {
        const movements = data.movements.map((m: any) => ({
          ...m,
          date: new Date(m.date),
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt)
        }));
        this.saveMovements(movements);
      }
      
      if (data.savingGoals) {
        const goals = data.savingGoals.map((g: any) => ({
          ...g,
          deadline: g.deadline ? new Date(g.deadline) : undefined,
          createdAt: new Date(g.createdAt),
          updatedAt: new Date(g.updatedAt)
        }));
        this.saveSavingGoals(goals);
      }
      
      if (data.savingTransactions) {
        const transactions = data.savingTransactions.map((t: any) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt)
        }));
        this.saveSavingTransactions(transactions);
      }
      
      if (data.balanceDisplayCurrency) {
        this.setBalanceDisplayCurrency(data.balanceDisplayCurrency);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Check if app can work offline
  canWorkOffline(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }

  // Install app as PWA
  async installPWA(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    try {
      // Check if app can be installed
      const beforeInstallPrompt = (window as any).deferredPrompt;
      if (beforeInstallPrompt) {
        beforeInstallPrompt.prompt();
        const { outcome } = await beforeInstallPrompt.userChoice;
        return outcome === 'accepted';
      }
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  }
}

// Export singleton instance
export const db = new DatabaseManager();

// Export helper functions for direct use
export const {
  getUserProfile,
  saveUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getBalanceDisplayCurrency,
  setBalanceDisplayCurrency,
  getMovements,
  saveMovements,
  addMovement,
  updateMovement,
  deleteMovement,
  getSavingGoals,
  saveSavingGoals,
  addSavingGoal,
  updateSavingGoal,
  deleteSavingGoal,
  getSavingTransactions,
  saveSavingTransactions,
  addSavingTransaction,
  deleteSavingTransaction,
  getUSDTQuote,
  saveUSDTQuote,
  getExchangeRates,
  saveExchangeRates,
  getOnboardingStatus,
  setOnboardingStatus,
  resetAllData,
  resetFinancialData,
  getStorageStats,
  exportData,
  importData,
  canWorkOffline,
  installPWA
} = db;