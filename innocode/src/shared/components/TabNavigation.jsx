import React from "react"

/**
 * TabNavigation - Component có thể tái sử dụng cho navigation tabs
 * @param {Object} props
 * @param {Array} props.tabs - Mảng các tab objects với format: { id: string, label: string }
 * @param {string} props.activeTab - ID của tab đang active
 * @param {Function} props.onTabChange - Callback function khi tab thay đổi
 * @param {string} props.className - CSS classes bổ sung cho container
 */
export default function TabNavigation({
  tabs = [],
  activeTab,
  onTabChange,
  className = "",
}) {
  const getActiveClasses = (isActive) => {
    return `
      box-border
      px-3
      h-[32px]
      border-b-2
      ${
        isActive
          ? "border-orange-400"
          : "border-transparent"
      }
      transition-colors
    `
  }

  return (
    <nav className={`flex gap-3 mb-3 text-sm leading-5 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={getActiveClasses(activeTab === tab.id)}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
