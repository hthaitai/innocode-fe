import React, { useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { fetchRoundMcqs } from "@/features/mcq/store/mcqThunk"
import { clearMcqs } from "@/features/mcq/store/mcqSlice"
import { fetchRounds } from "@/features/round/store/roundThunk"
import { fetchContests } from "@/features/contest/store/contestThunks"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"

const OrganizerMcqDetail = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { contestId, roundId, questionId } = useParams()

  const { contests } = useAppSelector((s) => s.contests)
  const { mcqs, loading, error } = useAppSelector((s) => s.mcq)
  const { rounds } = useAppSelector((s) => s.rounds)

  // --- Fetch data on mount ---
  useEffect(() => {
    if (roundId) {
      dispatch(fetchRoundMcqs({ roundId }))
    }
    if (contestId && !contests.length) {
      dispatch(fetchContests({ pageNumber: 1, pageSize: 50 }))
    }
    if (roundId && !rounds.length) {
      dispatch(fetchRounds({ contestId, pageNumber: 1, pageSize: 50 }))
    }

    // Cleanup on unmount
    return () => dispatch(clearMcqs())
  }, [dispatch, roundId, contestId])

  // --- Find current MCQ ---
  const mcq = mcqs?.find((q) => String(q.questionId) === String(questionId))

  // --- Calculate displayId ---
  const displayId = useMemo(() => {
    if (!mcqs || !mcq) return null
    const index = mcqs.findIndex(
      (q) => String(q.questionId) === String(questionId)
    )
    return index !== -1 ? index + 1 : null
  }, [mcqs, mcq, questionId])

  // --- Breadcrumb ---
  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )
  const round = rounds.find((r) => String(r.roundId) === String(roundId))
  const items = BREADCRUMBS.ORGANIZER_MCQ_DETAIL(
    contest?.name ?? "Contest",
    round?.name ?? "Round",
    displayId ? `Question #${displayId}` : "Question"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ_DETAIL(
    contestId,
    roundId,
    questionId
  )

  // --- Get options ---
  const options = mcq?.options || []

  return (
    <PageContainer
      breadcrumb={items}
      breadcrumbPaths={paths}
      loading={loading}
      error={error}
    >
      {!mcq ? (
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 min-h-[70px] flex items-center gap-5 text-[#7A7574]">
          <AlertTriangle size={20} />
          <p>This MCQ question has been deleted or is no longer available.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Question Information */}
          <InfoSection title="Question Information">
            <DetailTable
              data={[
                { label: "Question", value: mcq.text || "Untitled Question" },
                { label: "Weight", value: mcq.weight ?? "-" },
              ]}
            />
          </InfoSection>

          {/* Options */}
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              Options
            </div>
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white">
              {options.length === 0 ? (
                <div className="px-5 py-10 text-center text-[#7A7574]">
                  No options available for this question
                </div>
              ) : (
                <div className="divide-y divide-[#E5E5E5]">
                  {options.map((option, index) => {
                    const optionLabel = String.fromCharCode(65 + index) // A, B, C, D...
                    const isCorrect =
                      option.isCorrect || option.is_correct || false
                    return (
                      <div
                        key={option.id || option.optionId || index}
                        className="px-5 py-4 flex items-center gap-4"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#E5E5E5] flex items-center justify-center font-semibold text-sm">
                          {optionLabel}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-5">
                            {option.text || option.content || "No text"}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {isCorrect ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 size={20} />
                              <span className="text-sm font-medium">
                                Correct
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-400">
                              <XCircle size={20} />
                              <span className="text-sm">Incorrect</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default OrganizerMcqDetail
