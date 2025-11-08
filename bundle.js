// --- Start of bundle.js ---

// All application code is bundled into this single file.
// It relies on React and ReactDOM being available as global variables from the CDN.

"use strict";

// From services/fileParser.ts
const parseFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
            return reject(new Error("Failed to read file."));
        }
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

        resolve({
          id: `${file.name}-${file.lastModified}`,
          name: file.name,
          headers,
          data: jsonData,
          size: file.size,
          rowCount: jsonData.length,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

// From components/icons/
const AddIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }));
const ChevronLeftIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }));
const ChevronRightIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }));
const ColumnIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" }));
const DragHandleIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6h16M4 12h16M4 18h16" }));
const FilterIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0113 18v-6.586l-3.707-3.707A1 1 0 019 7V4a1 1 0 01-1-1H4a1 1 0 01-1-1z" }));
const FileIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", ...props, className: `h-6 w-6 ${props.className || ''}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }));
const PinIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }));
const SearchIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }));
const SettingsIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", ...props, className: `h-6 w-6 ${props.className || ''}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }));
const SortAscIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 15l7-7 7 7" }));
const SortDescIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }));
const SortIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 text-gray-400 group-hover:text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 9l4-4 4 4m0 6l-4 4-4-4" }));
const TrashIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }));

// From components/FilterDropdown.tsx
const FilterDropdown = ({ header, uniqueValues, filter, onFilterChange, isOpen, onClose }) => {
    const dropdownRef = React.useRef(null);
    const scrollableContainerRef = React.useRef(null);
    const [isLeftAligned, setIsLeftAligned] = React.useState(false);

    const areValuesEqual = (a, b) => {
        const comparableA = a instanceof Date ? a.getTime() : a;
        const comparableB = b instanceof Date ? b.getTime() : b;
        return comparableA === comparableB;
    };

    React.useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.parentElement.getBoundingClientRect();
            const dropdownWidth = 256;
            if (rect.right + dropdownWidth > window.innerWidth) {
                setIsLeftAligned(true);
            } else {
                setIsLeftAligned(false);
            }
        }
    }, [isOpen]);

    const handleCheckboxChange = (value) => {
        const isCurrentlyFiltered = filter?.type === 'checkbox';
        const currentSelected = isCurrentlyFiltered ? filter.selected : uniqueValues;
        const valueExists = currentSelected.some(v => areValuesEqual(v, value));
        const newSelectedValues = valueExists
            ? currentSelected.filter(v => !areValuesEqual(v, value))
            : [...currentSelected, value];

        if (newSelectedValues.length === uniqueValues.length) {
            onFilterChange(header, undefined);
        } else {
            onFilterChange(header, { type: 'checkbox', selected: newSelectedValues });
        }
    };

    const handleSelectAll = () => onFilterChange(header, undefined);
    const handleClearAll = () => onFilterChange(header, { type: 'checkbox', selected: [] });

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);
    
    React.useEffect(() => {
        const element = scrollableContainerRef.current;
        if (isOpen && element) {
            const handleWheel = (e) => {
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
            return () => element.removeEventListener('wheel', handleWheel);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return React.createElement('div', {
        ref: dropdownRef,
        className: `absolute top-full ${isLeftAligned ? 'right-0' : 'left-0'} mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col`,
        onClick: e => e.stopPropagation()
    },
        React.createElement('div', { className: 'flex-grow' },
            React.createElement('div', { className: 'max-h-60 overflow-y-auto p-2 text-sm', ref: scrollableContainerRef },
                uniqueValues.map((value, index) => {
                    const isChecked = filter?.type === 'checkbox' ? filter.selected.some(v => areValuesEqual(v, value)) : true;
                    return React.createElement('label', { key: index, className: 'flex items-center p-1 rounded hover:bg-gray-100 cursor-pointer' },
                        React.createElement('input', { type: 'checkbox', className: 'form-checkbox h-4 w-4 bg-gray-100 border-gray-300 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0', checked: isChecked, onChange: () => handleCheckboxChange(value) }),
                        React.createElement('span', { className: 'ml-2 text-gray-800 truncate' }, String(value))
                    );
                })
            )
        ),
        React.createElement('div', { className: 'flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg' },
            React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('button', { onClick: handleSelectAll, className: 'px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors' }, 'All'),
                React.createElement('button', { onClick: handleClearAll, className: 'px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors' }, 'Clear')
            ),
            React.createElement('button', { onClick: onClose, className: 'px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' }, 'Close')
        )
    );
};

// From components/ColumnSelector.tsx
const ColumnSelector = ({ allHeaders, visibleHeaders, onVisibleHeadersChange, columnOrder, onColumnOrderChange, pinnedColumns, onPinnedColumnsChange, uniqueValueCounts }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [draggedHeader, setDraggedHeader] = React.useState(null);
    const wrapperRef = React.useRef(null);
    const listRef = React.useRef(null);
    const positionsRef = React.useRef(new Map());

    const handleToggleVisibility = (header) => {
        if (visibleHeaders.length === 1 && visibleHeaders.includes(header)) return;
        const newVisibleHeaders = visibleHeaders.includes(header)
            ? visibleHeaders.filter(h => h !== header)
            : [...visibleHeaders, header];
        onVisibleHeadersChange(newVisibleHeaders);
    };

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
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

    const handleTogglePin = (header) => {
        const newPinned = pinnedColumns.includes(header)
            ? pinnedColumns.filter(h => h !== header)
            : [...pinnedColumns, header];
        onPinnedColumnsChange(newPinned);
    };
    
    const filteredAndOrderedHeaders = React.useMemo(() => {
        const filtered = columnOrder.filter(h => h.toLowerCase().includes(searchTerm.toLowerCase()));
        const pinned = filtered.filter(h => pinnedColumns.includes(h));
        const unpinned = filtered.filter(h => !pinnedColumns.includes(h));
        return [...pinned, ...unpinned];
    }, [columnOrder, searchTerm, pinnedColumns]);

    React.useLayoutEffect(() => {
        if (!listRef.current) return;
        const newPositions = new Map();
        const children = Array.from(listRef.current.children);

        children.forEach(child => {
            const key = child.dataset.headerKey;
            if (key) newPositions.set(key, child.getBoundingClientRect());
        });

        children.forEach(child => {
            const key = child.dataset.headerKey;
            if (!key) return;
            const oldRect = positionsRef.current.get(key);
            const newRect = newPositions.get(key);
            if (oldRect && newRect) {
                const deltaY = oldRect.top - newRect.top;
                if (Math.abs(deltaY) > 1) {
                    child.style.transform = `translateY(${deltaY}px)`;
                    child.style.transition = 'transform 0s';
                }
            }
        });
        positionsRef.current = newPositions;
        requestAnimationFrame(() => {
            children.forEach(child => {
                if (child.style.transform) {
                    child.style.transform = '';
                    child.style.transition = 'transform 0.3s ease-out';
                }
            });
        });
    }, [filteredAndOrderedHeaders]);

    const onDragStart = (e, header) => {
        setDraggedHeader(header);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', header);
        e.currentTarget.style.opacity = '0.5';
    };
    const onDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = 'rgba(239, 246, 255, 1)';
    };
    const onDragLeave = (e) => {
        e.currentTarget.style.backgroundColor = '';
    };
    const onDrop = (e, targetHeader) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = '';
        if (!draggedHeader || draggedHeader === targetHeader) return;
        const fromIndex = columnOrder.indexOf(draggedHeader);
        const toIndex = columnOrder.indexOf(targetHeader);
        const newOrder = [...columnOrder];
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);
        onColumnOrderChange(newOrder);
    };
    const onDragEnd = (e) => {
        setDraggedHeader(null);
        e.currentTarget.style.opacity = '1';
    };

    return React.createElement('div', { className: 'relative', ref: wrapperRef },
        React.createElement('button', { onClick: () => setIsOpen(!isOpen), className: 'flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors' },
            React.createElement(ColumnIcon),
            React.createElement('span', null, '컬럼')
        ),
        isOpen && React.createElement('div', { className: 'absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col' },
            React.createElement('div', { className: 'p-2 border-b border-gray-200' },
                React.createElement('div', { className: 'relative' },
                    React.createElement('span', { className: 'absolute inset-y-0 left-0 flex items-center pl-3' }, React.createElement(SearchIcon)),
                    React.createElement('input', { type: 'text', placeholder: '컬럼 검색...', value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm' })
                )
            ),
            React.createElement('div', { ref: listRef, className: 'max-h-80 overflow-y-auto text-sm' },
                filteredAndOrderedHeaders.map(header => {
                    const isChecked = visibleHeaders.includes(header);
                    const isDisabled = isChecked && visibleHeaders.length === 1;
                    const isPinned = pinnedColumns.includes(header);
                    return React.createElement('div', { key: header, 'data-header-key': header, className: 'flex items-center p-2 hover:bg-gray-100', draggable: true, onDragStart: (e) => onDragStart(e, header), onDragOver: onDragOver, onDragLeave: onDragLeave, onDrop: (e) => onDrop(e, header), onDragEnd: onDragEnd },
                        React.createElement('div', { className: 'flex items-center cursor-grab text-gray-400' }, React.createElement(DragHandleIcon)),
                        React.createElement('label', { className: `flex-grow flex items-center ml-2 ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}` },
                            React.createElement('input', { type: 'checkbox', className: 'form-checkbox h-4 w-4 bg-gray-100 border-gray-300 text-blue-600 rounded focus:ring-blue-500', checked: isChecked, onChange: () => handleToggleVisibility(header), disabled: isDisabled }),
                            React.createElement('span', { className: 'ml-2 text-gray-800 truncate' }, `${header} (${uniqueValueCounts[header] ?? 0})`)
                        ),
                        React.createElement('button', { title: isPinned ? '컬럼 고정 해제' : '컬럼 고정', className: `ml-2 p-1 rounded-md transition-colors ${isPinned ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:bg-gray-200'}`, onClick: () => handleTogglePin(header) }, React.createElement(PinIcon))
                    );
                })
            ),
            React.createElement('div', { className: 'flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg' },
                React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('button', { onClick: handleShowAll, className: 'px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors' }, '모두 보이기'),
                    React.createElement('button', { onClick: handleHideAll, className: 'px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors' }, '모두 숨기기')
                ),
                React.createElement('button', { onClick: () => setIsOpen(false), className: 'px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors' }, '닫기')
            )
        )
    );
};

