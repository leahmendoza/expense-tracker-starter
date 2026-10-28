export const formatMoney = (value) => {
  const n = Number(value);
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });
};

export const formatSigned = (value) =>
  `${Number(value) < 0 ? "−" : "+"}${formatMoney(Math.abs(Number(value)))}`;

const toDate = (isoDate) => new Date(`${isoDate}T00:00`);

export const formatDate = (isoDate, options = { month: "short", day: "numeric", year: "numeric" }) =>
  toDate(isoDate).toLocaleDateString("en-US", options);

export const formatMonth = (yearMonth) =>
  toDate(`${yearMonth}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" });

export const todayIso = () => new Date().toLocaleDateString("en-CA");

export const capitalize = (text) => text[0].toUpperCase() + text.slice(1);

export const signedAmount = (t) => (t.type === "income" ? 1 : -1) * Number(t.amount);
