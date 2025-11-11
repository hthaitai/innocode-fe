import { ClipboardList } from "lucide-react"

const RubricHeader = ({ rubric, loadingRubric, savingRubric, onRefresh, saveRubric }) => (
  <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
    <div className="flex gap-5 items-center">
      <ClipboardList size={20} />
      <div>
        <p className="text-[14px] leading-[20px]">Rubric Management</p>
        <p className="text-[12px] leading-[16px] text-[#7A7574]">
          {loadingRubric
            ? "Loading rubric..."
            : rubric
            ? <>Total Max Score: <span className="font-semibold">{rubric.totalMaxScore}</span></>
            : "No rubric yet. Create one."}
        </p>
      </div>
    </div>

    <div className="flex gap-2">
      <button className="button-white" onClick={onRefresh} disabled={loadingRubric}>
        Refresh
      </button>
      <button className="button-orange" onClick={saveRubric} disabled={savingRubric}>
        {savingRubric ? "Saving..." : "Save Rubric"}
      </button>
    </div>
  </div>
)

export default RubricHeader
