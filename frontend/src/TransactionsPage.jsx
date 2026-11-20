import { useState, useEffect, useCallback } from 'react';
import api from './api';
import TransactionForm from './TransactionForm';
import { Trash2, Pencil } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // transaction being edited

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      if (editing?._id === id) setEditing(null);
      fetchTransactions();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  return (
    <div className="space-y-8">
      <TransactionForm
        onTransactionAdded={fetchTransactions}
        editingTransaction={editing}
        onCancelEdit={() => setEditing(null)}
      />

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
                <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} Rs. {t.amount.toLocaleString()}
                </p>
                <button
                  onClick={() => setEditing(t)}
                  className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 p-2 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-gray-500">No transactions yet.</p>}
        </div>
      </div>
    </div>
  );
}