import { useState } from 'react'
import { prefersReducedMotion } from './motion'
import { capitalize, formatDate, formatMonth, formatSigned, signedAmount } from './format'

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.7 9.5h6.6L12 4M6.75 6.5v4.5M9.25 6.5v4.5" />
    </svg>
  );
}

function TransactionList({ transactions, categories, onDelete, lastAddedId }) {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [removingId, setRemovingId] = useState(null);

  // Let the row slide out before it leaves the list.
  const handleDelete = (id) => {
    if (prefersReducedMotion()) onDelete(id);
    else setRemovingId(id);
  };

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }

  // Newest first, grouped by month.
  const months = [];
  [...filteredTransactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .forEach(t => {
      const key = t.date.slice(0, 7);
      if (months.at(-1)?.key !== key) months.push({ key, items: [], net: 0 });
      months.at(-1).items.push(t);
      months.at(-1).net += signedAmount(t);
    });

  const isFiltered = filterType !== "all" || filterCategory !== "all";
  const count = filteredTransactions.length;

  return (
    <section className="transactions" aria-labelledby="transactions-heading">
      <div className="transactions-header">
        <h2 id="transactions-heading">
          Transactions <span className="count">{count}</span>
        </h2>
        <div className="filters">
          <div className="segmented filter-toggle" role="radiogroup" aria-label="Filter by type" data-value={filterType}>
            {TYPE_FILTERS.map(option => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="filter-type"
                  value={option.value}
                  checked={filterType === option.value}
                  onChange={(e) => setFilterType(e.target.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <select aria-label="Filter by category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{capitalize(cat)}</option>
            ))}
          </select>
        </div>
      </div>

      {count === 0 ? (
        <div className="empty-list">
          {isFiltered ? (
            <>
              <p>No transactions match these filters.</p>
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  setFilterType("all");
                  setFilterCategory("all");
                }}
              >
                Clear filters
              </button>
            </>
          ) : (
            <p>No transactions yet. Add your first one above.</p>
          )}
        </div>
      ) : (
        months.map(month => (
          <div key={month.key} className="month">
            <h3 className="month-heading">
              <span>{formatMonth(month.key)}</span>
              <span className="month-net">{formatSigned(month.net)}</span>
            </h3>
            <ul className="rows">
              {month.items.map(t => (
                <li
                  key={t.id}
                  className={`row${t.id === removingId ? " row-removing" : t.id === lastAddedId ? " row-added" : ""}`}
                  onAnimationEnd={(e) => {
                    if (e.target === e.currentTarget && t.id === removingId) onDelete(t.id);
                  }}
                >
                  <div className="row-main">
                    <span className="row-description">{t.description}</span>
                    <span className="row-meta">
                      <span>{capitalize(t.category)}</span>
                      <time dateTime={t.date}>{formatDate(t.date, { month: "short", day: "numeric" })}</time>
                    </span>
                  </div>
                  <span className={`row-amount ${t.type === "income" ? "income-amount" : "expense-amount"}`}>
                    {formatSigned(signedAmount(t))}
                  </span>
                  <button
                    type="button"
                    className="delete-btn"
                    aria-label={`Delete ${t.description}`}
                    onClick={() => handleDelete(t.id)}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}

export default TransactionList;
