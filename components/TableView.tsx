import React, { useState, useMemo, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { FileData, TableRow, Filter, TextFilter, CheckboxFilter } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import FilterDropdown from './FilterDropdown';
import { SortIcon } from './icons/SortIcon';
import { SortAscIcon } from './icons/SortAscIcon';
import { SortDescIcon } from './icons/SortDescIcon';
import ColumnSelector from './ColumnSelector';
import { TrashIcon } from './icons/TrashIcon';
import { FilterIcon } from './icons/FilterIcon';


interface TableViewProps {
  fileData: FileData;
}

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100, 150, 300, 500];
const MIN_COLUMN_WIDTH = 150; // px

const formatDate = (date: Date): string => {
    const pad = (num: number) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};


const TableView: React.FC<TableViewProps> = ({ fileData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [filters, setFilters] = useState<Record<string, Filter>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [inlineFilterHeader, setInlineFilterHeader] = useState<string | null>(null);
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState(String(currentPage));
  const [visibleHeaders, setVisibleHeaders] = useState<string[]>(fileData.headers);

  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef<{ index: number; startX: number; startWidth: number } | null>(null);

  // State for column drag-and-drop
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const ghostNodeRef = useRef<HTMLElement | null>(null);


  useEffect(() => {
    setVisibleHeaders(fileData.headers);
  }, [fileData.headers]);


  useEffect(() => {
    if (visibleHeaders.length > 0 && tableContainerRef.current) {
      const containerWidth = tableContainerRef.current.offsetWidth;
      const totalMinWidth = visibleHeaders.length * MIN_COLUMN_WIDTH;
      
      if (totalMinWidth > containerWidth) {
        setColumnWidths(visibleHeaders.map(() => MIN_COLUMN_WIDTH));
      } else {
        const extraSpace = containerWidth - totalMinWidth;
        const extraPerColumn = extraSpace / visibleHeaders.length;
        setColumnWidths(visibleHeaders.map(() => MIN_COLUMN_WIDTH + extraPerColumn));
      }
    } else if (visibleHeaders.length === 0) {
      setColumnWidths([]);
    }
  }, [visibleHeaders]);

  // Reset selection when data view changes
  useEffect(() => {
    setSelectedRowIndex(null);
  }, [sortConfig, filters, currentPage, rowsPerPage]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const uniqueColumnValues = useMemo(() => {
    const uniqueVals: Record<string, Set<string | number | boolean | Date>> = {};
    fileData.headers.forEach(header => {
      uniqueVals[header] = new Set();
    });
    fileData.data.forEach(row => {
      fileData.headers.forEach(header => {
        const value = row[header];
        if (value !== null && value !== undefined) {
          uniqueVals[header].add(value);
        }
      });
    });
    const result: Record<string, (string | number | boolean | Date)[]> = {};
    fileData.headers.forEach(header => {
      result[header] = Array.from(uniqueVals[header]);
    });
    return result;
  }, [fileData]);

    const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return fileData.data;
    }
    return fileData.data.filter(row => {
      return Object.entries(filters).every(([header, filterValue]) => {
        // FIX: Cast `filterValue` to `Filter` as Object.entries may not preserve the type and can default to `unknown`.
        const filter = filterValue as Filter;
        const cellValue = row[header];
        if (filter.type === 'checkbox') {
           // If nothing is selected in a checkbox filter, no rows should match.
          if (filter.selected.length === 0) return false;
          
          const comparableCellValue = cellValue instanceof Date ? cellValue.getTime() : cellValue;
          return filter.selected.some(selectedValue => {
              const comparableSelectedValue = selectedValue instanceof Date ? selectedValue.getTime() : selectedValue;
              return comparableSelectedValue === comparableCellValue;
          });
        }
        if (filter.type === 'text') {
          if (filter.value === '') return true;
          const cellString = String(cellValue ?? '');
          return cellString.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      });
    });
  }, [fileData.data, filters]);


  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === null || aVal === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bVal === null || bVal === undefined) return sortConfig.direction === 'asc' ? 1 : -1;

      if (aVal instanceof Date && bVal instanceof Date) {
        return sortConfig.direction === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
       if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return sortConfig.direction === 'asc' ? (aVal === bVal ? 0 : aVal ? -1 : 1) : (aVal === bVal ? 0 : aVal ? 1 : -1);
      }
      return String(aVal).localeCompare(String(bVal)) * (sortConfig.direction === 'asc' ? 1 : -1);
    });

  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, rowsPerPage]);
  
  const handleFilterChange = (header: string, newFilter: Filter | undefined) => {
    setFilters(prev => {
        const newFilters = { ...prev };
        if (newFilter) {
            newFilters[header] = newFilter;
        } else {
            delete newFilters[header];
        }
        return newFilters;
    });
    setCurrentPage(1);
  };
  
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleResizeMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = {
      index: index,
      startX: e.clientX,
      startWidth: columnWidths[index],
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  
  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    const { index, startX, startWidth } = isResizing.current;
    const dx = e.clientX - startX;
    
    const newWidth = startWidth + dx;

    if (newWidth >= MIN_COLUMN_WIDTH) {
        const newWidths = [...columnWidths];
        newWidths[index] = newWidth;
        setColumnWidths(newWidths);
    }
  }, [columnWidths]);

  const handleResizeMouseUp = useCallback(() => {
    if (!isResizing.current) return;
    isResizing.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleResizeMouseMove as any);
    window.addEventListener('mouseup', handleResizeMouseUp as any);
    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove as any);
      window.removeEventListener('mouseup', handleResizeMouseUp as any);
    };
  }, [handleResizeMouseMove, handleResizeMouseUp]);
    
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageInput(e.target.value);
    };
    
    const handlePageInputSubmit = () => {
        const pageNum = parseInt(pageInput, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        } else {
            setPageInput(String(currentPage));
        }
    };
    
    const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handlePageInputSubmit();
            e.currentTarget.blur();
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedColumnIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    
        const dragNode = (e.currentTarget as HTMLElement).parentElement;
        if (dragNode) {
            const rect = dragNode.getBoundingClientRect();
            const ghost = dragNode.cloneNode(true) as HTMLElement;
    
            ghost.style.position = 'absolute';
            ghost.style.top = '-10000px';
            ghost.style.left = '-10000px';
            ghost.style.width = `${rect.width}px`;
            ghost.style.height = `${rect.height}px`;
            ghost.style.pointerEvents = 'none';
            
            // Apply a more prominent and stylish "lifted" effect.
            ghost.style.backgroundColor = 'rgb(220 252 231)'; // Tailwind's green-100
            ghost.style.border = '2px solid rgb(34 197 94)'; // Tailwind's green-500
            ghost.style.borderRadius = '0.5rem'; // 8px
            ghost.style.boxShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)'; // Enhanced shadow
            ghost.style.transform = 'scale(1.05)';
            ghost.style.opacity = '1';
            
            document.body.appendChild(ghost);
            ghostNodeRef.current = ghost;
    
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            
            e.dataTransfer.setDragImage(ghost, offsetX, offsetY);
        }
    };

    const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (draggedColumnIndex === null || draggedColumnIndex === targetIndex) {
            setDropTargetIndex(null);
            return;
        }
        setDropTargetIndex(targetIndex);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        const relatedTarget = e.relatedTarget as Node;
        if (!e.currentTarget.contains(relatedTarget)) {
            setDropTargetIndex(null);
        }
    };

    const handleDragEnd = () => {
        if (ghostNodeRef.current) {
            ghostNodeRef.current.remove();
            ghostNodeRef.current = null;
        }
        setDraggedColumnIndex(null);
        setDropTargetIndex(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedColumnIndex === null || dropTargetIndex === null) {
            handleDragEnd();
            return;
        }

        const fromIndex = draggedColumnIndex;
        const toIndex = dropTargetIndex;

        if (fromIndex === toIndex) {
            handleDragEnd();
            return;
        }

        const newHeaders = [...visibleHeaders];
        const [movedHeader] = newHeaders.splice(fromIndex, 1);
        newHeaders.splice(toIndex, 0, movedHeader);
        
        const newWidths = [...columnWidths];
        const [movedWidth] = newWidths.splice(fromIndex, 1);
        newWidths.splice(toIndex, 0, movedWidth);

        setVisibleHeaders(newHeaders);
        setColumnWidths(newWidths);
        handleDragEnd();
    };

  const getColumnStyle = (index: number): React.CSSProperties => {
      const style: React.CSSProperties = {
          transition: 'background-color 0.2s ease-in-out',
      };
      
      if (dropTargetIndex === index && draggedColumnIndex !== index) {
          style.backgroundColor = 'rgba(147, 197, 253, 0.4)'; // Light blue background for the whole column (Tailwind's blue-300 with opacity)
      }
      return style;
  };

  const totalTableWidth = useMemo(() => columnWidths.reduce((sum, w) => sum + w, 0), [columnWidths]);
  
  const resizerPositions = columnWidths.slice(0, -1).reduce((acc, width, i) => {
      const prevPosition = i > 0 ? acc[i - 1] : 0;
      acc.push(prevPosition + width);
      return acc;
  }, [] as number[]);

  const hasActiveFilters = useMemo(() => Object.keys(filters).length > 0, [filters]);
  const isHeaderExpanded = useMemo(() => hasActiveFilters || inlineFilterHeader !== null, [hasActiveFilters, inlineFilterHeader]);


  if (!fileData) return null;

  return (
    <div className="flex flex-col h-full w-full bg-white text-gray-800 rounded-lg overflow-hidden">
      {/* Table Controls */}
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 text-sm flex-shrink-0">
        <div className="flex items-center gap-4">
            <span className="text-gray-600">({filteredData.length.toLocaleString()} / {fileData.data.length.toLocaleString()} rows)</span>
        </div>
        <div className="flex items-center gap-4">
          <ColumnSelector
            allHeaders={fileData.headers}
            visibleHeaders={visibleHeaders}
            onVisibleHeadersChange={setVisibleHeaders}
          />
          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-gray-600">Rows:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROWS_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon />
            </button>
            <div className="flex items-center gap-1 text-gray-900">
                Page
                <input
                    type="text"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onKeyDown={handlePageInputKeyDown}
                    onBlur={handlePageInputSubmit}
                    className="w-12 text-center bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                of {totalPages > 0 ? totalPages : 1}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
      
      {/* Table Structure with a single scroll container */}
      <div 
        ref={tableContainerRef} 
        className="flex-grow overflow-auto relative"
      >
        <div style={{ width: `${totalTableWidth}px`}} className="relative">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-gray-100">
                {columnWidths.length > 0 && resizerPositions.map((left, i) => (
                    <div
                        key={i}
                        onMouseDown={(e) => handleResizeMouseDown(i, e)}
                        className="absolute top-0 bottom-0 w-2.5 -translate-x-1/2 cursor-col-resize z-30"
                        style={{ left: `${left}px`}}
                    />
                ))}
                <div className="text-sm">
                    <div 
                      className="flex border-b-2 border-gray-300 select-none"
                    >
                        {visibleHeaders.map((header, i) => (
                            <div
                                key={header}
                                className={`font-semibold flex flex-col justify-start border-r border-gray-200 flex-shrink-0 relative transition-opacity ${draggedColumnIndex === i ? 'opacity-50' : ''}`}
                                style={{ width: `${columnWidths[i]}px`, ...getColumnStyle(i)}}
                                onDragOver={(e) => handleDragOver(e, i)}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div 
                                    className="flex items-stretch justify-between group cursor-auto"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, i)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div
                                        className="flex-grow p-3 flex items-center truncate"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSort(header);
                                        }}
                                    >
                                        <span className="truncate">{header}</span>
                                        <span
                                          className="ml-1 flex-shrink-0"
                                        >
                                            {sortConfig?.key === header ? (
                                                sortConfig.direction === 'asc' ? <SortAscIcon /> : <SortDescIcon />
                                            ) : (
                                                <SortIcon />
                                            )}
                                        </span>
                                    </div>
                                    <div className="border-l border-gray-200 my-2"></div>
                                    <FilterDropdown
                                        header={header}
                                        uniqueValues={uniqueColumnValues[header]}
                                        filter={filters[header]}
                                        onFilterChange={handleFilterChange}
                                        onActivateInlineFilter={setInlineFilterHeader}
                                        isOpen={activeFilterDropdown === header}
                                        onToggle={() => setActiveFilterDropdown(prev => prev === header ? null : header)}
                                        onClose={() => setActiveFilterDropdown(null)}
                                    />
                                </div>

                                {isHeaderExpanded && (
                                    <div className="px-2 pb-2 h-10 flex items-center">
                                        {(() => {
                                            const isTextFilter = uniqueColumnValues[header].length > 50;
                                            const filter = filters[header];

                                            if (isTextFilter) {
                                                return (
                                                    <input
                                                        type="text"
                                                        className="w-full h-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-normal"
                                                        value={(filter as TextFilter)?.value || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            handleFilterChange(header, value ? { type: 'text', value } : undefined);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Escape') {
                                                                e.currentTarget.blur();
                                                                setInlineFilterHeader(null);
                                                            }
                                                        }}
                                                        onBlur={() => setInlineFilterHeader(null)}
                                                        onClick={e => e.stopPropagation()}
                                                        autoFocus={inlineFilterHeader === header}
                                                        placeholder="필터..."
                                                    />
                                                );
                                            }

                                            // Checkbox filter
                                            const isFiltered = filter && filter.type === 'checkbox';
                                            const selectedCount = isFiltered ? (filter as CheckboxFilter).selected.length : 0;
                                            const isAllSelected = !isFiltered;
                                            const displayText = isAllSelected ? '모두' : `${selectedCount}개 선택됨`;

                                            return (
                                                <div
                                                    className="w-full h-full px-2 py-1 border border-gray-300 rounded-md text-sm font-normal bg-white flex items-center justify-between text-gray-700 cursor-pointer"
                                                    onClick={() => setActiveFilterDropdown(header)}
                                                >
                                                    <span className="truncate">{displayText}</span>
                                                    <SortDescIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="text-sm">
                <div>
                    {paginatedData.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`flex border-b border-gray-200 transition-colors ${selectedRowIndex === rowIndex ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                            onClick={() => setSelectedRowIndex(rowIndex)}
                        >
                            {visibleHeaders.map((header, i) => {
                                const cellValue = row[header];
                                const displayValue = cellValue instanceof Date
                                    ? formatDate(cellValue)
                                    : String(cellValue ?? '');
                                const columnStyle = getColumnStyle(i);

                                return (
                                    <div 
                                        key={header} 
                                        className="p-3 border-r border-gray-200 truncate flex-shrink-0" 
                                        style={{ width: `${columnWidths[i]}px`, ...columnStyle }}
                                    >
                                        {displayValue}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
             {paginatedData.length === 0 && (
                 <div className="text-center p-8 text-gray-600">No data matches the current filters.</div>
             )}
        </div>
      </div>
    </div>
  );
};

export default TableView;