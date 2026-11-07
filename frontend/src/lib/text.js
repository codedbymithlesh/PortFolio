export function getInitials(value, fallback = 'MR') {
  if (typeof value !== 'string' || !value.trim()) return fallback;

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}
