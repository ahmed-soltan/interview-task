# User Data Grid

A reusable React data grid built with TanStack Start, TanStack Router, TanStack
Query, and TanStack Table. It loads user data from JSONPlaceholder and provides
search, filtering, sorting, pagination, and row selection.

## Features

- Fetches users from the JSONPlaceholder API
- Runtime validation of API responses with Zod
- Loading skeleton state
- Error state with retry
- Empty-data and empty-filter-result states
- Debounced global search across:
  - Name
  - Username
  - Email
  - Phone
  - Website
- Column filters:
  - Text filters for Name, Username, Email, and Website
  - Select filters for Company and City
- Sortable table columns
- Client-side pagination
- Page sizes of 10, 25, 50, and 100
- Individual row selection
- Select-all for the current page
- Stable row selection based on each user's ID
- Responsive table overflow behavior

## Requirements

- Node.js 18 or newer
- pnpm

If pnpm is not installed, install it using
[Corepack](https://nodejs.org/api/corepack.html):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Getting started

Clone the repository and move into the project directory:

```bash
git clone <repository-url>
cd interview-task
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

The development server uses Vite and automatically reloads when source files
change.

## Available scripts

| Command                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `pnpm dev`             | Start the local development server on port 3000 |
| `pnpm build`           | Create a production build                       |
| `pnpm preview`         | Preview the production build locally            |
| `pnpm lint`            | Run ESLint                                      |
| `pnpm check`           | Check formatting with Prettier                  |
| `pnpm format`          | Format the project and apply ESLint fixes       |
| `pnpm generate-routes` | Regenerate the TanStack Router route tree       |

Run the main verification commands before submitting changes:

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm check
pnpm build
```

## Data source

Users are fetched from:

```text
https://jsonplaceholder.typicode.com/users
```

The request is defined in
[`src/entities/user/api/user-api.ts`](./src/entities/user/api/user-api.ts).
The response is validated against the Zod schema in
[`src/entities/user/model/schema.ts`](./src/entities/user/model/schema.ts).

The shared API client is located at
[`src/shared/api/client.ts`](./src/shared/api/client.ts), so request behavior
can be centralized if authentication, headers, or a different API base URL is
introduced later.

## Project structure

```text
src/
├── entities/
│   └── user/
│       ├── api/       # User API requests
│       └── model/     # User types and runtime schemas
├── features/
│   └── user/
│       ├── services/  # User-facing data hooks
│       └── ui/        # User table and column definitions
├── integrations/      # TanStack Query and development integrations
├── pages/
│   └── home/          # Page-level composition
├── routes/            # TanStack Router route adapters
└── shared/
    ├── api/           # Shared HTTP client
    ├── hooks/         # Reusable React hooks
    ├── lib/           # Shared table configuration and utilities
    └── ui/            # Reusable table, data-grid, skeleton, and UI primitives
```

The application follows a Feature-Sliced-style separation:

- **Entities** contain domain data, types, schemas, and API access.
- **Features** contain user-facing behavior and feature-specific UI.
- **Pages** compose features into route-level screens.
- **Shared** contains reusable UI and infrastructure without user-domain logic.
- **Routes** connect URLs to pages and should remain thin.

## Using the reusable data table

The reusable table is implemented in
[`src/shared/ui/data-table.tsx`](./src/shared/ui/data-table.tsx). It accepts
generic row data, column definitions, labels, and an optional stable row ID
function:

```tsx
<DataTable
  columns={columns}
  data={users}
  entityLabel="users"
  rowLabel="user"
  searchLabel="Search users"
  getRowId={(user) => String(user.id)}
/>
```

Column metadata controls filtering and global-search participation:

```tsx
meta: {
  filter: 'text',
  globalFilter: true,
}
```

## Production preview

Build the application and preview the generated output:

```bash
pnpm build
pnpm preview
```

The preview command prints the local URL for the production build.

## Troubleshooting

### Port 3000 is already in use

Stop the process using port 3000, or run Vite with another port:

```bash
pnpm exec vite dev --port 3001
```

### API data does not load

Check that the development server can reach
`jsonplaceholder.typicode.com`. The application displays an error state with a
**Try again** button when the request fails.

### Dependencies are out of date

Reinstall from the lockfile:

```bash
pnpm install --frozen-lockfile
```

## License

This project is an interview-task application and does not currently define a
separate license.
