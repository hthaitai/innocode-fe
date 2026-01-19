import { useGetRoundTimelineQuery } from "@/services/roundApi"

/**
 * Custom hook to fetch round timeline data using RTK Query
 * @param {string} roundId - The ID of the round
 * @returns {object} - { timeline, loading, error, refetch }
 */
const useRoundTimeline = (roundId) => {
  const {
    data: timeline,
    isLoading: loading,
    error,
    refetch,
  } = useGetRoundTimelineQuery(roundId || "", {
    skip: !roundId,
  })

  return {
    timeline: timeline || null,
    loading,
    error: error?.data?.message || error?.message || null,
    refetch,
  }
}

export default useRoundTimeline
