import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import { ArrowLeft, CheckCircle2, XCircle, FileText } from "lucide-react";
import {
  useGetSchoolCreationRequestByIdQuery,
  useApproveSchoolCreationRequestMutation,
  useDenySchoolCreationRequestMutation,
} from "@/services/schoolApi";
import { useModal } from "@/shared/hooks/useModal";
import { toast } from "react-hot-toast";
import InfoSection from "@/shared/components/InfoSection";
import DetailTable from "@/shared/components/DetailTable";
import StatusBadge from "@/shared/components/StatusBadge";
import { formatDateTime } from "@/shared/utils/dateTime";

const StaffSchoolCreationRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const {
    data: request,
    isLoading,
    error,
    refetch,
  } = useGetSchoolCreationRequestByIdQuery(id, {
    skip: !id,
  });

  const [approveRequest, { isLoading: isApproving }] =
    useApproveSchoolCreationRequestMutation();
  const [denyRequest, { isLoading: isDenying }] =
    useDenySchoolCreationRequestMutation();

  const isPending = request?.status?.toLowerCase() === "pending";

  // Handle approve with confirmation
  const handleApprove = () => {
    const schoolName = request?.name || request?.Name || "this school";
    openModal("approveRoleRegistration", {
      registrationName: schoolName,
      onConfirm: async () => {
        try {
          const requestId = request.requestId || request.id;
          await approveRequest(requestId).unwrap();
          toast.success("School creation request approved successfully");
          await refetch();
          navigate("/school-staff");
        } catch (err) {
          console.error("Error approving request:", err);
          toast.error(
            err?.data?.errorMessage ||
              err?.data?.message ||
              "Failed to approve school creation request"
          );
          throw err;
        }
      },
    });
  };

  // Handle deny with reason modal
  const handleDeny = () => {
    const schoolName = request?.name || request?.Name || "this school";
    openModal("denyRoleRegistration", {
      registrationName: schoolName,
      onConfirm: async (reason) => {
        try {
          const requestId = request.requestId || request.id;
          await denyRequest({ id: requestId, denyReason: reason }).unwrap();
          toast.success("School creation request denied successfully");
          await refetch();
          navigate("/school-staff");
        } catch (err) {
          console.error("Error denying request:", err);
          toast.error(
            err?.data?.errorMessage ||
              err?.data?.message ||
              err?.message ||
              "Failed to deny school creation request"
          );
          throw err;
        }
      },
    });
  };

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={BREADCRUMBS.SCHOOLS}
        loading={isLoading}
      >
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.SCHOOLS} error={error}>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Error loading request details</p>
          <p className="text-sm text-gray-500">
            {error?.data?.errorMessage ||
              error?.data?.message ||
              error?.message ||
              "Please try again later"}
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!request) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.SCHOOLS}>
        <div className="text-center py-8 text-gray-500">
          School creation request not found
        </div>
      </PageContainer>
    );
  }

  // Prepare request data for DetailTable
  const requestData = [
    {
      label: "School Name",
      value: request?.name || request?.Name || "—",
    },
    {
      label: "Province",
      value: request?.provinceName || request?.ProvinceName || "—",
    },
    {
      label: "Address",
      value: request?.address || request?.Address || "—",
    },
    {
      label: "Contact",
      value: request?.contact || request?.Contact || "—",
    },
    {
      label: "Status",
      value: <StatusBadge status={request?.status || request?.Status} />,
    },
    {
      label: "Requested By",
      value: request?.requestedByName || request?.requestedByEmail || "—",
    },
    {
      label: "Requested Email",
      value: request?.requestedByEmail || "—",
    },
    {
      label: "Created Date",
      value: request?.createdAt || request?.CreatedAt
        ? formatDateTime(request.createdAt || request.CreatedAt)
        : "—",
    },
    ...(request?.createdSchoolId
      ? [
          {
            label: "Created School ID",
            value: request.createdSchoolId,
          },
        ]
      : []),
  ];

  // Prepare review data
  const reviewData = request?.reviewedBy
    ? [
        {
          label: "Reviewed By",
          value:
            request.reviewedByName ||
            request.reviewedByEmail ||
            "—",
        },
        {
          label: "Reviewed At",
          value: request.reviewedAt
            ? formatDateTime(request.reviewedAt)
            : "—",
        },
        ...(request.denyReason
          ? [
              {
                label: "Deny Reason",
                value: (
                  <div className="whitespace-pre-wrap bg-red-50 p-3 rounded border border-red-200 text-gray-900">
                    {request.denyReason}
                  </div>
                ),
              },
            ]
          : []),
      ]
    : [];

  return (
    <PageContainer breadcrumb={BREADCRUMBS.SCHOOLS}>
      <div className="space-y-5">
        {/* Back Button */}
        <button
          onClick={() => navigate("/school-staff")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to School Creation Requests</span>
        </button>

        {/* Request Information */}
        <InfoSection title="School Creation Request Information">
          <DetailTable data={requestData} labelWidth="180px" />
        </InfoSection>

        {/* Review Information */}
        {reviewData.length > 0 && (
          <InfoSection title="Review Information">
            <DetailTable data={reviewData} labelWidth="180px" />
          </InfoSection>
        )}

        {/* Evidence Documents */}
        {request?.evidences && request.evidences.length > 0 && (
          <InfoSection title="Evidence Documents">
            <div className="space-y-2">
              {request.evidences.map((evidence, index) => {
                const evidenceUrl = evidence.url;
                // Extract filename from URL if name not provided
                const evidenceName = evidence.name || 
                  (evidenceUrl ? evidenceUrl.split('/').pop() : `Document ${index + 1}`);
                const evidenceType = evidence.type || "";
                const evidenceDate = evidence.createdAt;

                return (
                  <div
                    key={evidence.evidenceId || index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <FileText className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <a
                        href={evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium block truncate"
                      >
                        {evidenceName}
                      </a>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                        {evidenceType && (
                          <span className="px-2 py-0.5 bg-gray-200 rounded uppercase">
                            {evidenceType}
                          </span>
                        )}
                        {evidenceDate && (
                          <span>
                            Uploaded: {formatDateTime(evidenceDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </InfoSection>
        )}

        {/* Action Buttons for Pending Requests */}
        {isPending && (
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-end items-center min-h-[70px] gap-3">
            <button
              type="button"
              onClick={handleDeny}
              disabled={isDenying || isApproving}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDenying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Denying...</span>
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  <span>Deny</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={isApproving || isDenying}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isApproving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Approving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Approve</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default StaffSchoolCreationRequestDetail;

