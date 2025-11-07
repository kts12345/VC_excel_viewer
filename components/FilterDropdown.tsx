import React, { useState, useEffect, useRef } from 'react';
import { FilterIcon } from './icons/FilterIcon';
import { Filter, CheckboxFilter, TextFilter } from '../types';

interface FilterDropdownProps {
  header: string;
  uniqueValues: (string | number | boolean | Date)[];
  filter: Filter | undefined;
  onFilterChange: (header: string, filter: Filter | undefined) => void;
  isOpen: boolean;
  onClose: () => void;
}

const areValuesEqual = (a: any, b: any) => {
    const comparableA = a instanceof Date ? a.getTime() : a;
    const comparableB = b instanceof Date ? b.getTime() : b;
    return comparableA === comparableB;
};


const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
    header, 
    uniqueValues, 
    filter, 
    onFilterChange, 
    isOpen, 
    onClose 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [isLeftAligned, setIsLeftAligned] = useState(false);
  
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
        const rect = dropdownRef.current.parentElement!.getBoundingClientRect();
        const dropdownWidth = 256; // w-64

        if (rect.right + dropdownWidth > window.innerWidth) {
            setIsLeftAligned(true);
        } else {
            setIsLeftAligned(false);
        }
    }
  }, [isOpen]);

  const handleCheckboxChange = (value: string | number | boolean | Date) => {
    const isCurrentlyFiltered = filter?.type === 'checkbox';
    const currentSelected = isCurrentlyFiltered ? filter.selected : uniqueValues;
    
    const valueExists = currentSelected.some(v => areValuesEqual(v, value));

    const newSelectedValues = valueExists
      ? currentSelected.filter(v => !areValuesEqual(v, value))
      : [...currentSelected, value];

    if (newSelectedValues.length === uniqueValues.length) {
      // If all are selected, clear the filter
      onFilterChange(header, undefined);
    } else {
      onFilterChange(header, { type: 'checkbox', selected: newSelectedValues });
    }
  };

  const handleSelectAll = () => {
    onFilterChange(header, undefined);
  };

  const handleClearAll = () => {
    onFilterChange(header, { type: 'checkbox', selected: [] });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const element = scrollableContainerRef.current;
    if (isOpen && element) {
      const handleWheel = (e: WheelEvent) => {
        e.stopPropagation();

        const { scrollTop, scrollHeight, clientHeight } = element;
        const deltaY = e.deltaY;

        const isAtTop = scrollTop === 0;
        const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        
        if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
          e.preventDefault();
        }
      };
      
      element.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        element.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isOpen]);
  
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        ref={dropdownRef}
        className={`absolute top-full ${isLeftAligned ? 'right-0' : 'left-0'} mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col`} 
        onClick={e => e.stopPropagation()}
    >
        <div className="flex-grow">
        <div className="max-h-60 overflow-y-auto p-2 text-sm" ref={scrollableContainerRef}>
            {uniqueValues.map((value, index) => {
            const isChecked = filter?.type === 'checkbox' ? filter.selected.some(v => areValuesEqual(v, value)) : true;
            return (
                <label key={index} className="flex items-center p-1 rounded hover:bg-gray-100 cursor-pointer">
                <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 bg-gray-100 border-gray-300 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(value)}
                />
                <span className="ml-2 text-gray-800 truncate">{String(value)}</span>
                </label>
            );
            })}
        </div>
        </div>
        <div className="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex items-center gap-2">
            <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            >
                All
            </button>
            <button
                onClick={handleClearAll}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            >
                Clear
            </button>
        </div>
        <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            Close
        </button>
        </div>
    </div>
  );
};

export default FilterDropdown;