import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon, FiPieChart, FiList, FiTarget } from 'react-icons/fi';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/50 p-4 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 tracking-tight">
            FinTrack
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Cambiar Tema"
          >
            {theme === 'light' ? <FiMoon size={22} /> : <FiSun size={22} />}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-4 pb-32 sm:px-6 sm:pt-6 sm:pb-32">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pb-[env(safe-area-inset-bottom)] transition-colors duration-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-none">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`
            }
          >
            <FiPieChart size={24} className="mb-1" />
            <span className="text-xs font-medium">Resumen</span>
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`
            }
          >
            <FiList size={24} className="mb-1" />
            <span className="text-xs font-medium">Transacciones</span>
          </NavLink>
          <NavLink
            to="/planning"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`
            }
          >
            <FiTarget size={24} className="mb-1" />
            <span className="text-xs font-medium">Planificación</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
