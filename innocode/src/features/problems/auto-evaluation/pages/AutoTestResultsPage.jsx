import React, { useCallback, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useOrganizerRoundDetail } from "@/features/round/hooks/useOrganizerRoundDetail"
import { fetchAutoTestResults } from "../store/autoEvaluationThunks"

import AutoResultsTable from "../components/AutoResultsTable"

const AutoTestResultsPage = () => {
  const dispatch = useAppDispatch()
  const { contestId, roundId } = useParams()

  const { contests } = useAppSelector((s) => s.contests)
  const { round } = useOrganizerRoundDetail(contestId, roundId)

  const { results, resultsPagination, loading } = useAppSelector(
    (s) => s.autoEvaluation
  )

  const contest = contests.find((c) => String(c.contestId) === String(contestId))

  const breadcrumbItems = useMemo(
    () => ["Contests", contest?.name ?? "Contest", round?.name ?? "Round", "Auto Results"],
    [contest?.name, round?.name]
  )

  const fetchResultsData = useCallback(
    (pageNumber = 1) => {
      dispatch(
        fetchAutoTestResults({
          roundId,
          pageNumber,
          pageSize: resultsPagination.pageSize,
        })
      )
    },
    [dispatch, roundId, resultsPagination.pageSize]
  )

  useEffect(() => {
    fetchResultsData(1)
  }, [fetchResultsData])

  return (
    <PageContainer breadcrumb={breadcrumbItems}>
      <AutoResultsTable
        results={results}
        loading={loading}
        pagination={resultsPagination}
        onPageChange={fetchResultsData}
      />
    </PageContainer>
  )
}

export default AutoTestResultsPage
