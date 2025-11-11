import React, { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  fetchBanks,
  createTest,
  fetchRoundMcqs,
} from "@/features/mcq/store/mcqThunk"
import { clearBanks, clearMcqs } from "@/features/mcq/store/mcqSlice"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

import UploadCsvSection from "../components/organizer/UploadCsvSection"
import BankSelector from "../components/organizer/BankSelector"
import QuestionsPreviewSection from "../components/organizer/QuestionsPreviewSection"

const OrganizerMcqCreate = () => {
  const { contestId, roundId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { contests } = useAppSelector((s) => s.contests)
  const { rounds } = useAppSelector((s) => s.rounds)
  const { banks, testId, loading, error } = useAppSelector((s) => s.mcq)

  const [selectedBankId, setSelectedBankId] = useState(null)
  const [questionsPage, setQuestionsPage] = useState(1)
  const [questionsPageSize] = useState(10)

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

  const bankOptions = useMemo(
    () =>
      banks?.map((b) => ({
        value: b.bankId || b.id,
        label: b.name || "Untitled Bank",
      })) || [],
    [banks]
  )

  const selectedBankQuestions = useMemo(() => {
    const bank = banks?.find((b) => (b.bankId || b.id) === selectedBankId)
    return bank?.questions || []
  }, [banks, selectedBankId])

  const questionsWithIndex = useMemo(() => {
    const start = (questionsPage - 1) * questionsPageSize
    return selectedBankQuestions
      .slice(start, start + questionsPageSize)
      .map((q, i) => ({
        ...q,
        displayId: start + i + 1,
        optionsCount: q.options?.length || 0,
      }))
  }, [selectedBankQuestions, questionsPage, questionsPageSize])

  const pagination = useMemo(() => {
    const total = selectedBankQuestions.length
    const totalPages = Math.ceil(total / questionsPageSize) || 1
    return {
      pageNumber: questionsPage,
      pageSize: questionsPageSize,
      totalPages,
      totalCount: total,
      hasPreviousPage: questionsPage > 1,
      hasNextPage: questionsPage < totalPages,
    }
  }, [selectedBankQuestions.length, questionsPage, questionsPageSize])

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "displayId", size: 50 },
      { header: "Question Text", accessorKey: "text" },
      {
        header: "Options",
        accessorKey: "optionsCount",
        cell: (info) => `${info.getValue()} options`,
        size: 100,
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue()).toLocaleDateString()
            : "-",
        size: 120,
      },
    ],
    []
  )

  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )
  const round = rounds.find((r) => String(r.roundId) === String(roundId))

  const items = BREADCRUMBS.ORGANIZER_MCQ_NEW(
    contest?.name ?? "Contest",
    round?.name ?? "Round"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ_NEW(contestId, roundId)

  const handleChooseBank = async () => {
    if (!selectedBankId || !roundId) return

    // Use testId from state if available, otherwise fall back to roundId
    const currentTestId = testId || roundId

    if (!currentTestId) {
      toast.error("Unable to determine test ID")
      return
    }

    try {
      const result = await dispatch(
        createTest({ testId: currentTestId, bankId: selectedBankId, data: {} })
      )

      if (createTest.fulfilled.match(result)) {
        toast.success("Bank added to round successfully!")
        navigate(`/organizer/contests/${contestId}/rounds/${roundId}/mcqs`)
      } else {
        const error = result.payload
        toast.error(error?.Message || "Failed to add bank to round")
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <div className="space-y-4">
        <div className="space-y-1">
          <UploadCsvSection />

          <BankSelector
            options={bankOptions}
            value={selectedBankId}
            onChange={setSelectedBankId}
            loading={loading}
          />
        </div>

        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Preview bank questions
          </div>
          <QuestionsPreviewSection
            selectedBankId={selectedBankId}
            questionsWithIndex={questionsWithIndex}
            questionColumns={columns}
            pagination={pagination}
            loading={loading}
            error={error}
            onPageChange={setQuestionsPage}
            onChooseBank={handleChooseBank}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerMcqCreate
