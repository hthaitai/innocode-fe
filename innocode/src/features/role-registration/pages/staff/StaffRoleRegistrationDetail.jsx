import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import { ArrowLeft, CheckCircle2, XCircle, FileText } from "lucide-react";
import {
  useGetRoleRegistrationByIdQuery,
  useApproveRoleRegistrationMutation,
  useDenyRoleRegistrationMutation,
} from "@/services/roleRegistrationApi";
import { useModal } from "@/shared/hooks/useModal";
import { toast } from "react-hot-toast";
import InfoSection from "@/shared/components/InfoSection";
import DetailTable from "@/shared/components/DetailTable";
import StatusBadge from "@/shared/components/StatusBadge";
import { formatDateTime } from "@/shared/utils/dateTime";

const StaffRoleRegistrationDetail = () => {
  const { t } = useTranslation("pages");
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const {
    data: registration,
    isLoading,
    error,
    refetch,
  } = useGetRoleRegistrationByIdQuery(id, {
    skip: !id,
  });

  const [approveRegistration, { isLoading: isApproving }] =
    useApproveRoleRegistrationMutation();
  const [denyRegistration, { isLoading: isDenying }] =
    useDenyRoleRegistrationMutation();

  const isPending = registration?.status?.toLowerCase() === "pending";

  // Handle approve with confirmation
  const handleApprove = () => {
    const registrationName = registration?.fullname || registration?.fullName;
    openModal("approveRoleRegistration", {
      registrationName,
      onConfirm: async () => {
        try {
          const registrationId = registration.registrationId || registration.id;
          await approveRegistration(registrationId).unwrap();
          toast.success(t("roleRegistrations.roleRegistrationApproved"));
          await refetch();
          navigate("/role-registrations-staff");
        } catch (err) {
          console.error("Error approving registration:", err);
          toast.error(
            err?.data?.errorMessage ||
              err?.data?.message ||
              t("roleRegistrations.failedToApprove")
          );
          throw err;
        }
      },
    });
  };

  // Handle deny with reason modal
  const handleDeny = () => {
    const registrationName = registration?.fullname || registration?.fullName;
    openModal("denyRoleRegistration", {
      registrationName,
      onConfirm: async (reason) => {
        try {
          const registrationId = registration.registrationId || registration.id;
          await denyRegistration({ id: registrationId, reason }).unwrap();
          toast.success(t("roleRegistrations.roleRegistrationDenied"));
          await refetch();
          navigate("/role-registrations-staff");
        } catch (err) {
          console.error("Error denying registration:", err);
          toast.error(
            err?.data?.errorMessage ||
              err?.data?.message ||
              err?.message ||
              t("roleRegistrations.failedToDeny")
          );
          throw err;
        }
      },
    });
  };

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={BREADCRUMBS.ROLE_REGISTRATIONS}
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
      <PageContainer breadcrumb={BREADCRUMBS.ROLE_REGISTRATIONS} error={error}>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">{t("roleRegistrations.errorLoadingDetails")}</p>
          <p className="text-sm text-gray-500">
            {error?.data?.errorMessage ||
              error?.data?.message ||
              error?.message ||
              t("roleRegistrations.pleaseTryAgainLater")}
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!registration) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.ROLE_REGISTRATIONS}>
        <div className="text-center py-8 text-gray-500">
          {t("roleRegistrations.registrationNotFound")}
        </div>
      </PageContainer>
    );
  }

  // Format role name
  const formatRoleName = (role) => {
    if (!role) return "—";
    const roleMap = {
      judge: t("roleRegistrations.judge"),
      organizer: t("roleRegistrations.organizer"),
      "school manager": t("roleRegistrations.schoolManager"),
      staff: t("roleRegistrations.staff"),
    };
    const lowerRole = role.toLowerCase();
    return roleMap[lowerRole] || role.replace(/([A-Z])/g, " $1").trim();
  };

  // Prepare registration data for DetailTable
  const registrationData = [
    {
      label: t("roleRegistrations.fullName"),
      value: registration?.fullname || registration?.fullName || "—",
    },
    {
      label: t("roleRegistrations.email"),
      value: registration?.email || "—",
    },
    {
      label: t("roleRegistrations.phone"),
      value: registration?.phone || "—",
    },
    {
      label: t("roleRegistrations.requestedRole"),
      value: formatRoleName(registration?.requestedRole) || "—",
    },
    {
      label: t("schools.status"),
      value: <StatusBadge status={registration?.status} />,
    },
    {
      label: t("roleRegistrations.submittedDate"),
      value: registration?.createdAt
        ? formatDateTime(registration.createdAt)
        : "—",
    },
    ...(registration?.evidenceCount !== undefined
      ? [
          {
            label: t("roleRegistrations.evidenceDocumentsCount"),
            value: registration.evidenceCount,
          },
        ]
      : []),
  ];

  // Prepare review data
  const reviewData = registration?.reviewedBy
    ? [
        {
          label: t("roleRegistrations.reviewedBy"),
          value:
            registration.reviewedByName ||
            registration.reviewedByEmail ||
            "—",
        },
        {
          label: t("roleRegistrations.reviewedAt"),
          value: registration.reviewedAt
            ? formatDateTime(registration.reviewedAt)
            : "—",
        },
        ...(registration.denyReason
          ? [
              {
                label: t("roleRegistrations.denyReason"),
                value: (
                  <div className="whitespace-pre-wrap bg-red-50 p-3 rounded border border-red-200 text-gray-900">
                    {registration.denyReason}
                  </div>
                ),
              },
            ]
          : []),
      ]
    : [];

  return (
    <PageContainer breadcrumb={BREADCRUMBS.ROLE_REGISTRATIONS}>
      <div className="space-y-5">
        {/* Registration Information */}
        <InfoSection title={t("roleRegistrations.registrationInformation")}>
          <DetailTable data={registrationData} labelWidth="180px" />
        </InfoSection>

        {/* Review Information */}
        {reviewData.length > 0 && (
          <InfoSection title={t("roleRegistrations.reviewInformation")}>
            <DetailTable data={reviewData} labelWidth="180px" />
          </InfoSection>
        )}

        {/* Additional Information */}
        {registration?.payload && (
          <InfoSection title={t("roleRegistrations.additionalInformation")}>
            <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border text-gray-900">
              {registration.payload}
            </div>
          </InfoSection>
        )}

        {/* Evidence Documents */}
        {((registration?.evidences && registration.evidences.length > 0) ||
          (registration?.evidenceFiles &&
            registration.evidenceFiles.length > 0)) && (
          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("roleRegistrations.evidenceDocuments")}
              {registration?.evidenceCount !== undefined && (
                <span className="text-gray-500 font-normal ml-2">
                  ({registration.evidenceCount} {registration.evidenceCount !== 1 ? t("roleRegistrations.files") : t("roleRegistrations.file")})
                </span>
              )}
            </div>
            <div className="space-y-2">
              {(registration.evidences || registration.evidenceFiles || []).map(
                (evidence, index) => {
                  const evidenceUrl = evidence.url || evidence;
                  const evidenceName =
                    evidence.name ||
                    `Document ${index + 1}${
                      evidence.type ? ` - ${evidence.type}` : ""
                    }`;
                  const evidenceType = evidence.type || "";
                  const evidenceNote = evidence.note;
                  const evidenceDate = evidence.createdAt;

                  return (
                    <div
                      key={evidence.evidenceId || evidence.id || index}
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
                            <span className="px-2 py-0.5 bg-gray-200 rounded">
                              {evidenceType}
                            </span>
                          )}
                          {evidenceDate && (
                            <span>
                              {t("roleRegistrations.uploaded")}{" "}
                              {new Date(evidenceDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {evidenceNote && (
                          <p className="text-xs text-gray-600 mt-1 italic">
                            {t("roleRegistrations.note")} {evidenceNote}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Action Buttons for Pending Registrations */}
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
                  <span>{t("roleRegistrations.denying")}</span>
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  <span>{t("roleRegistrations.deny")}</span>
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
                  <span>{t("roleRegistrations.approving")}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t("roleRegistrations.approve")}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default StaffRoleRegistrationDetail;

