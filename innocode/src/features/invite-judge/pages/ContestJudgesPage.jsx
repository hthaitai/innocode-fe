import React, { useState, useCallback, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "../../../services/contestApi"
import { useGetJudgesToInviteQuery } from "../../../services/contestJudgeApi"
import { useModal } from "@/shared/hooks/useModal"
import { getJudgeInviteColumns } from "../columns/judgeInviteColumns"

const ContestJudgesPage = () => {
  const { contestId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [selectedJudgeId, setSelectedJudgeId] = useState(null)
  const { openModal } = useModal()

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: judgesData,
    isLoading: isJudgesLoading,
    isError: isJudgesError,
  } = useGetJudgesToInviteQuery({ contestId, page, pageSize })

  const judges = judgesData?.data || []
  const pagination = judgesData?.additionalData || {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_JUDGES(
    contest?.name ?? "Contest Judges"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_JUDGES(contestId)

  // Invite handler
  const handleInvite = useCallback(() => {
    if (!selectedJudgeId) return

    const judge = judges.find((j) => j.judgeId === selectedJudgeId)
    if (!judge) return

    openModal("inviteJudge", {
      contestId,
      judgeUserId: selectedJudgeId,
      judgeName: judge.judgeName,
      judgeEmail: judge.judgeEmail,
    })
  }, [selectedJudgeId, openModal, contestId, judges])

  const canInviteJudge = (judgeId) => {
    const judge = judges.find((j) => j.judgeId === judgeId)
    if (!judge) return false

    // Only allow invite if inviteStatus is null, Cancelled, Revoked, or Expired
    return (
      !judge.inviteStatus ||
      ["Cancelled", "Revoked", "Expired"].includes(judge.inviteStatus)
    )
  }

  const handleRowClick = (row) => {
    if (selectedJudgeId === row.judgeId) {
      // click again → deselect
      setSelectedJudgeId(null)
    } else {
      setSelectedJudgeId(row.judgeId)
    }
  }

  const columns = getJudgeInviteColumns()

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isContestLoading || isJudgesLoading}
      error={isContestError || isJudgesError}
    >
      <div>
        <TableFluent
          data={judges}
          columns={columns}
          loading={isJudgesLoading}
          error={isJudgesError}
          pagination={pagination}
          onPageChange={setPage}
          rowHighlightId={selectedJudgeId} // highlight selected row
          onRowClick={handleRowClick}
          renderActions={() => (
            <div className="flex items-center justify-between px-5 min-h-[70px]">
              <div className="text-sm leading-5 font-medium">Judges list</div>
              <button
                onClick={handleInvite}
                disabled={!selectedJudgeId || !canInviteJudge(selectedJudgeId)}
                className={`flex items-center gap-2 justify-center ${
                  !selectedJudgeId || !canInviteJudge(selectedJudgeId)
                    ? "button-gray"
                    : "button-orange"
                }`}
              >
                Invite
              </button>
            </div>
          )}
        />
      </div>
    </PageContainer>
  )
}

export default ContestJudgesPage
