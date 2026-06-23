# QR Attendnz — Frontend System Design

## Project Overview

QR Attendnz is a QR-code-based attendance tracking system. Teachers create sections (classes), add students, and mark daily attendance (time-in/time-out) by scanning QR codes. Parents can join sections via a class code, link themselves to their children's records, and receive Web Push notifications when attendance is recorded.

The frontend is a Next.js 16 application using the App Router, styled with shadcn/ui (Tailwind v4), and communicates with the backend REST API via server actions.

---

## Technology Stack

| Layer             | Technology                  | Purpose                                     |
| ----------------- | --------------------------- | ------------------------------------------- |
| Framework         | **Next.js 16**              | React meta-framework (App Router, SSR, RSC) |
| UI Library        | **React 19**                | Component rendering                         |
| Styling           | **Tailwind CSS v4**         | Utility-first CSS                           |
| Component Library | **shadcn/ui** (base-luma)   | Primitive UI components                     |
| State Management  | **Zustand**                 | Lightweight UI state management             |
| Validation        | **Zod**                     | Runtime env variable validation             |
| Icons             | **lucide-react**            | Icon library                                |
| Animations        | **motion**                  | Framer Motion animations                    |
| Theme             | **next-themes**             | Dark/light mode                             |
| QR Scanning       | **@zxing/browser**          | Browser-based QR code decoding              |
| Fonts             | **Geist Mono** + **Outfit** | Monospace + sans-serif typefaces            |
| Linting           | **ESLint** + Prettier       | Code quality & formatting                   |
| Package Manager   | **Bun**                     | JavaScript runtime & package manager        |

---

## Directory Structure

```
frontend/
├── AGENTS.md                     # Agent conventions
├── SYSTEM-DESIGN.md              # This file
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
│   └── attendance.ts             # Live attendance marking (time-in/time-out)
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
| `/subscription`                      | Yes  | teacher | Plan management & billing                     |
| `/settings`                          | Yes  | any     | Profile / account settings                    |

### Route Groups (planned)

```
app/
├── (auth)/
│   ├── sign-in/page.tsx
│   ├── sign-up/page.tsx
│   └── forgot-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx              # Authenticated layout (sidebar, navbar)
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

| Store          | File                   | State / Actions                                                     | Sync          |
| -------------- | ---------------------- | ------------------------------------------------------------------- | ------------- |
| `ui`           | `stores/ui.ts`         | `sidebarOpen`, `scannerOpen`, `lastScannedStudentId`                | —             |
| `session`      | `stores/session.ts`    | `session`, `fetch()`, `signIn()`, `signUp()`, `signOut()`          | On action     |
| `sections`     | `stores/sections.ts`   | `sections[]`, `fetch(date?)`                                        | Polling       |
| `attendance`   | `stores/attendance.ts` | `marked[]`, `timeIn(id)`, `timeOut(id)`                             | On mutation   |

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

  useEffect(() => { fetch() }, [fetch])
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
- **Mutations** (create, update, delete) use server actions in `actions/`, then call the store's `fetch()` to refresh.
- **Server actions** remain for SSR data fetching and mutations needing server-side validation.

---

## Authentication Flow

### Session-Based Auth via better-auth

1. **Sign-up / Sign-in**: User submits form → server action `auth.signUp()` or `auth.signIn()` → backend sets an HTTP-only session cookie.
2. **Subsequent requests**: The cookie is automatically forwarded by `credentials: "include"` in every `lib/api.ts` call.
3. **Session check**: Server components / layouts call `auth.getSession()` to check auth state. If no session, redirect to sign-in.
4. **Sign-out**: `auth.signOut()` → backend clears the session cookie.

### Auth Guards

- **Public routes** (`/`, `/auth/*`): accessible without session.
- **Protected routes** (`/dashboard`, `/sections/*`, `/attendance`, `/parent/*`, `/subscription`, `/settings`): parent layout checks session, redirects to sign-in if unauthenticated.
- **Role-based access**: Dashboard/sections/attendance pages additionally verify `user.role.includes("teacher")`. Parent pages verify `user.role.includes("parent")`.

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

| Variable                | Default                 | Description               |
| ----------------------- | ----------------------- | ------------------------- |
| `NEXT_PUBLIC_API_URL`   | `http://localhost:8080` | Backend API base URL      |
| `NEXT_PUBLIC_VAPID_KEY` | —                       | Web Push VAPID public key |

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
