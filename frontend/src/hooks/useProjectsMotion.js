import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Colours mirrored from the design tokens in index.css. */
const FRAME_BORDER_REST = 'rgba(241, 238, 232, 0.14)';
const FRAME_BORDER_HOVER = 'rgba(255, 140, 89, 0.5)';
const ARROW_REST = {
  backgroundColor: '#030303',
  borderColor: 'rgba(241, 238, 232, 0.14)',
  color: '#f1eee8',
};
const ARROW_ACTIVE = {
  backgroundColor: '#ff8c59',
  borderColor: '#ff8c59',
  color: '#030303',
};

/**
 * Cinematic motion for the Selected Work section.
 *
 * Everything is created inside a single gsap.matchMedia() context so that
 * reduced-motion users keep the untouched, fully visible layout and so that
 * every tween, listener and ScrollTrigger is reverted when the section
 * unmounts (StrictMode safe — no duplicate triggers).
 *
 * @param {React.RefObject} scopeRef ref of the `.work` root
 * @param {number} itemCount re-runs the setup when projects finish loading
 */
export default function useProjectsMotion(scopeRef, itemCount = 0) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    let disposed = false;
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        finePointer: '(hover: hover) and (pointer: fine)',
        wide: '(min-width: 901px)',
      },
      (context) => {
        const { motion, finePointer, wide } = context.conditions;
        if (!motion) return undefined;

        const teardown = [];

        gsap.utils.toArray('.work-item', scope).forEach((item) => {
          const frame = item.querySelector('.work-frame');
          const arrow = item.querySelector('.work-item__arrow');
          const media = item.querySelector('.work-item__media');
          const content = item.querySelector('.work-item__content');
          const viewport = item.querySelector('.work-frame__viewport');
          const img = item.querySelector('.work-frame__img');
          const meta = item.querySelector('.work-item__meta');
          const words = item.querySelectorAll('.split-word__inner');
          const desc = item.querySelector('.work-item__desc');
          const links = item.querySelector('.work-item__links');

          /* ── 1. Entrance: clip-path wipe + staggered copy ─────────── */

          const reveal = gsap.timeline({
            paused: true,
            defaults: { ease: 'power3.out' },
          });

          if (frame) {
            reveal.fromTo(
              frame,
              { clipPath: 'inset(0% 0% 100% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.05,
                ease: 'power3.inOut',
              },
              0,
            );
          }

          if (arrow) {
            reveal.fromTo(
              arrow,
              { autoAlpha: 0, scale: 0.55, rotate: -35 },
              { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.75 },
              0.5,
            );
          }

          if (meta) {
            reveal.fromTo(
              meta,
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.85 },
              0.16,
            );
          }

          if (words.length > 0) {
            reveal.fromTo(
              words,
              { yPercent: 118 },
              {
                yPercent: 0,
                duration: 0.95,
                stagger: 0.065,
                ease: 'power4.out',
              },
              0.28,
            );
          }

          if (desc) {
            reveal.fromTo(
              desc,
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.85 },
              0.58,
            );
          }

          if (links) {
            reveal.fromTo(
              links,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.85 },
              0.72,
            );
          }

          const alreadyInView =
            item.getBoundingClientRect().top < window.innerHeight * 0.82;

          if (alreadyInView) {
            reveal.play(0);
          } else {
            const trigger = ScrollTrigger.create({
              trigger: item,
              start: 'top 82%',
              once: true,
              onEnter: () => reveal.play(),
            });
            teardown.push(() => trigger.kill());
          }

          teardown.push(() => reveal.kill());

          /* ── 3. Scroll parallax (two-column desktop only) ─────────── */

          if (wide && media) {
            const mediaShift = gsap.fromTo(
              media,
              { y: 24 },
              {
                y: -24,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.6,
                },
              },
            );
            teardown.push(() => mediaShift.scrollTrigger?.kill());
          }

          if (wide && content) {
            const contentShift = gsap.fromTo(
              content,
              { y: -12 },
              {
                y: 12,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.9,
                },
              },
            );
            teardown.push(() => contentShift.scrollTrigger?.kill());
          }

          /* ── 2. Pointer parallax + hover states ───────────────────── */

          if (finePointer && img) {
            const toX = gsap.quickTo(img, 'x', {
              duration: 0.75,
              ease: 'power3.out',
            });
            const toY = gsap.quickTo(img, 'y', {
              duration: 0.75,
              ease: 'power3.out',
            });
            /* NB: quickTo('scale') is broken in GSAP 3.15.1 ("scale not
               eligible for reset" — the tween silently never applies), so the
               zoom is driven through the two axis properties instead. */
            const toScaleX = gsap.quickTo(img, 'scaleX', {
              duration: 0.7,
              ease: 'power3.out',
            });
            const toScaleY = gsap.quickTo(img, 'scaleY', {
              duration: 0.7,
              ease: 'power3.out',
            });

            const onEnter = () => {
              toScaleX(1.075);
              toScaleY(1.075);
              if (frame) {
                gsap.to(frame, {
                  borderColor: FRAME_BORDER_HOVER,
                  duration: 0.5,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
              }
            };

            const onLeave = () => {
              toScaleX(1);
              toScaleY(1);
              toX(0);
              toY(0);
              if (frame) {
                gsap.to(frame, {
                  borderColor: FRAME_BORDER_REST,
                  duration: 0.6,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
              }
            };

            item.addEventListener('pointerenter', onEnter);
            item.addEventListener('pointerleave', onLeave);

            teardown.push(() => {
              item.removeEventListener('pointerenter', onEnter);
              item.removeEventListener('pointerleave', onLeave);
            });

            if (viewport) {
              const onMove = (event) => {
                const rect = viewport.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                toX(
                  ((event.clientX - rect.left) / rect.width - 0.5) * 18,
                );
                toY(
                  ((event.clientY - rect.top) / rect.height - 0.5) * 12,
                );
              };

              const onViewportLeave = () => {
                toX(0);
                toY(0);
              };

              viewport.addEventListener('pointermove', onMove);
              viewport.addEventListener('pointerleave', onViewportLeave);

              teardown.push(() => {
                viewport.removeEventListener('pointermove', onMove);
                viewport.removeEventListener('pointerleave', onViewportLeave);
              });
            }
          }

          if (finePointer && arrow) {
            const onArrowEnter = () => {
              gsap.to(arrow, {
                scale: 1.06,
                rotate: 45,
                ...ARROW_ACTIVE,
                duration: 0.45,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            };

            const onArrowLeave = () => {
              gsap.to(arrow, {
                scale: 1,
                rotate: 0,
                ...ARROW_REST,
                duration: 0.5,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            };

            arrow.addEventListener('pointerenter', onArrowEnter);
            arrow.addEventListener('pointerleave', onArrowLeave);

            teardown.push(() => {
              arrow.removeEventListener('pointerenter', onArrowEnter);
              arrow.removeEventListener('pointerleave', onArrowLeave);
            });
          }

          teardown.push(() => {
            gsap.killTweensOf(
              [frame, arrow, img, media, content].filter(Boolean),
            );
          });
        });

        return () => teardown.forEach((fn) => fn());
      },
    );

    /* Fonts and lazy images settle after mount — keep trigger positions true. */
    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    window.addEventListener('load', refresh);
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      disposed = true;
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, [scopeRef, itemCount]);
}
