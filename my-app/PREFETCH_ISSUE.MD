# Next.js App Router — Prefetch in Dashboards

> **TL;DR:** If a route is loading without being clicked, it's almost always because of `<Link />` prefetching. Use `prefetch={false}` on heavy sidebar links to stop it.

---

## What is Prefetch?

Next.js **automatically prefetches** any route linked via `<Link />`. This means:

- Server Components for that route are **rendered in the background**
- All server-side data fetching (DB, Redis, API calls) **runs immediately**
- This happens **before the user ever clicks**

Prefetch triggers when a `<Link />` is **visible in the viewport**, **hovered**, or simply **mounted** in the DOM.

---

## Why It Becomes a Problem in Dashboards

A typical dashboard layout looks like this:

```
/dashboard/layout.tsx
 ├── Sidebar (always mounted)
 │    ├── <Link href="/dashboard" />
 │    ├── <Link href="/dashboard/connections" />
 │    └── <Link href="/dashboard/settings" />
 └── {children}
```

Because the Sidebar is **always rendered**, Next.js assumes the user might click any of those links. So it prefetches **all of them** on mount. The result:

- `/dashboard/connections` server logic runs
- `/dashboard/settings` server logic runs
- DB queries, Redis calls, and Auth checks **execute in the background**
- You see unexpected server logs and Vercel function invocations

**This is expected behavior — not a bug.**

---

## Common Misconceptions

| ❌ People think prefetch is caused by | ✅ Prefetch is actually caused by               |
| ------------------------------------- | ----------------------------------------------- |
| Redis connection changes              | `<Link />` being mounted or visible             |
| Layout re-rendering or fetching data  | Next.js automatic prefetch on `<Link />`        |
| Server Actions running                | Background route prefetching                    |
| Background workers finishing jobs     | Links in always-visible components like Sidebar |

---

## The Fix

Disable prefetch on routes with heavy server logic:

```tsx
// ✅ Do this — heavy routes
<Link href="/dashboard/connections" prefetch={false}>
  Connections
</Link>

<Link href="/dashboard/settings" prefetch={false}>
  Settings
</Link>
```

```tsx
// ✅ Keep default prefetch — lightweight routes
<Link href="/dashboard">Overview</Link>
```

After disabling prefetch:

- The route is **not fetched** in the background
- Server code runs **only on click**
- No unexpected DB or API calls
- Layout stays stable and predictable

---

## Best Practices for Dashboards

| Area                  | Rule                                                  |
| --------------------- | ----------------------------------------------------- |
| **Sidebar links**     | Use `prefetch={false}` on heavy or rarely-used routes |
| **Layout**            | Fetch only stable, shared data (e.g., user session)   |
| **Pages**             | Fetch dynamic or route-specific data inside the page  |
| **Client Components** | Never call Server Actions directly from sidebar nav   |
| **Quotas / Stats**    | Pass via props or refresh explicitly on user action   |

### When to use `prefetch={false}`

- Settings pages
- Connections / integrations pages
- Analytics or reporting pages
- Any route that triggers expensive server logic

### When to keep default prefetch

- Primary / most-visited routes
- Lightweight pages with minimal server work
- Routes the user navigates to frequently

---

## Mental Model

```
Sidebar mounts
  → Links are visible in viewport
    → Next.js prefetches linked routes
      → Server Components + data fetching run
        → DB / Redis / API calls execute
```

**Control the chain by controlling `prefetch` on `<Link />`.**
