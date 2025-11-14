import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from "@/shared/components/PageContainer";
import TableFluent from "@/shared/components/TableFluent";
import { Trophy, Medal, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDateTime } from "@/shared/utils/dateTime";
import { fetchLeaderboardByContest } from "@/features/leaderboard/store/leaderboardThunk";
import { BREADCRUMBS } from '@/config/breadcrumbs';
import useLeaderboardSignalR from "@/features/leaderboard/hooks/useLeaderboardSignalR";
import useContests from '../hooks/useContests';

const Leaderboard = () => {
  const { contestId: urlContestId } = useParams();
  const dispatch = useAppDispatch();
  
  const { contests, loading: contestsLoading } = useContests();
  const { entries, loading, error, pagination } = useAppSelector(
    (state) => state.leaderboard
  );

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  
  // Get available contests (ongoing or completed)
  const availableContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) return [];
    return contests.filter(c => c.isStatusVisible && (c.isOngoing || c.isCompleted));
  }, [contests]);

  // Use contestId from URL or first available contest
  const [selectedContestId, setSelectedContestId] = useState(urlContestId || null);
  
  useEffect(() => {
    if (!selectedContestId && availableContests.length > 0) {
      setSelectedContestId(availableContests[0].contestId);
    }
  }, [availableContests, selectedContestId]);

  // Fetch leaderboard data
  useEffect(() => {
    if (selectedContestId) {
      dispatch(fetchLeaderboardByContest({ contestId: selectedContestId, pageNumber, pageSize }));
    }
  }, [selectedContestId, pageNumber, dispatch]);

  // Real-time updates
  useLeaderboardSignalR(selectedContestId, false);

  // Get rank icon based on position
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Award className="text-amber-600" size={20} />;
      default:
        return null;
    }
  };

  // Get rank badge color
  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-300";
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  const leaderboardColumns = [
    {
      accessorKey: "rank",
      header: "Rank",
      size: 100,
      cell: ({ row }) => {
        const rank = row.original.rank;
        return (
          <div className="flex items-center gap-2">
            {getRankIcon(rank)}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRankBadgeClass(rank)}`}
            >
              #{rank}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "teamName",
      header: "Team Name",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          {row.original.teamName ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "score",
      header: "Score",
      size: 120,
      cell: ({ row }) => (
        <span className="text-lg font-bold text-blue-600">
          {(row.original.score ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "snapshotAt",
      header: "Last Updated",
      size: 180,
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {formatDateTime(row.original.snapshotAt)}
        </span>
      ),
    },
  ];

  // Get selected contest details
  const selectedContest = availableContests.find(c => c.contestId === selectedContestId);

  if (contestsLoading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.LEADERBOARD} loading={true}>
        <div>Loading contests...</div>
      </PageContainer>
    );
  }

  if (!availableContests || availableContests.length === 0) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.LEADERBOARD}>
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-8 text-center">
          <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contests Available</h3>
          <p className="text-gray-600">There are no active or completed contests to display leaderboards for.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      breadcrumb={BREADCRUMBS.LEADERBOARD}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        {/* Header with Contest Selector */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-4">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Trophy className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Contest Leaderboard
                </h2>
                <p className="text-sm text-gray-600">
                  View current standings and team rankings
                </p>
              </div>
            </div>
            
            {/* Contest Selector */}
            {availableContests.length > 1 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Contest:</label>
                <select
                  value={selectedContestId || ''}
                  onChange={(e) => setSelectedContestId(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableContests.map(contest => (
                    <option key={contest.contestId} value={contest.contestId}>
                      {contest.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Contest Info */}
          {selectedContest && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{selectedContest.name}</span>
                {selectedContest.description && (
                  <span> • {selectedContest.description}</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Trophy className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination.totalCount || entries.length}
                </p>
              </div>
            </div>
          </div>

          {entries.length > 0 && (
            <>
              <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Award className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Leading Team</p>
                    <p className="text-lg font-bold text-gray-900">
                      {entries[0]?.teamName || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Medal className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Top Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(entries[0]?.score ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Leaderboard Table */}
        <TableFluent
          data={entries}
          columns={leaderboardColumns}
          title="Rankings"
          pagination={{
            pageIndex: pageNumber - 1,
            pageSize: pageSize,
          }}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => setPageNumber(newPage + 1)}
        />
      </div>
    </PageContainer>
  );
};

export default Leaderboard;
