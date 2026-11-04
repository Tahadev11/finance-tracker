import { useState, useEffect, useCallback } from 'react';
import api from './api';
import TransactionForm from './TransactionForm';
import { Trash2 } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center text-xl text-gray-600 dark:text-gray-400">Loading...</div>;

  return (
    <div className="space-y-8">
      <TransactionForm onTransactionAdded={fetchTransactions} />
      
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">All Transactions</h3>
        </div>
        <div className="p-6 space-y-3">
          {transactions.map((t) => (
            <div key={t._id} className="flex justify-between items-center border-b border-gray-200/50 dark:border-gray-700/50 pb-3 last:border-0">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{t.category}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(t.date).toLocaleDateString()} • {t.description || 'No description'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className={`font-bold ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'} Rs. {t.amount.toLocaleString()}
                </p>
                <button 
                  onClick={() => handleDelete(t._id)}
                  className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 p-2 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>}
        </div>
      </div>
    </div>
  );
}