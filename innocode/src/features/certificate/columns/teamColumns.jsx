export const getTeamColumns = () => [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        {...{
          checked: table.getIsAllPageRowsSelected(),
          onChange: table.getToggleAllPageRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        {...{
          checked: row.getIsSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  },
  { accessorKey: "name", header: "Team Name" },
  { accessorKey: "schoolName", header: "School" },
  { accessorKey: "mentorName", header: "Mentor" },
  { accessorKey: "createdAt", header: "Created At" },
]
