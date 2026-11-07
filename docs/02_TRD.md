# Technical Requirements Document (TRD)
## Mithlesh Personal Portfolio Redesign

- **Version:** 1.0
- **Status:** Planning baseline
- **Architecture decision:** Retain React + Express + MongoDB for the first redesign release.

---

## 1. Current technical architecture

### Frontend
- React 19.
- Vite.
- React Router.
- JavaScript and CSS.
- Shared portfolio data/context.
- Public section components and separate admin pages.
- Existing custom visual effects and scroll behavior.

### Backend
- Node.js.
- Express 4.
- Mongoose.
- JWT authentication.
- bcryptjs password hashing.
- Multer upload middleware.
- Nodemailer email delivery.
- OTP and settings models.

### Database
MongoDB collections/models observed:
- Portfolio.
- Message.
- OTP.
- Settings.

### Deployment
- Vercel configuration exists for frontend and backend.
- Backend serverless behavior, environment variables and live production configuration must be verified before deployment changes.

## 2. Architecture principles

1. Keep the current backend unless a specific technical blocker requires a change.
2. Preserve current API behavior while adding optional fields.
3. Separate public portfolio UI from admin UI.
4. Centralize frontend API calls in one API client.
5. Validate all incoming backend data.
6. Store images in durable object storage, not ephemeral local serverless disk.
7. Make animation optional and progressively enhanced.
8. Avoid a large rewrite of working components without a migration reason.

## 3. Proposed target architecture

```text
Browser
  |
  | HTTPS
  v
React + Vite Frontend
  |-- Public portfolio routes
  |-- Project archive/detail routes
  |-- Admin routes
  |-- Shared API client
  |
  | JSON API requests
  v
Express API
  |-- Portfolio routes
  |-- Auth routes
  |-- Message routes
  |-- Settings routes
  |-- Upload routes
  |
  | Mongoose
  v
MongoDB
  |
  +---- Durable media provider (Cloudinary or equivalent)
  |
  +---- Email provider via Nodemailer
```

## 4. Recommended frontend organization

Adapt the existing code instead of performing a risky all-at-once folder migration.

```text
frontend/src/
  app/
    router/
    providers/
    App.jsx
  components/
    layout/
    ui/
    motion/
  sections/
    HeroSection.jsx
    AboutSection.jsx
    CapabilitiesSection.jsx
    ProjectsSection.jsx
    JourneySection.jsx
    ContactSection.jsx
  pages/
    HomePage.jsx
    ProjectArchivePage.jsx
    ProjectDetailPage.jsx
    AdminLogin.jsx
    AdminDashboard.jsx
  features/
    portfolio/
    contact/
    admin/
  context/
    PortfolioContext.jsx
  lib/
    apiClient.js
    seo.js
    motion.js
  styles/
    tokens.css
    global.css
    motion.css
```

## 5. Motion and visual technology

- Start with CSS transitions and IntersectionObserver for simple reveals.
- Add GSAP + ScrollTrigger only for specific narrative sequences that cannot be achieved cleanly with CSS.
- Consider Lenis only after testing native scroll, accessibility and mobile behavior.
- Use Three.js / React Three Fiber only for a clearly defined visual feature. Lazy-load it and provide a static fallback.
- Do not add all animation libraries by default.
- Respect `prefers-reduced-motion`.
- Avoid custom cursor on touch devices.

## 6. API requirements

Keep current routes compatible:

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/portfolio` | Public portfolio content |
| PUT | `/api/portfolio` | Admin portfolio update |
| POST | `/api/auth/login` | Admin login |
| PUT | `/api/auth/change-password` | Change admin password |
| POST | `/api/auth/request-otp` | Request reset OTP |
| POST | `/api/auth/verify-otp` | Verify OTP and reset password |
| POST | `/api/messages` | Public contact submission |
| GET | `/api/messages` | Admin message inbox |
| PATCH | `/api/messages/:id/read` | Mark message read |
| DELETE | `/api/messages/:id` | Delete message |
| GET | `/api/settings` | Admin settings retrieval |
| PUT | `/api/settings` | Update allowlisted setting |
| POST | `/api/upload/profile` | Upload profile image |
| POST | `/api/upload/project` | Upload project image |

Recommended additions:
- `GET /health/live`
- `GET /health/ready`
- Pagination and filtering for admin messages.
- Optional project detail endpoint if project data grows beyond a small embedded list.

## 7. API response and validation conventions

Use a consistent response shape:

```json
{
  "success": true,
  "data": {},
  "message": "Request completed"
}
```

Error example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted fields"
  }
}
```

Requirements:
- Validate request body and query parameters.
- Allowlist writable portfolio fields.
- Validate MongoDB IDs before database operations.
- Normalize and validate email addresses.
- Set explicit maximum lengths for text fields.
- Do not return password hashes, OTP hashes, JWT secrets or provider secrets.
- Use consistent HTTP status codes.

## 8. Environment configuration

| Variable | Use | Handling |
|---|---|---|
| `VITE_API_BASE_URL` | Frontend API URL | Public URL only; configure per environment |
| `MONGO_URL` | MongoDB connection | Backend secret |
| `JWT_SECRET` | JWT signing | Backend secret, strong random value |
| `ADMIN_PASSWORD` | Initial admin provisioning if retained | Do not expose or use as normal public config |
| `RECOVERY_EMAIL` | Recovery destination | Backend configuration |
| `EMAIL_USER` | Email provider username | Backend secret |
| `EMAIL_PASS` | Email provider password/app password | Backend secret |
| `ADMIN_EMAIL` | Notification destination | Backend configuration |
| `CLOUDINARY_CLOUD_NAME` | Media provider | Backend config |
| `CLOUDINARY_API_KEY` | Media provider | Backend secret |
| `CLOUDINARY_API_SECRET` | Media provider | Backend secret |

Never commit `.env` files. Frontend variables prefixed with `VITE_` are exposed to the browser and must not contain secrets.

## 9. Reliability and performance

- Reuse MongoDB connections safely in serverless runtime.
- Database connection failure must return a controlled 503 rather than continuing into database handlers.
- Add timeouts and clear API error handling.
- Lazy-load archive images and non-critical visual effects.
- Use responsive images and modern formats.
- Split admin code from public bundle.
- Avoid layout shifts by reserving image dimensions.
- Cache public portfolio data appropriately; do not cache admin responses.
- Provide fallback UI when API or optional visual assets fail.

## 10. Deployment requirements

Before changing deployment:
1. Verify actual production frontend and API URLs.
2. Verify all production environment variables.
3. Verify MongoDB connectivity and indexes.
4. Verify CORS with exact production domains.
5. Verify uploaded assets remain accessible after new invocations/deployments.
6. Run public and admin smoke tests.
7. Keep a rollback deployment available.

## 11. Technical decision gates

- Do not migrate auth to cookies until frontend and backend can be changed and tested together.
- Do not add a new animation dependency without a measured design requirement.
- Do not migrate project storage to a new collection unless current embedded schema becomes a real limitation.
- Do not change hosting provider as part of a visual redesign unless the current deployment cannot meet reliability requirements.
