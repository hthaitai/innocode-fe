import { Plus } from "lucide-react"
import DropdownFluent from "@/shared/components/DropdownFluent"

const BankSelector = ({ options, value, onChange, loading }) => (
  <div className="border-b border-[#E5E5E5] bg-white p-5">
    <div className="flex justify-between items-center">
      <div className="flex gap-5 items-center">
        <Plus size={20} />
        <div>
          <p className="text-[14px] leading-[20px]">Select Question Bank</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            Choose an existing question bank
          </p>
        </div>
      </div>
      <div className="min-w-[130px]">
        <DropdownFluent
          options={options}
          value={value}
          onChange={onChange}
          placeholder="Select a bank"
          disabled={loading || options.length === 0}
        />
      </div>
    </div>
  </div>
)

export default BankSelector
