import { useLayoutEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/navigation';

gsap.registerPlugin(ScrollTrigger);

/* Module-level singleton so the instance lives for the app's lifetime and
   can be reached by navigation helpers without threading it through props. */
let lenisInstance = null;

/** Returns the active Lenis instance, or null when not initialised. */
export function getLenis() {
  return lenisInstance;
}

/**
 * Initialises Lenis once for the whole application.
 *
 * - Skipped entirely under `prefers-reduced-motion: reduce` (native scroll).
 * - Touch scrolling stays native: Lenis only smooths wheel by default
 *   (`smoothWheel: true`, `syncTouch: false`).
 * - A single shared RAF loop drives Lenis via `gsap.ticker`, so there is
 *   never a duplicate Lenis animation loop alongside GSAP's.
 * - `ScrollTrigger.scrollerProxy(window, …)` keeps GSAP ScrollTrigger in sync
 *   with Lenis' animated scroll position via `lenis.on('scroll', …)`.
 *   The `scrollTop` setter sets scroll instantly (no `lenis.scrollTo`
 *   animation) because ScrollTrigger's internal `refresh()` calls
 *   `scrollFunc(0)` on every scroller to measure triggers — animating there
 *   would yank the page to the top whenever fonts/images settle.
 * - `refresh()` is wrapped to save/restore scroll so `ScrollTrigger.refresh()`
 *   (which briefly scrolls to 0 during measurement) never displaces the user.
 * - Destroyed on unmount (React StrictMode safe — the singleton guard
 *   ensures only one instance exists at any time).
 */
export default function useLenis() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined;

    /* Admin routes keep native scrolling — Lenis only drives the public site.
       Touch-primary devices also keep native scrolling so mobile touch remains
       natural (Lenis only smooths wheel by default anyway). */
    const isAdmin = window.location.pathname.startsWith('/admin');
    const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;

    if (
      isAdmin ||
      isTouchPrimary ||
      prefersReducedMotion()
    ) {
      return undefined;
    }

    /* Already initialised (e.g. StrictMode remount) — keep the singleton. */
    if (lenisInstance) return undefined;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      autoResize: true,
    });

    lenisInstance = lenis;
    window.__lenisInstance = lenis;

    /* Guard ScrollTrigger.refresh(): it internally scrolls every scroller to
       0 to measure triggers, and the recorded position is reset to 0 when
       refresh() is forced, so nothing restores the user's scroll. With Lenis,
       scrollFunc(0) would yank the page to top on every refresh (fonts,
       load, resize). Wrap globally so every caller (incl. useProjectsMotion)
       is protected, and restore on cleanup. */
    const originalRefresh = ScrollTrigger.refresh;
    ScrollTrigger.refresh = () => {
      if (!lenisInstance) return originalRefresh();
      const scroll = lenis.scroll;
      originalRefresh();
      lenis.targetScroll = lenis.animatedScroll = scroll;
      lenis.setScroll(scroll);
      lenis.emit();
    };

    /* Single shared RAF loop — GSAP's ticker drives Lenis (no extra loop). */
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    /* Keep ScrollTrigger synchronised with Lenis' animated scroll position. */
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onLenisScroll);

    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length && !ScrollTrigger.isRefreshing) {
          /* Instant set — no animation. While ScrollTrigger.isRefreshing
             (during ScrollTrigger.refresh() / _refreshAll) ScrollTrigger
             calls scrollFunc(0) to measure triggers; moving scroll there
             would yank the page to top. Triggers measure against the
             getter anyway, so not moving scroll is more correct. */
          lenis.targetScroll = lenis.animatedScroll = value;
          lenis.setScroll(value);
          lenis.emit();
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    /* Refresh trigger positions once layout/fonts settle (wrapped globally above). */
    const rafId = requestAnimationFrame(ScrollTrigger.refresh);
    window.addEventListener('load', ScrollTrigger.refresh);
    if (document.fonts?.ready) {
      document.fonts.ready.then(ScrollTrigger.refresh).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('load', ScrollTrigger.refresh);
      gsap.ticker.remove(tick);
      lenis.off('scroll', onLenisScroll);
      ScrollTrigger.scrollerProxy(window, null);
      ScrollTrigger.refresh = originalRefresh;
      lenis.destroy();
      lenisInstance = null;
      window.__lenisInstance = null;
    };
  }, []);
}
