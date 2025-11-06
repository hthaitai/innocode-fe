import { useEffect, useState } from 'react';
import { contestService } from '@/features/contest/services/contestService';
import { mapContestFromAPI } from '@/shared/utils/contestMapper';

export const useContestDetail = (contestId) => {
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contestId) {
      setError('Contest ID is required');
      return;
    }

    const fetchContestDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await contestService.getContestById(contestId);
        
        console.log('📊 Raw contest detail:', data);
        
        // Map the contest data from API format
        const mappedContest = data ? mapContestFromAPI(data) : null;
        
        console.log('🗺️ Mapped contest detail:', mappedContest);
        
        setContest(mappedContest);
      } catch (error) {
        console.error('❌ Error fetching contest detail:', error);
        setError(error.message || 'Failed to load contest details');
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetail();
  }, [contestId]);

  return {
    contest,
    loading,
    error,
  };
};

export default useContestDetail;
