# Application Flow Document
## Mithlesh Personal Portfolio Redesign

- **Version:** 1.0
- **Purpose:** Explain how visitors and the admin move through the application.

---

## 1. Application map

```text
Portfolio Website
|
|-- Public
|   |-- Home
|   |   |-- Hero
|   |   |-- About
|   |   |-- Capabilities / Skills
|   |   |-- Selected Projects
|   |   |-- Journey / Education
|   |   |-- Contact
|   |   |-- Footer
|   |
|   |-- Project Archive
|   |
|   |-- Project Detail (proposed)
|
|-- Admin
    |-- Login
    |-- Dashboard
        |-- Hero
        |-- About
        |-- Education
        |-- Skills
        |-- Projects
        |-- Contact
        |-- Messages
        |-- Settings
```

## 2. Public visitor journey

```text
Visitor opens website
  |
  v
Portfolio data loading
  |-- API success --> Render portfolio
  |-- API failure --> Show friendly fallback/error state
  |
  v
Hero
  |-- View selected work --> Scroll to Projects
  |-- Contact me --> Scroll to Contact
  |-- Resume --> Download only if verified resume exists
  |
  v
About
  |
  v
Capabilities / Skills
  |
  v
Selected Projects
  |-- Live demo --> Open external project
  |-- Source code --> Open GitHub repository
  |-- View details --> Open project detail route (if published)
  |-- All projects --> Open archive
  |
  v
Journey / Education
  |
  v
Contact
  |-- Invalid form --> Show field errors
  |-- Valid form --> POST /api/messages
       |-- Success --> Show confirmation and clear form
       |-- Failure --> Keep entered data and show retry message
  |
  v
Footer / Social links
```

## 3. Public page behavior

### Hero
- Show name, concise role statement, portrait and short introduction.
- Primary CTA: Explore selected work.
- Secondary CTA: Contact.
- Resume CTA is conditional on a real resume file.
- Scroll cue is decorative and must not be the only way to navigate.

### About
- Show a short, truthful personal/professional story.
- Show strengths or working principles.
- Do not add invented employment, client or achievement claims.

### Capabilities
- Group technologies by practical purpose.
- Example groupings: Frontend, Backend, Database, Tools & Platforms.
- Avoid a huge wall of logos without context.

### Selected Projects
- Display 3–5 projects chosen by the owner.
- Each card can show title, short summary, contribution, status, stack, image and links.
- Hide unavailable links instead of using `#` placeholders.

### Journey
- Show education and verified milestones.
- Keep chronology accurate and concise.

### Contact
- Fields: name, email, subject (optional or select), message.
- Client-side validation is for user experience; backend validation remains mandatory.
- Provide loading, success, failure and retry states.

## 4. Project archive flow

```text
Visitor selects "All projects"
  |
  v
Project Archive
  |-- Load projects
  |-- Optional category filter (only if project categories exist)
  |-- Optional search (only if useful for actual number of projects)
  |
  v
Select project
  |-- Live link available --> External demo
  |-- Source available --> GitHub
  |-- Detail content available --> Project detail page
  |-- Otherwise --> Show card content only
```

## 5. Admin authentication flow

```text
/admin/login
  |
  v
Enter email/username and password (match existing auth contract)
  |
  v
POST /api/auth/login
  |-- Invalid --> Show safe error
  |-- Valid --> Establish admin session
  |
  v
Admin dashboard
  |
  |-- Session valid --> Continue
  |-- Expired/invalid --> Return to login
  |
  v
Logout --> Clear session and return to login
```

Use the current JWT contract until a deliberate cookie-auth migration is approved. If changing token storage, update backend and frontend together and test CSRF/XSS implications.

## 6. Admin content editing flow

```text
Admin opens a section tab
  |
  v
Load current portfolio data
  |
  v
Edit fields / reorder content / select image
  |
  v
Client validation
  |-- Invalid --> Show field errors
  |-- Valid --> Save
  |
  v
PUT /api/portfolio
  |-- Success --> Confirm saved state
  |-- Failure --> Restore prior state or keep draft and show retry
  |
  v
Public website fetches updated data
```

The existing context uses optimistic updates and rollback behavior. Preserve that reliability or replace it with an equally clear save-state model.

## 7. Admin upload flow

```text
Admin chooses profile or project image
  |
  v
Validate type and size in UI
  |
  v
POST /api/upload/profile OR /api/upload/project
  |
  v
Backend validates file content and size
  |
  v
Upload to durable object storage
  |
  v
Return canonical secure URL + asset identifier
  |
  v
Save URL in portfolio document
```

Local disk paths must not be treated as durable production media when using ephemeral/serverless hosting.

## 8. Admin messages flow

```text
Admin opens Messages
  |
  v
GET /api/messages
  |
  v
View unread/read messages
  |-- Open message --> PATCH /api/messages/:id/read
  |-- Delete message --> Confirm --> DELETE /api/messages/:id
  |
  v
Refresh message list and unread count
```

## 9. Password recovery flow

```text
Admin selects Forgot password
  |
  v
Enter registered recovery email
  |
  v
POST /api/auth/request-otp
  |
  v
Receive OTP by email
  |
  v
Enter OTP + new password
  |
  v
POST /api/auth/verify-otp
  |-- Invalid/expired/too many attempts --> Safe error
  |-- Valid --> Reset password and invalidate OTP
  |
  v
Return to login
```

OTP must be cryptographically generated, hashed in storage, short-lived and rate-limited.

## 10. Navigation rules

- Desktop: compact persistent navigation with clear active section.
- Mobile: simple menu or compact navigation; content remains a natural vertical scroll.
- Deep links such as `/#projects` must work.
- Project archive/detail pages are actual routes.
- Essential actions must work by keyboard and touch, not hover alone.
- Do not trap normal scrolling inside a pinned horizontal sequence.
