import React, { useState } from "react";
import BaseModal from "@/shared/components/BaseModal";
import { XCircle } from "lucide-react";
import { Icon } from "@iconify/react";

const DenyRoleRegistrationModal = ({
  isOpen,
  onClose,
  onConfirm,
  registrationName,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for denying this registration.");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters long.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      await onConfirm(reason.trim());
      setIsLoading(false);
      onClose();
    } catch (err) {
      setIsLoading(false);
      // Don't close modal on error - let user see the error and try again
    }
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Deny Role Registration"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !reason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Denying...</span>
              </>
            ) : (
              <>
                <XCircle size={16} />
                <span>Confirm Deny</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <XCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">
                Are you sure you want to deny this registration?
              </p>
              {registrationName && (
                <p className="text-sm text-red-700">
                  Registration for: <span className="font-medium">{registrationName}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="denyReason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reason for Denial <span className="text-red-500">*</span>
          </label>
          <textarea
            id="denyReason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Please provide a detailed reason for denying this registration (minimum 10 characters)..."
          />
          {error && (
            <div className="flex items-center gap-1 mt-1">
              <Icon icon="mdi:alert-circle" className="text-red-500 text-sm" width="16" />
              <p className="text-red-500 text-xs">{error}</p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 characters required. This reason will be visible to the applicant.
          </p>
        </div>
      </div>
    </BaseModal>
  );
};

export default DenyRoleRegistrationModal;

