import { useEffect, useState, useCallback } from 'react';
import api from './api';
import TransactionForm from './TransactionForm';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard({ user }) {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, currentBalance: 0 });
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, categoriesRes, trendsRes, transactionsRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/categories'),
        api.get('/dashboard/trends'),
        api.get('/transactions'),
      ]);

      setSummary(summaryRes.data);
      setCategories(categoriesRes.data);
      setTransactions(transactionsRes.data);

      const formattedTrends = trendsRes.data.reduce((acc, curr) => {
        const monthYear = `${curr._id.month}/${curr._id.year}`;
        let existing = acc.find(item => item.name === monthYear);
        if (!existing) {
          existing = { name: monthYear, income: 0, expense: 0 };
          acc.push(existing);
        }
        if (curr._id.type === 'income') existing.income = curr.total;
        if (curr._id.type === 'expense') existing.expense = curr.total;
        return acc;
      }, []);

      setTrends(formattedTrends);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="p-8 text-center text-xl font-medium text-gray-600 dark:text-gray-400">Loading dashboard...</div>;

  return (
    <div className="space-y-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income Card - Glows Green in Light Mode */}
          <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white dark:border-gray-700/50 shadow-[0_8px_30px_rgb(16,185,129,0.15)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(16,185,129,0.3)] transition-all duration-300">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Income</h3>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
              Rs. {summary.totalIncome.toLocaleString()}
            </p>
          </div>

          {/* Expense Card - Glows Red/Pink in Light Mode */}
          <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white dark:border-gray-700/50 shadow-[0_8px_30px_rgb(244,63,94,0.15)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(244,63,94,0.3)] transition-all duration-300">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Expenses</h3>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-400 dark:to-pink-400">
              Rs. {summary.totalExpenses.toLocaleString()}
            </p>
          </div>

          {/* Balance Card - Glows Blue/Purple in Light Mode */}
          <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white dark:border-gray-700/50 shadow-[0_8px_30px_rgb(99,102,241,0.15)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(99,102,241,0.3)] transition-all duration-300">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Current Balance</h3>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Rs. {summary.currentBalance.toLocaleString()}
            </p>
          </div>
        </div>

      {/* Add Transaction Form */}
      <TransactionForm onTransactionAdded={fetchData} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Expenses by Category</h3>
          {categories.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No expenses recorded yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categories} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Income vs Expenses</h3>
          {trends.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No trend data recorded yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="income" fill="#00C49F" name="Income" />
                <Bar dataKey="expense" fill="#FF8042" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}