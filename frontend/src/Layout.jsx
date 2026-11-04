import { useTheme } from './ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, PiggyBank, Target, FileText, ShieldAlert, LogOut, Sun, Moon } from 'lucide-react';

export default function Layout({ user, onLogout, children }) {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Wallet },
    { name: 'Budgets', path: '/budgets', icon: PiggyBank },
    { name: 'Savings Goals', path: '/goals', icon: Target },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  if (user.isAdmin) {
    menuItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldAlert });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
     <aside className="w-64 bg-white/60 dark:bg-gray-900/70 backdrop-blur-2xl border-r border-white dark:border-gray-700/50 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-lg transition-colors duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            FinTrack
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/30' 
                    : 'text-gray-600 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-gray-800/50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 mt-2 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
      <header className="bg-white/60 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-white dark:border-gray-700/50 px-8 py-4 flex justify-between items-center z-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-sm transition-colors duration-300">
          <h2 className="text-xl font-bold capitalize text-gray-800 dark:text-white">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.replace('/', '')}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{user.name}</span>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}