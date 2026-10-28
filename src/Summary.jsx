import { useAnimatedNumber } from './motion'
import { formatMoney, signedAmount } from './format'

// Running balance after each transaction, scaled into a 100×100 box.
function balanceCurve(transactions) {
  const ordered = [...transactions].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
  let running = 0;
  const points = [0, ...ordered.map(t => (running += signedAmount(t)))];
  if (points.length < 2) points.push(0);

  const min = Math.min(0, ...points);
  const max = Math.max(1, ...points);
  const line = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 92 - ((p - min) / (max - min)) * 78;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" L");
  return `M0,100 L${line} L100,100 Z`;
}

// While a number is counting, show whole dollars so cents don't flicker.
const shown = (animated, target) =>
  formatMoney(Math.abs(animated - Number(target)) < 0.005 ? Number(target) : Math.round(animated));

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const shownIncome = useAnimatedNumber(totalIncome);
  const shownExpenses = useAnimatedNumber(totalExpenses);
  const shownBalance = useAnimatedNumber(Math.abs(balance));

  const spentShare = totalIncome > 0
    ? Math.min(totalExpenses / totalIncome, 1)
    : (totalExpenses > 0 ? 1 : 0);
  const spentPercent = Math.round(spentShare * 100);

  return (
    <section className="summary" aria-label="Summary">
      <svg className="summary-glow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="glow-fill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#1d3fd6" stopOpacity="0.15" />
            <stop offset="55%" stopColor="#2f6bff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#bfe2ff" />
          </linearGradient>
        </defs>
        <path d={balanceCurve(transactions)} fill="url(#glow-fill)" />
      </svg>
      <div className="summary-flutes" aria-hidden="true" />

      <div className="summary-content">
        <p className="summary-line">
          <span className="clause"><span className="income-amount">{shown(shownIncome, totalIncome)}</span> came in.</span>{" "}
          <span className="clause">{shown(shownExpenses, totalExpenses)} went out.</span>{" "}
          <span className="clause">{shown(shownBalance, Math.abs(balance))} {balance >= 0 ? "left." : "over."}</span>
        </p>

        <div className="summary-footer">
          <p className="spent-caption">{spentPercent}% of income spent</p>
          <div className="spent-bar" aria-hidden="true">
            <div className="spent-fill" style={{ "--spent": `${spentPercent}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Summary;
