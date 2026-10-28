import { useRef, useState } from 'react'
import { capitalize, todayIso } from './format'

const DEFAULT_CATEGORY = { expense: "food", income: "salary" };

function TransactionForm({ categories, onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(DEFAULT_CATEGORY.expense);
  const [date, setDate] = useState(todayIso);
  const [errors, setErrors] = useState({});
  const amountRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleTypeChange = (nextType) => {
    setType(nextType);
    if (category === DEFAULT_CATEGORY[type]) setCategory(DEFAULT_CATEGORY[nextType]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!amount || Number(amount) <= 0) nextErrors.amount = "Enter an amount greater than 0.";
    if (!description.trim()) nextErrors.description = "Enter a description, like “Groceries”.";
    setErrors(nextErrors);
    if (nextErrors.amount) return amountRef.current.focus();
    if (nextErrors.description) return descriptionRef.current.focus();

    onAdd({
      id: Date.now(),
      description: description.trim(),
      amount,
      type,
      category,
      date: date || todayIso(),
    });

    // Keep type, category and date so several entries in a row are quick.
    setDescription("");
    setAmount("");
    amountRef.current.focus();
  };

  return (
    <section className="add-transaction">
      <h2>Add a transaction</h2>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="type-field">
          <legend className="visually-hidden">Type</legend>
          <div className="segmented type-toggle" data-value={type}>
            {["expense", "income"].map(option => (
              <label key={option}>
                <input
                  type="radio"
                  name="type"
                  value={option}
                  checked={type === option}
                  onChange={(e) => handleTypeChange(e.target.value)}
                />
                <span>{capitalize(option)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="field field-amount">
          <span className="field-label">Amount</span>
          <span className="amount-input">
            <span className="amount-prefix" aria-hidden="true">$</span>
            <input
              ref={amountRef}
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? "amount-error" : undefined}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: undefined });
              }}
            />
          </span>
          {errors.amount && <span id="amount-error" className="field-error">{errors.amount}</span>}
        </label>

        <label className="field">
          <span className="field-label">Description</span>
          <input
            ref={descriptionRef}
            type="text"
            placeholder={type === "income" ? "e.g. Paycheck" : "e.g. Groceries"}
            value={description}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({ ...errors, description: undefined });
            }}
          />
          {errors.description && <span id="description-error" className="field-error">{errors.description}</span>}
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{capitalize(cat)}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <button type="submit" className="primary-btn">
          Add {type}
        </button>
      </form>
    </section>
  );
}

export default TransactionForm;
