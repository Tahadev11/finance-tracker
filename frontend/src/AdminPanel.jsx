import { useState, useEffect } from 'react';
import api from './api';
import { Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      // ✅ Hide admins from the management list
      setUsers(usersRes.data.filter((u) => !u.isAdmin));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure? This will delete the user and ALL their transactions.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xl text-gray-600 dark:text-gray-400">Loading Admin Data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{stats?.totalUsers}</p>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Transactions</h3>
          <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{stats?.totalTransactions}</p>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Global Income</h3>
          <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">
            Rs. {(stats?.globalIncome ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Global Expenses</h3>
          <p className="text-3xl font-extrabold text-red-600 dark:text-red-400">
            Rs. {(stats?.globalExpense ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Registered Users ({users.length})
          </h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-white/40 dark:hover:bg-gray-700/50 transition-colors">
                <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">{u.name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    User
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No regular users to manage.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}