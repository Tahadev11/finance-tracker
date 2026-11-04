import { useState } from 'react';
import api from './api';
import { useTheme } from './ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('postman@example.com'); 
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useTheme(); // <-- Access theme

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      
      {/* Theme Toggle Button (Top Right) */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-sm border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
        title="Toggle Theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Glassmorphism Login Card */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-md transition-colors duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
            FinTrack
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Sign in to manage your finances
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm font-medium text-center border border-red-100 dark:border-red-800/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-4"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}