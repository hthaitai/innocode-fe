import React, { useEffect } from "react";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import PageContainer from "@/shared/components/PageContainer";
import { School, Pencil, Trash2 } from "lucide-react";
import TableFluent from "@/shared/components/TableFluent";
import Actions from "../../../../shared/components/Actions";
import useProvinces from "../../../province/hooks/useProvinces";
import { useModal } from "../../../../shared/hooks/useModal";
import {
  useAddSchoolMutation,
  useDeleteSchoolMutation,
  useGetAllSchoolsQuery,
  useUpdateSchoolMutation,
} from "../../../../services/schoolApi";
import { useGetAllProvincesQuery } from "../../../../services/provinceApi";

const StaffSchools = () => {
  const { openModal } = useModal();

  // ----- Fetch Data -----
  const {
    data: schoolsData,
    isLoading: loading,
    error,
  } = useGetAllSchoolsQuery({ pageNumber: 1, pageSize: 100 });

  // ----- Mutations -----
  const [addSchool] = useAddSchoolMutation();
  const [updateSchool] = useUpdateSchoolMutation();
  const [deleteSchool] = useDeleteSchoolMutation();

  const { data: provincesData } = useGetAllProvincesQuery();

  // ----- CRUD Modals -----
  const handleSchoolModal = (mode, school = {}) => {
    openModal("school", {
      mode,
      initialData: school,
      provinces: provincesData?.data || [],
      onSubmit: async (data) => {
        try {
          if (mode === "create") {
            await addSchool(data).unwrap();
          } else if (mode === "edit") {
            await updateSchool({
              id: school.schoolId || school.school_id,
              data,
            }).unwrap();
          }
        } catch (err) {
          console.error("Error saving school:", err);
          throw err; // Re-throw để modal có thể xử lý error
        }
      },
    });
  };

  const handleDeleteSchool = (school) => {
    openModal("confirmDelete", {
      type: "school",
      item: school,
      onConfirm: async (onClose) => {
        try {
          await deleteSchool({
            id: school.schoolId || school.school_id,
          }).unwrap();
          onClose();
        } catch (err) {
          console.error("Error deleting school:", err);
          // Error sẽ được xử lý bởi modal hoặc toast
        }
      },
    });
  };

  // ----- Table Columns -----
  const schoolsColumns = [
    {
      accessorKey: "name",
      header: "School Name",
      cell: ({ row }) => row.original.name || "—",
    },
    {
      accessorKey: "provinceName",
      header: "Province",
      cell: ({ row }) => row.original.provinceName || "—",
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => row.original.contact || "—",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-GB"),
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
              onClick: () => handleSchoolModal("edit", row.original),
            },
            {
              label: "Delete",
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleDeleteSchool(row.original),
            },
          ]}
        />
      ),
    },
  ];

  // Extract items from response
  // Response structure: { data: Array, additionalData: {...}, message: string, ... }
  const schools = schoolsData?.data || [];

  // Log schools for debugging
  useEffect(() => {
    console.log("🔍 schoolsData (raw):", schoolsData);
    console.log("🔍 schools (extracted):", schools);
    console.log("🔍 schools count:", schools.length);
    if (schools.length > 0) {
      console.log("🔍 First school:", schools[0]);
    }
  }, [schoolsData, schools]);

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
              <p className="text-[14px] leading-[20px]">Schools Management</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Create and manage schools
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() => handleSchoolModal("create")}
          >
            New School
          </button>
        </div>

        <TableFluent data={schools} columns={schoolsColumns} title="Schools" />
      </div>
    </PageContainer>
  );
};

export default StaffSchools;
