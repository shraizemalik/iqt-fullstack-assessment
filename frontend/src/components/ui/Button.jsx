export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
