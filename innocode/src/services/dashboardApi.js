import { api } from "./api"

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query({
      query: (params = {}) => ({
        url: "dashboards/metrics",
        params: {
          startDate: params.startDate,
          endDate: params.endDate,
          timeRangePredefined: params.timeRangePredefined,
        },
      }),
      transformResponse: (response) => response.data,
    }),
    getDashboardCharts: builder.query({
      query: (params = {}) => ({
        url: "dashboards/charts",
        params: {
          startDate: params.startDate,
          endDate: params.endDate,
          timeRangePredefined: params.timeRangePredefined,
        },
      }),
      transformResponse: (response) => response.data,
    }),
    getTopPerformers: builder.query({
      query: (params = {}) => ({
        url: "dashboards/top-performers",
        params: {
          topCount: params.topCount || 3,
          startDate: params.startDate,
          endDate: params.endDate,
          timeRangePredefined: params.timeRangePredefined,
        },
      }),
      transformResponse: (response) => response.data,
    }),
    getSchoolMetrics: builder.query({
      query: (params = {}) => ({
        url: "dashboards/school-metrics",
        params: {
          topSchoolCount: params.topSchoolCount || 5,
          startDate: params.startDate,
          endDate: params.endDate,
          timeRangePredefined: params.timeRangePredefined,
        },
      }),
      transformResponse: (response) => response.data,
    }),

    // ========== Organizer Dashboard Endpoints ==========
    getOrganizerDashboardMetrics: builder.query({
      query: (params = {}) => ({
        url: "organizer-dashboards",
        params: {
          organizerId: params.organizerId,
          startDate: params.startDate,
          endDate: params.endDate,
          timeRangePredefined: params.timeRangePredefined,
        },
      }),
      transformResponse: (response) => response.data,
    }),
    getOrganizerDashboardContests: builder.query({
      query: (params = {}) => ({
        url: "organizer-dashboards/contests",
        params: {
          page: params.page,
          size: params.size,
        },
      }),
      transformResponse: (response) => response.data,
    }),
    getOrganizerContestDetails: builder.query({
      query: (contestId) => ({
        url: `organizer-dashboards/contests/${contestId}`,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
})

export const {
  // Admin Dashboard Hooks
  useGetDashboardMetricsQuery,
  useGetDashboardChartsQuery,
  useGetTopPerformersQuery,
  useGetSchoolMetricsQuery,
  // Organizer Dashboard Hooks
  useGetOrganizerDashboardMetricsQuery,
  useGetOrganizerDashboardContestsQuery,
  useGetOrganizerContestDetailsQuery,
} = dashboardApi
