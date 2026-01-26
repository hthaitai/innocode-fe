import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import TablePagination from "@/shared/components/TablePagination"
import { MapPin, Pencil, Trash2 } from "lucide-react"
import Actions from "../../../../shared/components/Actions"
import { useModal } from "../../../../shared/hooks/useModal"
import {
  useAddProvinceMutation,
  useDeleteProvinceMutation,
  useGetAllProvincesQuery,
  useUpdateProvinceMutation,
} from "../../../../services/provinceApi"

const StaffProvinces = () => {
  const { t } = useTranslation("pages")
  const { openModal } = useModal()

  // ----- State -----
  const [page, setPage] = useState(1)
  const pageSize = 10

  // ----- Fetch Data -----
  const {
    data: provincesData,
    isLoading: loading,
    error,
  } = useGetAllProvincesQuery({ pageNumber: page, pageSize })

  // ----- Mutations -----
  const [addProvince] = useAddProvinceMutation()
  const [updateProvince] = useUpdateProvinceMutation()
  const [deleteProvince] = useDeleteProvinceMutation()

  // ----- CRUD Modals -----
  const handleProvinceModal = (mode, province = {}) => {
    openModal("province", {
      mode,
      initialData: province,
      onSubmit: async (data) => {
        try {
          if (mode === "create") {
            await addProvince(data).unwrap()
          } else if (mode === "edit") {
            await updateProvince({
              id: province.provinceId || province.province_id,
              data,
            }).unwrap()
          }
        } catch (err) {
          console.error("Error saving province:", err)
          throw err
        }
      },
    })
  }

  const handleDeleteProvince = (province) => {
    openModal("confirmDelete", {
      type: "province",
      item: province,
      onConfirm: async (onClose) => {
        try {
          await deleteProvince({
            id: province.provinceId || province.province_id,
          }).unwrap()
          onClose()
        } catch (err) {
          console.error("Error deleting province:", err)
        }
      },
    })
  }

  // ----- Table Columns -----
  const provincesColumns = [
    {
      accessorKey: "name",
      header: t("provinces.name"),
      cell: ({ row }) => row.original.name || "—",
    },
    {
      accessorKey: "address",
      header: t("provinces.address"),
      cell: ({ row }) => row.original.address || "—",
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
              label: t("provinces.edit"),
              icon: Pencil,
              onClick: () => handleProvinceModal("edit", row.original),
            },
            {
              label: t("provinces.delete"),
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleDeleteProvince(row.original),
            },
          ]}
        />
      ),
    },
  ]

  // Extract items and pagination from response
  const provinces = provincesData?.data ?? []
  const pagination = provincesData?.additionalData ?? {
    pageNumber: 1,
    pageSize: pageSize,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  }

  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.PROVINCES}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Add contest */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <MapPin size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">
                {t("provinces.provincesManagement")}
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                {t("provinces.createAndManageProvinces")}
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() => handleProvinceModal("create")}
          >
            {t("provinces.newProvince")}
          </button>
        </div>

        <TableFluent
          data={provinces}
          columns={provincesColumns}
          title={t("provinces.provinces")}
        />

        <TablePagination pagination={pagination} onPageChange={setPage} />
      </div>
    </PageContainer>
  )
}

export default StaffProvinces
