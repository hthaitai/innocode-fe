import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import PreviewQuestionExpanded from "./PreviewQuestionExpanded"
import { getMcqPreviewColumns } from "../../columns/getMcqPreviewColumns"
import { getMcqSelectedColumns } from "../../columns/getMcqSelectedColumns"
import { Loader2 } from "lucide-react"
import SelectedQuestionExpanded from "./SelectedQuestionExpanded"

import { useTranslation } from "react-i18next"

const QuestionsPreviewSection = ({
  questions,
  selectedQuestions,
  setSelectedQuestions,
  loading,
  onChoose,
  onUploadCsv,
  onImportBanks,
}) => {
  const { t } = useTranslation("common")
  // Toggle selection from the main table
  const toggleSelect = (question) => {
    setSelectedQuestions((prev) => {
      const exists = prev.find((q) => q.questionId === question.questionId)
      if (exists) {
        return prev.filter((q) => q.questionId !== question.questionId)
      }
      return [...prev, question]
    })
  }

  // Deselect a question from the selected table
  const deselectQuestion = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.filter((q) => q.questionId !== questionId)
    )
  }

  // Check if all displayed questions are selected
  const isAllSelected =
    questions.length > 0 &&
    questions.every((q) =>
      selectedQuestions.some((sq) => sq.questionId === q.questionId)
    )

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Unselect all questions visible in the preview table
      const visibleIds = new Set(questions.map((q) => q.questionId))
      setSelectedQuestions((prev) =>
        prev.filter((q) => !visibleIds.has(q.questionId))
      )
    } else {
      // Select all questions visible in the preview table
      const newlySelected = questions.filter(
        (q) => !selectedQuestions.some((sq) => sq.questionId === q.questionId)
      )
      setSelectedQuestions((prev) => [...prev, ...newlySelected])
    }
  }

  // Columns
  const tableColumns = getMcqPreviewColumns(
    selectedQuestions,
    toggleSelect,
    toggleSelectAll,
    isAllSelected,
    t
  )
  const selectedColumns = getMcqSelectedColumns(deselectQuestion, t)

  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between items-end mb-3">
          <div className="text-sm leading-5 font-semibold">
            {t("common.previewQuestions")}
          </div>

          <div className="flex gap-2">
            <button className="button-orange" onClick={onUploadCsv}>
              {t("common.uploadCsv")}
            </button>
            <button className="button-orange px-3" onClick={onImportBanks}>
              {t("common.importFromBanks")}
            </button>
          </div>
        </div>

        <TableFluentScrollable
          data={questions}
          columns={tableColumns}
          renderSubComponent={(q) => <PreviewQuestionExpanded question={q} />}
          expandAt="text"
          maxHeight={400}
        />
      </div>

      <div>
        <div className="flex justify-between items-end mb-3">
          <p className="text-[14px] leading-[20px] font-medium">
            {t("common.selectedQuestionsCount", {
              count: selectedQuestions.length,
            })}
          </p>

          <button
            className={`px-3 flex items-center justify-center gap-2 ${
              loading || !selectedQuestions.length
                ? "button-gray"
                : "button-orange"
            }`}
            disabled={loading || !selectedQuestions.length}
            onClick={onChoose}
          >
            {loading && <Loader2 className="animate-spin w-4 h-4 text-white" />}
            {loading
              ? t("common.addingQuestions")
              : t("common.chooseSelectedQuestions")}{" "}
          </button>
        </div>

        <TableFluentScrollable
          data={selectedQuestions}
          columns={selectedColumns}
          renderSubComponent={(q) => <SelectedQuestionExpanded question={q} />}
          expandAt="text"
          maxHeight={400}
        />
      </div>
    </div>
  )
}

export default QuestionsPreviewSection
