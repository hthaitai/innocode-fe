import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import { getTestCaseDetailColumns } from "../../columns/getTestCaseDetailColumns"

const TestCaseResults = ({ details }) => {
  const columns = getTestCaseDetailColumns()

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
