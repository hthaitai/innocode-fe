import { api } from "./api";
export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "notifications",
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((notif) => ({
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
