import React, { useEffect } from "react";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import PageContainer from "@/shared/components/PageContainer";
import TableFluent from "@/shared/components/TableFluent";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import Actions from "../../../../shared/components/Actions";
import { useModal } from "../../../../shared/hooks/useModal";
import {
  useAddProvinceMutation,
  useDeleteProvinceMutation,
  useGetAllProvincesQuery,
  useUpdateProvinceMutation,
} from "../../../../services/provinceApi";

const StaffProvinces = () => {
  const { openModal } = useModal();

  // ----- Fetch Data -----
  const {
    data: provincesData,
    isLoading: loading,
    error,
  } = useGetAllProvincesQuery({ pageNumber: 1, pageSize: 100 });

  // ----- Mutations -----
  const [addProvince] = useAddProvinceMutation();
  const [updateProvince] = useUpdateProvinceMutation();
  const [deleteProvince] = useDeleteProvinceMutation();

  // ----- CRUD Modals -----
  const handleProvinceModal = (mode, province = {}) => {
    console.log("🔍 handleProvinceModal - mode:", mode);
    console.log("🔍 handleProvinceModal - province:", province);
    openModal("province", {
      mode,
      initialData: province,
      onSubmit: async (data) => {
        try {
          if (mode === "create") {
            await addProvince(data).unwrap();
          } else if (mode === "edit") {
            await updateProvince({
              id: province.provinceId || province.province_id,
              data,
            }).unwrap();
          }
        } catch (err) {
          console.error("Error saving province:", err);
          throw err; // Re-throw để modal có thể xử lý error
        }
      },
    });
  };

  const handleDeleteProvince = (province) => {
    console.log("🔍 handleDeleteProvince - province:", province);
    openModal("confirmDelete", {
      type: "province",
      item: province,
      onConfirm: async (onClose) => {
        try {
          await deleteProvince({
            id: province.provinceId || province.province_id,
          }).unwrap();
          onClose();
        } catch (err) {
          console.error("Error deleting province:", err);
          // Error sẽ được xử lý bởi modal hoặc toast
        }
      },
    });
  };

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
  ];

  // Extract items from response
  // Response structure: { data: Array, additionalData: {...}, message: string, ... }
  const provinces = provincesData?.data || [];

  // Log provinces for debugging
  useEffect(() => {
    console.log("🔍 provincesData (raw):", provincesData);
    console.log("🔍 provinces (extracted):", provinces);
    console.log("🔍 provinces count:", provinces.length);
    if (provinces.length > 0) {
      console.log("🔍 First province:", provinces[0]);
    }
  }, [provincesData, provinces]);

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
  );
};

export default StaffProvinces;
