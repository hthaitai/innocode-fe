import { api } from "./api";
export const provinceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProvinces: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 } = {}) => ({
        url: "/provinces",
        params: { pageNumber, pageSize },
      }),
      providesTags: (result) =>
        result?.data && Array.isArray(result.data)
          ? [
              ...result.data.map((province) => ({
                type: "Provinces",
                id: province.provinceId,
              })),
              { type: "Provinces", id: "LIST" },
            ]
          : [{ type: "Provinces", id: "LIST" }],
    }),
    getProvinceById: builder.query({
      query: (id) => `provinces/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Provinces", id }],
    }),
    addProvince: builder.mutation({
      query: (data) => ({
        url: "provinces",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Provinces", id: "LIST" }],
    }),
    updateProvince: builder.mutation({
      query: ({ id, data }) => ({
        url: `provinces/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Provinces", id },
        { type: "Provinces", id: "LIST" },
      ],
    }),
    deleteProvince: builder.mutation({
      query: ({ id }) => ({
        url: `provinces/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Provinces", id },
        { type: "Provinces", id: "LIST" },
      ],
    }),
  }),
});
export const {
    useGetAllProvincesQuery,
    useGetProvinceByIdQuery,
    useAddProvinceMutation,
    useUpdateProvinceMutation,
    useDeleteProvinceMutation,
} = provinceApi;