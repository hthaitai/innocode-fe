import React, { useState } from "react";
import BaseModal from "@/shared/components/BaseModal";
import { useGetRoleRegistrationByIdQuery } from "@/services/roleRegistrationApi";
import { useModal } from "@/shared/hooks/useModal";

const RoleRegistrationDetailsModal = ({
  isOpen,
  onClose,
  registrationId,
  onSuccess,
}) => {
  const { closeModal } = useModal();
  // isOpen is passed from ModalContext, default to true if not provided
  const modalIsOpen = isOpen !== undefined ? isOpen : true;
  
  // Use closeModal from useModal hook, fallback to onClose prop
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeModal();
    }
  };

  const {
    data: registration,
    isLoading,
    refetch,
    error: queryError,
  } = useGetRoleRegistrationByIdQuery(registrationId, {
    skip: !registrationId || !modalIsOpen,
  });

  if (isLoading) {
    return (
      <BaseModal
        isOpen={modalIsOpen}
        onClose={handleClose}
        title="Role Registration Details"
        size="lg"
      >
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </BaseModal>
    );
  }

  if (queryError) {
    return (
      <BaseModal
        isOpen={modalIsOpen}
        onClose={handleClose}
        title="Role Registration Details"
        size="lg"
      >
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">
            Error loading registration details
          </p>
          <p className="text-sm text-gray-500">
            {queryError?.data?.errorMessage ||
              queryError?.data?.message ||
              queryError?.message ||
              "Please try again later"}
          </p>
        </div>
      </BaseModal>
    );
  }

  if (!registration && !isLoading) {
    return (
      <BaseModal
        isOpen={modalIsOpen}
        onClose={handleClose}
        title="Role Registration Details"
        size="lg"
      >
        <div className="text-center py-8 text-gray-500">
          Registration not found
        </div>
      </BaseModal>
    );
  }

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      approved: {
        label: "Approved",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      denied: {
        label: "Denied",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <BaseModal
      isOpen={modalIsOpen}
      onClose={onClose}
      title="Role Registration Details"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Full Name
            </label>
            <p className="text-gray-900">
              {registration.fullname || registration.fullName || "—"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <p className="text-gray-900">{registration.email || "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Phone
            </label>
            <p className="text-gray-900">{registration.phone || "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Requested Role
            </label>
            <p className="text-gray-900 capitalize">
              {registration.requestedRole?.replace(/([A-Z])/g, " $1").trim() ||
                "—"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Status
            </label>
            <StatusBadge status={registration.status} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Submitted Date
            </label>
            <p className="text-gray-900">
              {registration.createdAt
                ? new Date(registration.createdAt).toLocaleString()
                : "—"}
            </p>
          </div>
          {registration.evidenceCount !== undefined && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Evidence Documents Count
              </label>
              <p className="text-gray-900">{registration.evidenceCount}</p>
            </div>
          )}
        </div>

        {/* Review Information */}
        {registration.reviewedBy && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Review Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Reviewed By
                </label>
                <p className="text-gray-900">
                  {registration.reviewedByName ||
                    registration.reviewedByEmail ||
                    "—"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Reviewed At
                </label>
                <p className="text-gray-900">
                  {registration.reviewedAt
                    ? new Date(registration.reviewedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
              {registration.denyReason && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Deny Reason
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap bg-red-50 p-3 rounded border border-red-200">
                    {registration.denyReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {registration.payload && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Additional Information
            </label>
            <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded border">
              {registration.payload}
            </p>
          </div>
        )}

        {(registration.evidences && registration.evidences.length > 0) ||
        (registration.evidenceFiles &&
          registration.evidenceFiles.length > 0) ? (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Evidence Documents
              {registration.evidenceCount !== undefined && (
                <span className="text-gray-500 font-normal ml-2">
                  ({registration.evidenceCount} file
                  {registration.evidenceCount !== 1 ? "s" : ""})
                </span>
              )}
            </label>
            <div className="space-y-2">
              {(registration.evidences || registration.evidenceFiles || []).map(
                (evidence, index) => {
                  const evidenceUrl = evidence.url || evidence;
                  const evidenceName =
                    evidence.name ||
                    `Document ${index + 1}${
                      evidence.type ? evidence.type : ""
                    }`;
                  const evidenceType = evidence.type || "";
                  const evidenceNote = evidence.note;
                  const evidenceDate = evidence.createdAt;

                  return (
                    <div
                      key={evidence.evidenceId || evidence.id || index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
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
                              Uploaded:{" "}
                              {new Date(evidenceDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {evidenceNote && (
                          <p className="text-xs text-gray-600 mt-1 italic">
                            Note: {evidenceNote}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ) : registration.evidenceCount > 0 ? (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Evidence Documents
            </label>
            <p className="text-gray-500 text-sm">
              {registration.evidenceCount} file(s) uploaded
            </p>
          </div>
        ) : null}
      </div>
    </BaseModal>
  );
};

export default RoleRegistrationDetailsModal;
