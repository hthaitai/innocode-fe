import { createSlice } from "@reduxjs/toolkit"
import { fetchRounds, addRound, updateRound, deleteRound } from "./roundThunks"

const initialState = {
  rounds: [],
  loading: false,
  error: null,
}

const roundSlice = createSlice({
  name: "rounds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ROUNDS
      .addCase(fetchRounds.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRounds.fulfilled, (state, action) => {
        state.loading = false
        state.rounds = action.payload
      })
      .addCase(fetchRounds.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ADD ROUND
      .addCase(addRound.pending, (state) => {
        state.loading = true
      })
      .addCase(addRound.fulfilled, (state, action) => {
        state.loading = false
        state.rounds.push(action.payload)
      })
      .addCase(addRound.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // UPDATE ROUND
      .addCase(updateRound.pending, (state) => {
        state.loading = true
      })
      .addCase(updateRound.fulfilled, (state, action) => {
        state.loading = false
        state.rounds = state.rounds.map((r) =>
          r.roundId === action.payload.roundId ? action.payload : r
        )
      })
      .addCase(updateRound.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // DELETE ROUND
      .addCase(deleteRound.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteRound.fulfilled, (state, action) => {
        state.loading = false
        state.rounds = state.rounds.filter(
          (r) => r.roundId !== action.payload
        )
      })
      .addCase(deleteRound.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default roundSlice.reducer
