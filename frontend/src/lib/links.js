export function isUsableExternalUrl(value) {
  if (typeof value !== 'string') return false;

  const candidate = value.trim();
  if (!candidate || candidate === '#') return false;

  try {
    const url = new URL(candidate);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
