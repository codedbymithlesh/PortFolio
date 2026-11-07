import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scrollToSection } from '../lib/navigation';

const SectionLink = React.forwardRef(function SectionLink(
  {
    section,
    children,
    className,
    onNavigate,
    onClick,
    ...props
  },
  ref,
) {
  const location = useLocation();
  const target = `/#${section}`;
  const current = `${location.pathname}${location.hash}`;

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    onNavigate?.();

    if (current === target) {
      event.preventDefault();
      scrollToSection(section);
    }
  };

  return (
    <Link
      ref={ref}
      to={target}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
});

export default SectionLink;
