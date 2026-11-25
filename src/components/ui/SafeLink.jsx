export function SafeLink({ href, children }) {
  try {
    const url = new URL(href);
    return ['https:', 'http:'].includes(url.protocol) &&
      <a className="text-link" href={url.href} target="_blank" rel="noreferrer">{children} ↗</a>;
  } catch {
    return null;
  }
}
