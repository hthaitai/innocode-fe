import React from 'react';
import { BreadcrumbTitle } from './breadcrumb';

export default function PageContainer({
  breadcrumb,
  breadcrumbPaths, // Thêm prop mới cho paths
  children,
  className = '',
  actions = null,
  bg = true,
}) {
  return (
    <div className={`p-2 ${className}`}>
      <div className="container mx-auto px-4 py-2">
        {breadcrumb && (
          <div className="breadcrumb-fixed">
            {breadcrumb ? (
              <BreadcrumbTitle 
                items={breadcrumb} 
                paths={breadcrumbPaths} 
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-800">
                {title}
              </h1>
            )}
            {actions && <div className="ml-4">{actions}</div>}
          </div>
        )}
        <div
          className={`min-h-[650px] rounded-lg p-2 ${
            bg ? 'bg-white shadow-md' : ''
          } ${breadcrumb ? 'mt-20' : ''}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
