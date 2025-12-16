import { api } from "./api";
export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 } = {}) => ({
        url: "notifications",
        params: {
          pageNumber,
          pageSize,
        },
      }),
      transformResponse: (response) => {
        const data = response.data || response;
        return {
          items: data.items || [],
          totalCount: data.totalCount || data.total || 0,
          pageNumber: data.pageNumber || data.currentPage || 1,
          pageSize: data.pageSize || 10,
          totalPages: data.totalPages || Math.ceil((data.totalCount || data.total || 0) / (data.pageSize || 10)),
          hasPreviousPage: (data.pageNumber || data.currentPage || 1) > 1,
          hasNextPage: (data.pageNumber || data.currentPage || 1) < (data.totalPages || Math.ceil((data.totalCount || data.total || 0) / (data.pageSize || 10))),
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((notif) => ({
                type: "Notifications",
                id: notif.notificationId,
              })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),
    getNotificationById: builder.query({
      query: (notificationId) => ({
        url: `notifications/${notificationId}`,
      }),
      transformResponse: (response) => {
        // API returns: { data: { ...notification }, ... }
        // Return the notification object directly
        return response.data || response;
      },
      providesTags: (result, error, notificationId) => [
        { type: "Notifications", id: notificationId },
      ],
    }),

    readNotification: builder.mutation({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/read`,
        method: "POST",
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: "Notifications", id: notificationId },
        { type: "Notifications", id: "LIST" },
      ],
    }),
    readAllNotifications: builder.mutation({
      query: () => ({
        url: "notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: (result, error) => [
        { type: "Notifications", id: "LIST" },
      ],
    }),
  }),
});
export const {
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useReadAllNotificationsMutation,
  useGetNotificationByIdQuery,
} = notificationApi;
