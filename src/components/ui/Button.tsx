import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  icon,
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-sans font-medium rounded-full transition-colors transition-shadow transition-transform duration-300 cursor-pointer whitespace-nowrap';

  const variants = {
    primary:
      'bg-forest text-text-on-dark hover:bg-forest-light shadow-md hover:shadow-lg hover:-translate-y-0.5',
    secondary:
      'bg-saffron text-white hover:bg-saffron-light shadow-md hover:shadow-lg hover:-translate-y-0.5',
    outline:
      'border-2 border-forest text-forest hover:bg-forest hover:text-text-on-dark',
    ghost: 'text-forest hover:bg-forest-muted',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
      {icon}
    </button>
  );
}
