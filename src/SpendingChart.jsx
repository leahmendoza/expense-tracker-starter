import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';
import { capitalize, formatMoney } from './format';

const MUTED_INK = "#8d98ba";
const GRID_COLOR = "rgba(180, 200, 255, 0.1)";
const LABEL_INK = "#eaf0ff";

function SpendingChart({ transactions }) {
  const totalsByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((totals, t) => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
      return totals;
    }, {});

  const data = Object.entries(totalsByCategory)
    .map(([category, total]) => ({ category: capitalize(category), total }))
    .sort((a, b) => b.total - a.total);

  return (
    <section className="spending-chart">
      <h2>Where the money went</h2>
      {data.length === 0 ? (
        <p className="empty-chart">No expenses yet. Spending will show up here by category.</p>
      ) : (
        <ResponsiveContainer width="100%" height={data.length * 40 + 30}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 64, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="bar-glow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1d3fd6" />
                <stop offset="100%" stopColor="#8cc8ff" />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} stroke={GRID_COLOR} />
            <XAxis type="number" tickFormatter={formatMoney} tick={{ fill: MUTED_INK, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="category" width={104} tick={{ fill: MUTED_INK, fontSize: 14 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => [formatMoney(value), "Spent"]}
              cursor={{ fill: "rgba(140, 200, 255, 0.06)" }}
              contentStyle={{ background: "#0d1433", border: "1px solid rgba(180, 200, 255, 0.2)", borderRadius: 10, color: LABEL_INK }}
              labelStyle={{ color: MUTED_INK }}
              itemStyle={{ color: LABEL_INK }}
            />
            <Bar dataKey="total" fill="url(#bar-glow)" radius={[0, 6, 6, 0]} barSize={18} animationDuration={700} animationEasing="ease-out">
              <LabelList dataKey="total" position="right" formatter={formatMoney} fill={LABEL_INK} fontSize={13} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

export default SpendingChart;
