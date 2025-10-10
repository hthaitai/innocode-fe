import React from 'react';
import { Icon } from '@iconify/react';

/**
 * BreadcrumbTitle Component
 *
 * Hiển thị breadcrumb với icon chevron giữa các mục
 *
 * @param {Array} items - Mảng các mục breadcrumb
 * @returns {JSX.Element} Component breadcrumb
 *
 * Ví dụ sử dụng:
 * <BreadcrumbTitle items={['Home', 'Contests', 'Contest Detail']} />
 * Kết quả: Home → Contests → Contest Detail
 */
const BreadcrumbTitle = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-3xl font-bold">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon
              icon="mdi:chevron-right"
              className="h-6 w-6 text-[#7A7574] flex-shrink-0"
            />
          )}
          <span
            className={
              index === items.length - 1 ? 'text-black' : 'text-[#7A7574]'
            }
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbTitle;
