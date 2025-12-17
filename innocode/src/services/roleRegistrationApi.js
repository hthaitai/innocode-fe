import { api } from "./api";

export const roleRegistrationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create role registration (public endpoint)
    createRoleRegistration: builder.mutation({
      query: (formData) => {
        // formData should already be a FormData object
        return {
          url: "/role-registrations",
          method: "POST",
          body: formData,
          // DO NOT set Content-Type; fetch sets it automatically for multipart/form-data
        };
      },
      transformResponse: (response) => response.data || response,
    }),

    // Get all role registrations
    getAllRoleRegistrations: builder.query({
      query: ({ pageNumber = 1, pageSize = 10, status } = {}) => ({
        url: "/role-registrations",
        params: {
          pageNumber,
          pageSize,
          ...(status && { status }),
        },
      }),
      providesTags: (result) =>
        result?.data && Array.isArray(result.data)
          ? [
              ...result.data.map((registration) => ({
                type: "RoleRegistrations",
                id: registration.registrationId || registration.id,
              })),
              { type: "RoleRegistrations", id: "LIST" },
            ]
          : [{ type: "RoleRegistrations", id: "LIST" }],
    }),

    // Get role registration by ID
    getRoleRegistrationById: builder.query({
      query: (id) => ({
        url: `/role-registrations/${id}`,
      }),
      transformResponse: (response) => response.data || response,
      providesTags: (result, error, id) => [
        { type: "RoleRegistrations", id },
      ],
    }),

    // Approve role registration
    approveRoleRegistration: builder.mutation({
      query: (id) => ({
        url: `/role-registrations/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "RoleRegistrations", id },
        { type: "RoleRegistrations", id: "LIST" },
      ],
    }),

    // Deny role registration
    denyRoleRegistration: builder.mutation({
      query: (id) => ({
        url: `/role-registrations/${id}/deny`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "RoleRegistrations", id },
        { type: "RoleRegistrations", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateRoleRegistrationMutation,
  useGetAllRoleRegistrationsQuery,
  useGetRoleRegistrationByIdQuery,
  useApproveRoleRegistrationMutation,
  useDenyRoleRegistrationMutation,
} = roleRegistrationApi;

