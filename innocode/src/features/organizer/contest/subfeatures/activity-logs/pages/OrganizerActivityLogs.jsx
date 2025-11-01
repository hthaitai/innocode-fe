import React from "react"
import PageContainer from "@/shared/components/PageContainer"
import { useOrganizerBreadcrumb } from "@/features/organizer/hooks/useOrganizerBreadcrumb"
import { ListChecks } from "lucide-react"
import TableFluent from "../../../../../../shared/components/TableFluent"

const OrganizerActivityLogs = () => {
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_ACTIVITY")
  const { logs, loading, error } = useFetchActivityLogs()

  const logsColumns = [
    { accessorKey: "at", header: "Timestamp" },
    { accessorKey: "user_name", header: "User" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "action", header: "Action" },
    { accessorKey: "target_type", header: "Target Type" },
    { accessorKey: "target_id", header: "Target ID" },
  ]

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <ListChecks size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Activity Logs</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                View all recorded actions across contests
              </p>
            </div>
          </div>
        </div>

        {/* Activity Log Table */}
        <TableFluent
          data={logs}
          columns={logsColumns}
          title="Activity Logs"
          // Read-only — no onRowClick, no CRUD
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerActivityLogs
