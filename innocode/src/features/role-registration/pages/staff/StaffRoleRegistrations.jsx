import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import PageContainer from "@/shared/components/PageContainer";
import TableFluent from "@/shared/components/TableFluent";
import { UserCheck } from "lucide-react";
import { useGetAllRoleRegistrationsQuery } from "@/services/roleRegistrationApi";

const StaffRoleRegistrations = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState(""); // "pending", "approved", "denied"
  const [requestedRoleFilter, setRequestedRoleFilter] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [desc, setDesc] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // ----- Fetch Data -----
  const {
    data: registrationsData,
    isLoading: loading,
    error,
    refetch,
  } = useGetAllRoleRegistrationsQuery({
    pageNumber,
    pageSize,
    ...(statusFilter && { status: statusFilter }),
    ...(requestedRoleFilter && { requestedRole: requestedRoleFilter }),
    ...(emailSearch && { emailContains: emailSearch }),
    ...(sortBy && { sortBy }),
    ...(sortBy && { desc }),
  });

  // ----- Handlers -----
  const handleRowClick = (registration) => {
    const registrationId = registration.registrationId || registration.id;
    navigate(`/role-registrations-staff/${registrationId}`);
  };

  // ----- Status Badge Component -----
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        className: "bg-yellow-50 text-yellow-700 border-yellow-300",
      },
      approved: {
        label: "Approved",
        className: "bg-green-50 text-green-700 border-green-300",
      },
      denied: {
        label: "Denied",
        className: "bg-red-50 text-red-700 border-red-300",
      },
    };

    const normalizedStatus = status?.toLowerCase() || "pending";
    const config = statusConfig[normalizedStatus] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}
      >
        {config.label}
      </span>
    );
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

  // Helper function to format role name
  const formatRoleName = (role) => {
    if (!role) return "—";
    // Handle different role formats
    const roleMap = {
      judge: "Judge",
      organizer: "Organizer",
      "school manager": "School Manager",
      staff: "Staff",
    };
    const lowerRole = role.toLowerCase();
    return roleMap[lowerRole] || role.replace(/([A-Z])/g, " $1").trim();
  };

  // ----- Table Columns -----
  const registrationsColumns = [
    {
      accessorKey: "fullname",
      header: "Full Name",
      cell: ({ row }) => {
        const name =
          row.original.fullname ||
          row.original.fullName ||
          row.original.FullName ||
          "—";
        return <span className="font-medium">{name}</span>;
      },
      size: 150,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.original.email || row.original.Email || "—";
        return <span className="text-gray-700">{email}</span>;
      },
      size: 200,
    },
    {
      accessorKey: "requestedRole",
      header: "Requested Role",
      cell: ({ row }) => {
        const role =
          row.original.requestedRole || row.original.RequestedRole || "—";
        return (
          <span className="capitalize font-medium text-gray-800">
            {formatRoleName(role)}
          </span>
        );
      },
      size: 150,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.original.phone || row.original.Phone || "—";
        return <span className="text-gray-700">{phone}</span>;
      },
      size: 120,
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
      header: "Submitted Date",
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

  // Extract items and pagination from response
  const registrations = registrationsData?.data || [];
  const paginationData = registrationsData?.additionalData || registrationsData?.pagination || {};
  const pagination = {
    pageNumber: pageNumber,
    pageSize: pageSize,
    totalPages: paginationData.totalPages || 1,
    totalCount: paginationData.totalCount || 0,
    hasPreviousPage: paginationData.hasPreviousPage || false,
    hasNextPage: paginationData.hasNextPage || false,
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPageNumber(1);
  }, [statusFilter, requestedRoleFilter, emailSearch, sortBy, desc]);

  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.ROLE_REGISTRATIONS}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[70px] py-4">
          <div className="flex gap-5 items-center">
            <UserCheck size={20} className="text-gray-700" />
            <div>
              <p className="text-[14px] leading-[20px] font-semibold text-gray-800">
                Role Registrations Management
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574] mt-0.5">
                Review and manage role registration requests
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600 font-medium">
                Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer min-w-[150px]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600 font-medium">
                Role:
              </label>
              <select
                value={requestedRoleFilter}
                onChange={(e) => setRequestedRoleFilter(e.target.value)}
                className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer min-w-[150px]"
              >
                <option value="">All Roles</option>
                <option value="judge">Judge</option>
                <option value="organizer">Organizer</option>
                <option value="school manager">School Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600 font-medium">
                Email:
              </label>
              <input
                type="text"
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                placeholder="Search email..."
                className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[200px]"
              />
            </div>

            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600 font-medium">
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer min-w-[150px]"
              >
                <option value="">Default</option>
                <option value="createdAt">Submitted Date</option>
                <option value="fullname">Full Name</option>
                <option value="email">Email</option>
                <option value="status">Status</option>
              </select>
            </div>

            {sortBy && (
              <div className="flex gap-2 items-center">
                <label className="text-sm text-gray-600 font-medium">
                  Order:
                </label>
                <select
                  value={desc ? "desc" : "asc"}
                  onChange={(e) => setDesc(e.target.value === "desc")}
                  className="px-4 py-2 border border-[#E5E5E5] rounded-[5px] text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer min-w-[100px]"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <TableFluent
          data={registrations}
          columns={registrationsColumns}
          title="Role Registrations"
          onRowClick={handleRowClick}
          pagination={pagination}
          onPageChange={setPageNumber}
        />
      </div>
    </PageContainer>
  );
};

export default StaffRoleRegistrations;

