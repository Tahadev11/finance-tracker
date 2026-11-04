import { useState, useEffect, useCallback } from 'react';
import api from './api';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: 'Food',
    monthlyLimit: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const fetchBudgets = useCallback(async () => {
    try {
      const response = await api.get(`/budgets?month=${formData.month}&year=${formData.year}`);
      setBudgets(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching budgets", error);
      setLoading(false);
    }
  }, [formData.month, formData.year]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', {
        ...formData,
        monthlyLimit: Number(formData.monthlyLimit),
      });
      setFormData({ ...formData, monthlyLimit: '' });
      fetchBudgets();
    } catch (error) {
      console.error("Error saving budget", error);
    }
  };

  if (loading) return <div className="text-center p-4 text-gray-600 dark:text-gray-400">Loading budgets...</div>;

  return (
    <div className="space-y-6">
      
      {/* Form to add a budget */}
      <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Monthly Limit (Rs.)</label>
            <input
              type="number"
              required
              value={formData.monthlyLimit}
              onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl w-40 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              placeholder="e.g. 10000"
            />
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all">
            Set Budget
          </button>
        </div>
      </form>

      {/* Budget Progress Bars */}
      <div className="space-y-4 mt-6">
        {budgets.length === 0 && <p className="text-gray-500 dark:text-gray-400">No budgets set for this month yet.</p>}
        
        {budgets.map((budget) => {
          let barColor = 'bg-gradient-to-r from-green-400 to-emerald-500';
          let textColor = 'text-green-600 dark:text-green-400';
          if (budget.percentage >= 80 && budget.percentage < 100) {
            barColor = 'bg-gradient-to-r from-yellow-400 to-orange-500';
            textColor = 'text-yellow-600 dark:text-yellow-400';
          } else if (budget.percentage >= 100) {
            barColor = 'bg-gradient-to-r from-red-500 to-pink-600';
            textColor = 'text-red-600 dark:text-red-400';
          }

          return (
            <div key={budget._id} className="bg-white/90 dark:bg-gray-800/40 p-5 rounded-2xl border border-white dark:border-gray-700/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none transition-colors">
              <div className="flex justify-between mb-3">
                <span className="font-bold text-gray-900 dark:text-gray-200">{budget.category}</span>
                <span className={`text-sm font-bold ${textColor}`}>
                  Rs. {budget.spent.toLocaleString()} / {budget.monthlyLimit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs font-semibold">
                <span className="text-gray-500 dark:text-gray-400">{budget.percentage}% used</span>
                {budget.percentage >= 100 ? (
                  <span className="text-red-500 dark:text-red-400 font-bold">Over budget by Rs. {(budget.spent - budget.monthlyLimit).toLocaleString()}</span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Rs. {budget.remaining.toLocaleString()} remaining</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}