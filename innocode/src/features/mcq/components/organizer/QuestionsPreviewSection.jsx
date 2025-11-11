import { Calendar } from "lucide-react"
import TableFluent from "@/shared/components/TableFluent"
import McqTableExpanded from "./McqTableExpanded"
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
  <div className="space-y-1">
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Calendar size={20} />
        <div>
          <p className="text-[14px] leading-[20px]">Questions Preview</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {selectedBankId
              ? "Preview questions from the selected bank"
              : "Select a bank to preview its questions"}
          </p>
        </div>
      </div>
      <button
        className="button-orange"
        disabled={!selectedBankId || loading}
        onClick={onChooseBank}
      >
        Choose this bank
      </button>
    </div>

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
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-center text-[#7A7574] text-sm leading-5 min-h-[70px]">
        Please select a bank from the dropdown above to preview its questions
      </div>
    )}
  </div>
)

export default QuestionsPreviewSection
