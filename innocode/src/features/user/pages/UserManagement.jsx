import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { Users, Pencil, Trash2, Lock, Unlock } from "lucide-react"
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
} from "@/services/userApi"
import Actions from "@/shared/components/Actions"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import DropdownFluent from "@/shared/components/DropdownFluent"
import { useApiError } from "@/shared/hooks/useApiError"
import UserDetailModal from "../components/UserDetailModal"

const USER_ROLES = [
  { value: "", label: "All Roles" },
  { value: "Student", label: "Student" },
  { value: "Mentor", label: "Mentor" },
  { value: "Organizer", label: "Organizer" },
  { value: "Judge", label: "Judge" },
  { value: "SchoolManager", label: "School Manager" },
  { value: "Staff", label: "Staff" },
  { value: "Admin", label: "Admin" },
]

const USER_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Locked", label: "Locked" },
  { value: "Unverified", label: "Unverified" },
]

const UserManagement = () => {
  const { t } = useTranslation(["pages", "common"])
  const { translateError } = useApiError()
  const { openModal } = useModal()
  const [pageNumber, setPageNumber] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
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
  const [deleteUser] = useDeleteUserMutation()
  const [updateUserStatus] = useUpdateUserStatusMutation()

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

  // Handle delete user
  const handleDeleteUser = (user) => {
    openModal("confirmDelete", {
      type: "user",
      item: user,
      onConfirm: async (onClose) => {
        try {
          await deleteUser({
            id: user.userId || user.id,
          }).unwrap()
          toast.success(t("userManagement.userDeletedSuccess"))
          refetch()
          onClose()
        } catch (error) {
          console.error("Error deleting user:", error)
          const errorMessage = translateError(error)
          toast.error(errorMessage)
          onClose()
        }
      },
    })
  }

  // Handle lock/unlock user
  const handleToggleLock = async (user) => {
    const newStatus = user.status === "Locked" ? "Active" : "Locked"
    try {
      await updateUserStatus({
        id: user.userId || user.id,
        status: newStatus,
      }).unwrap()
      toast.success(
        newStatus === "Locked"
          ? t("userManagement.userLockedSuccess")
          : t("userManagement.userUnlockedSuccess")
      )
      refetch()
    } catch (error) {
      console.error("Error toggling user lock:", error)
      const errorMessage = translateError(error)
      toast.error(errorMessage)
    }
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
              role
            )}`}
          >
            {role}
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
              status
            )}`}
          >
            {status}
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
        const isLocked = row.original.status === "Locked"
        return (
          <Actions
            row={row.original}
            items={[
              {
                label: t("common:buttons.edit"),
                icon: Pencil,
                onClick: () => handleEditUser(row.original),
              },
              {
                label: isLocked
                  ? t("userManagement.unlock")
                  : t("userManagement.lock"),
                icon: isLocked ? Unlock : Lock,
                className: isLocked ? "text-green-500" : "text-orange-500",
                onClick: () => handleToggleLock(row.original),
              },
              {
                label: t("common:buttons.delete"),
                icon: Trash2,
                className: "text-red-500",
                onClick: () => handleDeleteUser(row.original),
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
                onChange={setRoleFilter}
                options={USER_ROLES}
                placeholder={t("userManagement.allRoles")}
              />
            </div>

            {/* Status Filter */}
            <div className="min-w-[150px]">
              <DropdownFluent
                value={statusFilter}
                onChange={setStatusFilter}
                options={USER_STATUSES}
                placeholder={t("userManagement.allStatuses")}
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
    </PageContainer>
  )
}

export default UserManagement
