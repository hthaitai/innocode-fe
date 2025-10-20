// services/mockContestService.js
import { contestsDataOrganizer } from "../data/contestsDataOrganizer"

// Helper to simulate async API calls
const delay = (value, time = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(value), time))

export const contestService = {
  // --- CONTESTS ---

  getContests: async () => {
    return delay([...contestsDataOrganizer])
  },

  getContestById: async (id) => {
    const contest = contestsDataOrganizer.find((c) => c.contest_id === id)
    if (!contest) throw new Error("Contest not found")
    return delay(contest)
  },

  addContest: async (data) => {
    const newId = contestsDataOrganizer.length
      ? Math.max(...contestsDataOrganizer.map((c) => c.contest_id)) + 1
      : 1

    const newContest = {
      contest_id: newId,
      ...data,
      created_at: new Date().toISOString(),
      rounds: [],
    }

    contestsDataOrganizer.push(newContest)
    return delay(newContest)
  },

  updateContest: async (id, data) => {
    const index = contestsDataOrganizer.findIndex((c) => c.contest_id === id)
    if (index === -1) throw new Error("Contest not found")

    contestsDataOrganizer[index] = {
      ...contestsDataOrganizer[index],
      ...data,
    }

    return delay(contestsDataOrganizer[index])
  },

  deleteContest: async (id) => {
    const index = contestsDataOrganizer.findIndex((c) => c.contest_id === id)
    if (index === -1) throw new Error("Contest not found")

    const deleted = contestsDataOrganizer.splice(index, 1)[0]
    return delay(deleted)
  },

  // --- ROUNDS ---
  addRound: async (contestId, roundData) => {
    const contest = contestsDataOrganizer.find(
      (c) => c.contest_id === contestId
    )
    if (!contest) throw new Error("Contest not found")

    const newRoundId = contest.rounds.length
      ? Math.max(...contest.rounds.map((r) => r.round_id)) + 1
      : 1

    const newRound = {
      round_id: newRoundId,
      ...roundData,
      problems: [],
    }

    contest.rounds.push(newRound)
    return delay(newRound)
  },

  updateRound: async (contestId, roundId, data) => {
    const contest = contestsDataOrganizer.find(
      (c) => c.contest_id === contestId
    )
    if (!contest) throw new Error("Contest not found")

    const roundIndex = contest.rounds.findIndex((r) => r.round_id === roundId)
    if (roundIndex === -1) throw new Error("Round not found")

    contest.rounds[roundIndex] = {
      ...contest.rounds[roundIndex],
      ...data,
    }

    return delay(contest.rounds[roundIndex])
  },

  deleteRound: async (contestId, roundId) => {
    const contest = contestsDataOrganizer.find(
      (c) => c.contest_id === contestId
    )
    if (!contest) throw new Error("Contest not found")

    const roundIndex = contest.rounds.findIndex((r) => r.round_id === roundId)
    if (roundIndex === -1) throw new Error("Round not found")

    const deleted = contest.rounds.splice(roundIndex, 1)[0]
    return delay(deleted)
  },

  // --- PROBLEMS ---
  addProblem: async (contestId, roundId, problemData) => {
    const contest = contestsDataOrganizer.find(
      (c) => c.contest_id === contestId
    )
    if (!contest) throw new Error("Contest not found")

    const round = contest.rounds.find((r) => r.round_id === roundId)
    if (!round) throw new Error("Round not found")

    const newProblemId = round.problems.length
      ? Math.max(...round.problems.map((p) => p.problem_id)) + 1
      : 1

    const newProblem = {
      problem_id: newProblemId,
      ...problemData,
      test_cases: [],
    }

    round.problems.push(newProblem)
    return delay(newProblem)
  },

  updateProblem: async (contestId, roundId, problemId, data) => {
    const contest = contestsDataOrganizer.find(
      (c) => c.contest_id === contestId
    )
    if (!contest) throw new Error("Contest not found")

    const round = contest.rounds.find((r) => r.round_id === roundId)
    if (!round) throw new Error("Round not found")

    const index = round.problems.findIndex((p) => p.problem_id === problemId)
    if (index === -1) throw new Error("Problem not found")

    round.problems[index] = {
      ...round.problems[index],
      ...data,
    }

    return delay(round.problems[index])
  },

  deleteProblem: async (contestId, roundId, problemId) => {
    const contest = contestsDataOrganizer.find(
      (c) => c.contest_id === contestId
    )
    if (!contest) throw new Error("Contest not found")

    const round = contest.rounds.find((r) => r.round_id === roundId)
    if (!round) throw new Error("Round not found")

    const problemIndex = round.problems.findIndex(
      (p) => p.problem_id === problemId
    )
    if (problemIndex === -1) throw new Error("Problem not found")

    const deleted = round.problems.splice(problemIndex, 1)[0]
    return delay(deleted)
  },

  // --- TEST CASES ---
  addTestCase: async (contestId, roundId, problemId, testCaseData) => {
    const contest = contestsDataOrganizer.find(
      (c) => c.contest_id === contestId
    )
    if (!contest) throw new Error("Contest not found")

    const round = contest.rounds.find((r) => r.round_id === roundId)
    if (!round) throw new Error("Round not found")

    const problem = round.problems.find((p) => p.problem_id === problemId)
    if (!problem) throw new Error("Problem not found")

    const newTestCaseId = problem.test_cases.length
      ? Math.max(...problem.test_cases.map((t) => t.test_case_id)) + 1
      : 1

    const newTestCase = {
      test_case_id: newTestCaseId,
      ...testCaseData,
    }

    problem.test_cases.push(newTestCase)
    return delay(newTestCase)
  },

  updateTestCase: async (contestId, roundId, problemId, testCaseId, data) => {
    const contest = contestsDataOrganizer.find(
      (c) => c.contest_id === contestId
    )
    if (!contest) throw new Error("Contest not found")

    const round = contest.rounds.find((r) => r.round_id === roundId)
    if (!round) throw new Error("Round not found")

    const problem = round.problems.find((p) => p.problem_id === problemId)
    if (!problem) throw new Error("Problem not found")

    const index = problem.test_cases.findIndex(
      (t) => t.test_case_id === testCaseId
    )
    if (index === -1) throw new Error("Test case not found")

    problem.test_cases[index] = {
      ...problem.test_cases[index],
      ...data,
    }

    return delay(problem.test_cases[index])
  },

  deleteTestCase: async (contestId, roundId, problemId, testCaseId) => {
    const contest = contestsDataOrganizer.find(
      (c) => c.contest_id === contestId
    )
    if (!contest) throw new Error("Contest not found")

    const round = contest.rounds.find((r) => r.round_id === roundId)
    if (!round) throw new Error("Round not found")

    const problem = round.problems.find((p) => p.problem_id === problemId)
    if (!problem) throw new Error("Problem not found")

    const index = problem.test_cases.findIndex(
      (t) => t.test_case_id === testCaseId
    )
    if (index === -1) throw new Error("Test case not found")

    const deleted = problem.test_cases.splice(index, 1)[0]
    return delay(deleted)
  },
}
