import React, { useState, useMemo } from "react"
import CsvImportSection from "./CsvImportSection"
import QuestionsPreviewSection from "./QuestionsPreviewSection"
import { getPreviewColumns } from "../../columns/getPreviewColumns"

const UploadCsvTab = ({ testId, loading, error }) => {
  const [uploadedQuestions, setUploadedQuestions] = useState([])

  const columns = useMemo(() => getPreviewColumns(), [])

  const questionsWithIndex = useMemo(
    () =>
      uploadedQuestions.map((q, i) => ({
        ...q,
        displayId: i + 1,
        optionsCount: q.options?.length || 0,
      })),
    [uploadedQuestions]
  )

  return (
    <div className="space-y-4">
      <CsvImportSection testId={testId} onUpload={setUploadedQuestions} />

        {uploadedQuestions.length > 0 && (
        <QuestionsPreviewSection
          selectedBankId={null}
          questionsWithIndex={questionsWithIndex}
          questionColumns={columns}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}

export default UploadCsvTab
