import React from 'react';

export default function PageContainer({
  title,
  children,
  className = '',
  actions = null,
}) {
  return (
    <div className={`p-2 ${className}`}>
      <div className="container   mx-auto px-4 py-2">
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            {actions && <div className="ml-4">{actions}</div>}
          </div>
        )}
        <div className="bg-white min-h-[650px] rounded-lg shadow-md p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
