import styles from './Button.module.css';

const VARIANTS = {
  primary: styles.primary,
  secondary: styles.secondary,
  quiet: styles.quiet,
  danger: styles.danger,
};

/**
 * `as` lets the same visual button render as a router Link where the action is
 * really navigation, without an anchor styled to look like a button by hand.
 */
function Button({
  as: Component = 'button',
  variant = 'secondary',
  size = 'md',
  icon = false,
  block = false,
  className = '',
  type,
  ...props
}) {
  const classes = [
    styles.button,
    VARIANTS[variant],
    size === 'sm' && styles.small,
    icon && styles.icon,
    block && styles.block,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      className={classes}
      type={Component === 'button' ? (type ?? 'button') : type}
      {...props}
    />
  );
}

export default Button;
