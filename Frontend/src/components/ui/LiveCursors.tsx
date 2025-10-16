import React, { useEffect, useRef } from 'react';
import { Cursor } from '@/hooks/useCollaboration';
import { cn } from '@/utils/cn';

interface LiveCursorsProps {
  cursors: Cursor[];
  currentUserId: string;
  className?: string;
}

export const LiveCursors: React.FC<LiveCursorsProps> = ({
  cursors,
  currentUserId,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update cursor position for current user
      // This would typically be handled by the parent component
      // that manages the collaboration state
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Render live cursors */}
      {cursors
        .filter(cursor => cursor.userId !== currentUserId)
        .map((cursor) => (
          <div
            key={cursor.id}
            className="absolute pointer-events-none z-50 transition-all duration-100"
            style={{
              left: cursor.x,
              top: cursor.y,
              transform: 'translate(-2px, -2px)'
            }}
          >
            {/* Cursor pointer */}
            <div
              className="w-4 h-4"
              style={{ color: cursor.color }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full"
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              </svg>
            </div>

            {/* User name label */}
            <div
              className="absolute top-4 left-2 px-2 py-1 rounded text-xs font-medium text-white shadow-sm"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>

            {/* Cursor trail effect */}
            <div
              className="absolute top-0 left-0 w-1 h-1 rounded-full opacity-50 animate-ping"
              style={{ backgroundColor: cursor.color }}
            />
          </div>
        ))}
    </div>
  );
};
