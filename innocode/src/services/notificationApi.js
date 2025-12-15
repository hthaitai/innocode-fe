import { api } from "./api"
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
  }),
})
export const { useGetNotificationsQuery } = notificationApi
