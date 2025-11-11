import TableFluent from "@/shared/components/TableFluent"

const resultColumns = [
  { header: "Student", accessorKey: "studentName" },
  { header: "Team", accessorKey: "teamName" },
  { header: "Submitted At", accessorKey: "submittedAt" },
  { header: "Judged By", accessorKey: "judgedBy" },
  { header: "Score", accessorKey: "totalScore" },
  { header: "Max", accessorKey: "maxPossibleScore" },
]

const ResultsTable = ({ results, loading, pagination, onPageChange }) => {
  return (
    <TableFluent
      data={results}
      columns={resultColumns}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
    />
  )
}

export default ResultsTable
