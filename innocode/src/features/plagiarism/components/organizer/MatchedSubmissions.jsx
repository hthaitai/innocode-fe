import { useTranslation } from "react-i18next"
import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import { getMatchedSubmissionsColumns } from "../../columns/getMatchedSubmissionsColumns"

const MatchedSubmissions = ({ matches }) => {
  const { t } = useTranslation(["plagiarism"])
  const columns = getMatchedSubmissionsColumns(t)

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