// From components/ResizablePanels.tsx
const ResizablePanels = ({ leftPanel, rightPanel }) => {
    const [leftWidth, setLeftWidth] = React.useState(25);
    const isDragging = React.useRef(false);
    const containerRef = React.useRef(null);

    const handleMouseDown = React.useCallback(() => {
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, []);

    const handleMouseUp = React.useCallback(() => {
        if (isDragging.current) {
            isDragging.current = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
    }, []);

    const handleMouseMove = React.useCallback((e) => {
        if (!isDragging.current || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        if (newLeftWidth > 15 && newLeftWidth < 85) {
            setLeftWidth(newLeftWidth);
        }
    }, []);

    React.useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return React.createElement('div', { ref: containerRef, className: 'flex h-full w-full' },
        React.createElement('div', { style: { width: `${leftWidth}%` }, className: 'h-full flex-shrink-0' }, leftPanel),
        React.createElement('div', { className: 'w-1.5 h-full cursor-col-resize bg-gray-200 hover:bg-blue-500 transition-colors duration-200 relative z-10 flex-shrink-0', onMouseDown: handleMouseDown }),
        React.createElement('div', { className: 'flex-1 h-full relative overflow-hidden' }, rightPanel)
    );
};

// From components/FilePanel.tsx
const TABS = [
    { id: 'files', title: 'File List', icon: React.createElement(FileIcon) },
    { id: 'settings', title: 'Settings', icon: React.createElement(SettingsIcon) },
];
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
const HEADERS = [
    { key: 'name', label: 'File Name' },
    { key: 'size', label: 'Size' },
    { key: 'rowCount', label: 'Rows' },
];

const FileListTable = ({ files, selectedFileId, onSelectFile, onAddFiles, onDeleteFiles }) => {
    const [selectedIds, setSelectedIds] = React.useState(new Set());
    const [columnWidths, setColumnWidths] = React.useState([60, 20, 20]);
    const [sortConfig, setSortConfig] = React.useState({ key: 'name', direction: 'asc' });
    const fileInputRef = React.useRef(null);
    const fileListContainerRef = React.useRef(null);
    const isResizing = React.useRef(null);

    const handleAddClick = () => fileInputRef.current?.click();
    const handleDeleteClick = () => {
        onDeleteFiles(Array.from(selectedIds));
        setSelectedIds(new Set());
    };
    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(new Set(files.map(f => f.id)));
        else setSelectedIds(new Set());
    };
    const handleSelectOne = (id) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(id)) newSelectedIds.delete(id);
        else newSelectedIds.add(id);
        setSelectedIds(newSelectedIds);
    };
    const handleResizeMouseDown = (index, e) => {
        e.preventDefault();
        isResizing.current = { index, startX: e.clientX, startWidths: [...columnWidths] };
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };
    const handleResizeMouseMove = React.useCallback((e) => {
        if (!isResizing.current || !fileListContainerRef.current) return;
        const { index, startX, startWidths } = isResizing.current;
        const dx = e.clientX - startX;
        const containerWidth = fileListContainerRef.current.offsetWidth;
        const resizableWidth = containerWidth - 40;
        const startPixelWidths = startWidths.map(w => (w / 100) * resizableWidth);
        const newPixelWidths = [...startPixelWidths];
        const minWidthPx = 50;
        const newLeftWidth = newPixelWidths[index] + dx;
        const newRightWidth = newPixelWidths[index + 1] - dx;
        if (newLeftWidth >= minWidthPx && newRightWidth >= minWidthPx) {
            newPixelWidths[index] = newLeftWidth;
            newPixelWidths[index + 1] = newRightWidth;
            const totalWidth = newPixelWidths.reduce((sum, w) => sum + w, 0);
            const newPercentageWidths = newPixelWidths.map(w => (w / totalWidth) * 100);
            setColumnWidths(newPercentageWidths);
        }
    }, []);
    const handleResizeMouseUp = React.useCallback(() => {
        if (!isResizing.current) return;
        isResizing.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, []);
    React.useEffect(() => {
        window.addEventListener('mousemove', handleResizeMouseMove);
        window.addEventListener('mouseup', handleResizeMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleResizeMouseMove);
            window.removeEventListener('mouseup', handleResizeMouseUp);
        };
    }, [handleResizeMouseMove, handleResizeMouseUp]);
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };
    const sortedFiles = React.useMemo(() => {
        return [...files].sort((a, b) => {
            const aVal = a[sortConfig.key], bVal = b[sortConfig.key];
            if (typeof aVal === 'string' && typeof bVal === 'string') return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            if (typeof aVal === 'number' && typeof bVal === 'number') return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
            return 0;
        });
    }, [files, sortConfig]);
    const isAllSelected = files.length > 0 && selectedIds.size === files.length;
    const resizerPositions = columnWidths.slice(0, -1).reduce((acc, width, i) => {
        acc.push((i > 0 ? acc[i - 1] : 0) + width);
        return acc;
    }, []);

    return React.createElement('div', { className: 'flex flex-col h-full text-sm text-gray-800' },
        React.createElement('input', { type: 'file', ref: fileInputRef, onChange: onAddFiles, multiple: true, className: 'hidden', accept: '.csv,.xlsx,.xls' }),
        React.createElement('div', { className: 'flex-shrink-0 p-2 flex items-center gap-2 border-b border-gray-200 bg-gray-50' },
            React.createElement('button', { onClick: handleAddClick, className: 'flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors' }, React.createElement(AddIcon, { className: 'h-4 w-4 text-gray-600' }), React.createElement('span', null, 'Add')),
            React.createElement('button', { onClick: handleDeleteClick, disabled: selectedIds.size === 0, className: 'flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors' }, React.createElement(TrashIcon, { className: 'h-4 w-4' }), React.createElement('span', null, 'Delete'))
        ),
        React.createElement('div', { ref: fileListContainerRef, className: 'flex-grow overflow-auto relative' },
            resizerPositions.map((left, i) => React.createElement('div', { key: i, onMouseDown: (e) => handleResizeMouseDown(i, e), className: 'absolute top-0 bottom-0 w-2.5 -translate-x-1/2 cursor-col-resize z-30', style: { left: `calc(40px + ${left / 100} * (100% - 40px))` } })),
            React.createElement('div', { className: 'w-full text-left' },
                React.createElement('div', { className: 'flex sticky top-0 bg-white z-10 border-b border-gray-300 select-none' },
                    React.createElement('div', { className: 'p-2 font-semibold flex-shrink-0', style: { width: '40px' } }, React.createElement('input', { type: 'checkbox', onChange: handleSelectAll, checked: isAllSelected, className: 'form-checkbox h-4 w-4 bg-gray-100 border-gray-300 text-blue-600 rounded focus:ring-blue-500' })),
                    React.createElement('div', { className: 'flex flex-grow' },
                        HEADERS.map((header, i) => React.createElement('div', { key: header.key, className: 'p-2 font-semibold flex items-center justify-between border-r border-gray-200', style: { width: `${columnWidths[i]}%` }, onClick: () => handleSort(header.key) },
                            React.createElement('span', { className: 'truncate' }, header.label),
                            React.createElement('span', { className: 'ml-1' }, sortConfig.key === header.key ? (sortConfig.direction === 'asc' ? React.createElement(SortAscIcon) : React.createElement(SortDescIcon)) : React.createElement(SortIcon))
                        ))
                    )
                ),
                React.createElement('div', null,
                    sortedFiles.length > 0 ? sortedFiles.map(file => React.createElement('div', { key: file.id, className: `flex items-center border-b border-gray-200 transition-colors ${selectedFileId === file.id ? 'bg-blue-100' : 'hover:bg-gray-50'}` },
                        React.createElement('div', { className: 'p-2 flex-shrink-0', style: { width: '40px' } }, React.createElement('input', { type: 'checkbox', checked: selectedIds.has(file.id), onChange: () => handleSelectOne(file.id), className: 'form-checkbox h-4 w-4 bg-gray-100 border-gray-300 text-blue-600 rounded focus:ring-blue-500' })),
                        React.createElement('div', { className: 'flex flex-grow' },
                            React.createElement('div', { className: 'p-2 font-medium flex items-center gap-2 border-r border-gray-200 truncate', style: { width: `${columnWidths[0]}%` }, onClick: () => onSelectFile(file.id) }, React.createElement(FileIcon, { className: 'h-5 w-5 text-gray-500 flex-shrink-0' }), React.createElement('span', { className: 'truncate' }, file.name)),
                            React.createElement('div', { className: 'p-2 text-gray-600 tabular-nums border-r border-gray-200 truncate', style: { width: `${columnWidths[1]}%` }, onClick: () => onSelectFile(file.id) }, formatBytes(file.size)),
                            React.createElement('div', { className: 'p-2 text-gray-600 tabular-nums truncate', style: { width: `${columnWidths[2]}%` }, onClick: () => onSelectFile(file.id) }, file.rowCount.toLocaleString())
                        )
                    )) : React.createElement('div', { className: 'text-center p-8 text-gray-500' }, 'No files. Add or drop files to start.')
                )
            )
        )
    );
};
const TabButton = ({ isActive, onClick, title, icon }) => {
    return React.createElement('button', { onClick, title, className: 'relative w-full p-3 transition-colors duration-200 focus:outline-none group' },
        React.createElement('div', { className: `absolute inset-0 transition-colors ${isActive ? 'bg-white rounded-l-lg' : 'group-hover:bg-slate-700 rounded-lg'}` }),
        React.createElement('div', { className: 'relative flex justify-center items-center' }, React.cloneElement(icon, { className: `h-6 w-6 transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-white'}` }))
    );
};
const FilePanel = ({ files, selectedFileId, onSelectFile, onAddFiles, onDeleteFiles }) => {
    const [activeTab, setActiveTab] = React.useState('files');
    return React.createElement('div', { className: 'h-full w-full flex flex-row bg-white shadow-md' },
        React.createElement('div', { className: 'flex flex-col items-center py-2 pl-2 space-y-2 bg-slate-800' }, TABS.map(tab => React.createElement(TabButton, { key: tab.id, isActive: activeTab === tab.id, onClick: () => setActiveTab(tab.id), title: tab.title, icon: tab.icon }))),
        React.createElement('div', { className: 'flex-grow overflow-hidden' },
            activeTab === 'files' && React.createElement(FileListTable, { files, selectedFileId, onSelectFile, onAddFiles, onDeleteFiles }),
            activeTab === 'settings' && React.createElement('div', { className: 'p-4 text-gray-600 text-sm' }, 'Settings configuration feature to be implemented.')
        )
    );
};

