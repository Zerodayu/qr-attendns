# Prisma → Drizzle + Neon → PGLite Migration

## Overview
Successfully migrated the ORM from Prisma to Drizzle and the database from Neon to PGLite with file-based persistence.

## Changes Made

### 1. **New Drizzle Configuration**

#### `/drizzle/schema.ts` (NEW)
- Defined `pushSubscription` table with PostgreSQL schema
- UUID primary key with auto-generation
- Unique constraint on `endpoint` field
- JSON type for keys with full TypeScript support

#### `/drizzle/index.ts` (UPDATED)
- Initialized PGLite client with file-based persistence
- Configured to use `DATABASE_URL` env variable or default to `./data/pglite.db`
- Exported Drizzle ORM client for use across the application

#### `/drizzle.config.ts` (NEW)
- Drizzle Kit configuration for migrations and schema management
- Set up to use PGLite driver

### 2. **API Route Migrations**

All three API routes migrated from Prisma Client to Drizzle ORM:

#### `/app/api/subscribe/route.ts`
- **Old**: `prisma.pushSubscription.upsert()` with Accelerate
- **New**: Drizzle query with explicit SELECT + INSERT/UPDATE logic
- Removed Prisma Accelerate extension dependency

#### `/app/api/send-push/route.ts`
- **Old**: `prisma.pushSubscription.findMany()`
- **New**: Drizzle `db.select().from(pushSubscription)`
- Removed Prisma Accelerate extension dependency

#### `/app/api/unsubscribe/route.ts`
- **Old**: `prisma.pushSubscription.deleteMany()`
- **New**: Drizzle `db.delete().where(eq(pushSubscription.endpoint, endpoint))`
- Removed Prisma Accelerate extension dependency

### 3. **Dependency Updates**

#### Removed from `package.json`
- `@prisma/client` (v6.12.0)
- `@prisma/extension-accelerate` (v2.0.2)
- `prisma` (v6.12.0)

#### Kept
- `drizzle-orm` (v0.45.2)
- `drizzle-kit` (v0.31.10)
- `@electric-sql/pglite` (v0.5.3) - already present

#### Build Script
- **Old**: `"build": "prisma generate && next build"`
- **New**: `"build": "next build"`

### 4. **File Cleanup**
- ✓ Removed `/prisma` directory entirely
- ✓ Removed `.prisma` directories from node_modules

### 5. **Configuration & Documentation**

#### `.env.example` (NEW)
```env
# File-based persistence (recommended for production)
DATABASE_URL=file:./data/pglite.db

# Alternative: In-memory database (ephemeral)
# DATABASE_URL=memory://
```

#### `.gitignore` (UPDATED)
- Added `/data/` to ignore PGLite database files

#### `tsconfig.json` (NO CHANGE)
- Path alias `@/*` already configured - works with new imports

## Database Setup

### PGLite Features
✓ File-based persistence (survives restarts)  
✓ Full PostgreSQL compatibility  
✓ Works in Node.js/Next.js  
✓ Suitable for single-server production deployments  
✓ Built-in to Next.js edge functions (when needed)

### Schema
The `PushSubscription` table is automatically created on first run:

```sql
CREATE TABLE "PushSubscription" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  keys JSON NOT NULL
);
```

## Next Steps

1. **Install dependencies**: `bun install` or `npm install`
2. **Set environment variable**: Create `.env.local` with `DATABASE_URL=file:./data/pglite.db`
3. **Run development server**: `bun dev` or `npm run dev`
4. **Database initialization**: PGLite will auto-create tables on first query

## Verification Checklist

- ✓ No Prisma imports remain in codebase
- ✓ All 3 API routes migrated to Drizzle
- ✓ Drizzle client properly configured with PGLite
- ✓ Package.json dependencies cleaned up
- ✓ Build script simplified
- ✓ Environment documentation created
- ✓ Gitignore updated for data directory

## Migration Compatibility

| Feature | Status |
|---------|--------|
| Push notifications | ✓ Fully compatible |
| JSON storage | ✓ Works with PGLite |
| Production use | ✓ File persistence supported |
| TypeScript types | ✓ Full type safety with Drizzle |

## Rollback (if needed)

Git history contains the full Prisma implementation. To revert:
```bash
git log --oneline  # Find migration commit
git revert <commit-hash>
```

## Notes

- PGLite is single-process, ideal for serverless and single-server deployments
- If scaling to multiple servers later, migrate to traditional PostgreSQL
- Drizzle migrations can be generated via `drizzle-kit` if schema changes
- All existing functionality preserved - only ORM/DB layer changed
