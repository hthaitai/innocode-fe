import { api } from "./api"

export const activityLogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query({
      query: ({
        page = 1,
        pageSize = 20,
        userId,
        actionContains,
        targetType,
        targetId,
        from,
        to,
        sortBy = "at",
        desc = true,
      } = {}) => {
        const params = {
          Page: page,
          PageSize: pageSize,
        }

        if (userId) params.UserId = userId
        if (actionContains) params.ActionContains = actionContains
        if (targetType) params.TargetType = targetType
        if (targetId) params.TargetId = targetId
        if (from) params.From = from
        if (to) params.To = to
        if (sortBy) params.SortBy = sortBy
        if (desc !== undefined) params.Desc = desc

        return {
          url: "activitylogs",
          params,
        }
      },
      transformResponse: (response) => {
        // New API response structure: { data: [...], additionalData: { pageNumber, pageSize, totalPages, totalCount, ... } }
        const items = response?.data || []
        const additionalData = response?.additionalData || {}

        const totalCount = additionalData.totalCount || items.length
        const pageNumber = additionalData.pageNumber || 1
        const pageSize = additionalData.pageSize || 20
        const totalPages =
          additionalData.totalPages || Math.ceil(totalCount / pageSize)

        return {
          items,
          totalCount,
          pageNumber,
          pageSize,
          totalPages,
          hasPreviousPage: additionalData.hasPreviousPage || pageNumber > 1,
          hasNextPage: additionalData.hasNextPage || pageNumber < totalPages,
        }
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((log) => ({
                type: "ActivityLogs",
                id: log.logId || log.id || log.activityLogId,
              })),
              { type: "ActivityLogs", id: "LIST" },
            ]
          : [{ type: "ActivityLogs", id: "LIST" }],
    }),
  }),
})

export const { useGetActivityLogsQuery } = activityLogApi
