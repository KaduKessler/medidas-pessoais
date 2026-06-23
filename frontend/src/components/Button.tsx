import { type ButtonHTMLAttributes, forwardRef } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => {
    const classes = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ');
    return <button ref={ref} className={classes} {...props} />;
  },
);

Button.displayName = 'Button';
