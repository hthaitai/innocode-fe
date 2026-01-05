import { useTranslation } from "react-i18next"
import DropdownFluent from "../../../../shared/components/DropdownFluent"

const OrganizerAppealsToolbar = ({ decisionFilter, setDecisionFilter }) => {
  const { t } = useTranslation(["appeal"])

  return (
    <div className="flex items-center justify-end gap-2 mb-3">
      <div className="max-w-[364px] w-max">
        <DropdownFluent
          id="decisionFilterDropdown"
          value={decisionFilter}
          onChange={setDecisionFilter}
          options={[
            { value: "Pending", label: t("pending") },
            { value: "Approved", label: t("approved") },
            { value: "Rejected", label: t("rejected") },
          ]}
        />
      </div>
    </div>
  )
}

export default OrganizerAppealsToolbar
