# QR Attendnz — Frontend System Design

## Project Overview

QR Attendnz is a QR-code-based attendance tracking system. Teachers create sections (classes), add students, and mark daily attendance (time-in/time-out) by scanning QR codes. Parents can join sections via a class code, link themselves to their children's records, and receive Web Push notifications when attendance is recorded.

The frontend is a Next.js 16 application using the App Router, styled with shadcn/ui (Tailwind v4), and communicates with the backend REST API via server actions.

---

## Technology Stack

| Layer             | Technology                  | Purpose                                         |
| ----------------- | --------------------------- | ----------------------------------------------- |
| Framework         | **Next.js 16**              | React meta-framework (App Router, SSR, RSC)     |
| UI Library        | **React 19**                | Component rendering                             |
| Styling           | **Tailwind CSS v4**         | Utility-first CSS                               |
| Component Library | **shadcn/ui** (base-luma)   | Primitive UI components                         |
| Auth Client       | **better-auth/react**       | Client-side auth with session cookie management |
| State Management  | **Zustand**                 | Lightweight UI state management                 |
| Validation        | **Zod**                     | Runtime env variable validation                 |
| Icons             | **lucide-react**            | Icon library                                    |
| Animations        | **motion**                  | Framer Motion animations                        |
| Theme             | **next-themes**             | Dark/light mode                                 |
| QR Scanning       | **@zxing/browser**          | Browser-based QR code decoding                  |
| Fonts             | **Geist Mono** + **Outfit** | Monospace + sans-serif typefaces                |
| Linting           | **ESLint** + Prettier       | Code quality & formatting                       |
| Package Manager   | **Bun**                     | JavaScript runtime & package manager            |

---

## Directory Structure

