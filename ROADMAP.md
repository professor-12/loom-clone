# Loom Clone — Product & Engineering Roadmap

Personal portfolio project demonstrating senior-level ownership: async video, security, collaboration, and operational maturity.

---

## Current state (baseline)

**Stack:** Next.js 15 (App Router, Turbopack), React 19, PostgreSQL + Prisma 6, Tailwind v4, Radix, Cloudinary (upload/thumbnails), custom JWT + Google/GitHub OAuth (`better-auth` present but largely unused in application code). Docker present.

**Working today:** Landing, OAuth login, screen + camera recording, multipart upload → Cloudinary → `Video` records, paginated library, delete, share URL playback.

**Schema ahead of code:** Workspaces/members, `VideoShare`, `Comment`, `Folder` tree, billing/invoice/transaction, `Integration` — mostly not wired. Folders have server actions but library UI is incomplete; “Upload a video” is not connected. Notifications page is a shell.

**Gaps to address early:** Authorization on share/API vs `Visibility`, authenticated/scoped Cloudinary signing, middleware coverage vs dashboard routes, automated tests and CI, dependency clarity (`@ffmpeg/ffmpeg`, `better-auth`).

---

## Roadmap philosophy

Recruiters and hiring managers respond well to:

1. **Correct access control** — who can see what; how public / unlisted / workspace / private links behave.
2. **Async media pipeline** — upload, processing, playback; optional transcoding without blocking the UI.
3. **Collaboration** — comments, shares, optional workspace roles.
4. **Operational maturity** — tests, CI, observability, rate limits, migrations.
5. **Differentiation** — transcripts + search, webhooks, or analytics (so the project is not only “CRUD + video URL”).

---

## Phase 0 — Foundation

| ID | Deliverable | Signals |
|----|-------------|---------|
| 0.1 | **AuthZ for videos** — enforce `Visibility` on share page, library, and APIs; optional token/signed links for `UNLISTED` | Threat modeling beyond login |
| 0.2 | **Harden upload & Cloudinary signing** — authenticate routes; scope signatures to user/folder; upload limits | Production security |
| 0.3 | **Middleware + route protection** — align matcher with all dashboard routes; consistent redirects | Platform consistency |
| 0.4 | **OAuth / account edge cases** — provider linking, bug fixes in auth flows | Real-user robustness |
| 0.5 | **Dependencies** — wire `@ffmpeg/ffmpeg` (e.g. trim preview) or remove; align `better-auth` vs custom JWT | Maintainability |
| 0.6 | **Lint in CI/build** — re-enable ESLint on build or enforce in CI | Quality gates |

---

## Phase 1 — Product completeness

| ID | Deliverable | Signals |
|----|-------------|---------|
| 1.1 | **Folders end-to-end** — list/create/rename/delete; set `folderId` on upload; filter library | Data modeling, finishing features |
| 1.2 | **File upload** — “Upload a video” from disk through same pipeline as recording (progress, errors) | Full ingestion |
| 1.3 | **Video metadata** — edit title/description; optional thumbnail selection | SaaS polish |
| 1.4 | **Share controls** — persist `VideoShare`, revoke link, copy with correct visibility; optional password/expiry | Domain fit (Loom-like) |
| 1.5 | **Comments** — use Prisma `Comment` + server actions + optimistic UI | Collaboration |
| 1.6 | **Viewer analytics** — view counts; optional unique viewers (session/cookie) | Product + data |
| 1.7 | **Notifications** — in-app list for comments/shares using notifications route | Cross-feature integration |

---

## Phase 2 — Workspaces & roles

| ID | Deliverable | Signals |
|----|-------------|---------|
| 2.1 | **Workspace CRUD + switcher** — create workspace; invite flow (email or token v1) | Multi-tenant thinking |
| 2.2 | **Role enforcement** — `OWNER` / `ADMIN` / `MEMBER` on video and folder actions | Authorization at scale |
| 2.3 | **Workspace-scoped library** — `workspaceId` on videos, filters, default workspace | Clear data boundaries |

---

## Phase 3 — Pipeline & performance

| ID | Deliverable | Signals |
|----|-------------|---------|
| 3.1 | **Background jobs** — queue (e.g. Inngest, Trigger.dev, BullMQ) for post-upload work | Async systems |
| 3.2 | **Adaptive playback / transcoding** — Cloudinary transforms or HLS; document tradeoffs | Video domain depth |
| 3.3 | **Trim or chapters** — FFmpeg.wasm client-side or server-side via Cloudinary | UX + cost/latency tradeoffs |
| 3.4 | **CDN / caching** — headers, Next image/video optimization | Performance |

---

## Phase 4 — Integrations & platform

| ID | Deliverable | Signals |
|----|-------------|---------|
| 4.1 | **Webhooks** — e.g. `video.ready`, `video.viewed` | B2B API mindset |
| 4.2 | **Slack or Discord** — notify when recording is ready | Practical integration |
| 4.3 | **Transcripts + search** — speech-to-text; search titles + transcript snippets | High-impact demo |
| 4.4 | **Embeddable player** — iframe or oEmbed-style page | Parity with commercial tools |

---

## Phase 5 — Billing (optional)

| ID | Deliverable | Signals |
|----|-------------|---------|
| 5.1 | **Stripe** — Customer Portal + webhooks mapped to `Billing` / `Invoice` / `Transaction` | Money-moving systems |
| 5.2 | **Plan limits** — storage, duration, workspace caps | Policy enforcement |

---

## Phase 6 — Engineering excellence

| ID | Deliverable | Signals |
|----|-------------|---------|
| 6.1 | **Tests** — Vitest for logic; Playwright E2E (record → upload → share); test DB strategy | Discipline |
| 6.2 | **CI** — GitHub Actions: lint, typecheck, test, build on PR | Shipping hygiene |
| 6.3 | **Observability** — structured errors/logging; optional Sentry or OpenTelemetry | Operations |
| 6.4 | **Rate limiting** — upload and auth endpoints | Abuse prevention |
| 6.5 | **Architecture doc** — README diagram: record flow, auth, Cloudinary, DB | Communication |

---

## Suggested implementation order

1. 0.1 — Video visibility + share authorization  
2. 0.2 — Secure upload/signing  
3. 0.3 — Middleware alignment  
4. 1.1 — Folders wired to UI + upload  
5. 1.2 — File upload from library  
6. 1.4 — Share model + revoke/copy semantics  
7. 1.5 — Comments  
8. 6.1 + 6.2 — One critical E2E path + CI (early to limit rework)  
9. 2.1–2.3 — Workspaces  
10. 3.1 — Background jobs  
11. One differentiator: **4.3** (transcripts) **or** **4.1** (webhooks)  
12. 5.x — Billing only if you want the Stripe narrative  

---

## Resume-ready one-liner (evolve as you ship)

> Async video SaaS: Next.js 15, Prisma/Postgres, Cloudinary pipeline, OAuth, role-based workspaces, signed sharing, comments, background processing, E2E tests + CI.

---

*Last updated: April 2026*
