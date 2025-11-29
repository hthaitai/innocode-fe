import { configureStore } from "@reduxjs/toolkit"
import submissionReducer from "../features/submission/store/submissionSlice"
import leaderboardReducer from "../features/leaderboard/store/leaderboardSlice"
import manualProblemReducer from "../features/problems/manual/store/manualProblemSlice"
import { api } from "../services/api"

export const store = configureStore({
  reducer: {
    submissions: submissionReducer,
    leaderboard: leaderboardReducer,
    manualProblem: manualProblemReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})
