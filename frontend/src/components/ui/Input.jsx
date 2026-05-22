import React from 'react';

export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all
          ${error 
            ? 'border-red-400 focus:ring-red-200 focus:border-red-500' 
            : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
          }`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';