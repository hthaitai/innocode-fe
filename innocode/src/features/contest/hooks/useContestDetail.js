import { useEffect, useState, useCallback } from 'react';
import { contestService } from '@/features/contest/services/contestService';
import { mapContestFromAPI } from '@/shared/utils/contestMapper';

export const useContestDetail = (contestId) => {
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContestDetail = useCallback(async () => {
    if (!contestId) {
      setError('Contest ID is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await contestService.getContestById(contestId);
      
      
      // Map the contest data from API format
      const mappedContest = data ? mapContestFromAPI(data) : null;
      
      
      setContest(mappedContest);
    } catch (error) {
      console.error('❌ Error fetching contest detail:', error);
      setError(error.message || 'Failed to load contest details');
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchContestDetail();
  }, [fetchContestDetail]);

  return {
    contest,
    loading,
    error,
    refetch: fetchContestDetail,
  };
};

export default useContestDetail;
