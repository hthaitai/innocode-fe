import React, { useState, useMemo, useCallback } from "react"
import BankSelector from "./BankSelector"
import QuestionsPreviewSection from "./QuestionsPreviewSection"
import { getPreviewColumns } from "../../columns/getPreviewColumns"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createTest, fetchRoundMcqs } from "@/features/mcq/store/mcqThunk"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"

const BankImportTab = ({ banks, loading, error }) => {
  const [selectedBankId, setSelectedBankId] = useState(null)
  const [importing, setImporting] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()
  const { testId } = useAppSelector((s) => s.mcq)

  const selectedBankQuestions = useMemo(() => {
    const bank = banks?.find((b) => (b.bankId || b.id) === selectedBankId)
    return bank?.questions || []
  }, [banks, selectedBankId])

  const columns = useMemo(() => getPreviewColumns(), [])

  const questionsWithIndex = useMemo(
    () =>
      selectedBankQuestions.map((q, i) => ({
        ...q,
        displayId: i + 1,
        optionsCount: q.options?.length || 0,
      })),
    [selectedBankQuestions]
  )

  const handleChooseBank = useCallback(async () => {
    if (!selectedBankId) return
    if (!testId) return toast.error("Test not initialized.")

    try {
      setImporting(true)
      await dispatch(createTest({ testId, bankId: selectedBankId, data: { append: true } })).unwrap()
      toast.success("Bank imported to test successfully")

      if (roundId) {
        await dispatch(fetchRoundMcqs({ roundId, pageNumber: 1, pageSize: 10 })).unwrap()
      }

      navigate(`/organizer/contests/${contestId}/rounds/${roundId}/mcqs`)
    } catch (err) {
      console.error("Failed to import bank:", err)
      toast.error(err?.Message || "Failed to import bank")
    } finally {
      setImporting(false)
    }
  }, [selectedBankId, testId, roundId, contestId, dispatch, navigate])

  return (
    <div className="bg-white rounded-b-[5px] border border-[#E5E5E5]">
      <BankSelector
        options={banks.map((b) => ({
          value: b.bankId || b.id,
          label: b.name || "Untitled Bank",
        }))}
        value={selectedBankId}
        onChange={setSelectedBankId}
        loading={loading}
      />

      <QuestionsPreviewSection
        selectedBankId={selectedBankId}
        questionsWithIndex={questionsWithIndex}
        questionColumns={columns}
        loading={loading || importing}
        error={error}
        onChooseBank={handleChooseBank}
      />
    </div>
  )
}

export default BankImportTab
