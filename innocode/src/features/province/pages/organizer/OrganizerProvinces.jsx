import React from "react"
import { BREADCRUMBS } from '@/config/breadcrumbs'
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { MapPin, Pencil, Trash2 } from "lucide-react"
import useProvinces from "../../hooks/useProvinces"
import Actions from "../../../../shared/components/Actions"
import { useModal } from "../../../../shared/hooks/useModal"

const OrganizerProvinces = () => {
  const {
    provinces,
    loading,
    error,
    addProvince,
    updateProvince,
    deleteProvince,
  } = useProvinces()
  const { openModal } = useModal()

  // ----- CRUD Modals -----
  const handleProvinceModal = (mode, province = {}) => {
    openModal("province", {
      mode,
      initialData: province,
      onSubmit: async (data) => {
        if (mode === "create") return await addProvince(data)
        if (mode === "edit")
          return await updateProvince(province.province_id, data)
      },
    })
  }

  const handleDeleteProvince = (province) => {
    openModal("confirmDelete", {
      type: "province",
      item: province,
      onConfirm: async (onClose) => {
        await deleteProvince(province.province_id)
        onClose()
      },
    })
  }

  // ----- Table Columns -----
  const provincesColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name || "—",
    },
    {
      accessorKey: "address",
      header: "Address",
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
              label: "Edit",
              icon: Pencil,
              onClick: () => handleProvinceModal("edit", row.original),
            },
            {
              label: "Delete",
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleDeleteProvince(row.original),
            },
          ]}
        />
      ),
    },
  ]

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
              <p className="text-[14px] leading-[20px]">Provinces Management</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Create and manage provinces
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() => handleProvinceModal("create")}
          >
            New Province
          </button>
        </div>

        <TableFluent
          data={provinces}
          columns={provincesColumns}
          title="Provinces"
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerProvinces
