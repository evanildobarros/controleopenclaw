import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex bg-gray-100 dark:bg-bg-dark rounded-xl p-1 border border-gray-200 dark:border-white/10 transition-colors">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center w-8 h-8 ${theme === 'light' ? 'bg-white dark:bg-surface-base shadow-md text-emerald-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        title="Modo Claro"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center w-8 h-8 ${theme === 'system' ? 'bg-white dark:bg-surface-base shadow-md text-emerald-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        title="Tema do Sistema"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center w-8 h-8 ${theme === 'dark' ? 'bg-surface-elevated shadow-md text-emerald-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        title="Modo Escuro"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
