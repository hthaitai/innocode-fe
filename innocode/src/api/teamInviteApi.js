import axiosClient from "./axiosClient";

export const teamInviteApi = {
  // POST /api/teams/{teamId}/invites
  invite: (teamId, data) => 
    axiosClient.post(`/teams/${teamId}/invites`, data),
  
  // GET /api/teams/{teamId}/invites
  getByTeam: (teamId) => 
    axiosClient.get(`/teams/${teamId}/invites`),
  
  // POST /api/team-invites/accept?token={token}
  // Send token in both query params and body for compatibility
  accept: (token) => {
    console.log("📤 Accept invite request - token:", token);
    return axiosClient.post("/team-invites/accept", { token }, {
      params: { token }
    });
  },
  
  // POST /api/team-invites/decline?token={token}
  // Try with query params only first (some APIs prefer this for decline)
  decline: (token) => {
    console.log("📤 Decline invite request - token:", token);
    // Try query params only first
    return axiosClient.post("/team-invites/decline", null, {
      params: { token }
    });
  },
};