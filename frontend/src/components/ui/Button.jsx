import { LoadingSpinner } from './LoadingSpinner';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2.5';
  
  const variants = {
    primary: 'bg-teal-700 hover:bg-emerald-700 text-white shadow-sm',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <LoadingSpinner className="w-4 h-4 mr-2 border-current" />}
      {children}
    </button>
  );
};
