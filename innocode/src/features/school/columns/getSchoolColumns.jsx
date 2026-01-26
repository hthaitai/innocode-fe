import { formatDateTime } from "@/shared/utils/dateTime"

export const getSchoolColumns = (t) => [
  {
    accessorKey: "name",
    header: t("schools.schoolName"),
    size: 200,
    cell: ({ row }) => (
      <span title={row.original.name}>{row.original.name || "—"}</span>
    ),
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "provinceName",
    header: t("schools.province"),
    size: 150,
    cell: ({ row }) => (
      <span title={row.original.provinceName}>
        {row.original.provinceName || "—"}
      </span>
    ),
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    accessorKey: "contact",
    header: t("schools.contact"),
    size: 150,
    cell: ({ row }) => (
      <span title={row.original.contact}>{row.original.contact || "—"}</span>
    ),
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    accessorKey: "address",
    header: t("schools.address"),
    size: 200,
    cell: ({ row }) => (
      <span title={row.original.address}>{row.original.address || "—"}</span>
    ),
    meta: { className: "truncate max-w-[200px]" },
  },
  //   {
  //     accessorKey: "managerUsername",
  //     header: t("schools.manager"),
  //     size: 150,
  //     cell: ({ row }) => (
  //       <span title={row.original.managerUsername}>
  //         {row.original.managerUsername || "—"}
  //       </span>
  //     ),
  //     meta: { className: "truncate max-w-[150px]" },
  //   },
  {
    accessorKey: "createdAt",
    header: t("schools.createdDate"),
    size: 130,
    cell: ({ row }) => {
      const dateStr = formatDateTime(row.original.createdAt)
      return <span title={dateStr}>{dateStr}</span>
    },
    meta: { className: "truncate max-w-[130px]" },
  },
]