// From components/TableView.tsx
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100, 150, 300, 500];
const MIN_COLUMN_WIDTH = 150;
const formatDate = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const TableView = ({ fileData }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [filters, setFilters] = React.useState({});
    const [sortConfig, setSortConfig] = React.useState(null);
    const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);
    const [activeFilterDropdown, setActiveFilterDropdown] = React.useState(null);
    const [pageInput, setPageInput] = React.useState(String(currentPage));
    const [isFilterRowVisible, setIsFilterRowVisible] = React.useState(true);
    const [columnOrder, setColumnOrder] = React.useState(fileData.headers);
    const [visibleHeaders, setVisibleHeaders] = React.useState(fileData.headers);
    const [pinnedColumns, setPinnedColumns] = React.useState([]);
    const [columnWidths, setColumnWidths] = React.useState({});
    const tableContainerRef = React.useRef(null);
    const isResizing = React.useRef(null);
    const [draggedColumn, setDraggedColumn] = React.useState(null);
    const [dropTargetColumn, setDropTargetColumn] = React.useState(null);
    const ghostNodeRef = React.useRef(null);

    React.useEffect(() => {
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
            const newWidths = {};
            if (totalMinWidth > containerWidth) {
                initialHeaders.forEach(h => newWidths[h] = MIN_COLUMN_WIDTH);
            } else {
                const extraPerColumn = (containerWidth - totalMinWidth) / initialHeaders.length;
                initialHeaders.forEach(h => newWidths[h] = MIN_COLUMN_WIDTH + extraPerColumn);
            }
            setColumnWidths(newWidths);
        }
    }, [fileData.id, fileData.headers]);
    React.useEffect(() => { setSelectedRowIndex(null); }, [sortConfig, filters, currentPage, rowsPerPage]);
    React.useEffect(() => { setPageInput(String(currentPage)); }, [currentPage]);
    
    const orderedVisibleHeaders = React.useMemo(() => columnOrder.filter(h => visibleHeaders.includes(h)), [columnOrder, visibleHeaders]);
    const { pinnedVisibleHeaders, unpinnedVisibleHeaders } = React.useMemo(() => {
        const pinned = orderedVisibleHeaders.filter(h => pinnedColumns.includes(h));
        const unpinned = orderedVisibleHeaders.filter(h => !pinnedColumns.includes(h));
        return { pinnedVisibleHeaders: pinned, unpinnedVisibleHeaders: unpinned };
    }, [orderedVisibleHeaders, pinnedColumns]);

    const uniqueColumnValues = React.useMemo(() => {
        const uniqueVals = {};
        fileData.headers.forEach(header => { uniqueVals[header] = new Set(); });
        fileData.data.forEach(row => {
            fileData.headers.forEach(header => {
                const value = row[header];
                if (value !== null && value !== undefined) uniqueVals[header].add(value);
            });
        });
        const result = {};
        fileData.headers.forEach(header => { result[header] = Array.from(uniqueVals[header]); });
        return result;
    }, [fileData]);

    const filteredData = React.useMemo(() => {
        if (Object.keys(filters).length === 0) return fileData.data;
        return fileData.data.filter(row => {
            return Object.entries(filters).every(([header, filterValue]) => {
                const cellValue = row[header];
                if (filterValue.type === 'checkbox') {
                    if (filterValue.selected.length === 0) return false;
                    const comparableCellValue = cellValue instanceof Date ? cellValue.getTime() : cellValue;
                    return filterValue.selected.some(selectedValue => (selectedValue instanceof Date ? selectedValue.getTime() : selectedValue) === comparableCellValue);
                }
                if (filterValue.type === 'text') {
                    if (filterValue.value === '') return true;
                    return String(cellValue ?? '').toLowerCase().includes(filterValue.value.toLowerCase());
                }
                return true;
            });
        });
    }, [fileData.data, filters]);
    
    const uniqueValueCounts = React.useMemo(() => {
        const uniqueVals = {};
        fileData.headers.forEach(h => { uniqueVals[h] = new Set(); });
        filteredData.forEach(row => fileData.headers.forEach(h => { if(row[h] != null) uniqueVals[h].add(row[h]); }));
        const counts = {};
        fileData.headers.forEach(h => { counts[h] = uniqueVals[h].size; });
        return counts;
    }, [filteredData, fileData.headers]);

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key], bVal = b[sortConfig.key];
            if (aVal == null) return sortConfig.direction === 'asc' ? -1 : 1;
            if (bVal == null) return sortConfig.direction === 'asc' ? 1 : -1;
            if (aVal instanceof Date && bVal instanceof Date) return sortConfig.direction === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
            if (typeof aVal === 'string' && typeof bVal === 'string') return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            if (typeof aVal === 'number' && typeof bVal === 'number') return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
            if (typeof aVal === 'boolean' && typeof bVal === 'boolean') return sortConfig.direction === 'asc' ? (aVal === bVal ? 0 : aVal ? -1 : 1) : (aVal === bVal ? 0 : aVal ? 1 : -1);
            return String(aVal).localeCompare(String(bVal)) * (sortConfig.direction === 'asc' ? 1 : -1);
        });
    }, [filteredData, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const paginatedData = React.useMemo(() => sortedData.slice((currentPage - 1) * rowsPerPage, (currentPage - 1) * rowsPerPage + rowsPerPage), [sortedData, currentPage, rowsPerPage]);
    const handleFilterChange = (header, newFilter) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (newFilter) newFilters[header] = newFilter;
            else delete newFilters[header];
            return newFilters;
        });
        setCurrentPage(1);
    };
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };
    const handleResizeMouseDown = (header, e) => {
        e.preventDefault();
        isResizing.current = { header, startX: e.clientX, startWidth: columnWidths[header] };
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };
    const handleResizeMouseMove = React.useCallback((e) => {
        if (!isResizing.current) return;
        const { header, startX, startWidth } = isResizing.current;
        const newWidth = startWidth + (e.clientX - startX);
        if (newWidth >= MIN_COLUMN_WIDTH) setColumnWidths(prev => ({ ...prev, [header]: newWidth }));
    }, []);
    const handleResizeMouseUp = React.useCallback(() => {
        if (!isResizing.current) return;
        isResizing.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, []);
    React.useEffect(() => {
        window.addEventListener('mousemove', handleResizeMouseMove);
        window.addEventListener('mouseup', handleResizeMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleResizeMouseMove);
            window.removeEventListener('mouseup', handleResizeMouseUp);
        };
    }, [handleResizeMouseMove, handleResizeMouseUp]);
    const handlePageInputChange = (e) => setPageInput(e.target.value);
    const handlePageInputSubmit = () => {
        const pageNum = parseInt(pageInput, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
        else setPageInput(String(currentPage));
    };
    const handlePageInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            handlePageInputSubmit();
            e.currentTarget.blur();
        }
    };
    const handleDragStart = (e, header) => {
        setDraggedColumn(header);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', header);
        const dragNode = e.currentTarget;
        if (dragNode) {
            const rect = dragNode.getBoundingClientRect();
            const ghost = dragNode.cloneNode(true);
            ghost.style.position = 'absolute';
            ghost.style.top = '-10000px';
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
            e.dataTransfer.setDragImage(ghost, e.clientX - rect.left, e.clientY - rect.top);
        }
    };
    const handleDragOver = (e, targetHeader) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedColumn === null || draggedColumn === targetHeader) setDropTargetColumn(null);
        else setDropTargetColumn(targetHeader);
    };
    const handleDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropTargetColumn(null); };
    const handleDragEnd = () => {
        if (ghostNodeRef.current) {
            ghostNodeRef.current.remove();
            ghostNodeRef.current = null;
        }
        setDraggedColumn(null);
        setDropTargetColumn(null);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedColumn || !dropTargetColumn || draggedColumn === dropTargetColumn) {
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
    const getColumnStyle = (header) => {
        const style = { transition: 'background-color 0.2s ease-in-out' };
        if (dropTargetColumn === header && draggedColumn !== header) style.backgroundColor = 'rgba(147, 197, 253, 0.4)';
        return style;
    };
    const totalPinnedWidth = React.useMemo(() => pinnedVisibleHeaders.reduce((sum, h) => sum + (columnWidths[h] || MIN_COLUMN_WIDTH), 0), [pinnedVisibleHeaders, columnWidths]);
    const totalUnpinnedWidth = React.useMemo(() => unpinnedVisibleHeaders.reduce((sum, h) => sum + (columnWidths[h] || MIN_COLUMN_WIDTH), 0), [unpinnedVisibleHeaders, columnWidths]);
    const totalWidth = totalPinnedWidth + totalUnpinnedWidth;
    const stickyOffsets = React.useMemo(() => {
        const offsets = {};
        let currentOffset = 0;
        pinnedVisibleHeaders.forEach(header => {
            offsets[header] = currentOffset;
            currentOffset += columnWidths[header] || MIN_COLUMN_WIDTH;
        });
        return offsets;
    }, [pinnedVisibleHeaders, columnWidths]);
    const resizerPositions = React.useMemo(() => {
        const positions = [];
        let cumulativeWidth = 0;
        orderedVisibleHeaders.slice(0, -1).forEach(header => {
            cumulativeWidth += columnWidths[header] || MIN_COLUMN_WIDTH;
            positions.push({ header, left: cumulativeWidth });
        });
        return positions;
    }, [orderedVisibleHeaders, columnWidths]);
    const isFilterActive = React.useCallback((header) => {
        const filter = filters[header];
        if (!filter) return false;
        if (filter.type === 'text') return !!filter.value;
        if (filter.type === 'checkbox') {
            const allValues = uniqueColumnValues[header];
            return !allValues ? false : filter.selected.length < allValues.length;
        }
        return false;
    }, [filters, uniqueColumnValues]);

    if (!fileData) return null;
    
    const renderHeaderCell = (header, isPinned, style = {}) => React.createElement('div', { key: header, className: `font-semibold flex flex-col justify-start border-r border-gray-200 flex-shrink-0 relative transition-opacity ${isPinned ? 'bg-gray-200' : 'bg-gray-100'} ${draggedColumn === header ? 'opacity-50' : ''}`, style: { width: `${columnWidths[header] || MIN_COLUMN_WIDTH}px`, ...getColumnStyle(header), ...style }, onDragOver: (e) => handleDragOver(e, header), onDragLeave: handleDragLeave, onDrop: handleDrop },
        React.createElement('div', { className: 'flex items-stretch justify-between group cursor-auto h-12', draggable: true, onDragStart: (e) => handleDragStart(e, header), onDragEnd: handleDragEnd },
            React.createElement('div', { className: 'flex-grow p-3 flex items-center truncate', onClick: (e) => { e.stopPropagation(); handleSort(header); } },
                React.createElement('span', { className: 'truncate' }, header),
                React.createElement('span', { className: 'ml-1 flex-shrink-0' }, sortConfig?.key === header ? (sortConfig.direction === 'asc' ? React.createElement(SortAscIcon) : React.createElement(SortDescIcon)) : React.createElement(SortIcon))
            )
        ),
        isFilterRowVisible && React.createElement('div', { className: 'px-2 pb-2 h-10 flex items-center' },
            (() => {
                const isTextFilter = uniqueColumnValues[header].length > 50;
                const filter = filters[header];
                if (isTextFilter) {
                    return React.createElement('input', { type: 'text', 'data-filter-input-for': header, className: `w-full h-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-normal ${isFilterActive(header) ? 'border-teal-500' : 'border-gray-300'}`, value: (filter)?.value || '', onChange: (e) => handleFilterChange(header, e.target.value ? { type: 'text', value: e.target.value } : undefined), onKeyDown: (e) => { if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur(); }, onClick: e => e.stopPropagation(), placeholder: 'Filter...' });
                }
                const isFiltered = filter && filter.type === 'checkbox';
                const selectedCount = isFiltered ? (filter).selected.length : 0;
                const displayText = !isFiltered || selectedCount === uniqueColumnValues[header].length ? 'All' : `${selectedCount} selected`;
                return React.createElement('div', { className: 'relative w-full h-full' },
                    React.createElement('div', { className: `w-full h-full px-2 py-1 border rounded-md text-sm font-normal bg-white flex items-center justify-between text-gray-700 cursor-pointer ${isFilterActive(header) ? 'border-teal-500' : 'border-gray-300'}`, onClick: () => setActiveFilterDropdown(prev => prev === header ? null : header) },
                        React.createElement('span', { className: 'truncate' }, displayText),
                        React.createElement(SortDescIcon, { className: 'h-4 w-4 text-gray-500 flex-shrink-0' })
                    ),
                    React.createElement(FilterDropdown, { header, uniqueValues: uniqueColumnValues[header], filter: filters[header], onFilterChange: handleFilterChange, isOpen: activeFilterDropdown === header, onClose: () => setActiveFilterDropdown(null) })
                );
            })()
        )
    );
    const renderRowCell = (row, header, isPinned, style = {}) => {
        const cellValue = row[header];
        const displayValue = cellValue instanceof Date ? formatDate(cellValue) : String(cellValue ?? '');
        return React.createElement('div', { key: header, className: `p-3 border-r border-gray-200 truncate flex-shrink-0 ${isPinned ? 'bg-white' : ''}`, style: { width: `${columnWidths[header] || MIN_COLUMN_WIDTH}px`, ...getColumnStyle(header), ...style } }, displayValue);
    };

    return React.createElement('div', { className: 'flex flex-col h-full w-full bg-white text-gray-800 rounded-lg overflow-hidden' },
        React.createElement('div', { className: 'flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 text-sm flex-shrink-0' },
            React.createElement('div', { className: 'flex items-center gap-4' }, React.createElement('span', { className: 'text-gray-600' }, `(${filteredData.length.toLocaleString()} / ${fileData.data.length.toLocaleString()} rows)`)),
            React.createElement('div', { className: 'flex items-center gap-4' },
                React.createElement('button', { onClick: () => setIsFilterRowVisible(prev => !prev), className: `flex items-center gap-2 px-3 py-1.5 border rounded-md shadow-sm transition-colors ${isFilterRowVisible ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 hover:bg-gray-50'}` }, React.createElement(FilterIcon), React.createElement('span', null, 'Filter')),
                React.createElement(ColumnSelector, { allHeaders: fileData.headers, visibleHeaders, onVisibleHeadersChange: setVisibleHeaders, columnOrder, onColumnOrderChange: setColumnOrder, pinnedColumns, onPinnedColumnsChange: setPinnedColumns, uniqueValueCounts }),
                React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('label', { htmlFor: 'rowsPerPage', className: 'text-gray-600' }, 'Rows:'),
                    React.createElement('select', { id: 'rowsPerPage', value: rowsPerPage, onChange: (e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }, className: 'bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500' }, ROWS_PER_PAGE_OPTIONS.map(o => React.createElement('option', { key: o, value: o }, o)))
                ),
                React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('button', { onClick: () => setCurrentPage(p => Math.max(1, p - 1)), disabled: currentPage === 1, className: 'p-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed' }, React.createElement(ChevronLeftIcon)),
                    React.createElement('div', { className: 'flex items-center gap-1 text-gray-900' }, 'Page', React.createElement('input', { type: 'text', value: pageInput, onChange: handlePageInputChange, onKeyDown: handlePageInputKeyDown, onBlur: handlePageInputSubmit, className: 'w-12 text-center bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500' }), `of ${totalPages > 0 ? totalPages : 1}`),
                    React.createElement('button', { onClick: () => setCurrentPage(p => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages || totalPages === 0, className: 'p-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed' }, React.createElement(ChevronRightIcon))
                )
            )
        ),
        React.createElement('div', { ref: tableContainerRef, className: 'flex-grow w-full overflow-auto' },
            React.createElement('div', { className: 'relative text-sm', style: { width: totalWidth } },
                resizerPositions.map(({ header, left }) => React.createElement('div', { key: `resizer-${header}`, onMouseDown: (e) => handleResizeMouseDown(header, e), className: 'absolute top-0 h-full w-4 -translate-x-1/2 cursor-col-resize z-40', style: { left: `${left}px` } })),
                React.createElement('div', { className: 'sticky top-0 z-20 flex select-none border-b-2 border-gray-300' },
                    orderedVisibleHeaders.map(header => {
                        const isPinned = pinnedColumns.includes(header);
                        const style = {};
                        if (isPinned) {
                            style.position = 'sticky';
                            style.left = `${stickyOffsets[header]}px`;
                            style.zIndex = 21;
                        }
                        return renderHeaderCell(header, isPinned, style);
                    })
                ),
                React.createElement('div', null,
                    paginatedData.map((row, rowIndex) => React.createElement('div', { key: rowIndex, className: `flex border-b border-gray-200 transition-colors ${selectedRowIndex === rowIndex ? 'bg-blue-100' : 'hover:bg-gray-50'}`, onClick: () => setSelectedRowIndex(rowIndex) },
                        orderedVisibleHeaders.map(header => {
                            const isPinned = pinnedColumns.includes(header);
                            const style = {};
                            if (isPinned) {
                                style.position = 'sticky';
                                style.left = `${stickyOffsets[header]}px`;
                                style.zIndex = 1;
                            }
                            return renderRowCell(row, header, isPinned, style);
                        })
                    ))
                ),
                paginatedData.length === 0 && React.createElement('div', { className: 'text-center p-8 text-gray-600' }, 'No data matches the current filters.')
            )
        )
    );
};

