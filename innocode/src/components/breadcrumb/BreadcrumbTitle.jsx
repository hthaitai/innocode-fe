import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

/**
 * BreadcrumbTitle Component với khả năng click navigation
 *
 * @param {Array} items - Mảng các mục breadcrumb
 * @param {Array} paths - Mảng các đường dẫn tương ứng với từng mục breadcrumb
 * @returns {JSX.Element} Component breadcrumb
 *
 * Ví dụ sử dụng:
 * <BreadcrumbTitle 
 *   items={['Home', 'Contests', 'Contest Detail']} 
 *   paths={['/', '/contests', '/contest-detail/123']} 
 * />
 */
const BreadcrumbTitle = ({ items = [], paths = [] }) => {
  const navigate = useNavigate();
  
  if (items.length === 0) return null;

  const handleBreadcrumbClick = (index) => {
    // Không cho phép click vào mục cuối cùng (trang hiện tại)
    if (index === items.length - 1) return;
    
    // Nếu có paths được cung cấp, sử dụng paths
    if (paths[index]) {
      navigate(paths[index]);
    } else {
      // Fallback: navigate về trang trước đó
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center gap-2 text-[28px] leading-[36px] font-semibold">
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
              index === items.length - 1 
                ? 'text-black cursor-default' 
                : 'text-[#7A7574] cursor-pointer hover:text-orange-500 transition-colors duration-200'
            }
            onClick={() => handleBreadcrumbClick(index)}
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbTitle;