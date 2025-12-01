import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import PreviewQuestionExpanded from "./PreviewQuestionExpanded"
import { getMcqPreviewColumns } from "../../columns/getMcqPreviewColumns"
import { getMcqSelectedColumns } from "../../columns/getMcqSelectedColumns"
import { Loader2 } from "lucide-react"

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
    <div className="flex flex-col lg:flex-row md:gap-5 lg:gap-1">
      <div className="">
        <div className="text-sm font-semibold mb-2">Preview questions</div>
        <TableFluentScrollable
          data={questions}
          columns={tableColumns}
          renderSubComponent={(q) => <PreviewQuestionExpanded question={q} />}
          expandAt="text"
          maxHeight={400}
          renderActions={() => (
            <div className="min-h-[70px] px-5 flex justify-between items-center">
              <p className="text-[14px] leading-[20px] font-medium">
                All questions
              </p>

              <div className="flex gap-2">
                <button className="button-orange" onClick={onUploadCsv}>
                  Upload CSV
                </button>
                <button className="button-orange px-3" onClick={onImportBanks}>
                  Import from banks
                </button>
              </div>
            </div>
          )}
        />
      </div>

      <div className="">
        <div className="text-sm font-semibold mb-2">Selected questions</div>
        <TableFluentScrollable
          data={selectedQuestions}
          columns={selectedColumns}
          renderSubComponent={(q) => <PreviewQuestionExpanded question={q} />}
          expandAt="text"
          maxHeight={400}
          renderActions={() => (
            <div className="min-h-[70px] px-5 flex items-center justify-between">
              <p className="text-[14px] leading-[20px] font-medium">
                Selected ({selectedQuestions.length})
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
                {loading && (
                  <Loader2 className="animate-spin w-4 h-4 text-white" />
                )}
                {loading ? "Adding questions..." : "Choose selected questions"}{" "}
              </button>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default QuestionsPreviewSection
