import React, { useCallback, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useOrganizerRound } from "@/features/round/hooks/useOrganizerRound"

import { fetchManualResults } from "../store/manualProblemThunks"
import { setSearch } from "../store/manualProblemSlice"
import ResultsTable from "../components/ResultsTable"

const ManualResultsPage = () => {
  const dispatch = useAppDispatch()
  const { contestId, roundId } = useParams()

  const { contests } = useAppSelector((s) => s.contests)
  const { round } = useOrganizerRound(contestId, roundId)

  const { results, resultsLoading, resultsPagination, search } = useAppSelector(
    (s) => s.manualProblem
  )

  const contest = contests.find((c) => String(c.contestId) === String(contestId))

  const breadcrumbItems = useMemo(
    () => ["Contests", contest?.name ?? "Contest", round?.name ?? "Round", "Manual Results"],
    [contest?.name, round?.name]
  )

  const fetchResultsData = useCallback(
    (pageNumber = 1) => {
      dispatch(
        fetchManualResults({
          roundId,
          search,
          pageNumber,
          pageSize: resultsPagination.pageSize,
        })
      )
    },
    [dispatch, roundId, search, resultsPagination.pageSize]
  )

  useEffect(() => {
    fetchResultsData(1)
  }, [fetchResultsData])

  return (
    <PageContainer breadcrumb={breadcrumbItems}>
      <ResultsTable
        results={results}
        loading={resultsLoading}
        pagination={resultsPagination}
        onPageChange={fetchResultsData}
        search={search}
        setSearch={(patch) => dispatch(setSearch(patch))}
      />
    </PageContainer>
  )
}

export default ManualResultsPage
