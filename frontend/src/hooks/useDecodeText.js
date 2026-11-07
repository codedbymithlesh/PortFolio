import { useEffect } from 'react';

const DURATION = 480;
const SETTLE_AT = 380;
const FIRST_RESOLVE = 110;
const LAST_RESOLVE = 340;
const TICK = 46;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
};

/* Stable 32-bit hash so the scramble is deterministic per character and tick. */
const hashBit = (index, tick) => {
  let value = (index + 1) * 374761393 + (tick + 1) * 668265263;
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) & 1;
};

const binaryAt = (character, index, elapsed) => {
  if (character === ' ') return ' ';
  const tick = Math.floor((elapsed + index * 17) / TICK);
  return hashBit(index, tick) ? '1' : '0';
};

/**
 * Drives a short left-to-right binary decode on a navigation label.
 *
 * The static label stays in the DOM and defines the layout; the binary layer is
 * absolutely positioned over it, so the navbar never reflows. The animation
 * writes to the DOM directly instead of using state to keep it cheap.
 *
 * Listeners live on the surrounding anchor so hovering the index or the link
 * padding triggers the same effect, and so nothing ref-related leaves the hook.
 */
export default function useDecodeText(text, hostRef, binaryRef) {
  useEffect(() => {
    const host = hostRef.current;
    const binary = binaryRef.current;
    if (!host || !binary) return undefined;

    const anchor = host.closest('a, button') ?? host;
    let frame = 0;
    let startedAt = 0;
    let running = false;
    let painted = '';

    const reset = () => {
      running = false;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }

      host.classList.remove('is-decoding', 'is-settling');
      binary.textContent = text;
      painted = text;
    };

    const start = () => {
      if (running || !text || prefersReducedMotion()) return;

      const length = Math.max(1, text.length - 1);
      const initial = Array.from(text, (character, index) => (
        binaryAt(character, index, 0)
      )).join('');

      running = true;
      startedAt = performance.now();
      painted = initial;
      binary.textContent = initial;
      host.classList.add('is-decoding');
      host.classList.remove('is-settling');

      const paint = (now) => {
        if (!running) return;

        const elapsed = now - startedAt;
        let output = '';

        for (let index = 0; index < text.length; index += 1) {
          const character = text[index];
          const resolveAt = FIRST_RESOLVE
            + (index / length) * (LAST_RESOLVE - FIRST_RESOLVE);

          output += elapsed >= resolveAt
            ? character
            : binaryAt(character, index, elapsed);
        }

        if (elapsed >= SETTLE_AT) host.classList.add('is-settling');

        if (elapsed >= DURATION) {
          reset();
          return;
        }

        if (output !== painted) {
          binary.textContent = output;
          painted = output;
        }

        frame = requestAnimationFrame(paint);
      };

      frame = requestAnimationFrame(paint);
    };

    const onPointerEnter = (event) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') start();
    };

    const onPointerLeave = (event) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') reset();
    };

    const onFocus = () => {
      if (anchor.matches(':focus-visible')) start();
    };

    anchor.addEventListener('pointerenter', onPointerEnter);
    anchor.addEventListener('pointerleave', onPointerLeave);
    anchor.addEventListener('focus', onFocus);
    anchor.addEventListener('blur', reset);

    reset();

    const motion = typeof window.matchMedia === 'function'
      ? window.matchMedia(REDUCED_MOTION_QUERY)
      : null;
    const onMotionChange = () => {
      if (motion?.matches) reset();
    };

    motion?.addEventListener('change', onMotionChange);

    return () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      anchor.removeEventListener('pointerenter', onPointerEnter);
      anchor.removeEventListener('pointerleave', onPointerLeave);
      anchor.removeEventListener('focus', onFocus);
      anchor.removeEventListener('blur', reset);
      motion?.removeEventListener('change', onMotionChange);
      host.classList.remove('is-decoding', 'is-settling');
    };
  }, [text, hostRef, binaryRef]);
}
