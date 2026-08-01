import React from 'react';
import { cn } from '../../utils/format';

const controlClasses =
'w-full rounded-sm border border-cocoa/20 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-cocoa/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className
}: FieldWrapperProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium uppercase tracking-widest text-chestnut">
        
        {label}
        {required && <span className="ml-1 text-[#b3261e]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-cocoa/60">{hint}</p>}
      {error &&
      <p className="text-xs text-[#b3261e]" role="alert">
          {error}
        </p>
      }
    </div>);

}

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn(controlClasses, className)} {...props} />;
  });

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea({ className, ...props }, ref) {
    return (
      <textarea ref={ref} className={cn(controlClasses, className)} {...props} />);

  });

export const SelectInput = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>>(
  function SelectInput({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(controlClasses, 'pr-8', className)} {...props}>
      {children}
    </select>);

  });

export function Checkbox({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {label: string;}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 text-sm text-ink',
        className
      )}>
      
      <input
        type="checkbox"
        className="h-4 w-4 rounded-sm border-cocoa/30 text-cocoa accent-[#4A2E1F] focus:ring-gold"
        {...props} />
      
      {label}
    </label>);

}