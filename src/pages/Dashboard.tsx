import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiEye, FiEyeOff, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

type TimeFilter = 'month' | 'current_week' | 'prev_week' | 'yesterday';

export default function Dashboard() {
  const { transactions, balance, totalIncome, totalExpense, budgets, recurringTransactions } = useFinance();
  const [isSensitiveHidden, setIsSensitiveHidden] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

  const formatAmount = (amount: number) => {
    return isSensitiveHidden ? '****' : `$${amount.toFixed(2)}`;
  };

  const isDateInRange = (dateStr: string, filter: TimeFilter) => {
    // Todo el tiempo removido

    const [year, month, day] = dateStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return date.getTime() === yesterday.getTime();
    }

    if (filter === 'month') {
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

    if (filter === 'current_week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return date >= startOfWeek && date <= endOfWeek;
    }

    if (filter === 'prev_week') {
      const startOfPrevWeek = new Date(today);
      startOfPrevWeek.setDate(today.getDate() - today.getDay() - 7);
      const endOfPrevWeek = new Date(startOfPrevWeek);
      endOfPrevWeek.setDate(startOfPrevWeek.getDate() + 6);
      return date >= startOfPrevWeek && date <= endOfPrevWeek;
    }

    return true;
  };

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense' && isDateInRange(t.date, timeFilter))
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key],
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  // Calculate planning summaries
  const currentMonth = new Date().toISOString().substring(0, 7);
  const exceededBudgets = budgets.filter(b => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === b.category && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);
    return spent >= b.limit;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingRecurring = [...recurringTransactions]
    .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
    .find(r => r.nextDate >= todayStr || r.nextDate < todayStr); // Find any due or upcoming

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resumen</h2>
        <button
          onClick={() => setIsSensitiveHidden(!isSensitiveHidden)}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700"
          aria-label={isSensitiveHidden ? "Mostrar montos" : "Ocultar montos"}
          title={isSensitiveHidden ? "Mostrar montos" : "Ocultar montos"}
        >
          {isSensitiveHidden ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden sm:col-span-3 lg:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <FiDollarSign size={80} />
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1 relative z-10">Balance Total</p>
          <h3 className="text-4xl font-bold tracking-tight relative z-10">{formatAmount(balance)}</h3>
        </div>

        {/* Income Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Ingresos</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatAmount(totalIncome)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <FiTrendingUp size={24} />
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Gastos</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatAmount(totalExpense)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <FiTrendingDown size={24} />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h3 className="text-lg font-bold">Gastos por Categoría</h3>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-300"
          >
            {/* Todo el tiempo eliminado */}
            <option value="month">Mes actual</option>
            <option value="current_week">Semana actual</option>
            <option value="prev_week">Semana anterior</option>
            <option value="yesterday">Ayer</option>
          </select>
        </div>
        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  label={({ value }) => isSensitiveHidden ? '****' : `$${value.toFixed(2)}`}
                  labelLine={false}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value?: number) =>
                    isSensitiveHidden
                      ? '****'
                      : value !== undefined
                        ? `$${value.toFixed(2)}`
                        : ''
                  }
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <p>Aún no hay gastos registrados.</p>
          </div>
        )}
      </div>

      {/* Planning Summary Section */}
      {(exceededBudgets.length > 0 || upcomingRecurring) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exceededBudgets.length > 0 && (
            <Link to="/planning" className="block bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-0.5"><FiAlertCircle size={20} /></div>
                <div>
                  <h4 className="font-semibold text-red-700 dark:text-red-400">Presupuestos excedidos</h4>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                    {exceededBudgets.length} {exceededBudgets.length === 1 ? 'categoría superó su límite' : 'categorías superaron su límite'}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {upcomingRecurring && (
            <Link to="/planning" className="block bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 mt-0.5"><FiCalendar size={20} /></div>
                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400">Próximo pago recurrente</h4>
                  <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
                    {upcomingRecurring.title} - {new Date(upcomingRecurring.nextDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}
