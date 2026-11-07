import { useRef } from 'react';
import useDecodeText from '../hooks/useDecodeText';

/**
 * Wraps a short text label with the same binary decode effect used by the
 * primary navigation. The static label keeps the layout stable while the
 * binary layer sits on top of it.
 */
export default function DecodeText({ children, className = '' }) {
  const hostRef = useRef(null);
  const binaryRef = useRef(null);
  const text = typeof children === 'string' || typeof children === 'number'
    ? String(children)
    : '';

  useDecodeText(text, hostRef, binaryRef);

  return (
    <span ref={hostRef} className={`decode ${className}`.trim()}>
      <span className="decode__label">{children}</span>
      <span className="decode__binary" aria-hidden="true" ref={binaryRef}>
        {children}
      </span>
    </span>
  );
}
