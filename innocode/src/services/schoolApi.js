import { api } from "./api";
export const schoolApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchools: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 } = {}) => ({
        url: "schools",
        params: { pageNumber, pageSize },
      }),
      providesTags: (result) =>
        result?.data && Array.isArray(result.data)
          ? [
              ...result.data.map((school) => ({
                type: "Schools",
                id: school.schoolId,
              })),
            ]
          : [{ type: "Schools", id: "LIST" }],
    }),
    getSchoolById: builder.query({
      query: (id) => `schools/${id},`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Schools", id }],
    }),
    addSchool: builder.mutation({
      query: (data) => ({
        url: "schools",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Schools", id: "LIST" }],
    }),
    updateSchool: builder.mutation({
      query: ({ id, data }) => ({
        url: `schools/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Schools", id },
        { type: "Schools", id: "LIST" },
      ],
    }),
    deleteSchool: builder.mutation({
      query: ({ id }) => ({
        url: `schools/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Schools", id },
        { type: "Schools", id: "LIST" },
      ],
    }),
    createSchoolCreationRequest: builder.mutation({
      query: ({ Name, Address, ProvinceId, Contact, Evidences }) => {
        const formData = new FormData();

        // Append required fields
        formData.append("Name", Name);
        formData.append("ProvinceId", ProvinceId);

        // Append optional fields if provided
        if (Address) {
          formData.append("Address", Address);
        }
        if (Contact) {
          formData.append("Contact", Contact);
        }

        // Append Evidences array (files) if provided
        if (Evidences && Array.isArray(Evidences)) {
          Evidences.forEach((file) => {
            if (file instanceof File || file instanceof Blob) {
              formData.append("Evidences", file);
            }
          });
        }

        return {
          url: "/school-creation-requests",
          method: "POST",
          body: formData,
          // DO NOT set Content-Type; fetch sets it automatically for multipart/form-data
        };
      },
      transformResponse: (response) => response.data || response,
      invalidatesTags: [{ type: "SchoolCreationRequests", id: "MY_LIST" }],
    }),
    getMySchoolCreationRequests: builder.query({
      query: ({ Status, Search, Page = 1, PageSize = 10 } = {}) => {
        const params = {
          Page,
          PageSize,
        };
        if (Status) params.Status = Status;
        if (Search) params.Search = Search;

        return {
          url: "/school-creation-requests/my",
          params,
        };
      },
      transformResponse: (response) => ({
        requests: response.data || [],
        pagination: response.additionalData || {},
        message: response.message,
      }),
      providesTags: (result) =>
        result?.requests && Array.isArray(result.requests)
          ? [
              ...result.requests.map((request) => ({
                type: "SchoolCreationRequests",
                id: request.requestId || request.id,
              })),
              { type: "SchoolCreationRequests", id: "MY_LIST" },
            ]
          : [{ type: "SchoolCreationRequests", id: "MY_LIST" }],
    }),
    getAllSchoolCreationRequests: builder.query({
      query: ({ Status, Search, Page = 1, PageSize = 10 } = {}) => {
        const params = {
          Page,
          PageSize,
        };
        if (Status) params.Status = Status;
        if (Search) params.Search = Search;

        return {
          url: "/school-creation-requests",
          params,
        };
      },
      transformResponse: (response) => ({
        requests: response.data || [],
        pagination: response.additionalData || {},
        message: response.message,
      }),
      providesTags: (result) =>
        result?.requests && Array.isArray(result.requests)
          ? [
              ...result.requests.map((request) => ({
                type: "SchoolCreationRequests",
                id: request.requestId || request.id,
              })),
              { type: "SchoolCreationRequests", id: "LIST" },
            ]
          : [{ type: "SchoolCreationRequests", id: "LIST" }],
    }),
    getSchoolCreationRequestById: builder.query({
      query: (id) => `/school-creation-requests/${id}`,
      transformResponse: (response) => response.data || response,
      providesTags: (result, error, id) => [
        { type: "SchoolCreationRequests", id },
      ],
    }),
    approveSchoolCreationRequest: builder.mutation({
      query: (id) => ({
        url: `/school-creation-requests/${id}/approve`,
        method: "POST",
      }),
      transformResponse: (response) => response.data || response,
      invalidatesTags: (result, error, id) => [
        { type: "SchoolCreationRequests", id },
        { type: "SchoolCreationRequests", id: "LIST" },
      ],
    }),
    denySchoolCreationRequest: builder.mutation({
      query: ({ id, denyReason }) => ({
        url: `/school-creation-requests/${id}/deny`,
        method: "POST",
        body: { denyReason },
      }),
      transformResponse: (response) => response.data || response,
      invalidatesTags: (result, error, { id }) => [
        { type: "SchoolCreationRequests", id },
        { type: "SchoolCreationRequests", id: "LIST" },
      ],
    }),
    addMentorToSchool: builder.mutation({
      query: ({ schoolId, data }) => ({
        url: `schools/${schoolId}/mentors`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data || response,
      invalidatesTags: (result, error, { schoolId }) => [
        { type: "Schools", id: schoolId },
      ],
    }),
  }),
});
export const {
  useGetAllSchoolsQuery,
  useGetSchoolByIdQuery,
  useAddSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
  useCreateSchoolCreationRequestMutation,
  useGetMySchoolCreationRequestsQuery,
  useGetAllSchoolCreationRequestsQuery,
  useGetSchoolCreationRequestByIdQuery,
  useApproveSchoolCreationRequestMutation,
  useDenySchoolCreationRequestMutation,
  useAddMentorToSchoolMutation,
} = schoolApi;
