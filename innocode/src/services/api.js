import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
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
  }),
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
