import React from "react";

export const Input = React.forwardRef(
  (
    {
      label,
      type = "text",
      error,
      placeholder,
      className = "",
      // optional trailing element (icon/button) positioned inside the input
      trailing,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`w-full flex flex-col gap-1.5 ${className}`}
      >
        {label && (
          <label className="text-sm font-medium text-slate-800">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`
              w-full
              px-4
              pr-10
              py-2.5
              text-sm
              rounded-xl
              bg-white
              text-black
              placeholder:text-slate-800
              border
              transition-all
              focus:outline-none
              focus:ring-2
              ${
                error
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
              }
            `}
            {...props}
          />

          {trailing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {trailing}
            </div>
          )}
        </div>

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