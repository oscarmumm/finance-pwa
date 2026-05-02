import { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { FiPlus, FiTrash2, FiTarget, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function SavingsGoalsList() {
  const { goals, addGoal, deleteGoal, addFundsToGoal } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const [addingFundsId, setAddingFundsId] = useState<string | null>(null);
  const [fundsAmount, setFundsAmount] = useState('');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget || isNaN(Number(newTarget))) return;

    addGoal({
      title: newTitle,
      targetAmount: Number(newTarget),
      deadline: newDeadline || undefined,
    });
    
    setNewTitle('');
    setNewTarget('');
    setNewDeadline('');
    setIsAdding(false);
  };

  const handleAddFunds = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!fundsAmount || isNaN(Number(fundsAmount))) return;

    addFundsToGoal(id, Number(fundsAmount));
    setFundsAmount('');
    setAddingFundsId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Metas de Ahorro</h3>
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
          onSubmit={handleAddGoal}
          className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-3 mb-4 overflow-hidden"
        >
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Título de la Meta</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
              placeholder="Ej. Vacaciones"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Monto Objetivo ($)</label>
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
              placeholder="Ej. 1000"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Fecha Límite (Opcional)</label>
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
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
              Crear Meta
            </button>
          </div>
        </motion.form>
      )}

      {/* List */}
      {goals.length === 0 && !isAdding ? (
        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed">
          <p className="text-slate-500 dark:text-slate-400 mb-2">No tienes metas configuradas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);

            return (
              <div key={goal.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                      <FiTarget size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">{goal.title}</h4>
                      {goal.deadline && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Límite: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
                
                <div className="mt-4 flex justify-between items-end text-sm">
                  <span className="font-medium text-slate-800 dark:text-white">${goal.currentAmount.toFixed(2)}</span>
                  <span className="text-slate-500 dark:text-slate-400">de ${goal.targetAmount.toFixed(2)}</span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1 mb-4">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>

                {/* Add Funds Button / Form */}
                {addingFundsId === goal.id ? (
                  <form onSubmit={(e) => handleAddFunds(e, goal.id)} className="flex gap-2">
                    <div className="relative flex-1">
                      <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        value={fundsAmount}
                        onChange={(e) => setFundsAmount(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-800 dark:text-white"
                        placeholder="Monto a aportar"
                        autoFocus
                        required
                      />
                    </div>
                    <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                      Aportar
                    </button>
                    <button type="button" onClick={() => setAddingFundsId(null)} className="px-2 text-slate-400 hover:text-slate-600">
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setAddingFundsId(goal.id)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors flex justify-center items-center gap-2"
                  >
                    <FiPlus size={16} /> Aportar fondos
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
