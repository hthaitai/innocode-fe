import { ClipboardList } from "lucide-react"

const AutoTestCaseHeader = ({ loading, testCases, onCreate }) => (
  <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
    <div className="flex gap-5 items-center">
      <ClipboardList size={20} />
      <div>
        <p className="text-[14px] leading-[20px]">Test Case Management</p>
        <p className="text-[12px] leading-[16px] text-[#7A7574]">
          {loading
            ? "Loading test cases..."
            : testCases?.length
            ? <>Total Cases: <span className="font-semibold">{testCases.length}</span></>
            : "No test cases yet. Add one."}
        </p>
      </div>
    </div>

    <button className="button-orange" onClick={onCreate} disabled={loading}>
      New Test Case
    </button>
  </div>
)

export default AutoTestCaseHeader
