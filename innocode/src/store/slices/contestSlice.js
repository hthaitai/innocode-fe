import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { contestService } from "@/features/contest/services/contestService"
import { contests as fakeData } from "@/data/contests/contests"

// ---------- Initial State ----------
const initialState = {
  contests: fakeData || [],
  loading: false,
  error: null,
}

// ---------- Async Thunks ----------
export const fetchContests = createAsyncThunk(
  "contests/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // const data = await contestService.getAllContests()
      const data = fakeData // temporary mock
      return Array.isArray(data) ? data : []
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load contests")
    }
  }
)

export const addContest = createAsyncThunk(
  "contests/add",
  async (data, { rejectWithValue }) => {
    try {
      // const newContest = await contestService.createContest(data)
      const newContest = {
        contest_id: Date.now(),
        created_at: new Date().toISOString(),
        ...data,
      }
      return newContest
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateContest = createAsyncThunk(
  "contests/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // const updated = await contestService.updateContest(id, data)
      const updated = { ...data, contest_id: id }
      return updated
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteContest = createAsyncThunk(
  "contests/delete",
  async (id, { rejectWithValue }) => {
    try {
      // await contestService.deleteContest(id)
      console.log("[FAKE DELETE] Contest ID:", id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ---------- Slice ----------
const contestSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchContests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false
        state.contests = action.payload
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ADD
      .addCase(addContest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addContest.fulfilled, (state, action) => {
        state.loading = false
        state.contests.push(action.payload)
      })
      .addCase(addContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // UPDATE
      .addCase(updateContest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateContest.fulfilled, (state, action) => {
        state.loading = false
        state.contests = state.contests.map((c) =>
          c.contest_id === action.payload.contest_id ? action.payload : c
        )
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // DELETE
      .addCase(deleteContest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteContest.fulfilled, (state, action) => {
        state.loading = false
        state.contests = state.contests.filter(
          (c) => c.contest_id !== action.payload
        )
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default contestSlice.reducer
