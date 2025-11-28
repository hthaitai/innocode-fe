import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const BreadcrumbTitle = ({ items = [], paths = [], maxVisible = 3 }) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  if (!items || items.length === 0) return null;

  const handleBreadcrumbClick = (index) => {
    if (index === items.length - 1) return; // Last item = current page
    if (paths && paths[index]) navigate(paths[index]);
    else navigate(-1);
  };

  const isCollapsible = items.length > maxVisible;

  let firstItems = [];
  let lastItems = [];
  let hiddenItems = [];

  if (isCollapsible) {
    firstItems = [items[0]]; // Always show first
    lastItems = items.slice(items.length - (maxVisible - 1));
    hiddenItems = items.slice(1, items.length - (maxVisible - 1));
  } else {
    firstItems = items;
    lastItems = [];
    hiddenItems = [];
  }

  return (
    <div className="flex items-center gap-2 text-[28px] leading-[36px] font-semibold flex-wrap min-w-0 max-w-full">
      {/* First visible items */}
      {firstItems.map((item, index) => (
        <React.Fragment key={`first-${index}`}>
          {index !== 0 && (
            <Icon
              icon="mdi:chevron-right"
              className="h-6 w-6 text-[#7A7574] flex-shrink-0"
            />
          )}
          <span
            className={
              `${
                index === items.length - 1
                  ? "text-black cursor-default"
                  : "text-[#7A7574] cursor-pointer hover:text-orange-500 transition-colors duration-200"
              } truncate max-w-[400px]`
            }
            onClick={() => handleBreadcrumbClick(index)}
            title={item}
          >
            {item}
          </span>

          {/* Ellipsis dropdown if collapsible */}
          {isCollapsible && hiddenItems.length > 0 && index === 0 && (
            <>
              <Icon
                icon="mdi:chevron-right"
                className="h-6 w-6 text-[#7A7574]"
              />
              <span
                className="text-[#7A7574] cursor-pointer hover:text-orange-500 relative transition-colors duration-200"
                onClick={() => setShowAll(!showAll)}
              >
                ...
                {showAll && (
                  <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md p-2 z-50 flex flex-col gap-1">
                    {hiddenItems.map((hiddenItem, i) => (
                      <span
                        key={`hidden-${i}`}
                        className="text-[#7A7574] cursor-pointer hover:text-orange-500 transition-colors duration-200"
                        onClick={() => handleBreadcrumbClick(i + 1)}
                      >
                        {hiddenItem}
                      </span>
                    ))}
                  </div>
                )}
              </span>
            </>
          )}
        </React.Fragment>
      ))}

      {/* Last visible items */}
      {lastItems.map((item, index) => {
        const realIndex = items.length - lastItems.length + index;
        return (
          <React.Fragment key={`last-${realIndex}`}>
            {firstItems.length > 0 || index !== 0 ? (
              <Icon
                icon="mdi:chevron-right"
                className="h-6 w-6 text-[#7A7574] flex-shrink-0"
              />
            ) : null}
            <span
              className={
                `${
                  realIndex === items.length - 1
                    ? "text-black cursor-default"
                    : "text-[#7A7574] cursor-pointer hover:text-orange-500 transition-colors duration-200"
                } truncate max-w-[400px]`
              }
              onClick={() => handleBreadcrumbClick(realIndex)}
              title={item}
            >
              {item}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BreadcrumbTitle;
