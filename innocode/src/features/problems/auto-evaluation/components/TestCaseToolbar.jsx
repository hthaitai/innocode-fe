import React from "react"
import { useTranslation } from "react-i18next"

const TestCaseToolbar = ({ onUploadCsv, onCreate }) => {
  const { t } = useTranslation("common")
  return (
    <div className="flex justify-end items-center mb-3">
      <div className="flex gap-2">
        {/* Upload CSV */}
        <button className="button-orange" onClick={onUploadCsv}>
          {t("common.uploadCsv")}
        </button>

        {/* Add Test Case */}
        <button className="button-white px-3" onClick={onCreate}>
          {t("common.addTestCase")}
        </button>
      </div>
    </div>
  )
}

export default TestCaseToolbar
