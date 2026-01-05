import { useTranslation } from "react-i18next"
import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import { getTestCaseDetailColumns } from "../../columns/getTestCaseDetailColumns"

const TestCaseResults = ({ details }) => {
  const { t } = useTranslation(["plagiarism"])
  const columns = getTestCaseDetailColumns(t)

  return (
    <div>
      <TableFluentScrollable
        data={details}
        columns={columns}
        getRowId={(row) => row.detailsId}
      />
    </div>
  )
}

export default TestCaseResults
