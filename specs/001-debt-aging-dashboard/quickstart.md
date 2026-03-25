# Quickstart: BMS Debt Aging Analysis Dashboard

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- A valid BMS Session ID (obtained from HOSxP desktop application)
- Network access to hosxp.net and the hospital's HOSxP API server

## Setup

```bash
# Clone and install
git clone <repo-url>
cd debt-aging-analysis
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Configuration

### Vite Dev Proxy (for CORS)

The `vite.config.ts` includes a proxy configuration for the HOSxP API.
Update the proxy target if your hospital's API URL differs:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/hosxp-api': {
        target: 'https://your-hospital-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hosxp-api/, ''),
      },
    },
  },
});
```

### Environment Variables

No `.env` file is required. All configuration (API URL, auth key) is
dynamically obtained from the BMS Session ID validation at runtime.

## Usage

### Opening from HOSxP Desktop

The HOSxP desktop app opens this dashboard with a URL like:
```
http://localhost:5173/?bms-session-id=YOUR_SESSION_ID
```

The session ID is automatically captured, stored in a cookie, and
removed from the URL.

### Manual Login

If no session ID is provided, a login page appears where you can
paste a BMS Session ID manually.

## Development

### Available Scripts

```bash
npm run dev          # Start dev server with HMR
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Testing

```bash
# Run all tests
npm run test

# Run specific test file
npx vitest run tests/unit/utils/aging.test.ts

# Run with coverage
npx vitest run --coverage
```

### Project Structure

- `src/config/` — Centralized constants (aging buckets, thresholds)
- `src/api/` — HOSxP API client and SQL query builders
- `src/hooks/` — React Query data hooks
- `src/utils/` — Pure business logic (aging, formatting, export)
- `src/components/shared/` — Reusable UI components
- `src/components/dashboard/` — Dashboard-specific components
- `src/components/detail/` — Detail page components
- `src/pages/` — Page-level components
- `src/types/` — TypeScript type definitions
- `tests/` — Unit and integration tests

### Key Architecture Decisions

1. **No backend**: Queries HOSxP MySQL directly via REST SQL API
2. **Session-based auth**: BMS Session ID → PasteJSON → API credentials
3. **Centralized business logic**: Aging rules in `src/config/constants.ts`,
   calculations in `src/utils/aging.ts`
4. **Server state only**: TanStack Query manages all data fetching,
   caching, and refresh

## Deployment

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy as a static site on the same server
as BMS Accounting or any static file host.

### Production CORS

If deployed on a different origin than the HOSxP API, configure a
reverse proxy on the production server to route API requests.
