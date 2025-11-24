import { createSlice } from "@reduxjs/toolkit"
import { fetchRubric, saveRubric, deleteCriterion, fetchManualResults } from "./manualProblemThunks"

const emptyCriterion = () => ({ rubricId: undefined, description: "", maxScore: 1 })

const initialState = {
  rubric: null,
  criteria: [emptyCriterion()],
  loadingRubric: false,
  savingRubric: false,

  results: [],
  resultsLoading: false,
  resultsPagination: { pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0 },

  search: {
    studentIdSearch: "",
    teamIdSearch: "",
    studentNameSearch: "",
    teamNameSearch: "",
  },
}

const manualProblemSlice = createSlice({
  name: "manualProblem",
  initialState,
  reducers: {
    setCriteria(state, action) {
      state.criteria = action.payload
    },
    setSearch(state, action) {
      state.search = { ...state.search, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRubric.pending, (state) => {
        state.loadingRubric = true
      })
      .addCase(fetchRubric.fulfilled, (state, action) => {
        state.loadingRubric = false
        state.rubric = action.payload
        state.criteria = action.payload?.criteria?.length
          ? action.payload.criteria
          : [emptyCriterion()]
      })
      .addCase(fetchRubric.rejected, (state) => {
        state.loadingRubric = false
        state.rubric = null
        state.criteria = [emptyCriterion()]
      })

      .addCase(saveRubric.pending, (state) => {
        state.savingRubric = true
      })
      .addCase(saveRubric.fulfilled, (state) => {
        state.savingRubric = false
      })
      .addCase(saveRubric.rejected, (state) => {
        state.savingRubric = false
      })

      .addCase(deleteCriterion.fulfilled, (state, action) => {
        state.criteria = state.criteria.filter((c) => c.rubricId !== action.payload)
      })

      .addCase(fetchManualResults.pending, (state) => {
        state.resultsLoading = true
      })
      .addCase(fetchManualResults.fulfilled, (state, { payload }) => {
        state.resultsLoading = false
        state.results = payload.data
        if (payload.meta) state.resultsPagination = payload.meta
      })
      .addCase(fetchManualResults.rejected, (state) => {
        state.resultsLoading = false
        state.results = []
      })
  },
})

export const { setCriteria, setSearch } = manualProblemSlice.actions
export default manualProblemSlice.reducer
