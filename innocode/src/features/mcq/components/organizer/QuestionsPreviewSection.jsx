import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import PreviewQuestionExpanded from "./PreviewQuestionExpanded"
import { Trash2 } from "lucide-react"

const QuestionsPreviewSection = ({
  questions,
  columns,
  selectedQuestions,
  setSelectedQuestions,
  loading,
  onChoose,
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

  // Columns for All Questions table (Left)
  const tableColumns = [
    columns.find((col) => col.id === "expand"),
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-center items-center h-full">
          <input
            type="checkbox"
            checked={
              !!selectedQuestions.find(
                (q) => q.questionId === row.original.questionId
              )
            }
            onChange={() => toggleSelect(row.original)}
            className="text-[#E05307] accent-[#E05307]"
          />
        </div>
      ),
      size: 50,
    },
    columns.find((col) => col.accessorKey === "text"),
    columns.find((col) => col.accessorKey === "optionsCount"),
    columns.find((col) => col.accessorKey === "createdAt"),
  ]

  // Columns for Selected Questions table (Right)
  const selectedColumns = [
    columns.find((col) => col.id === "expand"),
    columns.find((col) => col.accessorKey === "text"),
    columns.find((col) => col.accessorKey === "optionsCount"),
    columns.find((col) => col.accessorKey === "createdAt"),
    {
      id: "deselect",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => deselectQuestion(row.original.questionId)}
            title="Deselect question"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      size: 40,
    },
  ]

  return (
    <div className="flex gap-3">
      <div className="w-1/2">
        <div className="text-sm font-semibold mb-2">All questions</div>
        <TableFluentScrollable
          data={questions}
          columns={tableColumns}
          loading={loading}
          renderSubComponent={(q) => <PreviewQuestionExpanded question={q} />}
          expandAt="text"
          maxHeight={400}
        />
      </div>

      <div className="w-1/2 flex flex-col">
        <div className="text-sm font-semibold mb-2">
          Selected questions ({selectedQuestions.length})
        </div>
        <TableFluentScrollable
          data={selectedQuestions}
          columns={selectedColumns}
          loading={loading}
          renderSubComponent={(q) => <PreviewQuestionExpanded question={q} />}
          expandAt="text"
          maxHeight={400}
        />

        <div className="flex justify-end mt-4">
          <button
            className="button-orange px-3"
            disabled={loading || !selectedQuestions.length}
            onClick={onChoose}
          >
            Choose selected questions
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionsPreviewSection
