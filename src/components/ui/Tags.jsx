export function Tags({ items }) {
  return items?.length > 0 && <ul className="tags">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}
