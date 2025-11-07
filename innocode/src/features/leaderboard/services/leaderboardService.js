import leaderboardApi from "../../../api/leaderboardApi"

export const leaderboardService = {
  async getAllByContestId(contestId, { pageNumber = 1, pageSize = 10 } = {}) {
    const res = await leaderboardApi.getAllByContestId(contestId, { pageNumber, pageSize })
    return res.data
  },
}
