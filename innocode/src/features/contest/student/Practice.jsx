import React from 'react';
import PageContainer from '@/shared/components/PageContainer';
import { BREADCRUMBS } from '@/config/breadcrumbs';
import { Clock, Award, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mảng màu để random
const CARD_COLORS = [
  'bg-yellow-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-indigo-400',
  'bg-red-400',
  'bg-orange-400',
  'bg-teal-400',
  'bg-cyan-400',
];

// Function để lấy màu random hoặc theo index
const getCardColor = (index) => {
  return CARD_COLORS[index % CARD_COLORS.length];
};

// Practice Card Component - Tái sử dụng
const PracticeCard = ({
  id,
  title,
  description,
  duration,
  level,
  color = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="w-[255px] flex-shrink-0 h-[230px] rounded-lg border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 group bg-white"
    >
      {/* Header với gradient */}
      <div
        className={`h-[50px] ${color} rounded-t-lg relative overflow-hidden`}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="h-[178px] bg-white rounded-b-lg px-4 py-3 flex flex-col">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-col pl-2 gap-2 text-xs text-gray-500 border-t border-gray-300 pt-2">
          {/* Duration */}
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-800" />
            <span>{duration}</span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1.5">
            <GraduationCap size={14} className="text-black" />
            <span>{level}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Component
const PracticeCardSkeleton = () => {
  return (
    <div className="w-[255px] flex-shrink-0 h-[230px] rounded-lg border border-gray-300 shadow-sm animate-pulse bg-white">
      <div className="h-[70px] bg-gray-300 rounded-t-lg"></div>
      <div className="h-[160px] bg-white rounded-b-lg px-4 py-3">
        <div className="h-5 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Award size={48} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No practices aivailable
      </h3>
      <p className="text-gray-500 max-w-md">
        Currently, there are no practice exercises available. Please check back
        later.
      </p>
    </div>
  );
};

const Practice = () => {
  // Mock data - Thay bằng API call thực tế
  const [practices, setPractices] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPractices([
        {
          id: 1,
          title: 'Practices 1',
          description:
            'Description of practice 1. Learn basic programming concepts.',
          duration: '90 minutes learning',
          level: 'Beginner level',
        },
        {
          id: 2,
          title: 'Practices 2',
          description: 'Advanced data structures and algorithms practice.',
          duration: '120 minutes learning',
          level: 'Intermediate level',
        },
        {
          id: 3,
          title: 'Practices 3',
          description:
            'Web development fundamentals with React and JavaScript.',
          duration: '60 minutes learning',
          level: 'Beginner level',
        },
        {
          id: 4,
          title: 'Practices 4',
          description: 'Database design and SQL query optimization techniques.',
          duration: '90 minutes learning',
          level: 'Advanced level',
        },
        {
          id: 5,
          title: 'Practices 5',
          description: 'Database design and SQL query optimization techniques.',
          duration: '90 minutes learning',
          level: 'Advanced level',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);
  const navigate = useNavigate();
  const handlePracticeClick = (practice) => {
    console.log('Clicked practice:', practice);
    navigate( `/practice-detail/${practice.id}` );
    // Navigate hoặc mở modal chi tiết
  };

  return (
    <PageContainer breadcrumb={BREADCRUMBS.PRACTICE}>
      <div className="p-5">
        {/* Header Section */}
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Practice</h1>
        </div> */}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-wrap gap-4">
            {[...Array(5)].map((_, index) => (
              <PracticeCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && practices.length === 0 && <EmptyState />}

        {/* Practice Cards - Flex Wrap Layout */}
        {!isLoading && practices.length > 0 && (
          <div className="flex flex-wrap gap-4 ">
            {practices.map((practice, index) => (
              <PracticeCard
                key={practice.id}
                {...practice}
                color={getCardColor(index)} // Tự động gán màu theo index
                onClick={() => handlePracticeClick(practice)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Practice;
