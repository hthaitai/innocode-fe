import { useNavigate } from "react-router-dom"
import TableFluent from "@/shared/components/TableFluent"
import TablePagination from "@/shared/components/TablePagination"
import { getPlagiarismColumns } from "../../columns/getPlagiarismColumns"
import PlagiarismToolbar from "./PlagiarismToolbar"

export default function ManagePlagiarism({
  contestId,
  plagiarismItems,
  pagination,
  setPage,
  setTeamNameSearch,
  setStudentNameSearch,
}) {
  const navigate = useNavigate()

  const handleSearch = ({ studentName, teamName }) => {
    setPage(1) // reset page
    setStudentNameSearch(studentName || "")
    setTeamNameSearch(teamName || "")
  }

  const handleRowClick = (item) => {
    navigate(`/organizer/contests/${contestId}/plagiarism/${item.submissionId}`)
  }

  const columns = getPlagiarismColumns()

  return (
    <>
      <PlagiarismToolbar onSearch={handleSearch} />

      <TableFluent
        data={plagiarismItems}
        columns={columns}
        onRowClick={handleRowClick}
      />

      <TablePagination pagination={pagination} onPageChange={setPage} />
    </>
  )
}
