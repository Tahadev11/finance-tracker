import { useState } from 'react';
import api from './api';

export default function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'card',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/transactions', {
        ...formData,
        amount: Number(formData.amount),
      });
      setFormData({ ...formData, amount: '', description: '' });
      onTransactionAdded();
    } catch (error) {
      console.error("Error adding transaction", error);
      alert("Failed to add transaction");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none mb-8 transition-all duration-300">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add New Transaction</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Amount (Rs.)</label>
          <input
            type="number"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
            placeholder="e.g. 1500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Salary">Salary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Description (Optional)</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
            placeholder="e.g. Lunch with team"
          />
        </div>

        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}