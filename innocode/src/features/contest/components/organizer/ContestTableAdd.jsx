import { Trophy } from "lucide-react"

const ContestTableAdd = ({ onAdd }) => (
  <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
    <div className="flex gap-5 items-center">
      <Trophy size={20} />
      <div>
        <p className="text-[14px] leading-[20px]">Contest Management</p>
        <p className="text-[12px] leading-[16px] text-[#7A7574]">
          Create and manage contests
        </p>
      </div>
    </div>
    <button className="button-orange" onClick={onAdd}>
      Add contest
    </button>
  </div>
)

export default ContestTableAdd

