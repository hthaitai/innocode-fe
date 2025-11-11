import { createSlice } from "@reduxjs/toolkit"
import { fetchRounds, addRound, updateRound, deleteRound } from "./roundThunk"
import { mapRoundList } from "../mappers/roundMapper"

const initialState = {
  rounds: [],
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  loading: false,
  error: null,
}

const roundSlice = createSlice({
  name: "rounds",
  initialState,
  reducers: {
    clearRounds(state) {
      state.rounds = []
      state.pagination = initialState.pagination // optional but recommended
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ROUNDS
      .addCase(fetchRounds.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRounds.fulfilled, (state, action) => {
        state.loading = false
        state.rounds = mapRoundList(action.payload.rounds)
        state.pagination = initialState.pagination
      })
      .addCase(fetchRounds.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ADD ROUND
      .addCase(addRound.pending, (state) => {
        state.loading = true
      })
      .addCase(addRound.fulfilled, (state) => {
        state.loading = false
        // Do NOT push anything.
        // Rounds list is reloaded via fetchRounds in UI.
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
        state.rounds = state.rounds.filter((r) => r.roundId !== action.payload)
      })
      .addCase(deleteRound.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearRounds } = roundSlice.actions
export default roundSlice.reducer
