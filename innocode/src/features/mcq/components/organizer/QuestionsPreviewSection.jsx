import { Calendar } from "lucide-react"
import TableFluent from "@/shared/components/TableFluent"
import PreviewQuestionExpanded from "./PreviewQuestionExpanded"

const QuestionsPreviewSection = ({
  selectedBankId,
  questionsWithIndex,
  questionColumns,
  pagination,
  loading,
  error,
  onPageChange,
  onChooseBank,
}) => (
  <div className="p-5">
    {/* Content */}
    {selectedBankId ? (
      <TableFluent
        data={questionsWithIndex}
        columns={questionColumns}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={onPageChange}
        renderSubComponent={(question) => (
          <PreviewQuestionExpanded question={question} />
        )}
        expandAt="text"
      />
    ) : (
      <div className="text-center text-[#7A7574] text-sm leading-5">
        Please select a bank from the dropdown above to preview its questions
      </div>
    )}

    {/* Button at bottom right */}
    {selectedBankId && (
      <div className="flex justify-end mt-8">
        <button
          className="button-orange"
          disabled={loading}
          onClick={onChooseBank}
        >
          Choose this bank
        </button>
      </div>
    )}
  </div>
)

export default QuestionsPreviewSection
