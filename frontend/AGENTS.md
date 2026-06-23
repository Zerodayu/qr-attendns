<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Backend Connectivity

- Backend runs at `http://localhost:8080`. Configurable via `NEXT_PUBLIC_API_URL` env var.
- **Client data** is managed via **Zustand stores** in `stores/`. Components subscribe to stores for the latest data.
- Stores use `@/lib/api` to fetch from the backend with `credentials: "include"` for session auth.
- **Server actions** in `actions/` are only for SSR data fetching and mutations needing server-side logic.
- **Real-time sync**: Use `usePolling` hook in `hooks/use-polling.ts` to auto-refresh stores on an interval.
- Session store (`stores/session.ts`) handles auth state — call `fetch()` on app load, then read `session` throughout.
- CORS on the backend allows `http://localhost:3001` (dev) and `http://localhost:3000` (preview).
- QR scanning uses `@zxing/browser` via `useQrScanner` hook in `hooks/use-qr-scanner.ts`.
- Refer to `SYSTEM-DESIGN.md` for full architecture, stores, route list, and data flow.
- When adding new features, update `SYSTEM-DESIGN.md` (stores, routes, actions, components, auth changes).

## Environment Variables

- **Always** import `env` from `@/env` instead of reading `process.env` directly.
- `env.ts` uses Zod for validation — missing or invalid vars fail at startup with a clear error.
- Public vars (prefixed `NEXT_PUBLIC_`) are available on both server and client.
- To add a new env var, add it to the Zod schema in `env.ts` and the corresponding `.env` file.
