# Backend Schema & API Specification
## Mithlesh Personal Portfolio Redesign

- **Version:** 1.0
- **Database:** MongoDB / Mongoose
- **Backend:** Node.js / Express
- **Status:** Existing schema audit + proposed backward-compatible additions

---

## 1. Existing models observed

### Portfolio
Single portfolio document containing:
- `hero`
- `about`
- `education[]`
- `skills`
- `projects[]`
- `contact`
- timestamps

### Message
- `name`
- `email`
- `subject`
- `message`
- `read`
- timestamps

### OTP
- `email`
- `otp`
- `createdAt`
- TTL expiry currently set to 300 seconds

### Settings
- unique `key`
- string `value`
- timestamps

## 2. Current API inventory

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/` | Public | Basic health/status |
| GET | `/api/portfolio` | Public | Fetch portfolio document |
| PUT | `/api/portfolio` | Admin JWT | Update portfolio |
| POST | `/api/auth/login` | Public | Admin login |
| PUT | `/api/auth/change-password` | Admin JWT | Change password |
| POST | `/api/auth/request-otp` | Public | Request reset OTP |
| POST | `/api/auth/verify-otp` | Public | Verify OTP and reset password |
| POST | `/api/messages` | Public | Create contact message |
| GET | `/api/messages` | Admin JWT | List messages |
| PATCH | `/api/messages/:id/read` | Admin JWT | Mark read |
| DELETE | `/api/messages/:id` | Admin JWT | Delete message |
| GET | `/api/settings` | Admin JWT | Read settings |
| PUT | `/api/settings` | Admin JWT | Update setting |
| POST | `/api/upload/profile` | Admin JWT | Upload profile image |
| POST | `/api/upload/project` | Admin JWT | Upload project image |

Do not remove or rename existing routes without an explicit migration plan.

## 3. Proposed Portfolio document shape

This is a target shape, not a requirement to replace the current collection. Add optional fields with defaults so existing documents continue to work.

```js
{
  hero: {
    name: String,
    subtitle: String,
    bio: String,
    profileImage: String,
    eyebrow: String,              // optional
    primaryCtaLabel: String,      // optional
    primaryCtaHref: String,       // optional
    secondaryCtaLabel: String,    // optional
    secondaryCtaHref: String     // optional
  },

  about: {
    professionalSummary: String,
    quote: String,
    badges: [{ label: String, type: String }],
    storyBlocks: [{               // optional
      heading: String,
      body: String
    }]
  },

  education: [{
    year: String,
    title: String,
    description: String,
    dotColor: String,
    institution: String,          // optional
    credential: String,           // optional
    sortOrder: Number             // optional
  }],

  skills: {
    frontend: [String],
    backend: [String],
    tools: [String],
    capabilities: [{              // optional
      title: String,
      summary: String,
      technologies: [String]
    }]
  },

  projects: [{
    title: String,
    slug: String,                 // optional, unique when present
    tech: [String],
    description: String,
    previewImage: String,
    link: String,
    codeLink: String,
    linkLabel: String,
    icon: String,
    featured: Boolean,            // optional
    status: String,               // optional
    role: String,                 // optional
    problem: String,              // optional
    solution: String,             // optional
    highlights: [String],         // optional
    gallery: [String],            // optional
    sortOrder: Number,            // optional
    published: Boolean            // optional
  }],

  contact: {
    email: String,
    location: String,
    github: String,
    linkedin: String,
    youtube: String,
    resumeUrl: String,            // optional
    availabilityText: String      // optional
  }
}
```

## 4. Message model

### Existing
`name`, `email`, `subject`, `message`, `read`, timestamps.

### Recommended additions
- `status`: `new | in_progress | handled | archived`.
- `sourcePage`: optional page/section identifier.
- `createdAt`: indexed.
- Keep abuse metadata only when necessary and handle it according to applicable privacy requirements.

Validation:
- Name required, bounded length.
- Email valid format and bounded length.
- Subject bounded length.
- Message required and bounded length.
- Reject unexpected fields.
- Escape user-submitted values before inserting into HTML emails.

## 5. OTP model

### Current risk
OTP is stored as plaintext and current generation uses `Math.random`. This is not appropriate for a password-reset security flow.

### Recommended shape

```js
{
  email: String,
  otpHash: String,
  attemptCount: Number,
  expiresAt: Date,
  createdAt: Date
}
```

Requirements:
- Generate with `crypto.randomInt`.
- Store only a hash of the OTP.
- Expire after five minutes or a documented short duration.
- TTL index on `expiresAt`.
- Limit attempts.
- Rate-limit request and verification endpoints.
- Invalidate old OTP when a new one is issued.
- Never log OTP values.

## 6. Settings model

Current key/value model may remain, but:
- Allowlist accepted keys.
- Separate public settings from secrets.
- Never return admin password hash or provider secrets from GET settings.
- Validate each setting according to its key.
- Audit sensitive admin changes.

## 7. Upload architecture

### Current implementation concern
Multer currently writes to local disk and the backend serves `/uploads`. This can be unreliable for ephemeral/serverless deployments because files may not persist across instances or deployments.

### Recommended flow
1. Admin selects image.
2. Backend checks size, extension, MIME and actual file signature.
3. Backend uploads to Cloudinary or another durable object storage provider.
4. Backend returns a secure URL and provider asset ID.
5. Portfolio stores the URL and optional asset ID.
6. Public frontend loads the image from durable storage.

Do not assume Cloudinary is active just because related packages exist in dependencies. Verify environment variables and production configuration.

## 8. Security requirements

- Restrict CORS to known frontend/admin origins.
- Do not use unrestricted reflected origins with credentials.
- Add rate limiting to login, OTP and contact endpoints.
- Validate all request bodies and query parameters.
- Allowlist portfolio update fields.
- Escape user-submitted values in email HTML.
- Add Helmet/security headers.
- Use secure, HttpOnly, SameSite cookies if auth is migrated to cookie-based sessions; implement CSRF protection where required.
- If localStorage JWT remains temporarily, strengthen XSS/CSP protections and define expiry/re-auth behavior.
- Validate file content, not just extension.
- Reject unexpected file types; treat SVG carefully.
- Return controlled 503 when database is unavailable.
- Never expose secrets, password hashes or OTP hashes.
- Audit admin mutations without recording secrets.

## 9. API behavior improvements

- Standardize success/error response envelopes.
- Add pagination to admin messages.
- Add consistent validation errors.
- Add `/health/live` and `/health/ready`.
- Add request IDs and structured server logs.
- Avoid caching admin or message data.
- Public portfolio response may use short cache/revalidation.
- Keep the current API contract backward-compatible during rollout.

## 10. Migration rules

1. Back up MongoDB before schema changes.
2. Add optional fields first.
3. Ensure old documents render with defaults.
4. Update admin forms to edit new fields.
5. Test save/read round trip.
6. Do not delete old fields until all clients and production data are verified.
7. Keep a rollback path for deployment and data migration.
