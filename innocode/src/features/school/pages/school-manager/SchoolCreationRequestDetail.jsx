import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs";
import { ArrowLeft, FileText, UserPlus } from "lucide-react";
import { useGetSchoolCreationRequestByIdQuery } from "@/services/schoolApi";
import InfoSection from "@/shared/components/InfoSection";
import DetailTable from "@/shared/components/DetailTable";
import StatusBadge from "@/shared/components/StatusBadge";
import { formatDateTime } from "@/shared/utils/dateTime";
import { useModalContext } from "@/context/ModalContext";

const SchoolCreationRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModalContext();

  const {
    data: request,
    isLoading,
    error,
  } = useGetSchoolCreationRequestByIdQuery(id, {
    skip: !id,
  });
console.log(request);
  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={BREADCRUMBS.SCHOOL_MANAGEMENT}
        breadcrumbPaths={BREADCRUMB_PATHS.SCHOOL_MANAGEMENT}
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
      <PageContainer 
        breadcrumb={BREADCRUMBS.SCHOOL_MANAGEMENT}
        breadcrumbPaths={BREADCRUMB_PATHS.SCHOOL_MANAGEMENT}
        error={error}
      >
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
      <PageContainer 
        breadcrumb={BREADCRUMBS.SCHOOL_MANAGEMENT}
        breadcrumbPaths={BREADCRUMB_PATHS.SCHOOL_MANAGEMENT}
      >
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

  // Breadcrumb for detail page
  const schoolName = request?.name || request?.Name || "Request";
  const breadcrumbItems = ["School Requests", schoolName];
  const breadcrumbPaths = ["/school-requests", `/school-requests/${id}`];

  // Check if status is approved
  const status = request?.status || request?.Status || "";


  return (
    <PageContainer 
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <div className="space-y-5">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/school-manager")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to School Management</span>
          </button>
        
        </div>

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
      </div>
    </PageContainer>
  );
};

export default SchoolCreationRequestDetail;

