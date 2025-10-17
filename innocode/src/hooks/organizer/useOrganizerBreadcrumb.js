// src/hooks/organizer/useOrganizerBreadcrumb.js
import { useParams } from "react-router-dom"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "../../config/breadcrumbs"
import { contestsDataOrganizer } from "../../data/contestsDataOrganizer"

/**
 * Hook to generate breadcrumb data for organizer pages.
 * @param {string} breadcrumbKey - Key for breadcrumb (e.g., "ORGANIZER_CONTEST_DETAIL", "ORGANIZER_TEAMS")
 * @returns {object} { contest, breadcrumbData }
 */
export function useOrganizerBreadcrumb(breadcrumbKey = "ORGANIZER_CONTEST_DETAIL") {
  const { contestId } = useParams()
  const numericContestId = parseInt(contestId)
  const contest = contestsDataOrganizer.find(c => c.contest_id === numericContestId)

  // Determine label for breadcrumb (contest name)
  const contestName = contest?.name ?? "Unknown Contest"

  // Build breadcrumb items (labels)
  let items = BREADCRUMBS[breadcrumbKey]
  if (typeof items === "function") {
    items = items(contestName)
  }
  if (!items) items = ["Not Found"]

  // Build breadcrumb paths (routes)
  let paths = BREADCRUMB_PATHS[breadcrumbKey]
  if (typeof paths === "function") {
    paths = paths(numericContestId)
  }
  if (!paths) paths = ["/"]

  return { contest, breadcrumbData: { items, paths } }
}
