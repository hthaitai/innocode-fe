import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useGetActivityLogsQuery } from "@/services/activityLogApi"
import { formatDateTime } from "@/shared/utils/dateTime"
import TableFluent from "@/shared/components/TableFluent"
import { History, User, Target, Calendar } from "lucide-react"

const ActivityLog = () => {
  const { t } = useTranslation(["pages", "common"])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(20)
  const [searchTerm, setSearchTerm] = useState("")
  const [targetIdFilter, setTargetIdFilter] = useState("")
  const [targetTypeFilter, setTargetTypeFilter] = useState("")

  const {
    data: logsData,
    isLoading,
    error,
    refetch,
  } = useGetActivityLogsQuery(
    {
      page: pageNumber,
      pageSize,
      actionContains: searchTerm || undefined,
      targetId: targetIdFilter || undefined,
      targetType: targetTypeFilter || undefined,
      sortBy: "at",
      desc: true,
    },
    {
      pollingInterval: 30000, // Auto-refresh every 30 seconds
    }
  )

  const logs = logsData?.items || []

  // Format action for display
  const formatAction = (action) => {
    if (!action) return "Unknown Action"
    // Format action like "user.login" to "User Login"
    return action
      .split(".")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(/_/g, " ")
  }

  // Get action badge color
  const getActionBadgeColor = (action) => {
    if (!action) return "bg-gray-100 text-gray-700"
    const actionLower = action.toLowerCase()
    if (actionLower.includes("create") || actionLower.includes("add"))
      return "bg-green-100 text-green-700"
    if (actionLower.includes("update") || actionLower.includes("edit"))
      return "bg-blue-100 text-blue-700"
    if (actionLower.includes("delete") || actionLower.includes("remove"))
      return "bg-red-100 text-red-700"
    if (actionLower.includes("approve") || actionLower.includes("accept"))
      return "bg-emerald-100 text-emerald-700"
    if (actionLower.includes("reject") || actionLower.includes("deny"))
      return "bg-orange-100 text-orange-700"
    if (actionLower.includes("login")) return "bg-purple-100 text-purple-700"
    return "bg-gray-100 text-gray-700"
  }

  // Table columns
  const columns = [
    {
      accessorKey: "action",
      header: t("activityLog.action"),
      cell: ({ row }) => {
        const action = row.original.action
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(
              action
            )}`}
          >
            {formatAction(action)}
          </span>
        )
      },
      size: 180,
    },
    {
      accessorKey: "userFullname",
      header: t("activityLog.user"),
      cell: ({ row }) => {
        const { userFullname, userEmail } = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">
              {userFullname || t("activityLog.unknownUser")}
            </span>
            {userEmail && (
              <span className="text-xs text-gray-500">{userEmail}</span>
            )}
          </div>
        )
      },
      size: 220,
    },
    {
      accessorKey: "targetType",
      header: t("activityLog.targetType"),
      cell: ({ row }) => {
        const targetType = row.original.targetType
        return (
          <span className="text-sm text-gray-700">
            {targetType
              ? targetType
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              : "—"}
          </span>
        )
      },
      size: 150,
    },
    {
      accessorKey: "targetId",
      header: t("activityLog.targetId"),
      cell: ({ row }) => {
        const targetId = row.original.targetId
        return (
          <span className="text-xs font-mono text-gray-600">{targetId}</span>
        )
      },
      size: 120,
    },
    {
      accessorKey: "at",
      header: t("activityLog.time"),
      cell: ({ row }) => {
        const timestamp = row.original.at
        return (
          <span className="text-sm text-gray-600">
            {timestamp ? formatDateTime(timestamp) : "—"}
          </span>
        )
      },
      size: 180,
    },
  ]

  // Pagination data
  const pagination = {
    pageNumber: logsData?.pageNumber || 1,
    pageSize: logsData?.pageSize || pageSize,
    totalPages: logsData?.totalPages || 1,
    totalCount: logsData?.totalCount || 0,
    hasPreviousPage: logsData?.hasPreviousPage || false,
    hasNextPage: logsData?.hasNextPage || false,
  }

  return (
    <div className="space-y-1">
      {/* Header Section with Filters */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[70px] py-4">
        <div className="flex gap-5 items-center">
          <History size={20} className="text-gray-700" />
          <div>
            <p className="text-[14px] leading-[20px] font-semibold text-gray-800">
              {t("activityLog.title")}
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574] mt-0.5">
              {t("activityLog.description")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Search by Action */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("activityLog.searchAction")}
              className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[180px]"
            />
          </div>

          {/* Filter by Target Type */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              placeholder={t("activityLog.filterTargetType")}
              className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[150px]"
            />
          </div>

          {/* Filter by Target ID */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={targetIdFilter}
              onChange={(e) => setTargetIdFilter(e.target.value)}
              placeholder={t("activityLog.filterTargetId")}
              className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[200px]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <TableFluent
        data={logs}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={(page) => setPageNumber(page)}
      />
    </div>
  )
}

export default ActivityLog
