import { useState, useEffect } from 'react';
import api from './api';

const CATEGORIES = {
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Other'],
  income:  ['Salary', 'Bonus', 'Other'],
};

const EMPTY_FORM = {
  type: 'expense',
  amount: '',
  category: 'Food',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'card',
  description: '',
};

export default function TransactionForm({
  onTransactionAdded,
  editingTransaction,   // ✅ new prop
  onCancelEdit,         // ✅ new prop
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When edit target changes, prefill form
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
        paymentMethod: editingTransaction.paymentMethod,
        description: editingTransaction.description || '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [editingTransaction]);

  const handleTypeChange = (newType) => {
    const validCats = CATEGORIES[newType];
    setFormData({
      ...formData,
      type: newType,
      category: validCats.includes(formData.category) ? formData.category : validCats[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, amount: Number(formData.amount) };
      if (editingTransaction) {
        await api.patch(`/transactions/${editingTransaction._id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      setFormData(EMPTY_FORM);
      onTransactionAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to save transaction');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white dark:border-gray-700/50 shadow mb-8">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Type</label>
          <select value={formData.type} onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Amount (Rs.)</label>
          <input type="number" required min="0" step="0" value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Category</label>
          <select value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl">
            {CATEGORIES[formData.type].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Date</label>
          <input type="date" required value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Description (Optional)</label>
          <input type="text" value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl" />
        </div>

        <div className="md:col-span-2 mt-2 flex gap-3">
          <button type="submit" disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50">
            {isSubmitting ? 'Saving...' : editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </button>
          {editingTransaction && (
            <button type="button" onClick={onCancelEdit}
              className="px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}