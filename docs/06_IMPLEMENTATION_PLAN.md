# Implementation Plan
## Mithlesh Personal Portfolio Redesign

- **Version:** 1.0
- **Purpose:** Turn the PRD, TRD, App Flow, UI/UX and Backend Schema into an ordered execution plan for an AI coding agent and developer.

---

## 1. Execution rules for the AI coding agent

Before changing code:
1. Read all six Markdown documents.
2. Inspect the current repository. Do not assume the documents describe code that has changed since the snapshot.
3. Identify the current branch, package scripts, build commands and environment configuration.
4. Create a feature branch or confirm the user has a backup.
5. Do not print, expose, overwrite or commit secrets.
6. Do not delete working admin, API, auth, upload or message functionality.
7. Do not replace existing content with invented sample data.
8. Make changes in small phases and run relevant tests/build after each phase.
9. Report changed files, commands run, test results and unresolved issues.
10. Stop and ask before destructive database migrations, auth contract changes, hosting changes or paid service setup.

## 2. Phase 0 — Repository baseline and safety

### Tasks
- Inspect frontend and backend package scripts.
- Run existing frontend build and backend startup/test commands.
- Record current routes and component structure.
- Verify public portfolio fetch, admin login, portfolio save, contact submission, message inbox and image upload in a safe environment.
- Check `.gitignore` and ensure no `.env` or secret file is tracked.
- Capture screenshots of current desktop and mobile pages.
- Back up database before any schema migration.

### Exit criteria
- Baseline build status is known.
- Existing behavior is documented.
- Rollback plan exists.
- No production data is changed.

## 3. Phase 1 — Content and design decisions

### Tasks
- Confirm hero headline and short bio.
- Confirm the real portrait and approve desktop/mobile crops.
- Choose 3–5 featured projects.
- Confirm project status, role, technologies, screenshots, demo and repository URLs.
- Confirm whether a resume PDF exists.
- Approve section order, wireframes, design tokens and navigation behavior.

### Exit criteria
- No placeholder claims or dead links.
- Portrait and project assets are available.
- Design direction is approved before complex implementation.

## 4. Phase 2 — Design foundation and app shell

### Tasks
- Add design tokens for color, typography, spacing, surfaces and focus states.
- Build responsive page shell and section container.
- Refine navbar and mobile navigation.
- Establish semantic landmarks and heading structure.
- Centralize API base URL and request handling.
- Preserve current route behavior and admin route protection.

### Exit criteria
- Public shell works on mobile and desktop.
- Existing routes still resolve.
- API errors have a graceful UI state.

## 5. Phase 3 — Public portfolio sections

Implement in this order:
1. Hero.
2. About.
3. Capabilities/Skills.
4. Selected Projects.
5. Journey/Education.
6. Contact.
7. Footer.

### Rules
- Render content from the existing portfolio API.
- Do not hard-code content that belongs in MongoDB.
- Add sensible empty/fallback states.
- Hide unavailable external links.
- Use the real portrait only after it is supplied and approved.

### Exit criteria
- All sections render from API data.
- Existing admin edits update the public site.
- Contact form still posts to the existing endpoint.

## 6. Phase 4 — Project archive and detail experience

### Tasks
- Improve existing all-projects page.
- Add project filters only if actual project categories support them.
- Add project detail route only for projects with enough accurate case-study content.
- Add optional schema fields in a backward-compatible way.
- Ensure live and source links are correct.

### Exit criteria
- No broken project links.
- Direct project URL loads correctly.
- Old project documents still render.

## 7. Phase 5 — Motion and visual polish

### Tasks
- Add controlled reveal animations.
- Add subtle portrait depth/parallax only if it remains comfortable and readable.
- Consider desktop-only pinned project storytelling.
- Add reduced-motion fallback.
- Lazy-load any heavy 3D/animation code.
- Test scroll behavior on touch devices.

### Rules
- Do not add GSAP, Lenis or Three.js automatically.
- Add a dependency only when a specific approved interaction requires it.
- Do not block page content behind animation.
- Do not use scroll-jacking.

### Exit criteria
- Smooth on target devices.
- No scroll trapping.
- Reduced-motion mode works.
- No noticeable layout shift or heavy main-thread work.

## 8. Phase 6 — Backend hardening

### Tasks
- Restrict CORS origins.
- Add request validation and allowlisted update fields.
- Add rate limits to login, OTP and contact endpoints.
- Replace insecure OTP generation/storage with crypto-secure generation and hashed storage.
- Escape user-supplied email content.
- Fix database connection failure behavior.
- Restrict settings keys and hide secrets.
- Migrate uploads to durable storage after provider credentials/configuration are confirmed.
- Add health/readiness endpoints and structured errors.

### Exit criteria
- Security checks pass.
- Existing API contract remains compatible or a documented migration is completed.
- Uploaded images persist after new invocations/deployments.

## 9. Phase 7 — Admin compatibility and regression

Test:
- Login success/failure.
- Session expiry and logout.
- Hero edit/save.
- About edit/save.
- Education edit/save.
- Skills edit/save.
- Project create/edit/delete/reorder if supported.
- Contact detail edit.
- Profile/project image upload.
- Messages list, mark read and delete.
- Settings behavior.
- Password change and OTP recovery.
- Failed save and retry behavior.

### Exit criteria
Every existing admin workflow works against the actual database without data loss.

## 10. Phase 8 — QA and launch

### Responsive QA
- 360px.
- 390px.
- 768px.
- 1024px.
- 1440px.

### Functional QA
- Direct route load and refresh.
- Navigation and deep links.
- Project links.
- Contact form validation and API failure handling.
- Admin authentication and CRUD.
- Upload persistence.
- Empty and loading states.

### Accessibility QA
- Keyboard-only navigation.
- Focus visibility.
- Form labels/errors.
- Contrast.
- Alt text.
- Reduced motion.
- Screen reader landmarks.

### Performance/SEO QA
- Image optimization.
- Lazy loading.
- Bundle splitting.
- Layout shift.
- Metadata and canonical URLs.
- Open Graph preview.
- Sitemap and robots.
- Structured data.

### Launch requirements
- Production environment variables verified.
- CORS verified against production domains.
- MongoDB connectivity verified.
- Durable media URLs verified.
- Public and admin smoke tests pass.
- Rollback deployment available.

## 11. Definition of done

The redesign is complete only when:
- Public experience matches approved UI/UX specification.
- Mobile and desktop layouts are both intentional and polished.
- All content is accurate and editable.
- Existing backend/admin features are preserved.
- Contact and uploads work in production.
- Security and accessibility requirements are addressed.
- No known critical build/runtime errors remain.
- Tests and production smoke checks pass.
- The agent provides a concise change report and lists remaining limitations.

## 12. Recommended agent execution prompt

Use this only after the six documents and design assets are present in the repository:

> Read `01_PRD.md`, `02_TRD.md`, `03_APP_FLOW.md`, `04_UI_UX_DESIGN.md`, `05_BACKEND_SCHEMA.md` and `06_IMPLEMENTATION_PLAN.md` completely before making changes. First inspect the current repository and compare it with the documents. Do not start coding immediately. Report the current architecture, any mismatches, risks, missing assets and proposed file-level change plan. Wait for approval before Phase 0/1 actions that affect data or deployment. Implement one approved phase at a time. Preserve the existing backend, admin dashboard, authentication, contact messages and portfolio CMS unless a change is explicitly approved. Do not invent personal content, project claims, links or credentials. Run builds and tests after each phase and report exact results.
