import type { LucideIcon } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  iconColor?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, iconColor, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="field">
        <label htmlFor={inputId}>
          {Icon && (
            <span className="field-icon" style={{ color: iconColor }}>
              <Icon size={13} strokeWidth={2.5} />
            </span>
          )}
          {label}
        </label>
        <input id={inputId} ref={ref} className={error ? 'has-error' : undefined} {...props} />
        {error && <span className="field-error">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
