import React, { useState, useRef, useEffect } from 'react';
import { ColumnIcon } from './icons/ColumnIcon';

interface ColumnSelectorProps {
  allHeaders: string[];
  visibleHeaders: string[];
  onVisibleHeadersChange: (newHeaders: string[]) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ allHeaders, visibleHeaders, onVisibleHeadersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = (header: string) => {
    const isVisible = visibleHeaders.includes(header);
    // Prevent hiding the last column
    if (visibleHeaders.length === 1 && isVisible) {
      return;
    }

    const newVisibleHeaders = isVisible
      ? visibleHeaders.filter(h => h !== header)
      : [...visibleHeaders, header];
      
    // Preserve original order
    const orderedNewVisibleHeaders = allHeaders.filter(h => newVisibleHeaders.includes(h));

    onVisibleHeadersChange(orderedNewVisibleHeaders);
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
      >
        <ColumnIcon />
        <span>컬럼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
          <div className="max-h-80 overflow-y-auto p-2 text-sm">
            {allHeaders.map((header) => {
              const isChecked = visibleHeaders.includes(header);
              const isDisabled = isChecked && visibleHeaders.length === 1;

              return (
                <label 
                  key={header} 
                  className={`flex items-center p-2 rounded hover:bg-gray-100 ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 bg-gray-100 border-gray-300 text-blue-600 rounded focus:ring-blue-500"
                    checked={isChecked}
                    onChange={() => handleToggle(header)}
                    disabled={isDisabled}
                  />
                  <span className="ml-2 text-gray-800 truncate">{header}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;
