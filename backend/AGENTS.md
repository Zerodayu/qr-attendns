# File Structure

Routes follow a feature-module pattern (see <https://github.com/Zerodayu/bun-elysia-app>):

```
src/
├── index.ts              # Elysia app entry point
├── routes.ts             # Aggregates all feature route plugins
├── auth/                 # Auth (better-auth config, session guard macro)
└── {feature}/
    ├── controller.ts     # Route definitions (Elysia plugin with prefix + tags)
    ├── service.ts        # Business logic (class with methods)
    └── model.ts          # Validation schemas using Elysia's t + Static types
```

## Conventions

- **controller.ts**: Define routes as an Elysia plugin with `prefix` and `tags`. Mount auth guard via `.use(authPlugin)`, then guard individual routes with `{ auth: true }`. Use `detail` for OpenAPI descriptions.
- **service.ts**: Class-based business logic. One class per feature. Throws on errors; controller handles status codes.
- **model.ts**: Validation schemas using Elysia's `t` from `elysia`. Export both schema objects and `Static<typeof ...>` types.
- **routes.ts**: Import and chain feature plugins: `.use(featureRoutes)`. The `api/v1/` prefix is set here, so feature routes use relative paths.
