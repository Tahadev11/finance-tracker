import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';
import { useTheme } from './ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create the user
      const response = await api.post('/auth/register', { name, email, password });
      
      // Automatically log them in after registering
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Email might be in use.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-sm border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Glassmorphism Register Card */}
      <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl border border-white dark:border-gray-700/50 w-full max-w-md transition-colors duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Start managing your finances today
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm font-medium text-center border border-red-100 dark:border-red-800/50">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-4"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}