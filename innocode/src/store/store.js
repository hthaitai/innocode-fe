import { configureStore } from "@reduxjs/toolkit"
import contestReducer from "./slices/contestSlice"

export const store = configureStore({
  reducer: {
    contests: contestReducer,
  },
})
