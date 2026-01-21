import { api } from "./api"

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query({
      query: (params = {}) => {
        const queryParams = {}

        // If Custom and has dates, send dates only
        if (
          params.timeRangePredefined === "Custom" &&
          params.startDate &&
          params.endDate
        ) {
          queryParams.startDate = params.startDate
          queryParams.endDate = params.endDate
        }
        // If not Custom and not AllTime, send predefined
        else if (
          params.timeRangePredefined &&
          params.timeRangePredefined !== "Custom" &&
          params.timeRangePredefined !== "AllTime"
        ) {
          queryParams.predefined = params.timeRangePredefined
        }
        // AllTime = no params

        return {
          url: "dashboards/metrics",
          params: queryParams,
        }
      },
      transformResponse: (response) => response.data,
    }),
    getDashboardCharts: builder.query({
      query: (params = {}) => {
        const queryParams = {}

        if (
          params.timeRangePredefined === "Custom" &&
          params.startDate &&
          params.endDate
        ) {
          queryParams.startDate = params.startDate
          queryParams.endDate = params.endDate
        } else if (
          params.timeRangePredefined &&
          params.timeRangePredefined !== "Custom" &&
          params.timeRangePredefined !== "AllTime"
        ) {
          queryParams.predefined = params.timeRangePredefined
        }

        return {
          url: "dashboards/charts",
          params: queryParams,
        }
      },
      transformResponse: (response) => response.data,
    }),
    getTopPerformers: builder.query({
      query: (params = {}) => {
        const queryParams = {
          topCount: params.topCount || 3,
        }

        if (
          params.timeRangePredefined === "Custom" &&
          params.startDate &&
          params.endDate
        ) {
          queryParams.startDate = params.startDate
          queryParams.endDate = params.endDate
        } else if (
          params.timeRangePredefined &&
          params.timeRangePredefined !== "Custom" &&
          params.timeRangePredefined !== "AllTime"
        ) {
          queryParams.predefined = params.timeRangePredefined
        }

        return {
          url: "dashboards/top-performers",
          params: queryParams,
        }
      },
      transformResponse: (response) => response.data,
    }),
    getSchoolMetrics: builder.query({
      query: (params = {}) => {
        const queryParams = {
          topSchoolCount: params.topSchoolCount || 5,
        }

        if (
          params.timeRangePredefined === "Custom" &&
          params.startDate &&
          params.endDate
        ) {
          queryParams.startDate = params.startDate
          queryParams.endDate = params.endDate
        } else if (
          params.timeRangePredefined &&
          params.timeRangePredefined !== "Custom" &&
          params.timeRangePredefined !== "AllTime"
        ) {
          queryParams.predefined = params.timeRangePredefined
        }

        return {
          url: "dashboards/school-metrics",
          params: queryParams,
        }
      },
      transformResponse: (response) => response.data,
    }),

    // ========== Organizer Dashboard Endpoints ==========
    getOrganizerDashboardMetrics: builder.query({
      query: (params = {}) => {
        const queryParams = {
          organizerId: params.organizerId,
        }

        if (
          params.timeRangePredefined === "Custom" &&
          params.startDate &&
          params.endDate
        ) {
          queryParams.startDate = params.startDate
          queryParams.endDate = params.endDate
        } else if (
          params.timeRangePredefined &&
          params.timeRangePredefined !== "Custom" &&
          params.timeRangePredefined !== "AllTime"
        ) {
          queryParams.predefined = params.timeRangePredefined
        }

        return {
          url: "organizer-dashboards",
          params: queryParams,
        }
      },
      transformResponse: (response) => response.data,
    }),
    getOrganizerDashboardContests: builder.query({
      query: (params = {}) => ({
        url: "organizer-dashboards/contests",
        params: {
          pageNumber: params.page,
          pageSize: params.size,
        },
      }),
    }),
    getOrganizerContestDetails: builder.query({
      query: (contestId) => ({
        url: `organizer-dashboards/contests/${contestId}`,
      }),
      transformResponse: (response) => response.data,
    }),

    // ========== Mentor Dashboard Endpoints ==========
    getMentorDashboard: builder.query({
      query: (params = {}) => {
        const queryParams = {}

        if (
          params.timeRangePredefined === "Custom" &&
          params.startDate &&
          params.endDate
        ) {
          queryParams.startDate = params.startDate
          queryParams.endDate = params.endDate
        } else if (
          params.timeRangePredefined &&
          params.timeRangePredefined !== "Custom" &&
          params.timeRangePredefined !== "AllTime"
        ) {
          queryParams.predefined = params.timeRangePredefined
        }

        return {
          url: "mentor-dashboards",
          params: queryParams,
        }
      },
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
  // Mentor Dashboard Hooks
  useGetMentorDashboardQuery,
} = dashboardApi
