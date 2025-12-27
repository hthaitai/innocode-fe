import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import PreviewQuestionExpanded from "./PreviewQuestionExpanded"
import { getMcqPreviewColumns } from "../../columns/getMcqPreviewColumns"
import { getMcqSelectedColumns } from "../../columns/getMcqSelectedColumns"
import { Loader2 } from "lucide-react"
import SelectedQuestionExpanded from "./SelectedQuestionExpanded"

const QuestionsPreviewSection = ({
  questions,
  selectedQuestions,
  setSelectedQuestions,
  loading,
  onChoose,
  onUploadCsv,
  onImportBanks,
}) => {
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

  // Columns
  const tableColumns = getMcqPreviewColumns(selectedQuestions, toggleSelect)
  const selectedColumns = getMcqSelectedColumns(deselectQuestion)

  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between items-end mb-3">
          <div className="text-sm leading-5 font-semibold">
            Preview questions
          </div>

          <div className="flex gap-2">
            <button className="button-orange" onClick={onUploadCsv}>
              Upload CSV
            </button>
            <button className="button-orange px-3" onClick={onImportBanks}>
              Import from banks
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
            {selectedQuestions.length}{" "}
            {selectedQuestions.length === 1 ? "question" : "questions"} selected
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
            {loading ? "Adding questions..." : "Choose selected questions"}{" "}
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
