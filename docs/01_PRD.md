# Product Requirements Document (PRD)
## Mithlesh Personal Portfolio Redesign

- **Product:** Mithlesh Rajbhar personal developer portfolio
- **Document:** PRD
- **Version:** 1.0
- **Status:** Planning baseline
- **Source of truth:** Uploaded `PortFolio-main.zip` repository snapshot
- **Design direction:** Hybrid cinematic storytelling + experimental editorial + restrained futuristic digital atmosphere
- **Motion preference:** Balanced, premium, smooth and controlled
- **Primary accent:** `#2B80FF`

---

## 1. Product vision

Redesign the existing portfolio into a memorable, professional, personal website that explains who Mithlesh is, what he builds, what technologies he works with, and how visitors can contact him.

The portfolio should feel custom-designed rather than like a generic developer template. It should use a scroll-led narrative, strong typography, a real personal portrait, carefully presented projects and restrained motion.

The redesign is a major frontend experience upgrade, **not a reason to unnecessarily replace the current backend or remove working admin features**.

## 2. Current product understanding

The repository is a full-stack portfolio, not a static landing page.

### Current stack observed
- Frontend: React 19, Vite, React Router, CSS.
- Backend: Node.js, Express 4.
- Database: MongoDB with Mongoose.
- Admin authentication: JWT and bcryptjs.
- Email: Nodemailer.
- Uploads: Multer currently writes to local disk.
- Deployment configuration: Vercel configuration exists for frontend and backend.

### Existing capabilities to preserve
- Public portfolio content retrieval.
- Admin login and protected dashboard.
- Editing hero, about, education, skills, projects and contact content.
- Profile and project image upload.
- Contact form submission.
- Admin message inbox, mark-as-read and delete.
- Password change and OTP password recovery.
- Settings management.

## 3. Product goals

1. Make the first screen immediately communicate identity, developer focus and personality.
2. Make the real portrait a key visual element without making the design feel like a personal-photo website.
3. Make selected projects the strongest proof of practical ability.
4. Make the entire public experience work well on mobile, tablet and desktop.
5. Keep all editable portfolio content manageable from the existing admin dashboard.
6. Improve security, storage reliability, accessibility, SEO and performance.
7. Keep the site understandable and usable even if decorative animation or 3D fails.

## 4. Target users and their needs

| Audience | What they need | Product response |
|---|---|---|
| Recruiters | Quick view of profile, skills, projects and contact | Clear introduction, concise skills, selected projects, contact/resume CTA |
| Potential clients | Evidence of what can be built | Project case studies, working demos, source links, inquiry form |
| Developers | Technical details and implementation evidence | Stack, features, role, architecture notes and repositories |
| General visitors | A sense of the person behind the work | Authentic portrait, personal story and journey |

## 5. Scope

### In scope
- Complete redesign of the public-facing UI.
- Responsive scroll-based home page.
- Hero, About, Capabilities/Skills, Selected Projects, Journey/Education, Contact and Footer.
- Improved project archive.
- Optional project detail pages for projects with enough content.
- Real user-supplied portrait.
- Smooth, restrained scroll and reveal animations.
- Existing API and admin CMS compatibility.
- Backend security and upload reliability improvements.
- SEO, accessibility and performance improvements.

### Out of scope unless separately approved
- Replacing MongoDB or Express with another backend.
- Rebuilding the admin CMS from scratch.
- Public user accounts, comments, payments or multi-author publishing.
- AI chatbot or AI-generated profile identity.
- Automatic GitHub repository ingestion.
- Heavy 3D experience that blocks content or requires a powerful GPU.
- Publishing unverified project claims, metrics or client results.

## 6. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Fetch public portfolio data from the existing API | Must |
| FR-02 | Display hero with name, role statement, real portrait and clear CTAs | Must |
| FR-03 | Display personal story and strengths | Must |
| FR-04 | Group technologies into meaningful capability categories | Must |
| FR-05 | Display 3–5 selected projects with accurate descriptions and links | Must |
| FR-06 | Provide a complete project archive | Must |
| FR-07 | Display education and relevant milestones | Must |
| FR-08 | Submit contact messages through existing backend | Must |
| FR-09 | Preserve admin editing of all existing portfolio sections | Must |
| FR-10 | Preserve admin message management | Must |
| FR-11 | Store uploaded images in durable storage | Must |
| FR-12 | Support reduced-motion preference | Must |
| FR-13 | Add project detail routes when content is ready | Should |
| FR-14 | Add resume download CTA only when a verified resume file exists | Should |

## 7. Non-functional requirements

- Responsive at 360px, 390px, 768px, 1024px and desktop widths.
- No horizontal overflow or clipped content.
- Keyboard-operable navigation, buttons, cards and forms.
- Visible focus states and accessible form errors.
- Reduced-motion support.
- Lazy-load below-the-fold imagery.
- Keep the first screen fast and avoid blocking 3D or animation scripts.
- Target Lighthouse mobile Performance >= 85 and Accessibility, SEO and Best Practices >= 90 as release goals; measure on the deployed build.
- Public content must remain readable if animation libraries or decorative assets fail.
- Secrets must never be exposed to frontend code or public API responses.

## 8. Content requirements

Every featured project should have:
- Title.
- Plain-language one-line summary.
- Problem or motivation.
- Mithlesh's actual contribution.
- 3–5 concrete features.
- Technologies actually used.
- Current status: Live, In Progress, Prototype, Private or Archived.
- Screenshots.
- Live demo URL if available.
- Source repository URL if available.

Potential projects to evaluate: LumaChat, Toolvix, Urlix, Ordis and THE FLOOR REMEMBERS. These are candidates only. Confirm their current status, links, screenshots and what was personally built before publishing.

## 9. Success criteria

- A visitor can understand the profile and primary developer focus within the first viewport.
- At least three projects have complete and accurate project content.
- Contact form produces clear validation, loading, success and error states.
- Admin can still update public content without editing source files.
- All existing public and admin workflows pass end-to-end tests.
- Mobile and desktop layouts are both polished.
- No essential information depends on hover, WebGL or animation.
- SEO metadata and social preview are verified on production.

## 10. Important product rules

1. Do not invent experience, client work, metrics, achievements or project outcomes.
2. Do not replace the user's face with an AI-generated face.
3. Do not remove the admin CMS or backend features during the visual redesign.
4. Do not hard-code content that is already managed through MongoDB.
5. Do not publish broken or placeholder links.
6. Prefer a clear, fast and polished experience over unnecessary visual effects.
