import { useCallback, useState, useEffect } from 'react';
import { userService } from '@/features/userService';

export const useProfile = (profileId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserById(profileId);
      setProfile(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  // ✅ Gọi hàm fetchProfile khi profileId thay đổi
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, fetchProfile };
};
