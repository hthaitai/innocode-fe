import TableFluent from "@/shared/components/TableFluent"

const autoResultColumns = [
  { header: "Submission", accessorKey: "submissionId" },
  { header: "Team", accessorKey: "teamName" },
  { header: "Student", accessorKey: "submittedByStudentName" },
  { header: "Status", accessorKey: "status" },
  { header: "Score", accessorKey: "score" },
  { header: "Attempt", accessorKey: "submissionAttemptNumber" },
  { header: "Created", accessorKey: "createdAt" },
]

const AutoResultsTable = ({ results, loading, pagination, onPageChange }) => {
  return (
    <TableFluent
      data={results}
      columns={autoResultColumns}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
    />
  )
}

export default AutoResultsTable
