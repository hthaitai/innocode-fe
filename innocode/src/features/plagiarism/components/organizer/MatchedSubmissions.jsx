import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import { getMatchedSubmissionsColumns } from "../../columns/getMatchedSubmissionsColumns"

const MatchedSubmissions = ({ matches }) => {
  if (!matches || matches.length === 0) return null

  const columns = getMatchedSubmissionsColumns()

  return (
    <div>
      <div className="text-sm font-semibold pt-3 pb-2">Matched Submissions</div>
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

