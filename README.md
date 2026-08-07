# Greentiq CRM – Advanced Customer Management Dashboard

**This is the assignment submission for [Greentiq](https://greentiq.com/)'s engineering assessment.** A full-featured customer relationship management (CRM) dashboard built with Next.js 16, TypeScript, React 19, and TanStack Query. Demonstrates modern state management patterns, advanced filtering with persistence, drag-and-drop reordering of saved filters, and a comprehensive mock API layer.

## Live Deployment

| Environment | URL |
|---|---|
| **Production** | https://greetiqcrm.ijas.space/ |
| **Dev** | https://greentiq-crm-git-dev-muhammed-ijas-projects.vercel.app/ |
| **QA** | https://greentiq-crm-git-qa-muhammed-ijas-projects.vercel.app/ |

## Clone & Setup

```bash
git clone https://github.com/Muhammedijas981/greentiq-crm.git
cd greentiq-crm
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 16.3.0 (App Router, TypeScript)
- **UI Library**: React 19.2.8
- **State Management**: React Hooks (`useReducer` for filters)
- **Server State**: TanStack React Query 5.101.4
- **Styling**: Tailwind CSS 4, CSS custom properties, shadcn/ui
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Form Handling**: React Hook Form 7.84 + Zod validation
- **Notifications**: Sonner 2.0.7
- **Icons**: Lucide React
- **Testing**: Manual QA via dev/qa/main branch strategy

**Language Composition**: TypeScript 96.4%, CSS 3.2%, JavaScript 0.4%

## Development Process

### Branching Strategy

This project uses a **three-tier environment model**:
- **`main` branch** → Production (https://greetiqcrm.ijas.space/)
- **`dev` branch** → Development preview
- **`qa` branch** → QA/testing environment

All development was **direct-to-branch commits** without formal PR workflow. Each branch is independently deployed to Vercel, enabling rapid iteration and isolated testing at each tier.

### Development Timeline

The project was built via iterative commits directly to branches, organized conceptually around these phases:

1. **Project Setup** – Next.js bootstrap, TypeScript config, dependencies (Tailwind, React Hook Form, TanStack Query, dnd-kit)
2. **Core Architecture** – Layout skeleton (Sidebar, Topbar), API client abstraction, type definitions, mock store
3. **Feature Build**:
   - Customer table with bulk selection and status/company badges
   - Multi-field filter panel (status, company, date range, text search)
   - Saved filters with manual drag-and-drop reordering
   - Customer CRUD (Create/Read/Update/Delete via modal form)
   - Dashboard with KPI cards (total customers, active leads, weekly contacts)
4. **QA & Bug Fixes** – Filter accuracy testing, edge-case handling, UI polish
5. **Bonus Features** – CSV export, theme switcher (dark/light), keyboard shortcuts

No formal issue tracker or pull request discussions were used; this was a focused solo build.

## Engineering Decisions

### 1. **useReducer over Zustand for Filter State**

**Decision**: Filters use React's built-in `useReducer` (see [`src/hooks/use-filters.ts`](src/hooks/use-filters.ts)) rather than an external state manager.

**Why**: 
- Filter state is ephemeral—it lives only in the current session and resets on page reload, so there is no need for persistence, DevTools, or cross-window sync.
- `useReducer` keeps the codebase dependency-lean and keeps filter logic co-located with the component tree.
- The reducer is self-contained and easy to reason about: status toggles, company toggles, date range, phone/email text, and "apply saved filter" all dispatch well-defined action types.

**Trade-off**: If the project scaled to require global filter state, temporal undo/redo, or cross-tab persistence, Zustand (or Jotai) would become a better choice. For this scope, the simplicity and zero overhead of `useReducer` is a win.

### 2. **Single CustomerForm in Two Modes (Create / Edit)**

**Decision**: One [`CustomerForm`](src/components/customers/customer-form.tsx) component handles both "Add Customer" and "Edit Customer" workflows via a `mode` prop and optional `initialData`.

**Why**:
- Eliminates code duplication—validation schema, field layout, and form logic are shared.
- The mode toggles button text, pre-population, and which mutation hook runs (create vs. update).
- A single modal entry point simplifies the parent component's state management.

**Implementation**:
- `mode: 'create' | 'edit'` prop controls behavior.
- `initialData?: Customer` is used if mode is 'edit'.
- React Hook Form's `defaultValues` are set from `initialData` or empty strings.
- On submit, the form dispatches the appropriate mutation (via `useCreateCustomer` or `useUpdateCustomer`).

### 3. **Debounce at the Hook Level**

**Decision**: A dedicated [`useDebounce`](src/hooks/use-debounce.ts) hook wraps text input values before passing them to API queries.

**Why**:
- Typing in a search bar triggers a keystroke every ~100ms. Without debouncing, a search for "john" would fire 4 separate API calls ("j", "jo", "joh", "john"), spamming the server.
- Debouncing at the hook level (default 500ms delay) ensures we wait until the user pauses or finishes typing before querying.
- This is transparent to components—they call `useDebounce(inputValue)` and get back the debounced value to pass to the query.
- React Query's dependency tracking automatically refetches when the debounced value changes.

### 4. **TanStack Query as the Sole Server-State Owner**

**Decision**: TanStack React Query (v5) is the only source of truth for fetched customer data, saved filters, and dashboard stats.

**Why**:
- Query manages caching, stale-time logic, automatic refetch on window focus, and request deduplication.
- All mutations (create, update, delete, reorder) go through Query's mutation hooks, ensuring the cache is invalidated and refreshed on success.
- No separate Redux store or async thunk layer—Query's simple `useQuery` and `useMutation` APIs do the heavy lifting.
- Separates concerns: UI state (`useReducer` for filters) vs. server state (Query for customers).

**Example**: When a filter is applied, the query key `['customers', filterParams]` automatically triggers a new fetch and re-caches the result.

### 5. **Mock API with Module-Level Store**

**Decision**: A [`mockStore`](src/lib/mock-store.ts) maintains in-memory customer and saved-filter state, backed by a JSON seed file, and is accessed via server route handlers (`/api/customers`, `/api/saved-filters`).

**Why**:
- Next.js route handlers can read and write to module-level variables that persist within a single server instance.
- This simulates a stateful backend without needing a database, Docker container, or external service.
- Mutations (POST/PATCH/DELETE) persist within the session and subsequent GETs return the updated data.

**Known Limitation**: 
- In production on Vercel's serverless, each cold start spins up a fresh Node process, so the store resets to the seed data. 
- This is acceptable for an assessment; a real system would use a persistent database (PostgreSQL, MongoDB, etc.).

### 6. **Drag-and-Drop Scoped to Saved Filters Only**

**Decision**: Draggable sorting via `@dnd-kit` is **only applied to the saved filters list**, not to the customer table rows.

**Why**:
- Saved filters are small in number and benefit from custom ordering—users may want frequently-used filters at the top.
- The customer table has 100+ rows; dragging individual rows is slow and error-prone. Sorting and pagination serve that use case better.
- Keeping dnd-kit scoped reduces complexity and bundle size impact.

**Implementation**: [`SavedFiltersList`](src/components/filters/saved-filters-list.tsx) wraps filters in `DndContext` with `@dnd-kit/sortable`, includes pointer and keyboard sensors (5px activation distance to avoid click interference), and calls the reorder API on drop.

### 7. **Flexbox-First Layout**

**Decision**: All responsive layouts use Tailwind's flexbox utilities (`flex`, `flex-1`, `gap`, `flex-col`, `sm:flex-row`) rather than CSS Grid.

**Why**:
- Flexbox is simpler to reason about for most layouts (sidebar ↔ main, stacked on mobile).
- One-dimensional layouts (rows of buttons, stacked filter inputs) are more natural in flexbox.
- Less CSS to write, fewer media-query edge cases.

**Trade-off**: Grid would be more elegant for 2D layouts (e.g., a multi-column dashboard grid), but for this CRM's mostly linear layout, flexbox wins on simplicity.

---

## What's Implemented ✓

- ✅ **Customer Table** with sorting, pagination, bulk selection, and status/company badges
- ✅ **Advanced Filtering** (status, company, date range, phone, email) with filter count indicator
- ✅ **Saved Filters** with create, apply, delete, and **drag-and-drop reordering**
- ✅ **CRUD Operations** – Add, view, edit, and delete customers with validation
- ✅ **Dashboard** with KPI stat cards (total customers, active leads, weekly contact count)
- ✅ **Mock API** with `/api/customers` and `/api/saved-filters` endpoints
- ✅ **Dark/Light Theme Switcher** via `next-themes`
- ✅ **CSV Export** for filtered customer data
- ✅ **Keyboard Shortcuts** (e.g., `Ctrl/Cmd + K` to focus search)
- ✅ **Responsive Design** – Mobile-first flexbox layout, tested on dev/qa branches
- ✅ **Loading States & Skeletons** for better UX
- ✅ **Toast Notifications** (Sonner) for user feedback

## What's Skipped ✗

- ❌ **Real Database** – Uses in-memory mock store (acceptable for assessment, not production)
- ❌ **Authentication & Authorization** – No login, no role-based access control
- ❌ **Advanced Analytics** – No revenue forecasting, pipeline visualization, or AI insights
- ❌ **Email Integration** – No automated email sending or message history
- ❌ **Calendar/Scheduling** – No meeting scheduler or task management
- ❌ **Custom Reports** – No report builder or BI integrations
- ❌ **Webhook Support** – No Zapier, Make.com, or third-party integrations

These are reasonable tradeoffs for a 48-hour assessment; the focus was on demonstrating clean architecture, intentional design decisions, and QA discipline.

## Running Locally

### Install & Start Dev Server

```bash
npm install
npm run dev
```

Navigate to http://localhost:3000. The app loads mock customer data and is ready to use.

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Testing & QA

Testing was done via **manual QA across three deployment environments**:

- **Dev branch** – Used for feature development and integration testing.
- **QA branch** – Used for UAT (user acceptance testing) before promoting to main.
- **Main branch** – Production-ready; deployed to https://greetiqcrm.ijas.space/.

### QA Focus Areas

1. **Filter Accuracy** – Verified that toggling status/company filters, entering date ranges, and searching by phone/email correctly narrow the customer list.
2. **Saved Filter Persistence** – Ensured saved filters are created, applied, and persist across page reloads (via mock store).
3. **Drag-and-Drop Reordering** – Tested that dragging saved filters updates their order and persists the change.
4. **CRUD Correctness** – Verified that adding a customer increments the table, editing updates fields, and deleting removes the record.
5. **Responsive Layout** – Tested the sidebar, table, and modals on mobile (320px), tablet (768px), and desktop (1920px) viewports.
6. **Theme Toggle** – Confirmed dark/light mode switches are applied globally and persist.
7. **Form Validation** – Confirmed Zod schema validates email format, required fields, and phone format.

No formal test framework (Jest, Vitest, Cypress) was set up, keeping the codebase lean per assessment scope. Automated E2E tests would be a priority for production.

---

## Project Structure

```
src/
├── app/                       # Next.js App Router pages & layouts
│   ├── layout.tsx            # Root layout with theme, query provider, sidebar/topbar
│   ├── page.tsx              # Dashboard (KPI cards)
│   ├── customers/            # Customers page (table & filters)
│   ├── api/                  # Route handlers (/api/customers, /api/saved-filters)
│   └── globals.css           # Global Tailwind + custom CSS
├── components/
│   ├── customers/            # Customer-specific components
│   │   ├── customer-form.tsx # Add/Edit customer modal
│   │   ├── customer-table.tsx
│   │   ├── customer-card.tsx
│   │   ├── stat-card.tsx
│   │   └── ...
│   ├── filters/              # Filter panel & saved filters
│   │   ├── filter-panel.tsx
│   │   ├── saved-filters-list.tsx (dnd-kit drag-drop here)
│   │   ├── filter-status.tsx, filter-company.tsx, etc.
│   │   └── ...
│   ├── layout/               # Sidebar, Topbar
│   ├── ui/                   # Base UI components (button, input, etc.)
│   ├── shared/               # Shared components (LoadingSkeleton, etc.)
│   └── theme-provider.tsx
├── hooks/
│   ├── use-filters.ts        # useReducer-based filter state
│   ├── use-debounce.ts       # Debounce utility hook
│   ├── use-customers.ts      # TanStack Query hook for customers
│   ├── use-customer-mutations.ts # Mutations (create, update, delete)
│   ├── use-dashboard-stats.ts
│   └── use-bulk-selection.ts
├── lib/
│   ├── api-client.ts         # Fetch wrapper, type-safe API calls
│   ├── mock-store.ts         # In-memory data store
│   ├── filter-utils.ts       # Filter matching logic
│   ├── validation.ts         # Zod schemas
│   └── ...
├── types/
│   ├── customer.ts
│   ├── filter.ts
│   └── ...
├── data/
│   └── customers.json        # Seed data (100+ customers)
└── providers/
    └── query-provider.tsx    # TanStack Query client setup
```

---

## Key Files & Engineering Details

### Filter State: `src/hooks/use-filters.ts`

Demonstrates `useReducer` pattern with multiple filter categories:

```typescript
export type FilterAction =
  | { type: 'TOGGLE_STATUS'; payload: string }
  | { type: 'TOGGLE_COMPANY'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: { from: string; to: string } }
  | { type: 'SET_PHONE'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'APPLY_SAVED_FILTER'; payload: FilterState };
```

This keeps filter logic deterministic and testable without external dependencies.

### Mock Store: `src/lib/mock-store.ts`

Module-level persistence within a server instance:

```typescript
let customers: Customer[] = [...(customersData as Customer[])];

export const mockStore = {
  getAll: () => [...customers],
  create: (data) => { /* generate ID, push, return */ },
  update: (id, data) => { /* find, merge, return */ },
  remove: (id) => { /* filter out */ },
  bulkUpdate: (ids, data) => { /* map and update */ },
  bulkRemove: (ids) => { /* filter */ }
};
```

### API Client: `src/lib/api-client.ts`

Type-safe fetch wrapper for all endpoints:

```typescript
export const apiClient = {
  getCustomers: async (params?: GetCustomersParams) => { /* fetch & JSON */ },
  createCustomer: async (data) => { /* POST */ },
  updateCustomer: async (id, data) => { /* PATCH */ },
  deleteCustomer: async (id) => { /* DELETE */ },
  getSavedFilters: async () => { /* fetch */ },
  reorderSavedFilters: async (startIndex, endIndex) => { /* PUT */ },
  // ...
};
```

### Debounce Hook: `src/hooks/use-debounce.ts`

Simple, reusable debounce:

```typescript
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

### Saved Filters with Drag-Drop: `src/components/filters/saved-filters-list.tsx`

Integrates `@dnd-kit/sortable` with React Query mutations:

```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    setItems((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      reorderMutation.mutate({ startIndex: oldIndex, endIndex: newIndex });
      return newItems;
    });
  }
};
```

---

## Deployment

All three branches are deployed to **Vercel**:

- **Main** → https://greetiqcrm.ijas.space/ (production domain)
- **Dev** → https://greentiq-crm-git-dev-muhammed-ijas-projects.vercel.app/
- **QA** → https://greentiq-crm-git-qa-muhammed-ijas-projects.vercel.app/

Each deployment is isolated and serves as a distinct environment for testing and release.

---

## License

This project is a Greentiq assessment submission. All rights reserved.

---

## Contact & Support

- **Repository**: https://github.com/Muhammedijas981/greentiq-crm
- **Live App**: https://greetiqcrm.ijas.space/
- **Author**: Muhammed Ijas

For questions or feedback on the engineering decisions and implementation, please refer to the code comments and this README.
