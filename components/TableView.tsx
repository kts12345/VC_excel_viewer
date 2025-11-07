import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { FileData, TableRow, Filter, TextFilter, CheckboxFilter } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import FilterDropdown from './FilterDropdown';
import { SortIcon } from './icons/SortIcon';
import { SortAscIcon } from './icons/SortAscIcon';
import { SortDescIcon } from './icons/SortDescIcon';
import ColumnSelector from './ColumnSelector';
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
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState(String(currentPage));
  const [isFilterRowVisible, setIsFilterRowVisible] = useState(true);
  
  // Advanced Column Management State
  const [columnOrder, setColumnOrder] = useState<string[]>(fileData.headers);
  const [visibleHeaders, setVisibleHeaders] = useState<string[]>(fileData.headers);
  const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);


  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef<{ header: string; startX: number; startWidth: number } | null>(null);

  // State for column drag-and-drop
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dropTargetColumn, setDropTargetColumn] = useState<string | null>(null);
  const ghostNodeRef = useRef<HTMLElement | null>(null);


  useEffect(() => {
    const initialHeaders = fileData.headers;
    setColumnOrder(initialHeaders);
    setVisibleHeaders(initialHeaders);
    setPinnedColumns([]);
    setFilters({});
    setSortConfig(null);
    setCurrentPage(1);
    setIsFilterRowVisible(true);

    if (initialHeaders.length > 0 && tableContainerRef.current) {
      const containerWidth = tableContainerRef.current.offsetWidth;
      const totalMinWidth = initialHeaders.length * MIN_COLUMN_WIDTH;
      const newWidths: Record<string, number> = {};

      if (totalMinWidth > containerWidth) {
        initialHeaders.forEach(h => newWidths[h] = MIN_COLUMN_WIDTH);
      } else {
        const extraSpace = containerWidth - totalMinWidth;
        const extraPerColumn = extraSpace / initialHeaders.length;
        initialHeaders.forEach(h => newWidths[h] = MIN_COLUMN_WIDTH + extraPerColumn);
      }
      setColumnWidths(newWidths);
    }
  }, [fileData.id, fileData.headers]);
  
  // Reset selection when data view changes
  useEffect(() => {
    setSelectedRowIndex(null);
  }, [sortConfig, filters, currentPage, rowsPerPage]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);


  const orderedVisibleHeaders = useMemo(() => {
    return columnOrder.filter(h => visibleHeaders.includes(h));
  }, [columnOrder, visibleHeaders]);

  const { pinnedVisibleHeaders, unpinnedVisibleHeaders } = useMemo(() => {
    const pinned = orderedVisibleHeaders.filter(h => pinnedColumns.includes(h));
    const unpinned = orderedVisibleHeaders.filter(h => !pinnedColumns.includes(h));
    return { pinnedVisibleHeaders: pinned, unpinnedVisibleHeaders: unpinned };
  }, [orderedVisibleHeaders, pinnedColumns]);


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
        const filter = filterValue as Filter;
        const cellValue = row[header];
        if (filter.type === 'checkbox') {
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
  
  const handleResizeMouseDown = (header: string, e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = {
      header: header,
      startX: e.clientX,
      startWidth: columnWidths[header],
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  
  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    const { header, startX, startWidth } = isResizing.current;
    const dx = e.clientX - startX;
    
    const newWidth = startWidth + dx;

    if (newWidth >= MIN_COLUMN_WIDTH) {
        setColumnWidths(prev => ({...prev, [header]: newWidth}));
    }
  }, []);

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

    const handleDragStart = (e: React.DragEvent, header: string) => {
        setDraggedColumn(header);
        e.dataTransfer.effectAllowed = 'move';
        // FIX: Corrected typo from `dataTansfer` to `dataTransfer`.
        e.dataTransfer.setData('text/plain', header);
    
        const dragNode = e.currentTarget as HTMLElement;
        if (dragNode) {
            const rect = dragNode.getBoundingClientRect();
            const ghost = dragNode.cloneNode(true) as HTMLElement;
    
            ghost.style.position = 'absolute';
            ghost.style.top = '-10000px';
            ghost.style.left = '-10000px';
            ghost.style.width = `${rect.width}px`;
            ghost.style.height = `${rect.height}px`;
            ghost.style.pointerEvents = 'none';
            ghost.style.backgroundColor = 'rgb(220 252 231)';
            ghost.style.border = '2px solid rgb(34 197 94)';
            ghost.style.borderRadius = '0.5rem';
            ghost.style.boxShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
            ghost.style.transform = 'scale(1.05)';
            ghost.style.opacity = '1';
            
            document.body.appendChild(ghost);
            ghostNodeRef.current = ghost;
    
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            
            e.dataTransfer.setDragImage(ghost, offsetX, offsetY);
        }
    };

    const handleDragOver = (e: React.DragEvent, targetHeader: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (draggedColumn === null || draggedColumn === targetHeader) {
            setDropTargetColumn(null);
            return;
        }
        setDropTargetColumn(targetHeader);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        const relatedTarget = e.relatedTarget as Node;
        if (!e.currentTarget.contains(relatedTarget)) {
            setDropTargetColumn(null);
        }
    };

    const handleDragEnd = () => {
        if (ghostNodeRef.current) {
            ghostNodeRef.current.remove();
            ghostNodeRef.current = null;
        }
        setDraggedColumn(null);
        setDropTargetColumn(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedColumn === null || dropTargetColumn === null || draggedColumn === dropTargetColumn) {
            handleDragEnd();
            return;
        }
    
        const fromIndex = columnOrder.indexOf(draggedColumn);
        const toIndex = columnOrder.indexOf(dropTargetColumn);
    
        const newOrder = [...columnOrder];
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);
    
        setColumnOrder(newOrder);
        handleDragEnd();
    };

  const getColumnStyle = (header: string): React.CSSProperties => {
      const style: React.CSSProperties = {
          transition: 'background-color 0.2s ease-in-out',
      };
      
      if (dropTargetColumn === header && draggedColumn !== header) {
          style.backgroundColor = 'rgba(147, 197, 253, 0.4)';
      }
      return style;
  };

  const totalPinnedWidth = useMemo(() => pinnedVisibleHeaders.reduce((sum, h) => sum + (columnWidths[h] || MIN_COLUMN_WIDTH), 0), [pinnedVisibleHeaders, columnWidths]);
  const totalUnpinnedWidth = useMemo(() => unpinnedVisibleHeaders.reduce((sum, h) => sum + (columnWidths[h] || MIN_COLUMN_WIDTH), 0), [unpinnedVisibleHeaders, columnWidths]);
  const totalWidth = totalPinnedWidth + totalUnpinnedWidth;

  const stickyOffsets = useMemo(() => {
      const offsets: Record<string, number> = {};
      let currentOffset = 0;
      for (const header of pinnedVisibleHeaders) {
          offsets[header] = currentOffset;
          currentOffset += columnWidths[header] || MIN_COLUMN_WIDTH;
      }
      return offsets;
  }, [pinnedVisibleHeaders, columnWidths]);

  const resizerPositions = useMemo(() => {
    const positions: { header: string; left: number }[] = [];
    let cumulativeWidth = 0;
    const headersToResize = orderedVisibleHeaders.slice(0, -1);
    
    headersToResize.forEach(header => {
        cumulativeWidth += columnWidths[header] || MIN_COLUMN_WIDTH;
        positions.push({ header: header, left: cumulativeWidth });
    });
    return positions;
  }, [orderedVisibleHeaders, columnWidths]);


  const isFilterActive = useCallback((header: string): boolean => {
    const filter = filters[header];
    if (!filter) {
        return false;
    }
    if (filter.type === 'text') {
        return !!filter.value;
    }
    if (filter.type === 'checkbox') {
        const allValues = uniqueColumnValues[header];
        if (!allValues) return false;
        return filter.selected.length < allValues.length;
    }
    return false;
  }, [filters, uniqueColumnValues]);

  if (!fileData) return null;

  const renderHeaderCell = (header: string, isPinned: boolean, style: React.CSSProperties = {}) => (
      <div
          key={header}
          className={`font-semibold flex flex-col justify-start border-r border-gray-200 flex-shrink-0 relative transition-opacity ${isPinned ? 'bg-gray-200' : 'bg-gray-100'} ${draggedColumn === header ? 'opacity-50' : ''}`}
          style={{ width: `${columnWidths[header] || MIN_COLUMN_WIDTH}px`, ...getColumnStyle(header), ...style}}
          onDragOver={(e) => handleDragOver(e, header)}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
      >
          <div 
              className="flex items-stretch justify-between group cursor-auto h-12"
              draggable
              onDragStart={(e) => handleDragStart(e, header)}
              onDragEnd={handleDragEnd}
          >
              <div
                  className="flex-grow p-3 flex items-center truncate"
                  onClick={(e) => { e.stopPropagation(); handleSort(header); }}
              >
                  <span className="truncate">{header}</span>
                  <span className="ml-1 flex-shrink-0">
                      {sortConfig?.key === header ? (
                          sortConfig.direction === 'asc' ? <SortAscIcon /> : <SortDescIcon />
                      ) : (
                          <SortIcon />
                      )}
                  </span>
              </div>
          </div>
           {isFilterRowVisible && (
              <div className="px-2 pb-2 h-10 flex items-center">
                  {(() => {
                      const isTextFilter = uniqueColumnValues[header].length > 50;
                      const filter = filters[header];

                      if (isTextFilter) {
                          return (
                              <input
                                  type="text"
                                  data-filter-input-for={header}
                                  className={`w-full h-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-normal ${isFilterActive(header) ? 'border-teal-500' : 'border-gray-300'}`}
                                  value={(filter as TextFilter)?.value || ''}
                                  onChange={(e) => {
                                      const value = e.target.value;
                                      handleFilterChange(header, value ? { type: 'text', value } : undefined);
                                  }}
                                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur(); }}
                                  onClick={e => e.stopPropagation()}
                                  placeholder="Filter..."
                              />
                          );
                      }
                      const isFiltered = filter && filter.type === 'checkbox';
                      const selectedCount = isFiltered ? (filter as CheckboxFilter).selected.length : 0;
                      const isAllSelected = !isFiltered || selectedCount === uniqueColumnValues[header].length;
                      const displayText = isAllSelected ? 'All' : `${selectedCount} selected`;

                      return (
                          <div className="relative w-full h-full">
                              <div
                                  className={`w-full h-full px-2 py-1 border rounded-md text-sm font-normal bg-white flex items-center justify-between text-gray-700 cursor-pointer ${isFilterActive(header) ? 'border-teal-500' : 'border-gray-300'}`}
                                  onClick={() => setActiveFilterDropdown(prev => prev === header ? null : header)}
                              >
                                  <span className="truncate">{displayText}</span>
                                  <SortDescIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              </div>
                              <FilterDropdown
                                  header={header}
                                  uniqueValues={uniqueColumnValues[header]}
                                  filter={filters[header]}
                                  onFilterChange={handleFilterChange}
                                  isOpen={activeFilterDropdown === header}
                                  onClose={() => setActiveFilterDropdown(null)}
                                />
                          </div>
                      );
                  })()}
              </div>
          )}
      </div>
  );

  const renderRowCell = (row: TableRow, header: string, isPinned: boolean, style: React.CSSProperties = {}) => {
      const cellValue = row[header];
      const displayValue = cellValue instanceof Date ? formatDate(cellValue) : String(cellValue ?? '');
      return (
          <div 
              key={header} 
              className={`p-3 border-r border-gray-200 truncate flex-shrink-0 ${isPinned ? 'bg-white' : ''}`}
              style={{ width: `${columnWidths[header] || MIN_COLUMN_WIDTH}px`, ...getColumnStyle(header), ...style }}
          >
              {displayValue}
          </div>
      );
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-gray-800 rounded-lg overflow-hidden">
      {/* Table Controls */}
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 text-sm flex-shrink-0">
        <div className="flex items-center gap-4">
            <span className="text-gray-600">({filteredData.length.toLocaleString()} / {fileData.data.length.toLocaleString()} rows)</span>
        </div>
        <div className="flex items-center gap-4">
          <button
              onClick={() => setIsFilterRowVisible(prev => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-md shadow-sm transition-colors ${
                  isFilterRowVisible ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
          >
              <FilterIcon />
              <span>Filter</span>
          </button>
          <ColumnSelector
            allHeaders={fileData.headers}
            visibleHeaders={visibleHeaders}
            onVisibleHeadersChange={setVisibleHeaders}
            columnOrder={columnOrder}
            onColumnOrderChange={setColumnOrder}
            pinnedColumns={pinnedColumns}
            onPinnedColumnsChange={setPinnedColumns}
          />
          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-gray-600">Rows:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROWS_PER_PAGE_OPTIONS.map(option => (<option key={option} value={option}>{option}</option>))}
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
      
      <div 
        ref={tableContainerRef} 
        className="flex-grow w-full overflow-auto"
      >
        <div className="relative text-sm" style={{ width: totalWidth }}>
            {resizerPositions.map(({ header, left }) => (
                <div
                    key={`resizer-${header}`}
                    onMouseDown={(e) => handleResizeMouseDown(header, e)}
                    className="absolute top-0 h-full w-4 -translate-x-1/2 cursor-col-resize z-40"
                    style={{ left: `${left}px` }}
                />
            ))}
            {/* Header */}
            <div className="sticky top-0 z-20 flex select-none border-b-2 border-gray-300">
                {orderedVisibleHeaders.map(header => {
                    const isPinned = pinnedColumns.includes(header);
                    const style: React.CSSProperties = {};
                    if (isPinned) {
                        style.position = 'sticky';
                        style.left = `${stickyOffsets[header]}px`;
                        style.zIndex = 21;
                    }
                    return renderHeaderCell(header, isPinned, style);
                })}
            </div>

            {/* Body */}
            <div>
                {paginatedData.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`flex border-b border-gray-200 transition-colors ${selectedRowIndex === rowIndex ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedRowIndex(rowIndex)}
                    >
                        {orderedVisibleHeaders.map(header => {
                           const isPinned = pinnedColumns.includes(header);
                           const style: React.CSSProperties = {};
                           if (isPinned) {
                               style.position = 'sticky';
                               style.left = `${stickyOffsets[header]}px`;
                               style.zIndex = 1; // Lower z-index for body cells
                           }
                           return renderRowCell(row, header, isPinned, style);
                        })}
                    </div>
                ))}
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