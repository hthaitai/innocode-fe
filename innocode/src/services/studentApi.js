import { api } from "./api"

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudentsBySchoolId: builder.query({
      query: (schoolId) => ({
        url: "students",
        params: { SchoolId: schoolId },
      }),
      transformResponse: (response) => {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return response.data || [];
      },
      providesTags: (result, error, schoolId) => [
        { type: "Students", id: `SCHOOL_${schoolId}` },
      ],
    }),
  }),
})

export const { useGetStudentsBySchoolIdQuery } = studentApi

