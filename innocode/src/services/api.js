import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import { toast } from "react-hot-toast"
import i18n from "../i18n/config"
import { isFetchError } from "../shared/utils/apiUtils"

const baseQuery = fetchBaseQuery({
  baseUrl: "https://innocode-challenge-api.onrender.com/api",
  prepareHeaders: (headers, { endpoint, type }) => {
    // Don't send token for public endpoints (role registration POST)
    // endpoint is the full URL path like "/role-registrations"
    const isPublicRoleRegistration =
      type === "mutation" && endpoint === "createRoleRegistration"

    if (!isPublicRoleRegistration) {
      const token = localStorage.getItem("token")
      if (token && token !== "null") {
        headers.set("Authorization", `Bearer ${token}`)
      }
    }
    return headers
  },
})

const baseQueryWithRetry = retry(baseQuery, {
  maxRetries: 3,
  retryCondition: (error, args, extraArgs) => {
    return isFetchError(error)
  },
})

const baseQueryWithGlobalErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQueryWithRetry(args, api, extraOptions)

  if (result.error && isFetchError(result.error)) {
    toast.error(i18n.t("suggestion.connectionError", { ns: "contest" }))
  }

  return result
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithGlobalErrorHandling,
  tagTypes: [
    "Contests",
    "Rounds",
    "Mcq",
    "PublishCheck",
    "TestCases",
    "TestResults",
    "Leaderboard",
    "Appeal",
    "JudgesInvite",
    "Teams",
    "Students",
    "TeamInvites",
    "ActivityLogs",
    "RoleRegistrations",
    "SchoolCreationRequests",
    "Plagiarism",
    "JudgeContests",
  ],
  endpoints: () => ({}),
})
