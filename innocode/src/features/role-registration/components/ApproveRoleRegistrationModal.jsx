import React, { useState } from "react";
import BaseModal from "@/shared/components/BaseModal";
import { CheckCircle2 } from "lucide-react";

const ApproveRoleRegistrationModal = ({
  isOpen,
  onClose,
  onConfirm,
  registrationName,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsLoading(false);
      onClose();
    } catch (err) {
      setIsLoading(false);
      // Don't close modal on error - let user see the error and try again
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Approve Role Registration"
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
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Approving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Confirm Approve</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 mb-1">
                Are you sure you want to approve this registration?
              </p>
              {registrationName && (
                <p className="text-sm text-green-700">
                  Registration for: <span className="font-medium">{registrationName}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ApproveRoleRegistrationModal;

