import { api } from "./api"

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query({
      query: (params = {}) => ({
        url: "dashboards/metrics", // Original URL was "dashboards/metrics"
        params: {
          startDate: params.startDate,
          endDate: params.endDate,
          timeRangePredefined: params.timeRangePredefined,
        },
      }),
      transformResponse: (response) => response.data,
      // providesTags: ["DashboardMetrics"], // Removed as per the provided code edit
    }),
  }),
})

export const { useGetDashboardMetricsQuery } = dashboardApi
