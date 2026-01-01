import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import { getMatchedSubmissionsColumns } from "../../columns/getMatchedSubmissionsColumns"

const MatchedSubmissions = ({ matches }) => {
  const columns = getMatchedSubmissionsColumns()

  return (
    <div>
      <TableFluentScrollable
        data={matches}
        columns={columns}
        loading={false}
        getRowId={(row) => row.submissionId}
      />
    </div>
  )
}

export default MatchedSubmissions

