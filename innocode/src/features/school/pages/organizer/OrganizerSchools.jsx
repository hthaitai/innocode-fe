import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { BREADCRUMBS } from '@/config/breadcrumbs'
import PageContainer from "@/shared/components/PageContainer"
import { School, Pencil, Trash2 } from "lucide-react"
import TableFluent from "@/shared/components/TableFluent"
import useSchools from "../../hooks/useSchools"
import Actions from "../../../../shared/components/Actions"
import useProvinces from "../../../province/hooks/useProvinces"
import { useModal } from "../../../../shared/hooks/useModal"

const OrganizerSchools = () => {
  const { t } = useTranslation("pages")
  const { schools, loading, error, addSchool, updateSchool, deleteSchool } =
    useSchools()
  const { provinces } = useProvinces()
  const { openModal } = useModal()

  // ----- CRUD Modals -----
  const handleSchoolModal = (mode, school = {}) => {
    openModal("school", {
      mode,
      initialData: school,
      provinces: provinces,
      onSubmit: async (data) => {
        if (mode === "create") return await addSchool(data)
        if (mode === "edit") return await updateSchool(school.school_id, data)
      },
    })
  }

  const handleDeleteSchool = (school) => {
    openModal("confirmDelete", {
      type: "school",
      item: school,
      onConfirm: async (onClose) => {
        await deleteSchool(school.school_id)
        onClose()
      },
    })
  }

  // ----- Table Columns -----
  const schoolsColumns = [
    {
      accessorKey: "name",
      header: t("schools.schoolName"),
      cell: ({ row }) => row.original.name || "—",
    },
    {
      accessorKey: "province_id",
      header: t("schools.province"),
      cell: ({ row }) => {
        const province = provinces.find(
          (p) => p.province_id === row.original.province_id
        )
        return province ? province.name : "—"
      },
    },
    {
      accessorKey: "contact",
      header: t("schools.contact"),
      cell: ({ row }) => row.original.contact || "—",
    },
    {
      accessorKey: "created_at",
      header: t("schools.createdAt"),
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleDateString("en-GB"),
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
              label: t("schools.edit"),
              icon: Pencil,
              onClick: () => handleSchoolModal("edit", row.original),
            },
            {
              label: t("schools.delete"),
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleDeleteSchool(row.original),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.SCHOOLS}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Header section */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <School size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">{t("schools.schoolsManagement")}</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                {t("schools.createAndManageSchools")}
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() => handleSchoolModal("create")}
          >
            {t("schools.newSchool")}
          </button>
        </div>

        <TableFluent data={schools} columns={schoolsColumns} title={t("schools.schools")} />
      </div>
    </PageContainer>
  )
}

export default OrganizerSchools
