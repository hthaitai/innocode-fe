import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import { getTestCaseDetailColumns } from "../../columns/getTestCaseDetailColumns"

const TestCaseResults = ({ details }) => {
  if (!details || details.length === 0) return null

  const columns = getTestCaseDetailColumns()

  return (
    <div>
      <div className="text-sm font-semibold pt-3 pb-2">Test case results</div>
      <TableFluentScrollable
        data={details}
        columns={columns}
        loading={false}
        getRowId={(row) => row.detailsId}
      />
    </div>
  )
}

export default TestCaseResults

