import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://innocode-challenge-api.onrender.com/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")
      if (token && token !== "null") {
        headers.set("Authorization", `Bearer ${token}`)
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
  ],
  endpoints: () => ({}),
})
