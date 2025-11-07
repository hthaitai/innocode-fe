import axiosClient from "./axiosClient"

const leaderboardApi = {
  getAllByContestId: (contestId, { pageNumber = 1, pageSize = 10 } = {}) => {
    axiosClient.get(`/leaderboard-entries/${contestId}`, {
      params: { pageNumber, pageSize },
    })
  },
}

export default leaderboardApi
