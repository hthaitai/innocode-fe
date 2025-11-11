import { useParams } from "react-router-dom"
import { useAppSelector } from "@/store/hooks"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

export function useOrganizerBreadcrumb(
  key = "ORGANIZER_CONTEST_DETAIL",
  options = {}
) {
  const { contestId, roundId, problemId, teamId, appealId } = useParams()

  // ✅ Use Redux store instead of static data
  const { contests } = useAppSelector((s) => s.contests)

  // ✅ Find the current contest using string ID (UUID safe)
  const contest = contests.find((c) => c.contestId === contestId)
  const contestName = contest?.name ?? "Unknown Contest"

  // ---- Keep these for future nested entities (rounds, problems, etc.) ----
  const round = null
  const problem = null
  const team = null
  const appeal = null

  // ---- Breadcrumb items ----
  let items = BREADCRUMBS[key]
  if (typeof items === "function") {
    items =
      {
        ORGANIZER_ROUND_DETAIL: () => items(contestName, "Unknown Round"),
        ORGANIZER_PROBLEM_DETAIL: () =>
          items(contestName, "Unknown Round", "Unknown Problem"),
        ORGANIZER_TEAM_DETAIL: () => items(contestName, "Unknown Team"),
        ORGANIZER_APPEAL_DETAIL: () => items(contestName, appealId),
        ORGANIZER_CERTIFICATE_ISSUE: () => items(contestName),
        ORGANIZER_CERTIFICATE_TEMPLATE_CREATE: () => items(contestName),
      }[key]?.() ?? items(contestName)
  }
  if (!items) items = ["Not Found"]

  // ---- Breadcrumb paths ----
  let paths = BREADCRUMB_PATHS[key]
  if (typeof paths === "function") {
    paths =
      {
        ORGANIZER_ROUND_DETAIL: () => paths(contestId, roundId),
        ORGANIZER_PROBLEM_DETAIL: () => paths(contestId, roundId, problemId),
        ORGANIZER_TEAM_DETAIL: () => paths(contestId, teamId),
        ORGANIZER_APPEAL_DETAIL: () => paths(contestId, appealId),
      }[key]?.() ?? paths(contestId)
  }
  if (!paths) paths = ["/"]

  return {
    contest,
    breadcrumbData: { items, paths },
  }
}
