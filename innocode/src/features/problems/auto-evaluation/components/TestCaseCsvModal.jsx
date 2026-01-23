import { useState } from "react"
import BaseModal from "@/shared/components/BaseModal"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import {
  useGetTestCaseTemplateQuery,
  useImportTestCasesCsvMutation,
} from "@/services/autoEvaluationApi"
import { isFetchError } from "@/shared/utils/apiUtils"

export default function TestCaseCsvModal({
  isOpen,
  onClose,
  roundId,
  contestId,
}) {
  const { t } = useTranslation(["common", "contest"])
  const { data: templateResponse } = useGetTestCaseTemplateQuery()
  const templateUrl = templateResponse?.data

  const [importTestCasesCsv, { isLoading: importing }] =
    useImportTestCasesCsvMutation()

  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError(t("common.validCsvError"))
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setError(null)
  }

  const handleImport = async () => {
    if (!selectedFile) {
      setError(t("common.selectCsvError"))
      return
    }

    try {
      await importTestCasesCsv({
        roundId,
        contestId,
        csvFile: selectedFile,
      }).unwrap()
      toast.success(t("common.testCasesImportedSuccess"))
      setSelectedFile(null)
      onClose()
    } catch (err) {
      console.error(err)

      if (isFetchError(err)) {
        toast.error(t("contest:suggestion.connectionError"))
        return
      }

      toast.error(err?.data?.message || t("common.failedToImportTestCases"))
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setError(null)
    onClose()
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="button-white"
        onClick={handleClose}
        disabled={importing}
      >
        {t("buttons.cancel")}
      </button>

      <button
        type="button"
        className={importing ? "button-gray" : "button-orange"}
        onClick={handleImport}
        disabled={importing}
      >
        {importing ? t("common.importing") : t("common.importCsv")}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("common.uploadTestCaseCsv")}
      size="md"
      footer={footer}
    >
      <div className="flex flex-col gap-3">
        {/* Download Template */}
        {templateUrl && (
          <div className="flex flex-col gap-1">
            <label className="text-xs leading-4 mb-1">
              {t("common.downloadTemplate")}
            </label>

            <div>
              <button
                type="button"
                className="button-white px-3"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = templateUrl
                  link.download = "test_cases_template.csv"
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                {t("common.download")}
              </button>
            </div>
          </div>
        )}

        {/* File Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs leading-4 mb-1">
            {t("common.selectTestCaseCsvFile")}
          </label>

          <button
            type="button"
            className="button-orange w-max"
            onClick={() =>
              document.getElementById("testcase-csv-input").click()
            }
          >
            {selectedFile ? t("common.changeCsv") : t("common.chooseCsv")}
          </button>

          <input
            id="testcase-csv-input"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile && (
            <p className="text-xs leading-4 text-[#7A7574] truncate mt-1">
              {selectedFile.name}
            </p>
          )}

          {error && <p className="text-xs text-[#D32F2F] mt-1">{error}</p>}
        </div>
      </div>
    </BaseModal>
  )
}
