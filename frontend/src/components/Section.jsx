import SplitText from './SplitText';

export default function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  variant = 'default',
  className = '',
  children,
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      className={`section section--${variant} ${className}`.trim()}
      aria-labelledby={titleId}
    >
      <div className="container">
        <header className="chapter">
          <div className="chapter__meta">
            {index && (
              <span className="chapter__index" aria-hidden="true">{index}</span>
            )}
            {eyebrow && <span className="chapter__eyebrow">{eyebrow}</span>}
          </div>

          <h2 id={titleId} className="chapter__title" data-reveal="words">
            <SplitText text={title} />
          </h2>

          {description && (
            <p
              className="chapter__note"
              data-reveal
              style={{ '--reveal-delay': '120ms' }}
            >
              {description}
            </p>
          )}
        </header>

        <div className="section__content">
          {children}
        </div>
      </div>
    </section>
  );
}
