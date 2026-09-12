import React from 'react';

/**
 * Shared layout component providing the subtle engineering grid-mesh background
 * extracted from Command Centre and applied uniformly behind all application routes.
 */
export default function GridBackground({ children, className = '' }) {
  return (
    <div className={`w-full flex-1 flex flex-col tech-grid bg-[#F8FAFC] ${className}`}>
      {children}
    </div>
  );
}
