import { configureStore } from "@reduxjs/toolkit"
import roundReducer from "../features/round/store/roundSlice"
import submissionReducer from "../features/submission/store/submissionSlice"
import leaderboardReducer from "../features/leaderboard/store/leaderboardSlice"
import mcqReducer from "@/features/mcq/store/mcqSlice"
import manualProblemReducer from "../features/problems/manual/store/manualProblemSlice"
import autoEvaluationReducer from "../features/problems/auto-evaluation/store/autoEvaluationSlice"
import { contestApi } from '@/services/contestApi'
import { roundApi } from '@/services/roundApi'

export const store = configureStore({
  reducer: {
    rounds: roundReducer,
    submissions: submissionReducer,
    leaderboard: leaderboardReducer,
    mcq: mcqReducer,
    manualProblem: manualProblemReducer,
    autoEvaluation: autoEvaluationReducer,
    [contestApi.reducerPath]: contestApi.reducer,
    [roundApi.reducerPath]: roundApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contestApi.middleware).concat(roundApi.middleware),
})
