import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';

const BAR_COLOR = "#2a78d6";
const MUTED_INK = "#898781";
const GRID_COLOR = "#e1e0d9";

const formatMoney = (value) => `$${value.toLocaleString()}`;

function SpendingChart({ transactions }) {
  const totalsByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((totals, t) => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
      return totals;
    }, {});

  const data = Object.entries(totalsByCategory)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="spending-chart">
      <h2>Spending by Category</h2>
      {data.length === 0 ? (
        <p className="empty-chart">No expenses yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={data.length * 40 + 30}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 60, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke={GRID_COLOR} />
            <XAxis type="number" tickFormatter={formatMoney} tick={{ fill: MUTED_INK, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="category" width={100} tick={{ fill: MUTED_INK, fontSize: 13 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [formatMoney(value), "Spent"]} cursor={{ fill: "rgba(11,11,11,0.04)" }} />
            <Bar dataKey="total" fill={BAR_COLOR} radius={[0, 4, 4, 0]} barSize={20}>
              <LabelList dataKey="total" position="right" formatter={formatMoney} fill="#52514e" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default SpendingChart;
