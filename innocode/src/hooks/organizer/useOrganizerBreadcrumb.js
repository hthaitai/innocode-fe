import { useParams } from "react-router-dom"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "../../config/breadcrumbs"

// Import separated fake data sources
import { contests as contestsData } from "../../data/contests/contests"
import { rounds as roundsData } from "../../data/contests/rounds"
import { problems as problemsData } from "../../data/contests/problems"
import { testCases as testCasesData } from "../../data/contests/testCases"
import { appeals as appealsData } from "../../data/contests/appeals" // ✅ new fake dataset (optional)

export function useOrganizerBreadcrumb(
  key = "ORGANIZER_CONTEST_DETAIL",
  options = {}
) {
  const { teams: allTeams = [] } = options
  const { contestId, roundId, problemId, teamId, appealId } = useParams()

  const numericContestId = contestId ? Number(contestId) : null
  const numericRoundId = roundId ? Number(roundId) : null
  const numericProblemId = problemId ? Number(problemId) : null
  const numericTeamId = teamId ? Number(teamId) : null
  const numericAppealId = appealId ? Number(appealId) : null // ✅ new param

  // ---- Lookup each entity separately ----
  const contest =
    options.contest ??
    contestsData.find((c) => c.contest_id === numericContestId)
  const contestName = contest?.name ?? "Unknown Contest"

  const round = roundsData.find(
    (r) => r.round_id === numericRoundId && r.contest_id === numericContestId
  )
  const roundName = round?.name ?? "Unknown Round"

  const problem = problemsData.find(
    (p) =>
      p.problem_id === numericProblemId &&
      p.round_id === numericRoundId &&
      p.contest_id === numericContestId
  )
  const problemName = problem?.name ?? `Problem ${numericProblemId ?? ""}`

  const teamSource = allTeams.length ? allTeams : contest?.teams ?? []
  const team = teamSource.find((t) => t.team_id === numericTeamId)
  const teamName = team?.name ?? `Team ${numericTeamId ?? ""}`

  const appeal =
    options.appeal ??
    appealsData?.find((a) => a.appeal_id === numericAppealId)
  const appealIdLabel = `Appeal #${numericAppealId ?? ""}` // ✅ for breadcrumb label

  // ---- Breadcrumb items ----
  let items = BREADCRUMBS[key]
  if (typeof items === "function") {
    items =
      {
        ORGANIZER_ROUND_DETAIL: () => items(contestName, roundName),
        ORGANIZER_PROBLEM_DETAIL: () =>
          items(contestName, roundName, problemName),
        ORGANIZER_TEAM_DETAIL: () => items(contestName, teamName),
        ORGANIZER_APPEAL_DETAIL: () => items(contestName, numericAppealId), // ✅ new handler
      }[key]?.() ?? items(contestName)
  }
  if (!items) items = ["Not Found"]

  // ---- Breadcrumb paths ----
  let paths = BREADCRUMB_PATHS[key]
  if (typeof paths === "function") {
    paths =
      {
        ORGANIZER_ROUND_DETAIL: () => paths(numericContestId, numericRoundId),
        ORGANIZER_PROBLEM_DETAIL: () =>
          paths(numericContestId, numericRoundId, numericProblemId),
        ORGANIZER_TEAM_DETAIL: () => paths(numericContestId, numericTeamId),
        ORGANIZER_APPEAL_DETAIL: () => paths(numericContestId, numericAppealId), // ✅ new handler
      }[key]?.() ?? paths(numericContestId)
  }
  if (!paths) paths = ["/"]

  return {
    contest,
    round,
    problem,
    team,
    appeal,
    breadcrumbData: { items, paths },
  }
}
