import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BudgetsList from '../components/planning/BudgetsList';
import SavingsGoalsList from '../components/planning/SavingsGoalsList';
import RecurringList from '../components/planning/RecurringList';

type Tab = 'budgets' | 'goals' | 'recurring';

export default function Planning() {
  const [activeTab, setActiveTab] = useState<Tab>('budgets');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'budgets', label: 'Presupuestos' },
    { id: 'goals', label: 'Metas' },
    { id: 'recurring', label: 'Recurrentes' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Planificación</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organiza y proyecta tus finanzas</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 relative py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabPlanning"
                className="absolute inset-0 bg-white dark:bg-slate-800 shadow-sm rounded-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'budgets' && <BudgetsList />}
            {activeTab === 'goals' && <SavingsGoalsList />}
            {activeTab === 'recurring' && <RecurringList />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
