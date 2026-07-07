import React from "react";

export const Input = React.forwardRef(
  (
    {
      label,
      type = "text",
      error,
      placeholder,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`w-full flex flex-col gap-1.5 ${className}`}
      >
        {label && (
          <label className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full
            px-4
            py-2.5
            text-sm
            rounded-xl
            bg-slate-900
            text-white
            placeholder:text-slate-500
            border
            transition-all
            focus:outline-none
            focus:ring-2
            ${
              error
                ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                : "border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
            }
          `}
          {...props}
        />

        {error && (
          <span className="text-xs font-medium text-red-400">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;