```
frontend/
├── AGENTS.md                     # Agent conventions
├── SYSTEM-DESIGN.md              # This file
├── middleware.ts                  # Proxy /api/* and /auth/* to backend
├── env.ts                        # Zod-validated environment variables
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js config (env defaults)
├── package.json
├── tsconfig.json                 # Path alias @/ → ./
├── postcss.config.mjs
├── eslint.config.mjs
├── .prettierrc
├── .prettierignore
├── .mcp.json
├── app/
│   ├── globals.css               # Tailwind base + CSS variables
│   ├── layout.tsx                # Root layout (ThemeProvider, fonts)
│   ├── page.tsx                  # Landing page (Hero)
│   └── favicon.ico
├── stores/                       # Zustand stores (UI state + data sync)
│   ├── ui.ts                     # Sidebar, scanner UI state
│   ├── session.ts                # Current user session / auth
│   ├── sections.ts               # Teacher sections with students + attendance
│   ├── attendance.ts             # Live attendance marking (time-in/time-out)
│   └── subscription.ts           # Plan status, create invoices, cancel
├── hooks/
│   ├── .gitkeep
│   ├── use-qr-scanner.ts         # @zxing/browser wrapper
│   └── use-polling.ts            # Interval-based store refresh
├── actions/                      # Server actions (BFF layer)
│   ├── auth.ts                   # signIn, signUp, signOut, getSession, etc.
│   ├── sections.ts               # getSections, createSection
│   ├── students.ts               # createStudent
│   ├── attendance.ts             # markTimeIn, markTimeOut
│   ├── parent.ts                 # joinSection, linkStudents
│   ├── push.ts                   # registerSubscription, unregisterSubscription
│   └── subscription.ts           # createInvoice, getStatus, cancel
├── components/                   # React components
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── popover.tsx
│   │   └── sheet.tsx
│   ├── hero.tsx                  # Landing page hero section
│   ├── logos.tsx                 # Brand logo SVGs
│   ├── nav-menu.tsx              # Navigation menu component
│   ├── navbar.tsx                # Top navigation bar
│   └── theme-provider.tsx        # next-themes provider wrapper
└── lib/
    ├── .gitkeep
    ├── api.ts                    # Fetch wrapper (credentials: "include", /api/v1 prefix)
    ├── auth-client.ts            # better-auth client (createAuthClient)
    └── utils.ts                  # cn() utility (clsx + tailwind-merge)
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                         │
│  ┌──────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │ Landing  │  │ Auth Pages  │  │ Dashboard /       │  │
│  │ Page     │  │ (sign-in,   │  │ Sections /        │  │
│  │ (/)      │  │  sign-up)   │  │ Attendance / etc. │  │
│  └──────────┘  └─────────────┘  └────────┬──────────┘  │
│                                          │              │
│                                    ┌─────▼─────┐       │
│                                    │ Server     │       │
│                                    │ Actions    │       │
│                                    │ (actions/) │       │
│                                    └─────┬─────┘       │
│                                          │              │
│                                    ┌─────▼─────┐       │
│                                    │ lib/api.ts │       │
│                                    │ (fetch     │       │
│                                    │  wrapper)  │       │
│                                    └─────┬─────┘       │
└──────────────────────────────────────────┼─────────────┘
                                           │
                              HTTP (fetch) │ credentials: "include"
                                           ▼
┌──────────────────────────────────────────────────────────┐
│               Backend (Bun + ElysiaJS)                   │
│                                                          │
│  ┌──────────────┐    ┌──────────────────────────────┐    │
│  │ CORS :8080   │───▶│ /api/v1/* API Routes         │    │
│  │ origin:3001  │    │ (auth, sections, attendance) │    │
│  └──────────────┘    └──────────┬───────────────────┘    │
│                                 │                        │
│                          ┌──────▼──────┐                 │
│                          │   Drizzle   │                 │
│                          │   ORM +     │                 │
│                          │ PostgreSQL  │                 │
│                          └─────────────┘                 │
└──────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User interacts** with a Next.js page (client component or server component).
2. **Client component** calls a **server action** (e.g., `actions/auth.ts` → `signIn()`).
3. **Server action** (`"use server"`) runs on the server, imports `@/lib/api` to make an HTTP request to the backend.
4. **`lib/api.ts`** constructs the URL `${API_BASE}/api/v1${path}`, adds `Content-Type: application/json`, and forwards the `better-auth` session cookie via `credentials: "include"`.
5. **Backend** processes the request (auth guard, business logic, DB query) and returns JSON.
6. **Response** flows back: `lib/api.ts` → server action → component (re-renders or shows feedback).
7. **QR scanning flow**: teacher taps a scan button → `useQrScanner` hook activates camera → `@zxing/browser` decodes QR → decoded value passed to `attendance.markTimeIn()` action → backend records attendance + push notification.

---

## Route Design

### App Router Pages

| Path                                 | Auth | Role    | Description                                   |
| ------------------------------------ | ---- | ------- | --------------------------------------------- |
| `/`                                  | No   | —       | Landing page (Hero)                           |
| `/auth/sign-in`                      | No   | —       | Login (email/password)                        |
| `/auth/sign-up`                      | No   | —       | Registration (name, email, password)          |
| `/auth/forgot-password`              | No   | —       | Request password reset email                  |
| `/auth/reset-password`               | No   | —       | Reset password with token                     |
| `/dashboard`                         | Yes  | teacher | Teacher dashboard (sections list)             |
| `/sections/new`                      | Yes  | teacher | Create a new section form                     |
| `/sections/[sectionId]`              | Yes  | teacher | Section detail — students + attendance        |
| `/sections/[sectionId]/students/new` | Yes  | teacher | Add student to section                        |
| `/attendance`                        | Yes  | teacher | Attendance marking page (QR scanner + manual) |
| `/parent/join`                       | Yes  | parent  | Join a section via class code                 |
| `/parent/board`                      | Yes  | parent  | View linked children / link new students      |
| `/subscription`                      | Yes  | teacher | Plan selection / current plan management      |
| `/payment/success`                   | Yes  | teacher | PayMongo return — payment confirmed           |
| `/payment/failed`                    | Yes  | teacher | PayMongo return — payment failed / cancelled  |
| `/settings`                          | Yes  | any     | Profile / account settings                    |

### Route Groups (planned)

```
app/
├── (auth)/
│   ├── sign-in/page.tsx        # Login form (Login component)
│   ├── sign-up/page.tsx
│   └── forgot-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx              # Authenticated layout + plan guard
│   ├── page.tsx                # Redirect to /dashboard
│   ├── dashboard/page.tsx
│   ├── sections/
│   │   ├── new/page.tsx
│   │   └── [sectionId]/
│   │       ├── page.tsx
│   │       └── students/new/page.tsx
│   ├── attendance/page.tsx
│   ├── parent/
│   │   ├── join/page.tsx
│   │   └── board/page.tsx
│   ├── subscription/page.tsx
│   ├── payment/
│   │   ├── success/page.tsx
│   │   └── failed/page.tsx
│   └── settings/page.tsx
├── layout.tsx                   # Root layout (fonts, theme)
├── page.tsx                     # Landing page (public)
```

---

## Actions Layer

All server actions live in `actions/` — one file per feature domain. Components **never** call the backend directly; they import and invoke actions.

| File              | Exports                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `auth.ts`         | `signIn`, `signUp`, `signOut`, `getSession`, `updateUser`, `changePassword`, `forgotPassword`, `resetPassword`, `sendVerificationEmail`, `verifyEmail` |
| `sections.ts`     | `getSections`, `createSection`                                                                                                                         |
| `students.ts`     | `createStudent`                                                                                                                                        |
| `attendance.ts`   | `markTimeIn`, `markTimeOut`                                                                                                                            |
| `parent.ts`       | `joinSection`, `linkStudents`                                                                                                                          |
| `push.ts`         | `getSubscriptions`, `registerSubscription`, `unregisterSubscription`                                                                                   |
| `subscription.ts` | `createInvoice`, `getStatus`, `cancel`                                                                                                                 |

Example usage in a component:

```tsx
import { getSections } from "@/actions/sections"

