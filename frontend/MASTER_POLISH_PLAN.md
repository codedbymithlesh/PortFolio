# Task Plan: Portfolio Master Polish

## Goal
Complete website-wide UI/UX refinement to make the portfolio polished, premium, visually consistent and production-ready.

## Phase 1: Codebase Audit & Analysis (COMPLETED)
- [x] Inspected all public pages, admin pages, components, hooks, and CSS
- [x] Identified design tokens, typography, spacing, and color systems
- [x] Reviewed animations (GSAP, Lenis, CSS), loading states, and responsive patterns
- [x] Identified inconsistencies and areas for improvement

## Phase 2: Design System Unification & CSS Cleanup
- [ ] Unify CSS custom properties (design tokens) across public + admin
- [ ] Remove admin-specific color system (green) → unify with main accent (#ff8c59)
- [ ] Unify font stacks (Inter + JetBrains Mono in admin → DM Sans + JetBrains Mono)
- [ ] Consolidate button, form, card, modal, skeleton, button patterns
- [ ] Remove duplicate/conflicting CSS rules
- [ ] Add consistent focus-visible, reduced-motion, and print styles

## Phase 3: Public Website Polish
- [ ] Hero: Polish entrance animations, portrait reveal, CTA interactions
- [ ] About: Polish layout, quote styling, badge display
- [ ] Skills/Capabilities: Polish ghost text, category layout, hover states
- [ ] Projects/Work: Polish card reveals, image hover, 3D tilt, arrow interactions
- [ ] Education/Journey: Polish rail progress, alternating layout
- [ ] Contact: Polish form UX, email underline animation, social icons
- [ ] All Projects page: Polish infinite scroll, archive row animations
- [ ] Navbar: Polish mobile menu, binary decode, active states
- [ ] Footer: Polish layout, social links, back-to-top
- [ ] Ensure consistent section spacing, container widths, heading hierarchy
- [ ] Polish reduced-motion and prefers-reduced-motion support

## Phase 4: Admin Dashboard Polish
- [ ] Unify admin color system with main portfolio (amber #ff8c59 instead of green)
- [ ] Unify font stack (Inter → DM Sans for body, keep JetBrains Mono)
- [ ] Polish login page: visual hierarchy, password reveal, OTP flow
- [ ] Polish sidebar: branding, nav items, active states, mobile behavior
- [ ] Polish header: hamburger, title, save button states
- [ ] Polish tabs: Hero, About, Skills, Projects, Education, Contact, Messages, Settings
- [ ] Polish forms: consistent field styling, validation, save states
- [ ] Polish tables/cards: hover states, skeleton loaders, empty states
- [ ] Polish modals: consistent header, footer, animations
- [ ] Polish mobile: bottom nav, more menu, responsive grids
- [ ] Polish tables: MessagesTab skeleton loaders, inline actions
- [ ] Ensure consistent loading states across all tabs

## Phase 5: Loading Experience Unification
- [ ] Create unified Preloader component (single implementation)
- [ ] Add skeleton loaders for all content-heavy sections
- [ ] Add button loading states (spinner + text)
- [ ] Add image placeholders (blur-up or solid color)
- [ ] Add skeleton loaders for admin tables and cards
- [ ] Remove duplicate/conflicting loader implementations
- [ ] Ensure no infinite loading states (add timeouts/fallbacks)

## Phase 6: Animation & Interaction Polish
- [ ] GSAP ScrollTrigger: consistent section reveals, project reveals, parallax
- [ ] Lenis: ensure smooth scroll sync, cleanup on unmount
- [ ] CSS transitions: buttons, cards, links, form fields (consistent durations/easing)
- [ ] Micro-interactions: hover, focus, active states consistent
- [ ] Reduced-motion: all animations respect prefers-reduced-motion
- [ ] Clean up GSAP/ScrollTrigger on unmount (no memory leaks)

## Phase 7: Responsive Design Verification & Fixes
- [ ] Test at: 360px, 390px, 768px, 1024px, 1440px, 1920px
- [ ] Fix horizontal overflow issues
- [ ] Fix uneven margins/padding
- [ ] Fix container width inconsistencies
- [ ] Fix mobile card layouts
- [ ] Fix admin sidebar/table responsiveness
- [ ] Fix text wrapping and image positioning
- [ ] Verify viewport heights (svh, dvh usage)

## Phase 8: Reusable Components & Code Quality
- [ ] Create shared Button, Card, Modal, Field, Skeleton, Loader components
- [ ] Remove duplicate CSS (admin.css vs index.css overlaps)
- [ ] Remove unused code (confirm unused components/hooks)
- [ ] Ensure consistent naming conventions
- [ ] Optimize imports (tree-shaking, dynamic imports where appropriate)

## Phase 9: Verification & Testing
- [ ] Run production build (npm run build)
- [ ] Run lint (npx eslint src)
- [ ] Test all public routes: /, /about, /skills, /projects, /contact, /all-projects
- [ ] Test admin routes: /admin/login, /admin, /admin/about, /admin/skills, /admin/projects, /admin/education, /admin/contact, /admin/messages, /admin/settings
- [ ] Test admin login, OTP recovery, password change
- [ ] Test contact form submission
- [ ] Test loading/error states
- [ ] Test direct URL access
- [ ] Test 5+ consecutive hard reloads
- [ ] Check browser console for errors
- [ ] Check horizontal overflow at all breakpoints
- [ ] Verify mobile and desktop layouts
- [ ] Confirm existing functionality works

## Phase 10: Final Report
- [ ] Document all changes made
- [ ] List files modified/created/deleted
- [ ] Document build and test results
- [ ] Note any remaining issues

## Current Status
- Phase 1: COMPLETED
- Phases 2-10: PENDING

## Key Design Decisions
- Maintain editorial portfolio aesthetic (warm black #030303, paper #f1eee8, ember #ff8c59)
- Unify admin with main design language (replace green with amber accent)
- Keep GSAP + ScrollTrigger + Lenis for animations
- Keep binary decode text effect for nav/CTA labels
- Preserve existing working features (contact form, admin auth, OTP recovery)
- Maintain GSAP-powered project animations (clip-path reveal, hover tilt, parallax)
- Keep existing responsive breakpoints and container system