import { createAsyncThunk } from "@reduxjs/toolkit"
import { roundService } from "@/features/round/services/roundService"

// GET all rounds
export const fetchRounds = createAsyncThunk(
  "rounds/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const data = await roundService.getAllRounds(params)
      return Array.isArray(data) ? data : []
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load rounds")
    }
  }
)

// CREATE round
export const addRound = createAsyncThunk(
  "rounds/add",
  async (data, { rejectWithValue }) => {
    try {
      return await roundService.createRound(data)
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create round")
    }
  }
)

// UPDATE round
export const updateRound = createAsyncThunk(
  "rounds/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await roundService.updateRound(id, data)
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update round")
    }
  }
)

// DELETE round
export const deleteRound = createAsyncThunk(
  "rounds/delete",
  async (id, { rejectWithValue }) => {
    try {
      await roundService.deleteRound(id)
      return id
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete round")
    }
  }
)