// From App.tsx
const App = () => {
    const [files, setFiles] = React.useState([]);
    const [selectedFileId, setSelectedFileId] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleNewFiles = React.useCallback(async (newFiles) => {
        if (newFiles.length === 0) return;
        setIsLoading(true);
        setError(null);
        const supportedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const validFiles = newFiles.filter(file => supportedTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx'));
        if (validFiles.length === 0) {
            setError(`No supported files found. Please provide Excel or CSV files.`);
            setIsLoading(false);
            return;
        }
        try {
            const parsedFilesData = await Promise.all(validFiles.map(file => parseFile(file)));
            setFiles(prevFiles => {
                const updatedFiles = [...prevFiles];
                parsedFilesData.forEach(parsedData => {
                    if (!updatedFiles.some(f => f.id === parsedData.id)) {
                        updatedFiles.push(parsedData);
                    }
                });
                return updatedFiles;
            });
            if (!selectedFileId && parsedFilesData.length > 0) {
                const newSelectedFile = files.find(f => f.id === selectedFileId) || parsedFilesData[0];
                setSelectedFileId(newSelectedFile.id);
            }
        } catch (err) {
            setError('Failed to parse one or more files. Please ensure they are not corrupted.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedFileId, files]);

    const handleFileDrop = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        handleNewFiles(Array.from(event.dataTransfer.files));
    }, [handleNewFiles]);

    const handleAddFiles = React.useCallback((event) => {
        if (event.target.files) {
            handleNewFiles(Array.from(event.target.files));
            event.target.value = '';
        }
    }, [handleNewFiles]);

    const handleDeleteFiles = React.useCallback((idsToDelete) => {
        const remainingFiles = files.filter(file => !idsToDelete.includes(file.id));
        setFiles(remainingFiles);
        if (selectedFileId && idsToDelete.includes(selectedFileId)) {
            setSelectedFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
        }
    }, [files, selectedFileId]);

    const handleDragOver = React.useCallback((event) => { event.preventDefault(); event.stopPropagation(); }, []);
    const handleDragEnter = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.types.includes('Files')) setIsDragging(true);
    }, []);
    const handleDragLeave = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setIsDragging(false);
    }, []);

    const selectedFile = files.find(file => file.id === selectedFileId) || null;

    return React.createElement('div', {
        className: 'h-screen w-screen bg-gray-100 text-gray-800 flex flex-col overflow-hidden',
        onDrop: handleFileDrop, onDragOver: handleDragOver, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave
    },
        isDragging && React.createElement('div', { className: 'absolute inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center z-50 pointer-events-none' },
            React.createElement('div', { className: 'text-white text-3xl font-bold border-4 border-dashed border-white rounded-2xl p-12' }, 'Drop Excel or CSV file here')
        ),
        React.createElement(ResizablePanels, {
            leftPanel: React.createElement(FilePanel, { files, selectedFileId, onSelectFile: setSelectedFileId, onAddFiles: handleAddFiles, onDeleteFiles: handleDeleteFiles }),
            rightPanel: React.createElement('div', { className: 'h-full w-full bg-white p-4 flex flex-col' },
                isLoading && React.createElement('div', { className: 'text-center p-8' }, 'Parsing file...'),
                error && React.createElement('div', { className: 'text-center p-8 text-red-600' }, error),
                !isLoading && !error && selectedFile && React.createElement(TableView, { key: selectedFile.id, fileData: selectedFile }),
                !isLoading && !error && !selectedFile && React.createElement('div', { className: 'flex-grow flex items-center justify-center text-gray-500' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h2', { className: 'text-2xl font-semibold text-gray-800' }, 'Welcome to the Data Viewer'),
                        React.createElement('p', { className: 'mt-2 text-gray-600' }, 'Drag and drop an Excel or CSV file anywhere to get started.')
                    )
                )
            )
        })
    );
};

// From index.tsx
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));

// --- End of bundle.js ---
