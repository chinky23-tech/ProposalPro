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
          <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
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
              h-11
              text-sm
              rounded-xl
              transition-all
              border
              text-left
              focus:outline-none
              ${
                isDark 
                  ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500" 
                  : "bg-white border-slate-200 text-slate-900 focus:border-emerald-500"
              }
              ${error ? "border-red-500" : ""}
              ${!selectedOption && isDark ? "text-slate-500" : ""}
              ${!selectedOption && !isDark ? "text-slate-500" : ""}
            `}
            {...props}
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
            <ChevronDown 
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? "transform rotate-180 text-emerald-400" : ""
              }`} 
            />
          </button>

          {isOpen && (
            <ul 
              className={`
                absolute z-50 w-full max-h-48 overflow-y-auto 
                rounded-xl shadow-2xl py-1 border top-full mt-1.5
                ${
                  isDark 
                    ? "bg-slate-900 border-slate-800 text-slate-200" 
                    : "bg-white border-slate-200 text-slate-800"
                }
              `}
            >
              {placeholder && (
                <li
                  onClick={() => handleOptionClick("")}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                    isDark ? "text-slate-400 hover:bg-slate-950" : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {placeholder}
                </li>
              )}
              
              {options.map((option) => {
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
                          ? "bg-emerald-600/20 text-emerald-400 font-medium"
                          : isDark ? "text-slate-200 hover:bg-slate-950 hover:text-white" : "text-slate-800 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-500" />
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