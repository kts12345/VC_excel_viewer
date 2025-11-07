import React, { useState, useRef, useCallback, ChangeEvent, useEffect, useMemo } from 'react';
import { FileData } from '../types';
import { FileIcon } from './icons/FileIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { AddIcon } from './icons/AddIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SortIcon } from './icons/SortIcon';
import { SortAscIcon } from './icons/SortAscIcon';
import { SortDescIcon } from './icons/SortDescIcon';


interface FilePanelProps {
  files: FileData[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  onAddFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  onDeleteFiles: (ids: string[]) => void;
}

type TabId = 'files' | 'settings';

interface Tab {
  id: TabId;
  title: string;
  icon: React.ReactElement<{ className?: string }>;
}

const TABS: Tab[] = [
  { id: 'files', title: 'File List', icon: <FileIcon /> },
  { id: 'settings', title: 'Settings', icon: <SettingsIcon /> },
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

type SortableKeys = 'name' | 'size' | 'rowCount';

const HEADERS: { key: SortableKeys; label: string }[] = [
    { key: 'name', label: 'File Name' },
    { key: 'size', label: 'Size' },
    { key: 'rowCount', label: 'Rows' },
];

const FileListTable: React.FC<Omit<FilePanelProps, 'onSelectFile'> & { onSelectFile: (id: string) => void; }> = ({
  files,
  selectedFileId,
  onSelectFile,
  onAddFiles,
  onDeleteFiles,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [columnWidths, setColumnWidths] = useState([60, 20, 20]);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileListContainerRef = useRef<HTMLDivElement>(null);

  const isResizing = useRef<{ index: number; startX: number; startWidths: number[] } | null>(null);

  const handleAddClick = () => fileInputRef.current?.click();

  const handleDeleteClick = () => {
    onDeleteFiles(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(files.map(f => f.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };
  
  const handleResizeMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = {
      index: index,
      startX: e.clientX,
      startWidths: [...columnWidths],
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  
  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !fileListContainerRef.current) return;

    const { index, startX, startWidths } = isResizing.current;
    const dx = e.clientX - startX;
    const containerWidth = fileListContainerRef.current.offsetWidth;
    
    // Checkbox width is fixed at 40px
    const resizableWidth = containerWidth - 40;
    const startPixelWidths = startWidths.map(w => (w / 100) * resizableWidth);

    const newPixelWidths = [...startPixelWidths];
    const minWidthPx = 50;

    const leftColWidth = newPixelWidths[index];
    const rightColWidth = newPixelWidths[index + 1];

    const newLeftWidth = leftColWidth + dx;
    const newRightWidth = rightColWidth - dx;

    if (newLeftWidth >= minWidthPx && newRightWidth >= minWidthPx) {
      newPixelWidths[index] = newLeftWidth;
      newPixelWidths[index + 1] = newRightWidth;

      const totalWidth = newPixelWidths.reduce((sum, w) => sum + w, 0);
      const newPercentageWidths = newPixelWidths.map(w => (w / totalWidth) * 100);
      
      setColumnWidths(newPercentageWidths);
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
    
  const handleSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [files, sortConfig]);

  const isAllSelected = files.length > 0 && selectedIds.size === files.length;
  
  const resizerPositions = columnWidths.slice(0, -1).reduce((acc, width, i) => {
      const prevPosition = i > 0 ? acc[i - 1] : 0;
      acc.push(prevPosition + width);
      return acc;
  }, [] as number[]);


  return (
    <div className="flex flex-col h-full text-sm text-gray-800">
      <input type="file" ref={fileInputRef} onChange={onAddFiles} multiple className="hidden" accept=".csv,.xlsx,.xls" />
      
      <div className="flex-shrink-0 p-2 flex items-center gap-2 border-b border-gray-200 bg-gray-50">
        <button onClick={handleAddClick} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors">
          <AddIcon className="h-4 w-4 text-gray-600" />
          <span>Add</span>
        </button>
        <button onClick={handleDeleteClick} disabled={selectedIds.size === 0} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
          <TrashIcon className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>

      <div ref={fileListContainerRef} className="flex-grow overflow-auto relative">
         {/* Resizer Handles - positioned relative to this container now */}
        {resizerPositions.map((left, i) => (
            <div
                key={i}
                onMouseDown={(e) => handleResizeMouseDown(i, e)}
                className="absolute top-0 bottom-0 w-2.5 -translate-x-1/2 cursor-col-resize z-30"
                style={{ left: `calc(40px + ${left / 100} * (100% - 40px))` }}
            />
        ))}

        <div className="w-full text-left">
          {/* Header */}
          <div className="flex sticky top-0 bg-white z-10 border-b border-gray-300 select-none">
            <div className="p-2 font-semibold flex-shrink-0" style={{ width: '40px' }}>
              <input type="checkbox" onChange={handleSelectAll} checked={isAllSelected} className="form-checkbox h-4 w-4 bg-gray-100 border-gray-300 text-blue-600 rounded focus:ring-blue-500" />
            </div>
            <div className="flex flex-grow">
                {HEADERS.map((header, i) => (
                  <div 
                    key={header.key} 
                    className="p-2 font-semibold flex items-center justify-between border-r border-gray-200" 
                    style={{ width: `${columnWidths[i]}%` }}
                    onClick={() => handleSort(header.key)}
                  >
                    <span className="truncate">{header.label}</span>
                    <span className="ml-1">
                      {sortConfig.key === header.key ? (
                        sortConfig.direction === 'asc' ? <SortAscIcon /> : <SortDescIcon />
                      ) : (
                        <SortIcon />
                      )}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Body */}
          <div>
            {sortedFiles.length > 0 ? sortedFiles.map(file => (
              <div
                key={file.id} 
                className={`flex items-center border-b border-gray-200 transition-colors ${selectedFileId === file.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
              >
                <div className="p-2 flex-shrink-0" style={{ width: '40px' }}>
                  <input type="checkbox" checked={selectedIds.has(file.id)} onChange={() => handleSelectOne(file.id)} className="form-checkbox h-4 w-4 bg-gray-100 border-gray-300 text-blue-600 rounded focus:ring-blue-500" />
                </div>
                <div className="flex flex-grow">
                    <div className="p-2 font-medium flex items-center gap-2 border-r border-gray-200 truncate" style={{ width: `${columnWidths[0]}%` }} onClick={() => onSelectFile(file.id)}>
                        <FileIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                    </div>
                    <div className="p-2 text-gray-600 tabular-nums border-r border-gray-200 truncate" style={{ width: `${columnWidths[1]}%` }} onClick={() => onSelectFile(file.id)}>{formatBytes(file.size)}</div>
                    <div className="p-2 text-gray-600 tabular-nums truncate" style={{ width: `${columnWidths[2]}%` }} onClick={() => onSelectFile(file.id)}>{file.rowCount.toLocaleString()}</div>
                </div>
              </div>
            )) : (
              <div className="text-center p-8 text-gray-500">
                No files. Add or drop files to start.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  title: string;
  icon: React.ReactElement<{ className?: string }>;
}> = ({ isActive, onClick, title, icon }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className="relative w-full p-3 transition-colors duration-200 focus:outline-none group"
    >
      <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-white rounded-l-lg' : 'group-hover:bg-slate-700 rounded-lg'}`}></div>
      <div className="relative flex justify-center items-center">
        {React.cloneElement(icon, {
          className: `h-6 w-6 transition-colors duration-200 ${
            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-white'
          }`
        })}
      </div>
    </button>
  );
};

const FilePanel: React.FC<FilePanelProps> = ({ files, selectedFileId, onSelectFile, onAddFiles, onDeleteFiles }) => {
  const [activeTab, setActiveTab] = useState<TabId>('files');

  return (
    <div className="h-full w-full flex flex-row bg-white shadow-md">
      <div className="flex flex-col items-center py-2 pl-2 space-y-2 bg-slate-800">
        {TABS.map((tab) => (
           <TabButton
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.title}
            icon={tab.icon}
          />
        ))}
      </div>

      <div className="flex-grow overflow-hidden">
        {activeTab === 'files' && (
          <FileListTable 
            files={files}
            selectedFileId={selectedFileId}
            onSelectFile={onSelectFile}
            onAddFiles={onAddFiles}
            onDeleteFiles={onDeleteFiles}
          />
        )}
        {activeTab === 'settings' && (
          <div className="p-4 text-gray-600 text-sm">
            Settings configuration feature to be implemented.
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePanel;