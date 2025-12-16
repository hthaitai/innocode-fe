import { api } from "./api";

export const activityLogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query({
      query: ({
        page = 1,
        pageSize = 20,
        userId,
        actionContains,
        targetType,
        from,
        to,
        sortBy = "at",
        desc = true,
      } = {}) => {
        const params = {
          Page: page,
          PageSize: pageSize,
        };

        if (userId) params.UserId = userId;
        if (actionContains) params.ActionContains = actionContains;
        if (targetType) params.TargetType = targetType;
        if (from) params.From = from;
        if (to) params.To = to;
        if (sortBy) params.SortBy = sortBy;
        if (desc !== undefined) params.Desc = desc;

        return {
          url: "activitylogs",
          params,
        };
      },
      transformResponse: (response) => {
        // Response có thể có dạng: { data: [...] } hoặc { data: { items: [...], totalCount: ... } }
        let items = [];
        let totalCount = 0;
        let pageNumber = 1;
        let pageSize = 20;
        let totalPages = 1;

        // Kiểm tra nếu response.data là array trực tiếp
        if (Array.isArray(response.data)) {
          items = response.data;
          totalCount = response.data.length;
          // Nếu có các field pagination ở cùng level với data
          if (response.totalCount !== undefined) totalCount = response.totalCount;
          if (response.pageNumber !== undefined) pageNumber = response.pageNumber;
          if (response.pageSize !== undefined) pageSize = response.pageSize;
          if (response.totalPages !== undefined) {
            totalPages = response.totalPages;
          } else {
            totalPages = Math.ceil(totalCount / pageSize);
          }
        } else if (response.data) {
          // Trường hợp response.data là object có items
          const data = response.data;
          items = data.items || data.data || (Array.isArray(data) ? data : []);
          totalCount = data.totalCount || data.total || items.length;
          pageNumber = data.pageNumber || data.currentPage || data.page || 1;
          pageSize = data.pageSize || 20;
          totalPages =
            data.totalPages ||
            Math.ceil(totalCount / pageSize);
        } else if (Array.isArray(response)) {
          // Trường hợp response là array trực tiếp
          items = response;
          totalCount = response.length;
        }

        return {
          items,
          totalCount,
          pageNumber,
          pageSize,
          totalPages,
          hasPreviousPage: pageNumber > 1,
          hasNextPage: pageNumber < totalPages,
        };
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
});

export const { useGetActivityLogsQuery } = activityLogApi;

