import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register'; // <-- Import Register
import Layout from './Layout';
import Dashboard from './Dashboard';
import TransactionsPage from './TransactionsPage';
import BudgetsPage from './Budget';
import GoalsPage from './GoalsPage';
import ReportsPage from './ReportsPage';
import AdminPanel from './AdminPanel';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // If user is NOT logged in, show Login or Register pages
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onLogin={setUser} />} />
        {/* If they go to any other URL, redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If user IS logged in, show the main app layout
  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/admin" element={user.isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
        {/* If they try to go to /login while logged in, send to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}