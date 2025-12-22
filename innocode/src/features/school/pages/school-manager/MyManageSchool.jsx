import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs";
import { useGetMyManageSchoolQuery } from "@/services/schoolApi";
import TableFluent from "@/shared/components/TableFluent";
import { School } from "lucide-react";

const MyManageSchool = () => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  const { data: schoolsData, isLoading: loading, error } =
    useGetMyManageSchoolQuery({
      Page: pageNumber,
      PageSize: pageSize,
    });

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "—";
    }
  };

  // Table Columns
  const columns = [
    {
      accessorKey: "name",
      header: "School Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name || "—"}</span>
      ),
      size: 200,
    },
    {
      accessorKey: "provinceName",
      header: "Province",
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.provinceName || "—"}</span>
      ),
      size: 150,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.contact || "—"}</span>
      ),
      size: 150,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.address || "—"}</span>
      ),
      size: 200,
    },
    {
      accessorKey: "managerUsername",
      header: "Manager",
      cell: ({ row }) => (
        <span className="text-gray-700">
          {row.original.managerUsername || "—"}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">
          {formatDate(row.original.createdAt)}
        </span>
      ),
      size: 130,
    },
  ];

  // Extract data from response
  const schools = schoolsData?.schools || [];
  const paginationData = schoolsData?.pagination || {};
  const pagination = {
    pageNumber: pageNumber,
    pageSize: pageSize,
    totalPages: paginationData.totalPages || 1,
    totalCount: paginationData.totalCount || 0,
    hasPreviousPage: paginationData.hasPreviousPage || false,
    hasNextPage: paginationData.hasNextPage || false,
  };

  // Handle row click - navigate to school detail
  const handleRowClick = (school) => {
    const schoolId = school.schoolId || school.id;
    if (schoolId) {
      navigate(`/schools/${schoolId}`);
    }
  };

  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.SCHOOL_MANAGEMENT}
      breadcrumbPaths={BREADCRUMB_PATHS.SCHOOL_MANAGEMENT}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Header Section */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <School size={20} className="text-gray-700" />
            <div>
              <p className="text-[14px] leading-[20px] font-semibold text-gray-800">
                My Managed Schools
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574] mt-0.5">
                View and manage schools you are managing
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <TableFluent
          data={schools}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPageNumber(page)}
          onRowClick={handleRowClick}
        />
      </div>
    </PageContainer>
  );
};

export default MyManageSchool;
