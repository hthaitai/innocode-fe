import { createAsyncThunk } from "@reduxjs/toolkit"
import submissionService from "../services/submissionService"
import { handleThunkError } from "../../../shared/utils/handleThunkError"

export const downloadSubmissionById = createAsyncThunk(
  "submission/downloadById",
  async (submissionId, { rejectWithValue }) => {
    try {
        const data = await submissionService.downloadById(submissionId)
        return data
    } catch(err) {
        return rejectWithValue(handleThunkError)
    }
  }
)
