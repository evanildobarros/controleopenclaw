import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 transition-colors">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        title="Modo Claro"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md transition-colors ${theme === 'system' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        title="Tema do Sistema"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        title="Modo Escuro"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
