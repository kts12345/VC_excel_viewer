import React, { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { ColumnIcon } from './icons/ColumnIcon';
import { SearchIcon } from './icons/SearchIcon';
import { DragHandleIcon } from './icons/DragHandleIcon';
import { PinIcon } from './icons/PinIcon';


interface ColumnSelectorProps {
  allHeaders: string[];
  visibleHeaders: string[];
  onVisibleHeadersChange: (newHeaders: string[]) => void;
  columnOrder: string[];
  onColumnOrderChange: (newOrder: string[]) => void;
  pinnedColumns: string[];
  onPinnedColumnsChange: (newPinned: string[]) => void;
  uniqueValueCounts: Record<string, number>;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ 
  allHeaders, 
  visibleHeaders, 
  onVisibleHeadersChange,
  columnOrder,
  onColumnOrderChange,
  pinnedColumns,
  onPinnedColumnsChange,
  uniqueValueCounts
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedHeader, setDraggedHeader] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<Map<string, DOMRect>>(new Map());


  const handleToggleVisibility = (header: string) => {
    const isVisible = visibleHeaders.includes(header);
    if (visibleHeaders.length === 1 && isVisible) return;

    const newVisibleHeaders = isVisible
      ? visibleHeaders.filter(h => h !== header)
      : [...visibleHeaders, header];
    
    onVisibleHeadersChange(newVisibleHeaders);
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    
  }, [wrapperRef]);

  const handleShowAll = () => onVisibleHeadersChange(allHeaders);
  const handleHideAll = () => {
    const pinnedVisible = visibleHeaders.filter(h => pinnedColumns.includes(h));
    if (pinnedVisible.length > 0) {
        onVisibleHeadersChange(pinnedVisible);
    } else if (visibleHeaders.length > 1) {
        onVisibleHeadersChange([visibleHeaders[0]]);
    }
  };

  const handleTogglePin = (header: string) => {
    const newPinned = pinnedColumns.includes(header)
      ? pinnedColumns.filter(h => h !== header)
      : [...pinnedColumns, header];
    onPinnedColumnsChange(newPinned);
  };

  const filteredAndOrderedHeaders = useMemo(() => {
    const filtered = columnOrder.filter(h => h.toLowerCase().includes(searchTerm.toLowerCase()));
    const pinned = filtered.filter(h => pinnedColumns.includes(h));
    const unpinned = filtered.filter(h => !pinnedColumns.includes(h));
    return [...pinned, ...unpinned];
  }, [columnOrder, searchTerm, pinnedColumns]);

  useLayoutEffect(() => {
    if (!listRef.current) return;
    
    const newPositions = new Map<string, DOMRect>();
    const children = Array.from(listRef.current.children) as HTMLElement[];

    // Calculate new positions for all current items
    children.forEach(child => {
        const key = child.dataset.headerKey;
        if (key) {
            newPositions.set(key, child.getBoundingClientRect());
        }
    });

    // Apply INVERT transform for items that have moved
    children.forEach(child => {
        const key = child.dataset.headerKey;
        if (!key) return;
        
        const oldRect = positionsRef.current.get(key);
        const newRect = newPositions.get(key);

        if (oldRect && newRect) {
            const deltaY = oldRect.top - newRect.top;
            if (Math.abs(deltaY) > 1) { // Only animate if moved significantly
                child.style.transform = `translateY(${deltaY}px)`;
                child.style.transition = 'transform 0s';
            }
        }
    });

    // Update the ref for the next run with the new positions
    positionsRef.current = newPositions;

    // PLAY animation in the next frame
    requestAnimationFrame(() => {
        children.forEach(child => {
            if (child.style.transform) {
                 child.style.transform = '';
                 child.style.transition = 'transform 0.3s ease-out';
            }
        });
    });

  }, [filteredAndOrderedHeaders]);


  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, header: string) => {
    setDraggedHeader(header);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', header);
    e.currentTarget.style.opacity = '0.5';
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    target.style.backgroundColor = 'rgba(239, 246, 255, 1)'; // bg-blue-50
  };
    
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    target.style.backgroundColor = '';
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetHeader: string) => {
    e.preventDefault();
    (e.currentTarget as HTMLDivElement).style.backgroundColor = '';
    if (!draggedHeader || draggedHeader === targetHeader) return;

    const fromIndex = columnOrder.indexOf(draggedHeader);
    const toIndex = columnOrder.indexOf(targetHeader);

    const newOrder = [...columnOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    onColumnOrderChange(newOrder);
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedHeader(null);
    e.currentTarget.style.opacity = '1';
  };


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
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="컬럼 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          
          <div ref={listRef} className="max-h-80 overflow-y-auto text-sm">
            {filteredAndOrderedHeaders.map((header) => {
              const isChecked = visibleHeaders.includes(header);
              const isDisabled = isChecked && visibleHeaders.length === 1;
              const isPinned = pinnedColumns.includes(header);

              return (
                <div
                  key={header}
                  data-header-key={header}
                  className="flex items-center p-2 hover:bg-gray-100"
                  draggable
                  onDragStart={(e) => onDragStart(e, header)}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, header)}
                  onDragEnd={onDragEnd}
                >
                  <div className="flex items-center cursor-grab text-gray-400">
                    <DragHandleIcon />
                  </div>
                  <label className={`flex-grow flex items-center ml-2 ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 bg-gray-100 border-gray-300 text-blue-600 rounded focus:ring-blue-500"
                      checked={isChecked}
                      onChange={() => handleToggleVisibility(header)}
                      disabled={isDisabled}
                    />
                    <span className="ml-2 text-gray-800 truncate">
                      {header} ({uniqueValueCounts[header] ?? 0})
                    </span>
                  </label>
                  <button 
                    title={isPinned ? '컬럼 고정 해제' : '컬럼 고정'}
                    className={`ml-2 p-1 rounded-md transition-colors ${isPinned ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:bg-gray-200'}`}
                    onClick={() => handleTogglePin(header)}
                  >
                    <PinIcon />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
             <div className="flex items-center gap-2">
                <button
                    onClick={handleShowAll}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                >
                    모두 보이기
                </button>
                <button
                    onClick={handleHideAll}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                >
                    모두 숨기기
                </button>
            </div>
             <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            >
                닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;