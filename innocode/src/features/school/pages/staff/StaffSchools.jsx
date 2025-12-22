import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import PageContainer from "@/shared/components/PageContainer";
import TableFluent from "@/shared/components/TableFluent";
import { School } from "lucide-react";
import { useGetAllSchoolCreationRequestsQuery } from "@/services/schoolApi";
import StatusBadge from "@/shared/components/StatusBadge";
import DropdownFluent from "@/shared/components/DropdownFluent";

const StaffSchools = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Fetch data
  const {
    data: requestsData,
    isLoading: loading,
    error,
    refetch,
  } = useGetAllSchoolCreationRequestsQuery({
    Status: statusFilter || undefined,
    Search: searchTerm || undefined,
    Page: pageNumber,
    PageSize: pageSize,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
    refetch();
  }, [statusFilter, searchTerm, refetch]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

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
      cell: ({ row }) => {
        const name = row.original.name || row.original.Name || "—";
        return <span className="font-medium">{name}</span>;
      },
      size: 200,
    },
    {
      accessorKey: "provinceName",
      header: "Province",
      cell: ({ row }) => {
        const province = row.original.provinceName || row.original.ProvinceName || "—";
        return <span className="text-gray-700">{province}</span>;
      },
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status || row.original.Status} />
      ),
      size: 120,
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => {
        const date =
          row.original.createdAt ||
          row.original.CreatedAt ||
          row.original.created_at ||
          "—";
        return (
          <span className="text-gray-700 text-sm">{formatDate(date)}</span>
        );
      },
      size: 130,
    },
  ];

  // Extract data from response
  const requests = requestsData?.requests || [];
  const paginationData = requestsData?.pagination || {};
  const pagination = {
    pageNumber: pageNumber,
    pageSize: pageSize,
    totalPages: paginationData.totalPages || 1,
    totalCount: paginationData.totalCount || 0,
    hasPreviousPage: paginationData.hasPreviousPage || false,
    hasNextPage: paginationData.hasNextPage || false,
  };

  // Handle row click
  const handleRowClick = (request) => {
    const requestId = request.requestId || request.id;
    navigate(`/school-staff/${requestId}`);
  };

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
                School Creation Requests Management
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574] mt-0.5">
                Review and manage school creation requests
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search Input */}
            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600 font-medium">
                Search:
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchTerm);
                  }
                }}
                placeholder="Search by name, address, contact..."
                className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[250px]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600 font-medium">
                Status:
              </label>
              <div className="min-w-[150px]">
                <DropdownFluent
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: "", label: "All Status" },
                    { value: "Pending", label: "Pending" },
                    { value: "Approved", label: "Approved" },
                    { value: "Denied", label: "Denied" },
                  ]}
                  placeholder="All Status"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <TableFluent
          data={requests}
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

export default StaffSchools;
