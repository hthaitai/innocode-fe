import React, { useCallback, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useOrganizerRound } from "@/features/round/hooks/useOrganizerRound"
import {
  fetchRubric,
  saveRubric,
  deleteCriterion,
} from "../store/manualProblemThunks"
import { setCriteria } from "../store/manualProblemSlice"
import RubricEditor from "../components/RubricEditor"

const ManualRubricPage = () => {
  const dispatch = useAppDispatch()
  const { contestId, roundId } = useParams()

  const { contests } = useAppSelector((s) => s.contests)
  const { round } = useOrganizerRound(contestId, roundId)

  const { rubric, criteria, loadingRubric, savingRubric } = useAppSelector(
    (s) => s.manualProblem
  )

  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )

  const breadcrumbItems = useMemo(
    () => [
      "Contests",
      contest?.name ?? "Contest",
      round?.name ?? "Round",
      "Rubric Editor",
    ],
    [contest?.name, round?.name]
  )

  const fetchRubricData = useCallback(() => {
    dispatch(fetchRubric(roundId))
  }, [dispatch, roundId])

  const saveRubricData = useCallback(() => {
    dispatch(saveRubric({ roundId, criteria }))
      .unwrap()
      .then(() => dispatch(fetchRubric(roundId)))
  }, [dispatch, roundId, criteria])

  useEffect(() => {
    fetchRubricData()
  }, [fetchRubricData])

  return (
    <PageContainer breadcrumb={breadcrumbItems}>
      <RubricEditor
        rubric={rubric}
        criteria={criteria}
        setCriteria={(next) => dispatch(setCriteria(next))}
        loadingRubric={loadingRubric}
        savingRubric={savingRubric}
        saveRubric={saveRubricData}
        roundId={roundId}
        onDeleteCriterion={(rubricId) =>
          dispatch(deleteCriterion({ roundId, rubricId })).then(() =>
            fetchRubricData()
          )
        }
      />
    </PageContainer>
  )
}

export default ManualRubricPage
