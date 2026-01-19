import { api } from "./api"

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

    // Admin endpoints
    getAllUsers: builder.query({
      query: ({
        page = 1,
        pageSize = 20,
        role,
        status,
        search,
        sortBy,
        desc,
      } = {}) => {
        const params = {
          Page: page,
          PageSize: pageSize,
        }
        if (role) params.Role = role
        if (status) params.Status = status
        if (search) params.Search = search
        if (sortBy) params.SortBy = sortBy
        if (desc !== undefined) params.Desc = desc

        return {
          url: "users",
          params,
        }
      },
      transformResponse: (response) => {
        const items = response?.data || []
        const additionalData = response?.additionalData || {}

        return {
          items,
          totalCount: additionalData.totalCount || items.length,
          pageNumber: additionalData.pageNumber || 1,
          pageSize: additionalData.pageSize || 20,
          totalPages: additionalData.totalPages || 1,
          hasPreviousPage: additionalData.hasPreviousPage || false,
          hasNextPage: additionalData.hasNextPage || false,
        }
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((user) => ({
                type: "Users",
                id: user.userId || user.id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUserById: builder.query({
      query: (id) => `users/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    toggleUserStatus: builder.mutation({
      query: (id) => ({
        url: `users/${id}/toggle-status`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    registerStaff: builder.mutation({
      query: (data) => ({
        url: "auth/register-staff",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
})

export const {
  useGetUserMeQuery,
  useUpdateUserMeMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useToggleUserStatusMutation,
  useRegisterStaffMutation,
} = userApi
