import { api } from "./api"

export const appealApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyAppeals: builder.query({
      query: (contestId) => `/contests/${contestId}/appeals/my-appeal`,
      transformResponse: (response, meta, arg) => {
        console.log("=== getMyAppeals API Response ===");
        console.log("Raw response:", response);
        console.log("Contest ID:", arg);
        console.log("Response type:", typeof response);
        console.log("Is array:", Array.isArray(response));
        
        // Handle different response formats
        // Format 1: { data: [...], additionalData: {...}, message: "...", statusCode: 200, code: "SUCCESS" }
        if (response && typeof response === 'object' && response.data) {
          console.log("Using format 1: response.data");
          return {
            appeals: Array.isArray(response.data) ? response.data : [],
            pagination: response.additionalData || null,
          }
        }
        
        // Format 2: Direct array
        if (Array.isArray(response)) {
          console.log("Using format 2: direct array");
          return {
            appeals: response,
            pagination: null,
          }
        }
        
        // Format 3: { appeals: [...] }
        if (response && response.appeals) {
          console.log("Using format 3: response.appeals");
          return {
            appeals: Array.isArray(response.appeals) ? response.appeals : [],
            pagination: response.pagination || null,
          }
        }
        
        // Fallback: empty array
        console.warn("Unknown response format, returning empty array");
        return {
          appeals: [],
          pagination: null,
        }
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error("=== getMyAppeals API Error ===");
        console.error("Error response:", response);
        console.error("Contest ID:", arg);
        console.error("==============================");
        return response;
      },
      providesTags: (result, error, id) => [{ type: "Appeal", id }],
    }),
    createAppeal: builder.mutation({
      query: ({
        RoundId,
        TeamId,
        StudentId,
        Reason,
        Evidences,
        AppealResolution,
      }) => {
        const formData = new FormData()

        // Append required fields
        formData.append("RoundId", RoundId)
        formData.append("TeamId", TeamId)
        formData.append("StudentId", StudentId)
        formData.append("Reason", Reason)

        // Append AppealResolution as array
        if (AppealResolution && Array.isArray(AppealResolution)) {
          AppealResolution.forEach((resolution) => {
            formData.append("AppealResolution", resolution)
          })
        } else if (AppealResolution) {
          // Fallback: if it's a single value, still append it
          formData.append("AppealResolution", AppealResolution)
        }

        if (Evidences && Array.isArray(Evidences) && Evidences.length > 0) {
          Evidences.forEach((evidence, index) => {
            // Check if evidence is an object with file and note, or just a file
            if (evidence && typeof evidence === "object" && evidence.file) {
              // Format: Evidences[index].File and Evidences[index].Note
              const fileKey = `Evidences[${index}].File`
              const noteKey = `Evidences[${index}].Note`
              formData.append(fileKey, evidence.file)
              formData.append(noteKey, evidence.note || "")
            } else if (evidence instanceof File || evidence instanceof Blob) {
              // Old format: just a file (fallback)
              const fileKey = `Evidences[${index}].File`
              const noteKey = `Evidences[${index}].Note`
              formData.append(fileKey, evidence)
              formData.append(noteKey, "")
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

