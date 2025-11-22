import axiosClient from "./axiosClient";

export const teamInviteApi = {
  // POST /api/teams/{teamId}/invites
  invite: (teamId, data) => 
    axiosClient.post(`/teams/${teamId}/invites`, data),
  
  // POST /api/team-invites/accept?token={token}
  accept: (token) => 
    axiosClient.post("/team-invites/accept", null, {
      params: { token }
    }),
  
  // POST /api/team-invites/decline?token={token}
  decline: (token) => 
    axiosClient.post("/team-invites/decline", null, {
      params: { token }
    }),
};