import React from 'react';
import './ContestCard.css';
import { Icon } from '@iconify/react';

const ContestCard = ({ contest, onClick }) => {
  // ✅ Status badge colors
  const statusColors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    gray: 'bg-gray-100 text-gray-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="contest-card bg-white" onClick={onClick}>
      {/* Contest Icon/Image */}
      <div className="contest-card__icon">
        {contest.imgUrl ? (
          <img 
            src={contest.imgUrl} 
            alt={contest.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="flex items-center justify-center w-full h-full bg-orange-100">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M20.5 6H18V4C18 2.9 17.1 2 16 2H8C6.9 2 6 2.9 6 4V6H3.5C2.67 6 2 6.67 2 7.5V9.5C2 10.33 2.67 11 3.5 11H4.09L5.41 20.6C5.58 21.9 6.69 23 8 23H16C17.31 23 18.42 21.9 18.59 20.6L19.91 11H20.5C21.33 11 22 10.33 22 9.5V7.5C22 6.67 21.33 6 20.5 6ZM8 4H16V6H8V4ZM17.5 11L16.21 20H7.79L6.5 11H17.5Z" fill="#ff6b35"/>
                  </svg>
                </div>
              `;
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-orange-100">
            <Icon icon="mdi:trophy" className="text-orange-500 text-4xl" />
          </div>
        )}
      </div>
      
      {/* Contest Content */}
      <div className="contest-card__content">
        {/* Status Badge */}
        {contest.statusLabel && (
          <div className="mb-2">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${statusColors[contest.statusColor] || statusColors.gray}`}>
              {contest.statusLabel}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="contest-card__title">{contest.name}</h3>
        
        {/* Description */}
        <p className="contest-card__description">{contest.description}</p>
        
        {/* Meta Info */}
        <div className="contest-card__meta">
          <span className="contest-card__teams">
            <Icon icon="mdi:account-group" className="inline mr-1" />
            {contest.teams > 0 ? `${contest.teams} Teams` : 'No limit'}
          </span>
          <span className="contest-card__time">
            <Icon icon="mdi:clock-outline" className="inline mr-1" />
            {contest.timeLeft}
          </span>
        </div>

        {/* Rewards */}
        {contest.rewardsText && (
          <div className="mt-2 text-sm text-orange-600 font-medium truncate">
            <Icon icon="mdi:gift" className="inline mr-1" />
            <span className="truncate">{contest.rewardsText}</span>
          </div>
        )}

        {/* Year */}
        {contest.year && (
          <div className="mt-1 text-xs text-gray-500">
            <Icon icon="mdi:calendar" className="inline mr-1" />
            {contest.year}
          </div>
        )}
      </div>
      
      {/* Arrow Icon */}
      <div className="contest-card__arrow transition-all duration-300">
        <Icon icon="mdi:chevron-right" />
      </div>
    </div>
  );
};

export default ContestCard;
