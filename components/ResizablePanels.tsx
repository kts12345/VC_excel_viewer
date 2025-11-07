
import React, { useState, useCallback, useRef, MouseEvent } from 'react';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

const ResizablePanels: React.FC<ResizablePanelsProps> = ({ leftPanel, rightPanel }) => {
  const [leftWidth, setLeftWidth] = useState(25); // Adjusted initial width for better default view
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    }
  }, []);

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Set reasonable min/max widths
    if (newLeftWidth > 15 && newLeftWidth < 85) {
      setLeftWidth(newLeftWidth);
    }
  }, []);

  React.useEffect(() => {
    // Add mousemove and mouseup to the window to catch events outside the component
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  return (
    <div ref={containerRef} className="flex h-full w-full">
      <div style={{ width: `${leftWidth}%` }} className="h-full flex-shrink-0">
        {leftPanel}
      </div>
      <div
        className="w-1.5 h-full cursor-col-resize bg-gray-200 hover:bg-blue-500 transition-colors duration-200 relative z-10 flex-shrink-0"
        onMouseDown={handleMouseDown}
      />
      <div className="flex-1 h-full relative overflow-hidden">
        {rightPanel}
      </div>
    </div>
  );
};

export default ResizablePanels;
