import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserMe: builder.query({
      query: () => ({
        url: "users/me",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) => [{ type: "Users", id: result?.userId }],
    }),
    updateUserMe: builder.mutation({
      query: (data) => ({
        url: "users/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error) => [
        { type: "Users", id: result?.userId },
      ],
    }),
  }),
});

export const { useGetUserMeQuery, useUpdateUserMeMutation } = userApi;
