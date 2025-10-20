// src/hooks/organizer/useOrganizerBreadcrumb.js
import { useParams } from "react-router-dom"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "../../config/breadcrumbs"
import { contestsDataOrganizer } from "../../data/contestsDataOrganizer"

/**
 * Hook to generate breadcrumb data for organizer pages.
 * @param {string} breadcrumbKey - Key for breadcrumb (e.g., "ORGANIZER_CONTEST_DETAIL", "ORGANIZER_ROUND_DETAIL")
 * @returns {object} { contest, round, problem, breadcrumbData }
 */
export function useOrganizerBreadcrumb(breadcrumbKey = "ORGANIZER_CONTEST_DETAIL") {
  const { contestId, roundId, problemId } = useParams()

  const numericContestId = parseInt(contestId)
  const numericRoundId = roundId ? parseInt(roundId) : null
  const numericProblemId = problemId ? parseInt(problemId) : null

  // Step 1: Find the contest
  const contest = contestsDataOrganizer.find(c => c.contest_id === numericContestId)
  const contestName = contest?.name ?? "Unknown Contest"

  // Step 2: Find round (if exists)
  const round = contest?.rounds?.find(r => r.round_id === numericRoundId)
  const roundName = round?.name ?? "Unknown Round"

  // Step 3: Find problem (if exists)
  const problem = round?.problems?.find(p => p.problem_id === numericProblemId)
  const problemName = problem
    ? `Problem ${problem.problem_id}`
    : "Unknown Problem"

  // Step 4: Build breadcrumb items (labels)
  let items = BREADCRUMBS[breadcrumbKey]
  if (typeof items === "function") {
    // Different breadcrumb functions expect different parameters
    if (breadcrumbKey === "ORGANIZER_ROUND_DETAIL") items = items(contestName, roundName)
    else if (breadcrumbKey === "ORGANIZER_PROBLEM_DETAIL") items = items(contestName, roundName, problemName)
    else items = items(contestName)
  }
  if (!items) items = ["Not Found"]

  // Step 5: Build breadcrumb paths (routes)
  let paths = BREADCRUMB_PATHS[breadcrumbKey]
  if (typeof paths === "function") {
    if (breadcrumbKey === "ORGANIZER_ROUND_DETAIL")
      paths = paths(numericContestId, numericRoundId)
    else if (breadcrumbKey === "ORGANIZER_PROBLEM_DETAIL")
      paths = paths(numericContestId, numericRoundId, numericProblemId)
    else
      paths = paths(numericContestId)
  }
  if (!paths) paths = ["/"]

  return { contest, round, problem, breadcrumbData: { items, paths } }
}
