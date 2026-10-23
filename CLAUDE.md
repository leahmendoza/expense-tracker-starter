# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This is the starter project for a Claude Code course ("Expense Tracker" / "Finance Tracker"). Per the README, it **intentionally ships with a bug, poor UI, and messy code** — these are fixed incrementally throughout the course. Do not assume existing code is correct; the known defects are the point.

## Commands

```bash
npm install      # first-time setup
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # ESLint (flat config in eslint.config.js)
```

There is no test suite or test framework configured.

## Architecture

A single-page React 19 app built with Vite. The entire application lives in **`src/App.jsx`** — one `App` component holding all state via `useState`. There is no routing, no backend, no persistence (state resets on reload), and no component decomposition.

Data model: a `transactions` array seeded inline in `App.jsx`. Each transaction is `{ id, description, amount, type, category, date }` where `type` is `"income"` or `"expense"` and `category` is one of the strings in the `categories` array. Derived values (`totalIncome`, `totalExpenses`, `balance`, `filteredTransactions`) are computed on each render from that array.

## Known defects (intentional — likely targets for course exercises)

- **`amount` is stored as a string**, so the `reduce((sum, t) => sum + t.amount, 0)` calls for `totalIncome`/`totalExpenses` do **string concatenation**, not addition. The summary cards show garbage totals (e.g. `$05000`). Fixing usually means coercing with `Number(t.amount)`.
- The seeded **"Freelance Work"** entry has `type: "expense"` but `category: "salary"`, so it is miscounted as an expense.
