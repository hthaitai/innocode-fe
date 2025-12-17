import React, { useState } from "react";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import PageContainer from "@/shared/components/PageContainer";
import TableFluent from "@/shared/components/TableFluent";
import { UserCheck, CheckCircle2, XCircle, Eye } from "lucide-react";
import Actions from "@/shared/components/Actions";
import { useModal } from "@/shared/hooks/useModal";
import {
  useGetAllRoleRegistrationsQuery,
  useApproveRoleRegistrationMutation,
  useDenyRoleRegistrationMutation,
} from "@/services/roleRegistrationApi";
import { toast } from "react-hot-toast";

const StaffRoleRegistrations = () => {
  const { openModal } = useModal();
  const [statusFilter, setStatusFilter] = useState(""); // "pending", "approved", "denied"

  // ----- Fetch Data -----
  const {
    data: registrationsData,
    isLoading: loading,
    error,
    refetch,
  } = useGetAllRoleRegistrationsQuery({
    pageNumber: 1,
    pageSize: 100,
    ...(statusFilter && { status: statusFilter }),
  });

  // ----- Mutations -----
  const [approveRegistration] = useApproveRoleRegistrationMutation();
  const [denyRegistration] = useDenyRoleRegistrationMutation();

  // ----- Handlers -----
  const handleApprove = async (registration) => {
    try {
      const registrationId = registration.registrationId || registration.id;
      await approveRegistration(registrationId).unwrap();
      toast.success("Role registration approved successfully");
      refetch();
    } catch (err) {
      console.error("Error approving registration:", err);
      toast.error(
        err?.data?.message || "Failed to approve role registration"
      );
    }
  };

  const handleDeny = async (registration) => {
    try {
      const registrationId = registration.registrationId || registration.id;
      await denyRegistration(registrationId).unwrap();
      toast.success("Role registration denied successfully");
      refetch();
    } catch (err) {
      console.error("Error denying registration:", err);
      toast.error(err?.data?.message || "Failed to deny role registration");
    }
  };

  const handleViewDetails = (registration) => {
    const registrationId = registration.registrationId || registration.id;
    openModal("roleRegistrationDetails", {
      registrationId: registrationId,
    });
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
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const registration = row.original;
        const isPending = registration.status?.toLowerCase() === "pending";

        return (
          <Actions
            row={registration}
            items={[
              {
                label: "View Details",
                icon: Eye,
                onClick: () => handleViewDetails(registration),
              },
              ...(isPending
                ? [
                    {
                      label: "Approve",
                      icon: CheckCircle2,
                      className: "text-green-600",
                      onClick: () => handleApprove(registration),
                    },
                    {
                      label: "Deny",
                      icon: XCircle,
                      className: "text-red-600",
                      onClick: () => handleDeny(registration),
                    },
                  ]
                : []),
            ]}
          />
        );
      },
    },
  ];

  // Extract items from response
  const registrations = registrationsData?.data || [];

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
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600 font-medium">
              Filter by Status:
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
        </div>

        <TableFluent
          data={registrations}
          columns={registrationsColumns}
          title="Role Registrations"
        />
      </div>
    </PageContainer>
  );
};

export default StaffRoleRegistrations;

