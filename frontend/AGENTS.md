<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Backend Connectivity

- Backend runs at `http://localhost:8080`. Configurable via `NEXT_PUBLIC_API_URL` env var.
- **Authentication** uses `better-auth/client/react` — import `authClient` from `@/lib/auth-client`. It handles session cookies, CSRF, and base URL automatically.
- **Session state**: Use `authClient.useSession()` React hook in client components (returns `{ data, isPending, error, refetch }`). Or use `useSessionStore` zustand store for non-hook access.
- **API calls**: Use `@/lib/api` (fetch wrapper with `credentials: "include"`). Stores call this to fetch data.
- **Zustand stores** in `stores/` manage cached API data (sections, attendance). Components subscribe for latest data.
- **Server actions** in `actions/` are only for SSR data fetching and mutations needing server-side logic.
- **Real-time sync**: Use `usePolling` hook in `hooks/use-polling.ts` to auto-refresh stores on an interval.
- CORS on the backend allows `http://localhost:3001` (dev) and `http://localhost:3000` (preview).
- QR scanning uses `@zxing/browser` via `useQrScanner` hook in `hooks/use-qr-scanner.ts`.
- Refer to `SYSTEM-DESIGN.md` for full architecture, stores, route list, and data flow.
- When adding new features, update `SYSTEM-DESIGN.md` (stores, routes, actions, components, auth changes).

## Environment Variables

- **Always** import `env` from `@/env` instead of reading `process.env` directly.
- `env.ts` uses Zod for validation — missing or invalid vars fail at startup with a clear error.
- Public vars (prefixed `NEXT_PUBLIC_`) are available on both server and client.
- To add a new env var, add it to the Zod schema in `env.ts` and the corresponding `.env` file.
