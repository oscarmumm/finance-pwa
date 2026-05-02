import React, { createContext, useContext, useEffect, useState } from 'react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // YYYY-MM-DD
}

export type RecurringFrequency = 'weekly' | 'monthly';

export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  frequency: RecurringFrequency;
  nextDate: string; // YYYY-MM-DD
}

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;

  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  goals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  updateGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  addFundsToGoal: (id: string, amount: number) => void;

  recurringTransactions: RecurringTransaction[];
  addRecurring: (recurring: Omit<RecurringTransaction, 'id'>) => void;
  deleteRecurring: (id: string) => void;
  approveRecurring: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    if (saved && JSON.parse(saved).length > 0) {
      const parsed = JSON.parse(saved);
      const categoryMap: Record<string, string> = {
        'Food': 'Comida',
        'Transport': 'Transporte',
        'Utilities': 'Servicios',
        'Entertainment': 'Entretenimiento',
        'Salary': 'Salario',
        'Other': 'Otros'
      };
      
      const migrated = parsed.map((t: Transaction) => ({
        ...t,
        category: categoryMap[t.category] || t.category
      }));
      
      return migrated;
    }

    // Generar 30 transacciones de ejemplo si está vacío
    const mockData: Transaction[] = [];
    const categories = ['Comida', 'Transporte', 'Servicios', 'Entretenimiento', 'Salario', 'Otros'];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const isIncome = i % 6 === 0; // Aproximadamente 1 ingreso por cada 5 gastos
      const type: TransactionType = isIncome ? 'income' : 'expense';
      const category = isIncome ? 'Salario' : categories[Math.floor(Math.random() * 4)]; // Evitar 'Salario' y 'Otros' en gastos aleatorios comunes
      const amount = isIncome ? 1500 + Math.random() * 1000 : 10 + Math.random() * 100;
      
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Fecha aleatoria en los últimos 30 días
      
      const hours = Math.floor(Math.random() * 14) + 8; // Entre 8am y 10pm
      const minutes = Math.floor(Math.random() * 60);
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      mockData.push({
        id: crypto.randomUUID(),
        type,
        amount: Number(amount.toFixed(2)),
        category,
        date: date.toISOString().split('T')[0],
        time,
      });
    }
    
    // Ordenar de más reciente a más antigua
    return mockData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(() => {
    const saved = localStorage.getItem('recurringTransactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
  }, [recurringTransactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    setBudgets(prev => [...prev, { ...budget, id: crypto.randomUUID() }]);
  };

  const updateBudget = (id: string, updatedBudget: Partial<Budget>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updatedBudget } : b));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const addGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    setGoals(prev => [...prev, { ...goal, id: crypto.randomUUID(), currentAmount: 0 }]);
  };

  const updateGoal = (id: string, updatedGoal: Partial<SavingsGoal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updatedGoal } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addFundsToGoal = (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    updateGoal(id, { currentAmount: goal.currentAmount + amount });

    addTransaction({
      type: 'expense',
      amount,
      category: `Meta: ${goal.title}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    });
  };

  const addRecurring = (recurring: Omit<RecurringTransaction, 'id'>) => {
    setRecurringTransactions(prev => [...prev, { ...recurring, id: crypto.randomUUID() }]);
  };

  const deleteRecurring = (id: string) => {
    setRecurringTransactions(prev => prev.filter(r => r.id !== id));
  };

  const approveRecurring = (id: string) => {
    const recurring = recurringTransactions.find(r => r.id === id);
    if (!recurring) return;

    addTransaction({
      type: recurring.type,
      amount: recurring.amount,
      category: recurring.category,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    });

    const currentDate = new Date(recurring.nextDate);
    if (recurring.frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 7);
    }

    setRecurringTransactions(prev => prev.map(r => 
      r.id === id ? { ...r, nextDate: currentDate.toISOString().split('T')[0] } : r
    ));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        addFundsToGoal,
        recurringTransactions,
        addRecurring,
        deleteRecurring,
        approveRecurring,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
