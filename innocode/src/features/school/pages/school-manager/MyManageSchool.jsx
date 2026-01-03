import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs";
import { useGetMyManageSchoolQuery } from "@/services/schoolApi";
import TableFluent from "@/shared/components/TableFluent";
import { School } from "lucide-react";

const MyManageSchool = () => {
  const { t } = useTranslation("pages");
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
      header: t("schools.schoolName"),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name || "—"}</span>
      ),
      size: 200,
    },
    {
      accessorKey: "provinceName",
      header: t("schools.province"),
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.provinceName || "—"}</span>
      ),
      size: 150,
    },
    {
      accessorKey: "contact",
      header: t("schools.contact"),
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.contact || "—"}</span>
      ),
      size: 150,
    },
    {
      accessorKey: "address",
      header: t("schools.address"),
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.address || "—"}</span>
      ),
      size: 200,
    },
    {
      accessorKey: "managerUsername",
      header: t("schools.manager"),
      cell: ({ row }) => (
        <span className="text-gray-700">
          {row.original.managerUsername || "—"}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "createdAt",
      header: t("schools.createdDate"),
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
                {t("schools.myManagedSchools")}
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574] mt-0.5">
                {t("schools.viewAndManageSchools")}
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
