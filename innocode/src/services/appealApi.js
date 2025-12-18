import { api } from "./api"

export const appealApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyAppeals: builder.query({
      query: () => "/appeals/my-appeal",
      transformResponse: (response) => {
        // API returns: { data: [...], additionalData: {...}, message: "...", statusCode: 200, code: "SUCCESS" }
        return {
          appeals: response.data || [],
          pagination: response.additionalData || null,
        }
      },
      providesTags: (result, error, id) => [{ type: "Appeal", id }],
    }),
    createAppeal: builder.mutation({
      query: ({ RoundId, TeamId, StudentId, Reason, Evidences }) => {
        const formData = new FormData()

        // Append required fields
        formData.append("RoundId", RoundId)
        formData.append("TeamId", TeamId)
        formData.append("StudentId", StudentId)
        formData.append("Reason", Reason)

        // Append Evidences array (files) if provided
        if (Evidences && Array.isArray(Evidences)) {
          Evidences.forEach((file, index) => {
            if (file instanceof File || file instanceof Blob) {
              formData.append("Evidences", file)
            }
          })
        }

        return {
          url: "/appeals",
          method: "POST",
          body: formData,
          // DO NOT set Content-Type; fetch sets it automatically for multipart/form-data
        }
      },
      transformResponse: (response) => {
        return response.data || response
      },
      invalidatesTags: [{ type: "Appeal", id: "LIST" }, { type: "Appeal" }],
    }),

    // GET all appeals
    getAppeals: builder.query({
      query: ({
        contestId,
        state,
        decision,
        pageNumber = 1,
        pageSize = 10,
      }) => ({
        url: `/contests/${contestId}/appeals`,
        params: { state, decision, pageNumber, pageSize },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((appeal) => ({
                type: "Appeal",
                id: appeal.appealId,
              })),
              { type: "Appeal", id: "LIST" },
            ]
          : [{ type: "Appeal", id: "LIST" }],
    }),

    // GET appeal by id
    getAppealById: builder.query({
      query: (appealId) => `/appeals/${appealId}`,
      transformResponse: (response) => {
        return response.data
      },
      providesTags: (result, error, appealId) => [
        { type: "Appeal", id: appealId },
      ],
    }),

    // PUT review an appeal
    reviewAppeal: builder.mutation({
      query: ({ appealId, decision, decisionReason }) => ({
        url: `/appeals/${appealId}/review`,
        method: "PUT",
        body: { decision, decisionReason },
      }),
      invalidatesTags: [{ type: "Appeal", id: "LIST" }],
    }),
  }),
})

export const {
  useGetMyAppealsQuery,
  useCreateAppealMutation,
  useGetAppealsQuery,
  useGetAppealByIdQuery,
  useReviewAppealMutation,
} = appealApi
