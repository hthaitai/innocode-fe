import axiosClient from './axiosClient';

export const mentorApi = {
  // GET /api/mentors?UserId={UserId}
  getByUserId: (UserId) => axiosClient.get('/mentors', { params: { UserId } }),
};