export default async function DashboardPage() {
  const sections = await getSections()
  // ...
}
```

---

### `createDataStore` factory (`stores/data.ts`)

A generic helper to create async data stores with `loading`, `error`, `lastFetched`, `fetch`, and `setData`. Used internally by domain stores.

---

## Middleware / Proxy (`middleware.ts`)

Next.js middleware intercepts all requests to `/api/*` and `/auth/*` and rewrites them to the backend server:

```typescript
// middleware.ts — runs on every matching request
export function middleware(request: NextRequest) {
  const target = process.env.API_URL ?? "http://localhost:8080"
  // Rewrite /api/v1/* → http://localhost:8080/api/v1/*
  // Rewrite /auth/*     → http://localhost:8080/auth/*
  const url = new URL(request.nextUrl.pathname + request.nextUrl.search, target)
  return NextResponse.rewrite(url)
}
```

This means:
- **No CORS needed** — all requests are same-origin from the browser's perspective.
- **No base URL in client code** — `lib/api.ts` uses relative paths like `/api/v1/sections`.
- **Auth cookies** flow automatically (same domain, no cross-origin issues).
- **In production**, set `API_URL` to the production backend URL.

The middleware only matches `/api/:path*` and `/auth/:path*` via the `config.matcher`.

---

## API Client (`lib/api.ts`)

A thin fetch wrapper that:

- Targets `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`) with `/api/v1/` prefix.
- Forwards session cookies via `credentials: "include"` (required for better-auth session auth).
- Sets `Content-Type: application/json` by default.
- Throws `ApiError` on non-ok responses for unified error handling.
- Returns parsed JSON, or `undefined` for 204 No Content.

```typescript
export class ApiError extends Error {
  /* ... */
}

