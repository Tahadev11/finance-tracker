import { useState, useEffect } from 'react';
import api from './api';
import { CSVLink } from 'react-csv';

export default function ReportsPage() {
  const [transactions, setTransactions] = useState([]);
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());

  useEffect(() => {
    api.get('/transactions').then(res => setTransactions(res.data)).catch(console.error);
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return (d.getMonth() + 1) === Number(reportMonth) && d.getFullYear() === Number(reportYear);
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const exportToPDF = () => {
    if (filteredTransactions.length === 0) return alert("No transactions for this month.");
    
    import('jspdf').then(({ jsPDF }) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Financial Report`, 14, 22);
        doc.setFontSize(12);
        doc.text(`Period: ${new Date(0, reportMonth - 1).toLocaleString('default', { month: 'long' })} ${reportYear}`, 14, 32);
        
        doc.setTextColor(0, 128, 0);
        doc.text(`Total Income: Rs. ${totalIncome.toLocaleString()}`, 14, 42);
        doc.setTextColor(255, 0, 0);
        doc.text(`Total Expenses: Rs. ${totalExpenses.toLocaleString()}`, 14, 50);
        doc.setTextColor(0, 0, 0);
        doc.text(`Net Balance: Rs. ${netBalance.toLocaleString()}`, 14, 58);
        
        const tableData = filteredTransactions.map(t => [
          new Date(t.date).toLocaleDateString(),
          t.category,
          t.type.toUpperCase(),
          `Rs. ${t.amount.toLocaleString()}`,
          t.description || '-'
        ]);

        autoTable.default(doc, {
          startY: 68,
          head: [['Date', 'Category', 'Type', 'Amount', 'Description']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229] },
        });

        doc.save(`Report-${reportMonth}-${reportYear}.pdf`);
      });
    });
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50 max-w-3xl">
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Generate Monthly Report</h3>
      
      <div className="flex flex-wrap gap-6 items-end mb-8">
        
        {/* Month Select */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Month
          </label>
          <select 
            value={reportMonth} 
            onChange={(e) => setReportMonth(e.target.value)} 
            className="bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-40"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {/* Year Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Year
          </label>
          <input 
            type="number" 
            value={reportYear} 
            onChange={(e) => setReportYear(e.target.value)} 
            className="bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-2.5 rounded-xl w-28 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-3">
          <CSVLink
            data={filteredTransactions.map(t => ({
              Date: new Date(t.date).toLocaleDateString(),
              Category: t.category,
              Type: t.type,
              Amount: t.amount,
              Description: t.description || ''
            }))}
            filename={`report-${reportMonth}-${reportYear}.csv`}
            className={`px-5 py-2.5 rounded-xl text-white font-bold transition-all ${filteredTransactions.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30'}`}
          >
            Export CSV
          </CSVLink>

          <button 
            onClick={exportToPDF}
            className={`px-5 py-2.5 rounded-xl text-white font-bold transition-all ${filteredTransactions.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/30'}`}
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
          Found <span className="font-bold">{filteredTransactions.length}</span> transactions for {new Date(reportYear, reportMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}.
        </p>
      </div>
    </div>
  );
}