import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { Users, Eye, UserCheck, UserX, EyeIcon } from "lucide-react"
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
  useRegisterStaffMutation,
} from "@/services/userApi"
import { useAuth } from "@/context/AuthContext"
import Actions from "@/shared/components/Actions"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import DropdownFluent from "@/shared/components/DropdownFluent"
import { useApiError } from "@/shared/hooks/useApiError"
import UserDetailModal from "../components/UserDetailModal"
import StaffRegistrationModal from "../components/StaffRegistrationModal"
import { Plus } from "lucide-react"

const USER_ROLES = [
  { value: "", labelKey: "userManagement.allRoles" },
  { value: "Student", labelKey: "common:roles.student" },
  { value: "Mentor", labelKey: "common:roles.mentor" },
  { value: "Organizer", labelKey: "common:roles.organizer" },
  { value: "Judge", labelKey: "common:roles.judge" },
  { value: "SchoolManager", labelKey: "common:roles.schoolmanager" },
  { value: "Staff", labelKey: "common:roles.staff" },
  { value: "Admin", labelKey: "common:roles.admin" },
]

const USER_STATUSES = [
  { value: "", labelKey: "userManagement.allStatuses" },
  { value: "Active", labelKey: "common:userStatuses.active" },
  { value: "Inactive", labelKey: "common:userStatuses.inactive" },
  { value: "Unverified", labelKey: "common:userStatuses.unverified" },
]