export function get<T>(path: string): Promise<T>
export function post<T>(path: string, body?: unknown): Promise<T>
export function del<T>(path: string): Promise<T>
```

---

## State Management (Zustand)

Zustand stores in `stores/` are the single source of truth for **all client state** — both UI state and cached API data. Stores auto-refresh via `usePolling` so components always render the latest backend data.

### Stores

| Store          | File                     | State / Actions                                                   | Backend Driver |
| -------------- | ------------------------ | ----------------------------------------------------------------- | -------------- |
| `ui`           | `stores/ui.ts`           | `sidebarOpen`, `scannerOpen`, `lastScannedStudentId`              | —              |
| `session`      | `stores/session.ts`      | `session`, `fetch()`, `signIn()`, `signUp()`, `signOut()`         | `authClient`   |
| `sections`     | `stores/sections.ts`     | `sections[]`, `fetch(date?)`                                      | `lib/api.ts`   |
| `attendance`   | `stores/attendance.ts`   | `marked[]`, `timeIn(id)`, `timeOut(id)`                           | `lib/api.ts`   |
| `subscription` | `stores/subscription.ts` | `status`, `loading`, `fetch()`, `createInvoice(plan)`, `cancel()` | `lib/api.ts`   |

### Data Flow

```
Backend API                    Zustand Store              React Component
───────────                    ─────────────              ───────────────
GET /api/v1/sections  ───▶    sections.fetch()   ───▶    useSectionsStore((s) => s.sections)
                                    │
                              sections: Section[]       Renders latest data
                              loading: boolean
                              lastFetched: number

POST /api/v1/attendance/time-in  ◀───  attendance.timeIn(studentId)
                                              │
                                        marked[] updated
                                        Component re-renders
```

### Usage

```tsx
"use client"
import { useSectionsStore } from "@/stores/sections"
import { useUiStore } from "@/stores/ui"
import { usePolling } from "@/hooks/use-polling"

function SectionList() {
  const sections = useSectionsStore((s) => s.sections)
  const fetch = useSectionsStore((s) => s.fetch)

  // Auto-refresh every 30 seconds for "always latest" data
  usePolling(fetch, 30_000)

  useEffect(() => {
    fetch()
  }, [fetch])
  // ...
}
```

### Polling Hook

`usePolling(callback, intervalMs)` runs `callback` on the given interval. Pass `0` or less to disable. Components use it to keep their stores fresh:

```tsx
usePolling(() => useSectionsStore.getState().fetch(), 15_000)
```

### Notes

- **Reads** always go through stores. Components never call `lib/api.ts` directly.
- **Mutations** (create, update, delete) call the store's action method (e.g., `useAttendanceStore.getState().timeIn(id)`), then the store calls `lib/api.ts` and updates state.
- **Server actions** in `actions/` are for SSR data fetching and mutations needing server-side validation.

---

## Authentication Flow

### better-auth Client (`lib/auth-client.ts`)

The frontend uses `createAuthClient` from `better-auth/react` to handle auth. It is initialized once in `lib/auth-client.ts`:

```typescript
export const authClient = createAuthClient({
  baseURL: "http://localhost:8080",
  basePath: "/auth",
})
```

The client:

- Manages session cookie forwarding automatically.
- Provides typed API methods: `authClient.signIn.email()`, `authClient.signUp.email()`, `authClient.signOut()`, `authClient.getSession()`.
- Exposes `authClient.useSession()` React hook for reactive session state in components.

### Session Flow

1. **App load**: Root layout or session provider calls `useSessionStore.fetch()` (or `authClient.getSession()`) to check for an existing session.
2. **Sign-up / Sign-in**: Form calls `useSessionStore.signIn()` / `signUp()` → these call `authClient.signIn.email()` → backend sets HTTP-only session cookie → store calls `getSession()` to hydrate state.
3. **Subsequent requests**: The cookie is automatically forwarded by both `authClient.$fetch` and raw `fetch` with `credentials: "include"`.
4. **Sign-out**: `authClient.signOut()` → backend clears the session cookie → store clears.
5. **Reactivity**: The `authClient.useSession()` React hook re-renders components on session changes (using nanostores under the hood).

### Client Component Session Hook

```tsx
"use client"
import { authClient } from "@/lib/auth-client"

