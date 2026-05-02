import { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import type { RecurringFrequency, TransactionType } from '../../contexts/FinanceContext';
import { FiPlus, FiTrash2, FiCalendar, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function RecurringList() {
  const { recurringTransactions, addRecurring, deleteRecurring, approveRecurring } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<TransactionType>('expense');
  const [newCategory, setNewCategory] = useState('Servicios');
  const [newFrequency, setNewFrequency] = useState<RecurringFrequency>('monthly');
  const [newNextDate, setNewNextDate] = useState('');

  const categories = ['Comida', 'Transporte', 'Servicios', 'Entretenimiento', 'Salario', 'Otros'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount || isNaN(Number(newAmount)) || !newNextDate) return;

    addRecurring({
      title: newTitle,
      amount: Number(newAmount),
      type: newType,
      category: newCategory,
      frequency: newFrequency,
      nextDate: newNextDate,
    });
    
    setNewTitle('');
    setNewAmount('');
    setNewNextDate('');
    setIsAdding(false);
  };

  const isOverdue = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  return (
    <div className="space-y-4">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pagos Recurrentes</h3>
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
          className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-3 mb-4 overflow-hidden"
        >
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Descripción</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
              placeholder="Ej. Netflix"
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Monto ($)</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
                placeholder="Ej. 15"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tipo</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as TransactionType)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Frecuencia</label>
              <select
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value as RecurringFrequency)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
              >
                <option value="monthly">Mensual</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Próxima Fecha</label>
            <input
              type="date"
              value={newNextDate}
              onChange={(e) => setNewNextDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white"
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
      {recurringTransactions.length === 0 && !isAdding ? (
        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed">
          <p className="text-slate-500 dark:text-slate-400 mb-2">No tienes pagos recurrentes configurados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Sort by next date */}
          {[...recurringTransactions]
            .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
            .map(recurring => {
              const overdue = isOverdue(recurring.nextDate);
              const dueToday = isToday(recurring.nextDate);
              
              let dateColor = 'text-slate-500 dark:text-slate-400';
              if (overdue) dateColor = 'text-red-500 font-medium';
              else if (dueToday) dateColor = 'text-yellow-600 dark:text-yellow-500 font-medium';

              return (
                <div key={recurring.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${recurring.type === 'income' ? 'bg-green-50 dark:bg-green-900/30 text-green-600' : 'bg-red-50 dark:bg-red-900/30 text-red-600'}`}>
                      <FiCalendar size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white leading-tight">{recurring.title}</h4>
                      <div className="text-xs mt-1 flex items-center gap-2">
                        <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                          {recurring.frequency === 'monthly' ? 'Mensual' : 'Semanal'}
                        </span>
                        <span className={dateColor}>
                          {overdue ? 'Vencido: ' : dueToday ? 'Hoy: ' : 'Próximo: '} 
                          {new Date(recurring.nextDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-bold ${recurring.type === 'income' ? 'text-green-500' : 'text-slate-800 dark:text-white'}`}>
                        {recurring.type === 'income' ? '+' : '-'}${recurring.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => approveRecurring(recurring.id)} 
                        className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
                        title="Registrar pago"
                      >
                        <FiCheck size={16} />
                      </button>
                      <button 
                        onClick={() => deleteRecurring(recurring.id)} 
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
}
