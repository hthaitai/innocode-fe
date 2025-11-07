import { createSlice } from "@reduxjs/toolkit"
import { downloadSubmissionById } from "./submissionThunk"

const initialState = {
  submission: null,
  loading: false,
  error: null,
}

const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadSubmissionById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(downloadSubmissionById.fulfilled, (state, action) => {
        state.loading = false
        state.submission = action.payload
      })
      .addCase(downloadSubmissionById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default submissionSlice.reducer