function UserBadge() {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <Skeleton />
  return <span>{session?.user.name}</span>
}
```

### Store-Based Session Access

For non-hook scenarios (e.g., inside callbacks, server actions, or when polling is needed), the zustand `useSessionStore` syncs with the better-auth client:

```tsx
import { useSessionStore } from "@/stores/session"

const session = useSessionStore((s) => s.session)
const signOut = useSessionStore((s) => s.signOut)
```

### Auth Guards

- **Public routes** (`/`, `/auth/*`): accessible without session.
- **Protected routes** (`/dashboard`, `/sections/*`, `/attendance`, `/parent/*`, `/subscription`, `/settings`): parent layout checks session, redirects to sign-in if unauthenticated.
- **Role-based access**: Dashboard/sections/attendance pages additionally verify `user.role.includes("teacher")`. Parent pages verify `user.role.includes("parent")`.

---

## Subscription / Payment Flow

### Plan Guard (Dashboard Layout)

The `(dashboard)/layout.tsx` acts as a **plan guard** for teacher routes. On every navigation to any teacher page, the layout runs before rendering children:

```
Request → (dashboard)/layout.tsx
  ├── getSession()
  ├── session.user.role.includes("teacher") AND session.user.plan === "free"?
  │     └── YES → redirect("/subscription")
  └── NO  → render <Outlet /> (normal dashboard)
```

This prevents teachers with expired/cancelled/free plans from accessing any dashboard functionality (sections, students, attendance). Parents bypass the guard entirely.

### Payment Flow

```
Teacher on /subscription
  │
  ├── Selects plan (Essential ₱200/mo or Premium ₱350/mo)
  │
  ├── subscription.createInvoice("essential")
  │     → POST /api/v1/subscription/create-invoice { plan }
  │     → returns { checkoutUrl, linkId }
  │
  ├── window.location.href = checkoutUrl
  │     → PayMongo hosted checkout
  │
  │   ┌── User pays successfully ──┐
  │   │                            │
  │   ▼                            ▼
  │   /payment/success            /payment/failed
  │   │                            │
  │   ├── Polls subscription       ├── "Payment failed"
  │   │   status every 3s          ├── "Try again" button
  │   │                            │   → links back to
  │   ├── Once plan ≠ free:        │     /subscription
  │   │   redirect /dashboard      │
  │   │                            │
  │   └── Webhook activates plan   │
  │       (async, backend)         │
  │                                │
  └────────────────────────────────┘
```

### Subscription Store (`stores/subscription.ts`)

| Method / State        | Description                                                                            |
| --------------------- | -------------------------------------------------------------------------------------- |
| `status`              | `SubscriptionStatus \| null` — plan, status, periods                                   |
| `loading`             | Boolean                                                                                |
| `error`               | String \| null                                                                         |
| `fetch()`             | GET `/api/v1/subscription/status` — hydrates store                                     |
| `createInvoice(plan)` | POST `/api/v1/subscription/create-invoice` → returns `{ checkoutUrl }`, redirects user |
| `cancel()`            | POST `/api/v1/subscription/cancel` — cancels plan                                      |
| `clearError()`        | Resets error                                                                           |

### Redirect Handling (`/payment/success`)

After PayMongo redirects the user back:

1. Polls `/api/v1/subscription/status` every 3 seconds.
2. Once `status.plan !== "free"`: redirect to `/dashboard`.
3. Backend webhook (`POST /api/v1/subscription/webhook`) processes the payment asynchronously — the frontend polls until the webhook has updated the plan.

---

## QR Scanning Flow

```
Teacher navigates to /attendance
          │
          ▼
  Tap "Scan QR" button
          │
          ▼
  useQrScanner hook
  ├── Requests camera permission (facingMode: "environment")
  ├── Initializes BrowserMultiFormatReader
  └── Starts continuous decode
          │
          ▼
  Student presents QR code
  (encodes student ID or time-limited token)
          │
          ▼
  @zxing/browser decodes → text result
          │
          ▼
  onResult callback → attendance.markTimeIn(studentId)
          │
          ▼
  Backend records attendance + push notification
          │
          ▼
  UI feedback: success toast, student name on scanned list
  Scanner continues for next student
```

---

## Component Architecture

### Layout Components

| Component       | Location                        | Description                        |
| --------------- | ------------------------------- | ---------------------------------- |
| `ThemeProvider` | `components/theme-provider.tsx` | `next-themes` wrapper (dark/light) |
| `Navbar`        | `components/navbar.tsx`         | Top navigation bar                 |
| `NavMenu`       | `components/nav-menu.tsx`       | Navigation menu items              |

### UI Primitives (shadcn/ui)

Located in `components/ui/`:

| Component             | Description               |
| --------------------- | ------------------------- |
| `button.tsx`          | Button with variants      |
| `badge.tsx`           | Status badge              |
| `navigation-menu.tsx` | Navigation menu primitive |
| `popover.tsx`         | Popover overlay           |
| `sheet.tsx`           | Slide-out panel           |

### Feature Components (planned)

| Component           | Route                         | Description                          |
| ------------------- | ----------------------------- | ------------------------------------ |
| `DashboardSection`  | `/dashboard`                  | Section list with attendance summary |
| `SectionCard`       | `/dashboard`                  | Individual section card              |
| `CreateSectionForm` | `/sections/new`               | New section form                     |
| `StudentList`       | `/sections/[id]`              | Students with attendance status      |
| `AddStudentForm`    | `/sections/[id]/students/new` | Add student form                     |
| `AttendanceGrid`    | `/attendance`                 | Student grid with scan/manual entry  |
| `QRScanner`         | `/attendance`                 | Camera view + scan overlay           |
| `ScannedList`       | `/attendance`                 | Recently scanned students            |
| `JoinSectionForm`   | `/parent/join`                | Class code input form                |
| `LinkedStudents`    | `/parent/students`            | Linked children list                 |
| `SubscriptionPlans` | `/subscription`               | Plan cards + checkout                |
| `SettingsForm`      | `/settings`                   | Profile update / password change     |

---

## Environment Variables

All env vars are validated at startup via `env.ts` using Zod. Import `env` from `@/env` — never access `process.env` directly.

| Variable                | Default                 | Description                                |
| ----------------------- | ----------------------- | ------------------------------------------ |
| `API_URL`               | `http://localhost:8080` | Backend URL (used by middleware as proxy target) |
| `NEXT_PUBLIC_API_URL`   | `http://localhost:8080` | Backend API base URL (fallback for direct calls) |
| `NEXT_PUBLIC_VAPID_KEY` | —                       | Web Push VAPID public key                  |

---

## Scripts

| Script      | Command                | Description                  |
| ----------- | ---------------------- | ---------------------------- |
| `dev`       | `next dev`             | Start dev server (port 3001) |
| `build`     | `next build`           | Production build             |
| `start`     | `next start`           | Start production server      |
| `lint`      | `eslint`               | Run ESLint                   |
| `format`    | `prettier --write ...` | Format all TS/TSX files      |
| `typecheck` | `tsc --noEmit`         | TypeScript type checking     |

---

## Future Considerations

- **Loading states**: Use React `useTransition` or `useActionState` for pending states on server actions.
- **Error boundaries**: Wrap feature sections with error boundaries for graceful failure.
- **Offline support**: Service worker + caching strategy for attendance data.
- **PWA**: Web manifest + service worker for installable experience.
- **E2E tests**: Playwright for critical flows (sign-up, sign-in, attendance marking).
