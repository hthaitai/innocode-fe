import { configureStore } from "@reduxjs/toolkit"
import contestReducer from "../features/contest/store/contestSlice"
import roundReducer from "../features/round/store/roundSlice"

export const store = configureStore({
  reducer: {
    contests: contestReducer,
    rounds: roundReducer,
  },
})
