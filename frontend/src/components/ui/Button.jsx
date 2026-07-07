import { LoadingSpinner } from "./LoadingSpinner";

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20",

    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",

    outline:
      "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-200",

    danger:
      "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20",

    success:
      "bg-emerald-600 hover:bg-emerald-500 text-white",

    warning:
      "bg-orange-600 hover:bg-orange-500 text-white",

    ghost:
      "hover:bg-slate-800 text-slate-300",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner className="w-4 h-4 border-current" />
      )}

      {!isLoading && leftIcon}

      {children}

      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;