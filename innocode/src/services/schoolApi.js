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
  }),
});
export const {
  useGetAllSchoolsQuery,
  useGetSchoolByIdQuery,
  useAddSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
} = schoolApi;
