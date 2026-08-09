import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  as = 'button',
  className = '',
  ...props
}) {
  // `motion[as]` only resolves plain string tags ('button', 'div', ...).
  // When `as` is a component reference (e.g. React Router's <Link>), it has
  // to be wrapped with motion(Component) instead. Memoized so we don't
  // recreate the wrapped component on every render.
  const Component = useMemo(
    () => (typeof as === 'string' ? motion[as] : motion(as)),
    [as]
  );

  return (
    <Component
      className={`btn btn--${variant} btn--${size} ${className}`}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 15 : 17} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 15 : 17} />}
    </Component>
  );
}
