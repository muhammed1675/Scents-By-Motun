import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/format';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-colors duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-cocoa text-ivory hover:bg-ink',
  secondary: 'bg-cream text-cocoa hover:bg-[#e9dbc9]',
  outline: 'border border-cocoa/30 text-cocoa hover:border-cocoa hover:bg-cream',
  ghost: 'text-cocoa hover:bg-cream',
  gold: 'bg-gold text-ink hover:bg-[#b8930f]',
  danger: 'bg-[#b3261e] text-white hover:bg-[#8f1e18]'
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-2',
  md: 'text-sm px-5 py-3',
  lg: 'text-sm px-7 py-4'
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
React.ButtonHTMLAttributes<HTMLButtonElement> & {to?: undefined;};

type LinkProps = CommonProps & {
  to: string;
  onClick?: () => void;
};

export function Button(props: ButtonProps | LinkProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth,
    className,
    children
  } = props;
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  if ('to' in props && props.to) {
    const { to, onClick } = props;
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {children}
      </Link>);

  }

  const {
    variant: _v,
    size: _s,
    fullWidth: _f,
    className: _c,
    children: _ch,
    ...rest
  } = props as ButtonProps;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>);

}