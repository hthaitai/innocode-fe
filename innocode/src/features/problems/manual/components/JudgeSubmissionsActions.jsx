import React from "react"
import DropdownFluent from "../../../../shared/components/DropdownFluent"
import { useTranslation } from "react-i18next"

const JudgeSubmissionsActions = ({ statusFilter, setStatusFilter }) => {
  const { t } = useTranslation("judge")

  return (
    <div className="flex justify-end mb-3">
      <div className="min-w-[130px] w-max">
        <DropdownFluent
          id="statusFilterDropdown"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            {
              value: "Pending",
              label: t("manualSubmissions.filter.Pending"),
            },
            {
              value: "Finished",
              label: t("manualSubmissions.filter.Finished"),
            },
            // {
            //   value: "Cancelled",
            //   label: t("manualSubmissions.filter.Cancelled"),
            // },
            // {
            //   value: "PlagiarismConfirmed",
            //   label: t("manualSubmissions.filter.PlagiarismConfirmed"),
            // },
            // {
            //   value: "PlagiarismSuspected",
            //   label: t("manualSubmissions.filter.PlagiarismSuspected"),
            // },
          ]}
        />
      </div>
    </div>
  )
}

export default JudgeSubmissionsActions
