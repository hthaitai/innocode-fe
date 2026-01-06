import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { School, Pencil, Trash2 } from "lucide-react"
import {
  useGetAllSchoolsQuery,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
} from "@/services/schoolApi"
import Actions from "@/shared/components/Actions"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import DropdownFluent from "@/shared/components/DropdownFluent"
import { useGetAllProvincesQuery } from "@/services/provinceApi"
import { useApiError } from "@/shared/hooks/useApiError"

const StaffSchoolsManagement = () => {
  const { t } = useTranslation(["pages", "common"])
  const { translateError } = useApiError()
  const { openModal } = useModal()
  const [pageNumber, setPageNumber] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [provinceFilter, setProvinceFilter] = useState("")
  const pageSize = 10

  // Fetch schools data
  const {
    data: schoolsResponse,
    isLoading: loading,
    error,
    refetch,
  } = useGetAllSchoolsQuery({
    pageNumber,
    pageSize,
  })

  // Fetch provinces for filter
  const { data: provincesData } = useGetAllProvincesQuery()

  // Mutations
  const [updateSchool] = useUpdateSchoolMutation()
  const [deleteSchool] = useDeleteSchoolMutation()

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1)
  }, [searchTerm, provinceFilter])

  // Extract data from response
  const schools = schoolsResponse?.data || []
  const provinces = provincesData?.data || []

  // Filter schools based on search and province
  const filteredSchools = schools.filter((school) => {
    const matchesSearch = searchTerm
      ? (school.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.contact || "").toLowerCase().includes(searchTerm.toLowerCase())
      : true

    const matchesProvince = provinceFilter
      ? (school.provinceId || school.province_id) === provinceFilter
      : true

    return matchesSearch && matchesProvince
  })

  // Handle edit school modal
  const handleSchoolModal = (mode, school = {}) => {
    openModal("school", {
      mode,
      initialData: school,
      provinces: provinces,
      onSubmit: async (data) => {
        try {
          await updateSchool({
            id: school.schoolId || school.school_id,
            data,
          }).unwrap()
          toast.success(t("schools.schoolUpdatedSuccess"))
          refetch()
        } catch (error) {
          console.error("Error saving school:", error)
          toast.error(t("schools.schoolUpdatedError"))
          throw error
        }
      },
    })
  }

  // Handle delete school
  const handleDeleteSchool = (school) => {
    openModal("confirmDelete", {
      type: "school",
      item: school,
      onConfirm: async (onClose) => {
        try {
          await deleteSchool({
            id: school.schoolId || school.school_id,
          }).unwrap()
          toast.success(t("schools.schoolDeletedSuccess"))
          refetch()
          onClose()
        } catch (error) {
          console.error("Error deleting school:", error)

          // Use translateError helper to get the appropriate error message
          const errorMessage = translateError(error)
          toast.error(errorMessage)

          // Always close modal after showing error
          onClose()
        }
      },
    })
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "—"
    try {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch (error) {
      return "—"
    }
  }

  // Get province name by ID
  const getProvinceName = (provinceId) => {
    const province = provinces.find(
      (p) => (p.provinceId || p.province_id) === provinceId
    )
    return province ? province.provinceName || province.name : "—"
  }

  // Table Columns
  const columns = [
    {
      accessorKey: "name",
      header: t("schools.schoolName"),
      cell: ({ row }) => {
        const name = row.original.name || row.original.Name || "—"
        return <span className="font-medium text-gray-800">{name}</span>
      },
      size: 250,
    },
    {
      accessorKey: "provinceId",
      header: t("schools.province"),
      cell: ({ row }) => {
        const provinceId = row.original.provinceId || row.original.province_id
        return (
          <span className="text-gray-700">{getProvinceName(provinceId)}</span>
        )
      },
      size: 180,
    },
    {
      accessorKey: "address",
      header: t("schools.address"),
      cell: ({ row }) => {
        const address = row.original.address || row.original.Address || "—"
        return <span className="text-gray-700 text-sm">{address}</span>
      },
      size: 200,
    },
    {
      accessorKey: "contact",
      header: t("schools.contact"),
      cell: ({ row }) => {
        const contact = row.original.contact || row.original.Contact || "—"
        return <span className="text-gray-700 text-sm">{contact}</span>
      },
      size: 180,
    },
    {
      accessorKey: "createdAt",
      header: t("schools.createdAt"),
      cell: ({ row }) => {
        const date =
          row.original.createdAt ||
          row.original.CreatedAt ||
          row.original.created_at ||
          "—"
        return <span className="text-gray-600 text-sm">{formatDate(date)}</span>
      },
      size: 130,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <Actions
          row={row.original}
          items={[
            {
              label: t("common:buttons.edit"),
              icon: Pencil,
              onClick: () => handleSchoolModal("edit", row.original),
            },
            {
              label: t("common:buttons.delete"),
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleDeleteSchool(row.original),
            },
          ]}
        />
      ),
      size: 80,
    },
  ]

  // Pagination data
  const paginationData = schoolsResponse?.additionalData || {}
  const pagination = {
    pageNumber: pageNumber,
    pageSize: pageSize,
    totalPages: paginationData.totalPages || 1,
    totalCount: filteredSchools.length,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < (paginationData.totalPages || 1),
  }

  // Province filter options
  const provinceOptions = [
    { value: "", label: t("schools.allProvinces") },
    ...provinces.map((p) => ({
      value: p.provinceId || p.province_id,
      label: p.provinceName || p.name,
    })),
  ]

  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.SCHOOLS}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Header Section with Filters */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[70px] py-4">
          <div className="flex gap-5 items-center">
            <School size={20} className="text-gray-700" />
            <div>
              <p className="text-[14px] leading-[20px] font-semibold text-gray-800">
                {t("schools.schoolsManagement")}
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574] mt-0.5">
                {t("schools.manageAllSchools")}
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
                placeholder={t("schools.searchSchools")}
                className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[200px]"
              />
            </div>

            {/* Province Filter */}
            <div className="min-w-[180px]">
              <DropdownFluent
                value={provinceFilter}
                onChange={setProvinceFilter}
                options={provinceOptions}
                placeholder={t("schools.allProvinces")}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <TableFluent
          data={filteredSchools}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPageNumber(page)}
        />
      </div>
    </PageContainer>
  )
}

export default StaffSchoolsManagement
