import React from "react";

export const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      error,
      className = "",
      placeholder = "Select an option",
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

        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full
              appearance-none
              px-4
              py-2.5
              pr-10
              text-sm
              rounded-xl
              bg-slate-900
              text-white
              border
              transition-all
              focus:outline-none
              focus:ring-2
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              }
            `}
            {...props}
          >
            {placeholder && (
              <option value="">
                {placeholder}
              </option>
            )}

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

Select.displayName = "Select";

export default Select;