const UserManagement = () => {
  const { t } = useTranslation(["pages", "common"])
  const { translateError } = useApiError()
  const { openModal } = useModal()
  const { user: currentUser } = useAuth() // Lấy thông tin user hiện tại
  const [pageNumber, setPageNumber] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const pageSize = 10
  // Fetch users data
  const {
    data: usersResponse,
    isLoading: loading,
    error,
    refetch,
  } = useGetAllUsersQuery({
    page: pageNumber,
    pageSize,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    search: searchTerm || undefined, // Use 'search' instead of 'fullName'
  })

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPageNumber(1)
  }, [searchTerm, roleFilter, statusFilter])

  // Mutations
  const [updateUser] = useUpdateUserMutation()
  const [toggleUserStatus] = useToggleUserStatusMutation()
  const [registerStaff, { isLoading: isRegisteringStaff }] =
    useRegisterStaffMutation()

  const users = usersResponse?.items || []

  // Handle view user detail
  const handleViewUserDetail = (user) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }

  // Handle edit user modal
  const handleEditUser = (user) => {
    openModal("user", {
      mode: "edit",
      initialData: user,
      onSubmit: async (data) => {
        try {
          await updateUser({
            id: user.userId || user.id,
            data,
          }).unwrap()
          toast.success(t("userManagement.userUpdatedSuccess"))
          refetch()
        } catch (error) {
          console.error("Error updating user:", error)
          const errorMessage = translateError(error)
          toast.error(errorMessage)
          throw error
        }
      },
    })
  }

  // Handle create staff
  const handleCreateStaff = async (data) => {
    try {
      await registerStaff(data).unwrap()
      toast.success(t("userManagement.staffCreatedSuccess"))
      setIsStaffModalOpen(false)
      refetch()
    } catch (error) {
      console.error("Error creating staff:", error)
      const errorMessage = translateError(error)
      toast.error(errorMessage)
      throw error
    }
  }

  // Handle toggle user status (Active/Inactive)
  const handleToggleStatus = async (user) => {
    // Kiểm tra nếu user đang cố toggle status của chính mình
    const userId = user.userId || user.id
    const currentUserId = currentUser?.userId || currentUser?.id

    if (userId === currentUserId) {
      toast.error(t("userManagement.cannotToggleOwnStatus"))
      return
    }

    const currentStatus = user.status
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active"

    openModal("confirm", {
      title: t("userManagement.toggleStatusTitle"),
      description: t("userManagement.toggleStatusConfirm", {
        name: user.fullname || user.fullName,
        currentStatus,
        newStatus,
      }),
      onConfirm: async () => {
        try {
          await toggleUserStatus(userId).unwrap()
          toast.success(
            newStatus === "Inactive"
              ? t("userManagement.userDeactivatedSuccess")
              : t("userManagement.userActivatedSuccess"),
          )
          refetch()
        } catch (error) {
          console.error("Error toggling user status:", error)
          const errorMessage = translateError(error)
          toast.error(errorMessage)
        }
      },
    })
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700"
      case "Inactive":
        return "bg-gray-100 text-gray-700"
      case "Locked":
        return "bg-red-100 text-red-700"
      case "Unverified":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700"
      case "Staff":
        return "bg-blue-100 text-blue-700"
      case "Organizer":
        return "bg-indigo-100 text-indigo-700"
      case "Judge":
        return "bg-cyan-100 text-cyan-700"
      case "SchoolManager":
        return "bg-teal-100 text-teal-700"
      case "Mentor":
        return "bg-orange-100 text-orange-700"
      case "Student":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Table Columns
  const columns = [
    {
      accessorKey: "fullname",
      header: t("userManagement.fullName"),
      cell: ({ row }) => {
        const fullname = row.original.fullname || row.original.fullName || "—"
        return <span className="font-medium text-gray-800">{fullname}</span>
      },
      size: 200,
    },
    {
      accessorKey: "email",
      header: t("userManagement.email"),
      cell: ({ row }) => {
        const email = row.original.email || "—"
        return <span className="text-gray-700 text-sm">{email}</span>
      },
      size: 250,
    },
    {
      accessorKey: "role",
      header: t("userManagement.role"),
      cell: ({ row }) => {
        const role = row.original.role
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
              role,
            )}`}
          >
            {role ? t(`common:roles.${role.toLowerCase()}`) : "—"}
          </span>
        )
      },
      size: 150,
    },
    {
      accessorKey: "status",
      header: t("userManagement.status"),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
              status,
            )}`}
          >
            {status ? t(`common:userStatuses.${status.toLowerCase()}`) : "—"}
          </span>
        )
      },
      size: 120,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const userId = row.original.userId || row.original.id
        const currentUserId = currentUser?.userId || currentUser?.id
        const isCurrentUser = userId === currentUserId
        const isActive = row.original.status === "Active"

        return (
          <Actions
            row={row.original}
            items={[
              {
                label: isActive
                  ? t("userManagement.deactivate")
                  : t("userManagement.activate"),
                icon: isActive ? UserX : UserCheck,
                className: isActive ? "text-red-500" : "text-green-500",
                onClick: () => handleToggleStatus(row.original),
                disabled: isCurrentUser,
                tooltip: isCurrentUser
                  ? t("userManagement.cannotToggleOwnStatus")
                  : undefined,
              },
            ]}
          />
        )
      },
      size: 80,
    },
  ]

  // Pagination data - use API totalCount, not filtered length
  const pagination = {
    pageNumber: usersResponse?.pageNumber || pageNumber,
    pageSize: usersResponse?.pageSize || pageSize,
    totalPages: usersResponse?.totalPages || 1,
    totalCount: usersResponse?.totalCount || 0,
    hasPreviousPage: usersResponse?.hasPreviousPage || false,
    hasNextPage: usersResponse?.hasNextPage || false,
  }

  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.USER_MANAGEMENT}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Header Section with Filters */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[70px] py-4">
          <div className="flex gap-5 items-center">
            <Users size={20} className="text-gray-700" />
            <div>
              <p className="text-[14px] leading-[20px] font-semibold text-gray-800">
                {t("userManagement.title")}
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574] mt-0.5">
                {t("userManagement.description")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Create Staff Button - Only for Admin */}
            {currentUser?.role?.toLowerCase() === "admin" && (
              <button
                onClick={() => setIsStaffModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-[5px] text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                <Plus size={16} />
                {t("userManagement.createStaff")}
              </button>
            )}

            {/* Search Input */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("userManagement.searchUsers")}
                className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[200px]"
              />
            </div>

            {/* Role Filter */}
            <div className="min-w-[150px]">
              <DropdownFluent
                value={roleFilter}
                onChange={(val) => {
                  setRoleFilter(val)
                  setPageNumber(1)
                }}
                options={USER_ROLES.map((r) => ({
                  value: r.value,
                  label: t(r.labelKey),
                }))}
                placeholder={t("userManagement.allRoles")}
                className="min-w-[150px]"
              />
            </div>

            {/* Status Filter */}
            <div className="min-w-[150px]">
              <DropdownFluent
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val)
                  setPageNumber(1)
                }}
                options={USER_STATUSES.map((s) => ({
                  value: s.value,
                  label: t(s.labelKey),
                }))}
                placeholder={t("userManagement.allStatuses")}
                className="min-w-[150px]"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <TableFluent
          data={users}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPageNumber(page)}
          onRowClick={handleViewUserDetail}
        />
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedUser(null)
        }}
      />
      {/* Staff Registration Modal */}
      <StaffRegistrationModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onSubmit={handleCreateStaff}
        loading={isRegisteringStaff}
      />
    </PageContainer>
  )
}

export default UserManagement
