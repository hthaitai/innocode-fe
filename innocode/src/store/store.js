import { configureStore } from "@reduxjs/toolkit"
import contestReducer from "../features/contest/store/contestSlice"
import roundReducer from "../features/round/store/roundSlice"
import submissionReducer from "../features/submission/store/submissionSlice"
import leaderboardReducer from "../features/leaderboard/store/leaderboardSlice"
import mcqReducer from "@/features/mcq/store/mcqSlice"
import manualProblemReducer from "../features/problems/manual/store/manualProblemSlice"
import autoEvaluationReducer from "../features/problems/auto-evaluation/store/autoEvaluationSlice"

export const store = configureStore({
  reducer: {
    contests: contestReducer,
    rounds: roundReducer,
    submissions: submissionReducer,
    leaderboard: leaderboardReducer,
    mcq: mcqReducer,
    manualProblem: manualProblemReducer,
    autoEvaluation: autoEvaluationReducer,
  },
})
