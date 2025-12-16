import axiosClient from "./axiosClient";

export const teamInviteApi = {
  // POST /api/teams/{teamId}/invites
  invite: (teamId, data) => 
    axiosClient.post(`/teams/${teamId}/invites`, data),
  
  // GET /api/teams/{teamId}/invites
  getByTeam: (teamId) => 
    axiosClient.get(`/teams/${teamId}/invites`),
  
  // POST /api/team-invites/accept?token={token}&email={email}
  // Public endpoint - no authentication required
  accept: (token, email) => {
    return axiosClient.post("/team-invites/accept", null, {
      params: { token, email }
    });
  },
  
  // POST /api/team-invites/decline?token={token}&email={email}
  // Public endpoint - no authentication required
  decline: (token, email) => {
    return axiosClient.post("/team-invites/decline", null, {
      params: { token, email }
    });
  },
};