import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      error,
      className = "",
      placeholder = "Select an option",
      value,
      onChange,
      variant = "dark", 
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

   // 1. Make the lookup case-insensitive or string-safe just in case
const selectedOption = options.find(
  (opt) => String(opt.value).trim() === String(value).trim()
);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionClick = (optionValue) => {
  if (onChange) {
    // Pass BOTH name and value back so e.target.name works flawlessly!
    onChange({ 
      target: { 
        name: props.name, 
        value: optionValue 
      } 
    });
  }
  setIsOpen(false);
};

    const isDark = variant === "dark";

    return (
      <div
        ref={containerRef}
        className={`w-full flex flex-col gap-1.5 relative ${className}`}
      >
        {label && (
          <label className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            {label}
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            ref={ref}
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-full
              flex
              items-center
              justify-between
              px-4
              py-2.5
              text-sm
              rounded-xl
              transition-all
              border
              text-left
              focus:outline-none
              focus:ring-2
              ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-white focus:border-emerald-500 focus:ring-emerald-500/20" 
                  : "bg-white border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20"
              }
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
              ${!selectedOption && isDark ? "text-slate-400" : ""}
              ${!selectedOption && !isDark ? "text-slate-500" : ""}
            `}
            {...props}
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
            <ChevronDown 
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`} 
            />
          </button>

          {isOpen && (
            <ul 
              className={`
                absolute z-9999 w-full max-h-48 overflow-auto 
                rounded-xl shadow-xl py-1 focus:outline-none border
                ${
                  isDark 
                    ? "bg-slate-900 border-slate-800 text-slate-200 top-full mt-1.5" 
                    : "bg-white border-slate-200 text-slate-800 bottom-full mb-1.5" // <-- Forces it UPWARDS inside the light modal form
                }
              `}
            >
              {placeholder && (
                <li
                  onClick={() => handleOptionClick("")}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                    isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {placeholder}
                </li>
              )}
              
              {options.map((option) => {
                // 2. Update this line inside the map loop
const isSelected = String(option.value).trim() === String(value).trim();
                return (
                  <li
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`
                      px-4 
                      py-2 
                      text-sm 
                      cursor-pointer 
                      transition-colors
                      flex
                      items-center
                      justify-between
                      ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-700 font-medium" // <-- Changed from blue to Emerald
                          : isDark ? "text-slate-200 hover:bg-slate-800" : "text-slate-800 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600" /> // <-- Changed icon to Emerald
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {error && (
          <span className="text-xs font-medium text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);
export default Select;
Select.displayName = "Select";