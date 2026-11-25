export function Check({ children, ...props }) {
  return <label className="check"><input type="checkbox" {...props} /><span>{children}</span></label>;
}
