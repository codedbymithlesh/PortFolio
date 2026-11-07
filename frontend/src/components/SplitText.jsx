export default function SplitText({ text, className = '', as: Tag = 'span' }) {
  const words = String(text || '').split(/\s+/).filter(Boolean);

  if (words.length === 0) return null;

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span className="split-word" key={`${word}-${index}`}>
          <span
            className="split-word__inner"
            style={{ '--word-index': index }}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
