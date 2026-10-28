import { useCallback, useState } from 'react'
import './App.css'
import Summary from './Summary'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import SpendingChart from './SpendingChart'
import Toast from './Toast'
import { formatDate, formatSigned, signedAmount } from './format'

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Salary", amount: 5000, type: "income", category: "salary", date: "2025-01-01" },
    { id: 2, description: "Rent", amount: 1200, type: "expense", category: "housing", date: "2025-01-02" },
    { id: 3, description: "Groceries", amount: 150, type: "expense", category: "food", date: "2025-01-03" },
    { id: 4, description: "Freelance Work", amount: 800, type: "expense", category: "salary", date: "2025-01-05" },
    { id: 5, description: "Electric Bill", amount: 95, type: "expense", category: "utilities", date: "2025-01-06" },
    { id: 6, description: "Dinner Out", amount: 65, type: "expense", category: "food", date: "2025-01-07" },
    { id: 7, description: "Gas", amount: 45, type: "expense", category: "transport", date: "2025-01-08" },
    { id: 8, description: "Netflix", amount: 15, type: "expense", category: "entertainment", date: "2025-01-10" },
  ]);

  const categories = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];

  const [lastAddedId, setLastAddedId] = useState(null);
  const [toast, setToast] = useState(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const handleAdd = (newTransaction) => {
    setTransactions(prev => [...prev, newTransaction]);
    setLastAddedId(newTransaction.id);
    setToast({
      id: Date.now(),
      message: `Added “${newTransaction.description}” (${formatSigned(signedAmount(newTransaction))})`,
      onUndo: () => setTransactions(prev => prev.filter(t => t.id !== newTransaction.id)),
    });
  };

  const handleDelete = (id) => {
    const index = transactions.findIndex(t => t.id === id);
    const removed = transactions[index];
    setTransactions(prev => prev.filter(t => t.id !== id));
    setToast({
      id: Date.now(),
      message: `Deleted “${removed.description}”`,
      onUndo: () => {
        setTransactions(prev => [...prev.slice(0, index), removed, ...prev.slice(index)]);
        setLastAddedId(removed.id);
      },
    });
  };

  const dates = transactions.map(t => t.date).sort();
  const period = dates.length > 0
    ? `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`
    : "No transactions yet";

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-name">Finance Tracker</h1>
        <p className="period-pill">{period}</p>
      </header>

      <Summary transactions={transactions} />
      <div className="workspace">
        <TransactionForm categories={categories} onAdd={handleAdd} />
        <SpendingChart transactions={transactions} />
      </div>
      <TransactionList transactions={transactions} categories={categories} onDelete={handleDelete} lastAddedId={lastAddedId} />

      <Toast toast={toast} onDismiss={dismissToast} />
    </main>
  );
}

export default App
