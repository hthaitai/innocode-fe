import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchBanks, fetchRoundMcqs } from "@/features/mcq/store/mcqThunk"
import { clearBanks, clearMcqs } from "@/features/mcq/store/mcqSlice"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import UploadCsvTab from "../components/organizer/UploadCsvTab"
import BankImportTab from "../components/organizer/BankImportTab"
import { Database, FileText } from "lucide-react"

const OrganizerMcqCreate = () => {
  const { contestId, roundId } = useParams()
  const dispatch = useAppDispatch()
  const { contests } = useAppSelector((s) => s.contests)
  const { rounds } = useAppSelector((s) => s.rounds)
  const { banks, loading, error, testId } = useAppSelector((s) => s.mcq)

  const [activeTab, setActiveTab] = useState("upload")

  useEffect(() => {
    dispatch(fetchBanks({ pageNumber: 1, pageSize: 100 }))
    if (roundId) {
      dispatch(fetchRoundMcqs({ roundId, pageNumber: 1, pageSize: 10 }))
    }
    return () => {
      dispatch(clearBanks())
      dispatch(clearMcqs())
    }
  }, [dispatch, roundId])


  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )
  const round = rounds.find((r) => String(r.roundId) === String(roundId))

  const items = BREADCRUMBS.ORGANIZER_MCQ_NEW(
    contest?.name ?? "Contest",
    round?.name ?? "Round"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ_NEW(contestId, roundId)

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <div>
        {/* ------------------ Tabs Header ------------------ */}
        <div className="flex text-xs leading-4">
          <button
            className={`min-w-[240px] min-h-[34px] px-2 transition-all duration-200 ease-in-out ${
              activeTab === "upload"
                ? "border border-[#E5E5E5] border-b-white rounded-t-[5px] bg-white"
                : "hover:bg-[#DADADA] border border-[#f3f3f3] rounded-t-[5px]"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            <div className="flex gap-2 items-center">
              <FileText size={16} />
              Upload CSV
            </div>
          </button>

          <button
            className={`min-w-[240px] min-h-[34px] px-2 transition-all duration-200 ease-in-out ${
              activeTab === "bank"
                ? "border border-[#E5E5E5] border-b-white rounded-t-[5px] bg-white"
                : "hover:bg-[#DADADA] border border-[#f3f3f3] rounded-t-[5px]"
            }`}
            onClick={() => setActiveTab("bank")}
          >
            <div className="flex gap-2 items-center">
              <Database size={16} />
              Import from Bank
            </div>
          </button>
        </div>

        {/* ------------------ Tab Content ------------------ */}
        {activeTab === "upload" && (
          <UploadCsvTab testId={testId} loading={loading} error={error} />
        )}

        {activeTab === "bank" && (
          <BankImportTab banks={banks} loading={loading} error={error} />
        )}
      </div>
    </PageContainer>
  )
}

export default OrganizerMcqCreate
