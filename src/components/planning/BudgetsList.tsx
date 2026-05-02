import { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function BudgetsList() {
  const { budgets, addBudget, deleteBudget, transactions } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('Comida');
  const [newLimit, setNewLimit] = useState('');

  const categories = ['Comida', 'Transporte', 'Servicios', 'Entretenimiento', 'Salario', 'Otros'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLimit || isNaN(Number(newLimit))) return;

    addBudget({ category: newCategory, limit: Number(newLimit) });
    setNewLimit('');
    setIsAdding(false);
  };

  // Calculate spent amount for the current month
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const spentByCategory = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Mis Presupuestos</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleAdd}
          className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-3 mb-4"
        >
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Límite Mensual ($)</label>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
              placeholder="Ej. 500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
            >
              Guardar
            </button>
          </div>
        </motion.form>
      )}

      {/* List */}
      {budgets.length === 0 && !isAdding ? (
        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed">
          <p className="text-slate-500 dark:text-slate-400 mb-2">No tienes presupuestos configurados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.map(budget => {
            const spent = spentByCategory[budget.category] || 0;
            const percentage = Math.min(100, (spent / budget.limit) * 100);
            
            let colorClass = 'bg-green-500';
            if (percentage > 90) colorClass = 'bg-red-500';
            else if (percentage > 75) colorClass = 'bg-yellow-500';

            return (
              <div key={budget.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">{budget.category}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ${spent.toFixed(2)} de ${budget.limit.toFixed(2)}
                    </p>
                  </div>
                  <button onClick={() => deleteBudget(budget.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
                  <motion.div
                    className={`h-full ${colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                
                {percentage >= 100 && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <FiAlertCircle size={12} /> Límite excedido
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
