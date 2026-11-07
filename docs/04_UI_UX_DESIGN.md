# UI/UX Design Specification
## Mithlesh Personal Portfolio Redesign

- **Version:** 1.0
- **Creative direction:** Hybrid cinematic + experimental editorial + restrained futuristic
- **Motion:** Balanced, premium and controlled
- **Accent:** `#2B80FF`

---

## 1. Design objective

Create a distinctive portfolio that feels like a carefully art-directed digital experience, not a generic developer template or a terminal-themed dashboard.

The interface should communicate personality and capability while keeping content readable and navigation obvious.

## 2. Visual identity

### Color tokens

| Token | Suggested value | Usage |
|---|---|---|
| Background | `#080A10` | Main page background |
| Background secondary | `#0B0E15` | Alternate section tone |
| Surface | `#111722` | Cards and panels |
| Surface elevated | `#151D2A` | Elevated panels |
| Accent | `#2B80FF` | Main highlight, CTA, active states |
| Text primary | `#F3F6FC` | Main headings and body |
| Text secondary | `#AAB4C4` | Supporting text |
| Text muted | `#6D788A` | Metadata |
| Border | `rgba(255,255,255,0.10)` | Subtle separators |

Use the blue accent intentionally. Avoid making every heading, border and icon blue.

### Typography
- Display: Outfit or similar geometric display family.
- Body: Inter or equivalent readable sans-serif.
- Technical metadata: JetBrains Mono, used sparingly.
- Use responsive type sizing with `clamp()`.
- Use large editorial headings with short line lengths.
- Avoid overly small body copy.

### Shape and texture
- Mostly crisp geometry with a few softer surfaces.
- Subtle grain, fine grid lines, soft blue lighting and restrained gradients.
- Avoid excessive glassmorphism and excessive rounded cards.
- Keep the background quiet enough for text and portrait to remain dominant.

## 3. Overall composition

- Centered max-width content grid.
- Generous whitespace.
- Asymmetric editorial layouts where useful.
- Consistent 8px spacing rhythm.
- Strong hierarchy between section title, explanatory copy and content.
- A compact navbar that does not dominate the viewport.
- Use cards only when they clarify grouping.

## 4. Hero section

### Recommended composition
- Large headline and concise positioning statement.
- Real portrait integrated into the composition, preferably on the right or as a layered focal point.
- Subtle blue light/shape behind the portrait.
- Primary CTA: Explore selected work.
- Secondary CTA: Contact.
- Optional resume CTA only if a verified resume PDF is provided.
- Small scroll cue.

### Hero content rules
- Name must be prominent.
- Role statement must be specific and understandable.
- Keep paragraph concise.
- Do not use unsupported claims such as "10x engineer", "expert" or fake years of experience.

## 5. Personal portrait direction

- Use only a real photo supplied and approved by Mithlesh.
- Do not generate or substitute an AI face.
- Ask for 2–3 clear photos before final image composition.
- Preferred input: sharp face, good lighting, face unobstructed, high resolution, simple background.
- Prepare desktop and mobile crops.
- Optional treatment: clean cutout/mask, restrained blue rim light, subtle grain and depth.
- Preserve recognizability; avoid aggressive face retouching.
- Use meaningful alt text.
- Do not repeat the same large portrait in every section.

## 6. Section-by-section design

| Order | Section | Visual direction | Interaction |
|---|---|---|---|
| 01 | Hero | Large editorial typography + real portrait + subtle ambient depth | Gentle stagger and CTA scroll |
| 02 | About | Split editorial layout, personal story and strengths | Small reveal; avoid distracting effects |
| 03 | Capabilities | Grouped capability panels or compact clusters | Small hover/focus response |
| 04 | Selected work | Large image-led project cards or panels | Controlled reveal; optional pinned horizontal sequence on desktop only |
| 05 | Journey | Vertical timeline or milestones | Subtle line/progress reveal |
| 06 | Contact | Strong closing statement, simple form and social links | Clear form states |
| 07 | Footer | Minimal links and back-to-top | Simple transition |

## 7. Project card design

Every featured project card should prioritize:
1. Project screenshot or visual preview.
2. Project title.
3. One-line explanation.
4. What Mithlesh personally built.
5. Status label.
6. Technology tags.
7. Live demo and source links when available.

Do not make cards depend on hover to reveal essential content. On mobile, display all important information by default.

## 8. Motion system

### Allowed motion
- Short reveal transitions.
- Gentle opacity and transform changes.
- Subtle portrait parallax if it does not affect readability.
- Small interactive feedback on buttons and cards.
- A restrained scroll progress indicator.
- Optional pinned project sequence on wide desktop only.

### Motion constraints
- Motion must never delay access to essential content.
- Respect `prefers-reduced-motion`.
- Disable parallax and pinned sequences when reduced motion is requested.
- Avoid scroll-jacking.
- Avoid continuous heavy particles.
- Avoid autoplay audio/video.
- Clean up observers, animation timelines and event listeners.
- Do not rely on hover for mobile interactions.

## 9. Responsive behavior

| Width | Design behavior |
|---|---|
| <= 480px | Single column; optimized portrait crop; stacked CTAs; vertical project cards; no pinned horizontal scroll |
| 481–767px | Compact navigation; adaptive card grid; reduced decoration |
| 768–1023px | Tablet layout; maintain hierarchy; disable expensive 3D if necessary |
| >= 1024px | Full editorial grid; large portrait; optional pinned project sequence |

Test at 360px, 390px, 768px, 1024px and 1440px.

## 10. Accessibility

- Semantic header, nav, main, section and footer.
- Logical heading order.
- Keyboard-accessible navigation and controls.
- Visible focus styles.
- Sufficient text contrast.
- Labels and announced validation errors for forms.
- Descriptive alt text for meaningful images.
- Empty alt for decorative images.
- Touch targets around 44px or larger.
- Reduced-motion mode.
- No essential hover-only information.

## 11. UI states

Design all states, not just the ideal state:
- Portfolio loading.
- Portfolio API error.
- Empty project list.
- Project image failed to load.
- Contact form idle, invalid, submitting, success and error.
- Admin save idle, saving, saved and failed.
- Admin session expired.
- Uploading, upload success and upload failure.

## 12. Visual QA checklist

- Does the hero communicate identity within a few seconds?
- Does the portrait look authentic and properly cropped on mobile?
- Are section headings and body copy readable?
- Do project cards show real evidence rather than generic claims?
- Is the blue accent used with restraint?
- Does the page still work with animation disabled?
- Is mobile a deliberate layout, not merely a compressed desktop?
- Is every CTA connected to a real destination?
