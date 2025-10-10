import React from 'react';

/**
 * TabNavigation - Component có thể tái sử dụng cho navigation tabs
 * @param {Object} props
 * @param {Array} props.tabs - Mảng các tab objects với format: { id: string, label: string }
 * @param {string} props.activeTab - ID của tab đang active
 * @param {Function} props.onTabChange - Callback function khi tab thay đổi
 * @param {string} props.className - CSS classes bổ sung cho container
 * @param {string} props.activeColor - Màu cho tab active (default: 'orange')
 * @param {string} props.hoverColor - Màu hover cho tab inactive (default: 'gray')
 */
export default function TabNavigation({
  tabs = [],
  activeTab,
  onTabChange,
  className = '',
  activeColor = 'orange',
  hoverColor = 'gray'
}) {
  const getActiveClasses = (isActive) => {
    if (isActive) {
      return `bg-${activeColor}-100 text-${activeColor}-600 border-b-4 border-${activeColor}-400 shadow`;
    }
    return `hover:bg-${hoverColor}-100`;
  };

  return (
    <nav className={`flex gap-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded-md font-medium transition ${getActiveClasses(activeTab === tab.id)}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
