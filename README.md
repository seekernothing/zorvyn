# Zorvyn — Finance Dashboard

so basically this is a personal finance dashboard i built for the Frontend Dev Intern assignment. i went a little overboard with the design ngl — wanted it to feel premium, like those apple-ish dashboards you see on dribbble. its fully functional tho, role-based UI and everything works.

---

## how to run it

you need node 18+ and pnpm installed.

```bash
git clone <your-repo-url>
cd zorvyn
pnpm install
pnpm dev
```

it'll open on [http://localhost:3000](http://localhost:3000)

if you wanna build production:
```bash
pnpm build
pnpm start
```

---

## tech i used

- **Next.js 16** (app router) — felt like the right pick, SSR + file routing just makes life easier
- **TypeScript** — honestly cant go back to plain JS after this
- **Tailwind v4** — love the utility-first approach, defined all my theme tokens in CSS
- **shadcn/ui** — saved me so much time with accessible components
- **Redux Toolkit** — went with RTK for state management, the slice pattern keeps things clean
- **Recharts** — for all the charts, pretty composable and works well with react
- **Framer Motion** — animations, page transitions, the spring counter thing. love this library
- **next-themes** — dark/light mode toggle, detects system preference too

---

## folder structure (rough overview)

```
zorvyn/
├── app/
│   ├── layout.tsx          # root layout, providers, fonts etc
│   ├── page.tsx            # main dashboard page
│   └── globals.css         # theme tokens, color system
│
├── components/
│   ├── dashboard/
│   │   ├── top-nav.tsx             # navbar with tabs, role switcher, theme toggle
│   │   ├── summary-cards.tsx       # those 4 stat cards at the top
│   │   ├── animated-number.tsx     # spring counter component (reusable)
│   │   ├── statistics-chart.tsx    # the big area chart (income vs expenses)
│   │   ├── expense-breakdown.tsx   # donut chart + category legend
│   │   ├── insights-section.tsx    # insight cards with that hover glow effect
│   │   ├── transactions-table.tsx  # full table — search, filter, sort, export, everything
│   │   └── add-transaction-modal.tsx # admin-only modal for adding transactions
│   │
│   ├── providers/
│   │   ├── theme-provider.tsx
│   │   └── redux-provider.tsx      # also handles localStorage hydration
│   └── ui/                         # shadcn base stuff
│
└── lib/
    ├── store/
    │   ├── store.ts
    │   ├── transactionsSlice.ts    # all the transaction logic + selectors
    │   ├── uiSlice.ts              # role & active tab state
    │   ├── hooks.ts                # typed hooks
    │   └── types.ts
    ├── data/
    │   └── mock.ts                 # 138 mock transactions, 12 months worth
    ├── export.ts                   # CSV/JSON export
    └── motion.ts                   # shared easing constants
```

---

## features

### dashboard overview
- 4 summary cards at top — balance, income, expenses, savings. each shows % change vs last month (green/red indicators)
- numbers animate on mount with spring physics which looks pretty cool imo
- 12-month area chart showing income vs expenses side by side
- donut chart for expense categories with animated progress bars

### transactions
- full table with all the stuff — description, category, date, amount
- real-time search (filters across description & category)
- category dropdown filter (10 categories)
- type filter — income/expense/all
- click column headers to sort (works both ways)
- pagination, 10 rows per page
- nice empty state when nothing matches ur filters
- export filtered data as CSV or JSON
- admin can delete rows (hover to see the button)

### role-based stuff

| what | viewer | admin |
|---|---|---|
| see all the data | ✅ | ✅ |
| add transactions | ❌ | ✅ |
| delete transactions | ❌ | ✅ |
| export | ✅ | ✅ |

theres a dropdown in the nav to switch roles. admin gets the "Add Transaction" button + floating action button on mobile.

### insights
3 cards with this aceternity-style spotlight hover effect:
1. **top spending category** — which category you spent most in + percentage
2. **month vs month** — how income/expenses changed vs last month
3. **savings health** — animated gauge bar, tells you if youre doing good or need to save more

### analytics tab
- monthly comparison bar chart (grouped bars — income vs expense)
- spending by category — horizontal bars, ranked

### dark mode
- one click toggle (sun/moon icon in nav)
- uses resolvedTheme so no double-click weirdness
- full color system with separate light and dark tokens, all in oklch
- picks up system preference on first load

### data persistence
- transactions saved to localStorage (`zorvyn:transactions`)
- hydrates from localStorage on page load
- add or delete something as admin — it persists across refreshes
- falls back to the 138 mock transactions if localStorage is empty or broken

---

## state management

using Redux Toolkit with 2 slices:

**transactionsSlice** — holds all transactions + filter state. everything derived (stats, chart data, category breakdown, insights) comes from `createSelector` memoized selectors. no redundant state anywhere.

```
transactions.items[]      ← the actual data
transactions.filters{}    ← search, category, type, sort stuff
```

main selectors:
- `selectFilteredTransactions` — applies all filters + sort in one pass
- `selectSummaryStats` — current vs last month numbers
- `selectMonthlyChartData` — 12 months of data for the area chart
- `selectCategoryBreakdown` — expenses grouped by category
- `selectInsights` — top category, month-over-month %, savings rate

**uiSlice** — just the role and active tab. nothing fancy.

```
ui.role          ← "viewer" | "admin"
ui.activeTab     ← "overview" | "transactions" | "analytics" | "insights"
```

---

## some design decisions i made

**color system** — all colors are CSS custom properties in oklch(), mapped to tailwind v4 via `@theme inline`. semantic tokens like `--brand`, `--positive`, `--negative` that adapt across light/dark automatically.

**animations** — every animation has a reason. stagger entrance on cards so your eye follows naturally. spring counters make data feel alive. AnimatePresence for clean tab transitions. the spotlight hover on insight cards is inspired by aceternity ui.

**no sidebar** — went with top nav on purpose. finance dashboards need max horizontal space for charts and tables. sidebar would've eaten into that.

---

## assignment checklist

| requirement | done? |
|---|---|
| summary cards (balance, income, expenses) | ✅ |
| time-based chart | ✅ area chart, 12 months |
| category chart | ✅ donut + bar charts |
| transactions list w/ date, amount, category, type | ✅ |
| filtering | ✅ category + type |
| sorting | ✅ all columns, both directions |
| search | ✅ real-time |
| role-based UI | ✅ viewer/admin |
| insights section | ✅ 3 insight cards |
| state management | ✅ RTK |
| responsive | ✅ mobile to desktop |
| empty states | ✅ |
| dark mode | ✅ |
| localStorage persistence | ✅ |
| export (CSV/JSON) | ✅ |
| animations | ✅ |
| advanced filtering | ✅ |
| documentation | ✅ (this readme lol) |

---

built by **Abhishek Biradar**
