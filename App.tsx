
import React, { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { FileData } from './types';
import { parseFile } from './services/fileParser';
import ResizablePanels from './components/ResizablePanels';
import FilePanel from './components/FilePanel';
import TableView from './components/TableView';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleNewFiles = useCallback(async (newFiles: File[]) => {
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
              if(!updatedFiles.some(f => f.id === parsedData.id)){
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


  const handleFileDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleNewFiles(Array.from(event.dataTransfer.files));
  }, [handleNewFiles]);

  const handleAddFiles = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleNewFiles(Array.from(event.target.files));
      event.target.value = ''; // Reset input
    }
  }, [handleNewFiles]);

  const handleDeleteFiles = useCallback((idsToDelete: string[]) => {
    const remainingFiles = files.filter(file => !idsToDelete.includes(file.id));
    setFiles(remainingFiles);
    
    if (selectedFileId && idsToDelete.includes(selectedFileId)) {
      setSelectedFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
    }
  }, [files, selectedFileId]);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
        return;
    }
    setIsDragging(false);
  }, []);

  const selectedFile = files.find(file => file.id === selectedFileId) || null;

  return (
    <div 
      className="h-screen w-screen bg-gray-100 text-gray-800 flex flex-col overflow-hidden"
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-white text-3xl font-bold border-4 border-dashed border-white rounded-2xl p-12">
            Drop Excel or CSV file here
          </div>
        </div>
      )}
      <ResizablePanels
        leftPanel={
          <FilePanel
            files={files}
            selectedFileId={selectedFileId}
            onSelectFile={setSelectedFileId}
            onAddFiles={handleAddFiles}
            onDeleteFiles={handleDeleteFiles}
          />
        }
        rightPanel={
          <div className="h-full w-full bg-white p-4 flex flex-col">
            {isLoading && <div className="text-center p-8">Parsing file...</div>}
            {error && <div className="text-center p-8 text-red-600">{error}</div>}
            {!isLoading && !error && selectedFile && <TableView key={selectedFile.id} fileData={selectedFile} />}
            {!isLoading && !error && !selectedFile && (
              <div className="flex-grow flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-800">Welcome to the Data Viewer</h2>
                  <p className="mt-2 text-gray-600">Drag and drop an Excel or CSV file anywhere to get started.</p>
                </div>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default App;