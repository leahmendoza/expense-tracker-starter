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

A single-page React 19 app built with Vite. There is no routing, no backend, and no persistence (state resets on reload).

**`src/App.jsx`** is the container: it owns the `transactions` state and the `categories` list, exposes `handleAdd` to append a transaction, and composes three presentational children. Each child owns the local state only it needs:

- **`src/Summary.jsx`** — receives `transactions`; computes `totalIncome`, `totalExpenses`, and `balance` internally and renders the summary cards.
- **`src/TransactionForm.jsx`** — owns the form field state (`description`, `amount`, `type`, `category`); on submit it builds a new transaction and reports it up via the `onAdd` callback, then resets its fields.
- **`src/TransactionList.jsx`** — receives `transactions` and `categories`; owns the `filterType`/`filterCategory` state and renders the filter controls plus the transactions table.

Data model: a `transactions` array seeded inline in `App.jsx`. Each transaction is `{ id, description, amount, type, category, date }` where `type` is `"income"` or `"expense"` and `category` is one of the strings in the `categories` array. Seed `amount`s are numbers.

## Known defects (intentional — likely targets for course exercises)

- **Form-entered amounts stay strings.** `TransactionForm` passes the `<input>` value through unchanged, so a transaction added via the form has a string `amount`. `Summary`'s `reduce((sum, t) => sum + t.amount, 0)` then does **string concatenation** instead of addition, breaking the totals. (Seed data was already converted to numbers; the form is the remaining gap — fix with `Number(amount)` in the form's submit.)
- The seeded **"Freelance Work"** entry has `type: "expense"` but `category: "salary"`, so it is miscounted as an expense.
