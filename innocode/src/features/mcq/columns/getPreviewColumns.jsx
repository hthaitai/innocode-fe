// src/features/mcq/components/columns/getPreviewColumns.js
import { ExpandColumn } from "../../../shared/components/ExpandColumn"

export const getPreviewColumns = () => [
  // ← don't call it (no parentheses)
  ExpandColumn,
  {
    header: "Question Text",
    accessorKey: "text",
    cell: (info) => info.getValue() || "Untitled Question",
  },
  {
    header: "Options",
    accessorKey: "optionsCount",
    cell: (info) => `${info.getValue()} options`,
    size: 100,
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: (info) =>
      info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "-",
    size: 120,
  },
]
