const calculateTimeLeft = (startDate) => {
  if (!startDate) return 'TBA';
  const now = new Date();
  const start = new Date(startDate);
  const diff = start - now;
  if (diff <= 0) return 'Started';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return 'Less than a minute';
};
const getStatusInfo = (status, startDate, endDate) => {
  // If it's Draft, hide it regardless of dates
  if (status === 'Draft') {
    return {
      label: 'Draft',
      color: 'gray',
      isVisible: false,
    };
  }
  
  if (!startDate || !endDate) {
    return {
      label: 'Unknown',
      color: 'gray',
      isVisible: false,
    };
  }
  
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate actual status based on dates
  if (now < start) {
    return {
      label: 'Upcoming',
      color: 'blue',
      isVisible: true,
    };
  } else if (now >= start && now <= end) {
    return {
      label: 'Ongoing',
      color: 'green',
      isVisible: true,
    };
  } else {
    return {
      label: 'Completed',
      color: 'gray',
      isVisible: true,
    };
  }
};
export const mapContestFromAPI = (apiContest) => {
  const statusInfo = getStatusInfo(
    apiContest.status,
    apiContest.start,
    apiContest.end
  );
  return {
    contestId: apiContest.contestId,
    name: apiContest.name,
    description: apiContest.description,
    createdAt: apiContest.createdAt,
    createBy: apiContest.createBy,
    status: apiContest.status,
    registrationStart: apiContest.registrationStart,
    registrationEnd: apiContest.registrationEnd,
    teamMembersMax: apiContest.teamMembersMax,
    teamLimitMax: apiContest.teamLimitMax,
    rewardsText: apiContest.rewardsText,
    year: apiContest.year,
    imgUrl: apiContest.imgUrl,
    start: apiContest.start,
    end: apiContest.end,

    //computed fields
    teams: apiContest.teamLimitMax || 0,
    timeLeft: calculateTimeLeft(apiContest.start),
    statusLabel: statusInfo.label,
    statuscolor: statusInfo.color,
    isStatusVisible: statusInfo.isVisible,
    isDraft: apiContest.status === 'Draft',
    isUpcoming: statusInfo.label === 'Upcoming',
    isOngoing: statusInfo.label === 'Ongoing',
    isCompleted: statusInfo.label === 'Completed',
  };
};
export const mapContestToAPI = (uiContest) => {
  return {
    name: uiContest.name,
    description: uiContest.description,
  };
};
