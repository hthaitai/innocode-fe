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
      query: ({
        pageNumber = 1,
        pageSize = 10,
        status,
        requestedRole,
        emailContains,
        sortBy,
        desc,
      } = {}) => {
        const params = {
          Page: pageNumber,
          PageSize: pageSize,
        };

        if (status) params.Status = status;
        if (requestedRole) params.RequestedRole = requestedRole;
        if (emailContains) params.EmailContains = emailContains;
        if (sortBy) params.SortBy = sortBy;
        if (desc !== undefined) params.Desc = desc;

        return {
          url: "/role-registrations",
          params,
        };
      },
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
      query: ({ id, reason }) => ({
        url: `/role-registrations/${id}/deny`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
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

