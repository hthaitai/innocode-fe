import { createAsyncThunk } from "@reduxjs/toolkit"
import manualProblemApi from "@/api/manualProblemApi"
import toast from "react-hot-toast"
import { handleThunkError } from "../../../../shared/utils/handleThunkError"

export const fetchRubric = createAsyncThunk(
  "manualProblem/fetchRubric",
  async (roundId, { rejectWithValue }) => {
    try {
      const result = await manualProblemApi.getRubric(roundId)
      return result?.data ?? {} // <-- This is the correct inner data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const saveRubric = createAsyncThunk(
  "manualProblem/saveRubric",
  async ({ roundId, criteria }, { rejectWithValue }) => {
    try {
      const cleaned = criteria
        .filter((c) => c.description.trim() !== "")
        .map((c) => ({
          rubricId: c.rubricId,
          description: c.description,
          maxScore: Number(c.maxScore || 0),
        }))

      // Split into two arrays
      const toUpdate = cleaned.filter((c) => c.rubricId)
      const toCreate = cleaned.filter((c) => !c.rubricId)

      // 1) Update only existing
      if (toUpdate.length > 0) {
        await manualProblemApi.updateRubric(roundId, { criteria: toUpdate })
      }

      // 2) Create new ones
      if (toCreate.length > 0) {
        await manualProblemApi.createRubric(roundId, { criteria: toCreate })
      }

      toast.success("Rubric saved")
      return true
    } catch (err) {
      toast.error("Failed to save rubric")
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const deleteCriterion = createAsyncThunk(
  "manualProblem/deleteCriterion",
  async ({ roundId, rubricId }, { rejectWithValue }) => {
    try {
      await manualProblemApi.deleteRubricCriterion(roundId, rubricId)
      toast.success("Criterion deleted")
      return rubricId
    } catch (err) {
      toast.error("Failed to delete criterion")
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const fetchManualResults = createAsyncThunk(
  "manualProblem/fetchManualResults",
  async ({ roundId, search, pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      const resp = await manualProblemApi.getManualTestResults(roundId, {
        pageNumber,
        pageSize,
        ...Object.fromEntries(Object.entries(search).filter(([, v]) => v)),
      })
      return {
        data: resp?.data ?? [],
        meta: resp?.additionalData,
      }
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)
