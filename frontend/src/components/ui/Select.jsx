import React, { useState, useRef, useEffect } from "react";
// Import the Lucide icons here
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
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find((opt) => opt.value === value);

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
        onChange({ target: { value: optionValue } });
      }
      setIsOpen(false);
    };

    return (
      <div
        ref={containerRef}
        className={`w-full flex flex-col gap-1.5 relative ${className}`}
      >
        {label && (
          <label className="text-sm font-medium text-slate-800">
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
              bg-white
              transition-all
              border
              text-left
              focus:outline-none
              focus:ring-2
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 text-slate-900"
                  : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900"
              }
              ${!selectedOption ? "text-slate-400" : ""}
            `}
            {...props}
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
            
            {/* Cleaner Chevron icon using Lucide */}
            <ChevronDown 
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`} 
            />
          </button>

          {isOpen && (
            <ul className="absolute z-50 w-full mt-1.5 max-h-60 overflow-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1 focus:outline-none">
              {placeholder && (
                <li
                  onClick={() => handleOptionClick("")}
                  className="px-4 py-2 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {placeholder}
                </li>
              )}
              
              {options.map((option) => {
                const isSelected = option.value === value;
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
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-slate-700 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    
                    {/* Cleaner Check icon using Lucide */}
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600" />
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

Select.displayName = "Select";

export default Select;