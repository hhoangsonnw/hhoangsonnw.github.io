export default function GlitchText({ as: Component = 'span', children, className = '' }) {
  const text = typeof children === 'string' ? children : '';
  return (
    <Component className={`glitch ${className}`} data-text={text}>
      {children}
    </Component>
  );
}
