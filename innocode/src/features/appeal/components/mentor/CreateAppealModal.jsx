import React, { useState, useEffect } from "react";
import BaseModal from "@/shared/components/BaseModal";
import { TextField } from "@mui/material";
import { useCreateAppealMutation } from "@/services/appealApi";
import { toast } from "react-hot-toast";
import { Icon } from "@iconify/react";
import DropdownFluent from "@/shared/components/DropdownFluent";

export default function CreateAppealModal({
  isOpen,
  onClose,
  contestId,
  roundId,
  teamId,
  studentId,
  roundName,
  roundType,
}) {
  const [reason, setReason] = useState("");
  const [evidences, setEvidences] = useState([]);
  const [appealResolution, setAppealResolution] = useState("retake");
  const [createAppeal, { isLoading }] = useCreateAppealMutation();

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setEvidences([]);
      // Set default appealResolution based on roundType
      if (roundType === "McqTest" || roundType === "AutoEvaluation") {
        setAppealResolution("retake");
      } else if (roundType === "Manual") {
        setAppealResolution("retake"); // Default to retake, but user can change
      }
    }
  }, [isOpen, roundType]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEvidences(files);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the appeal");
      return;
    }

    if (!roundId || !teamId || !studentId) {
      toast.error("Missing required information");
      return;
    }

    try {
      await createAppeal({
        RoundId: roundId,
        TeamId: teamId,
        StudentId: studentId,
        Reason: reason,
        Evidences: evidences.length > 0 ? evidences : undefined,
        AppealResolution: appealResolution,
      }).unwrap();

      toast.success("Appeal submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating appeal:", error);
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
      });

      const errorMessage = error?.data?.errorMessage;
      toast.dismiss();

      toast.error(errorMessage);
    }
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <button className="button-white" onClick={onClose} disabled={isLoading}>
        Cancel
      </button>
      <button
        className="button-orange"
        onClick={handleSubmit}
        disabled={isLoading || !reason.trim()}
      >
        {isLoading ? "Submitting..." : "Submit Appeal"}
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Request an Appeal"
      size="md"
      footer={footer}
    >
      <div className="space-y-4">
        {/* Round Info */}
        {(roundName || roundType) && (
          <div className="bg-gray-50 rounded px-3 py-2 border border-gray-200">
            {roundName && (
              <>
                <p className="text-xs text-gray-600 mb-1">Round:</p>
                <p className="text-sm font-medium text-gray-900">{roundName}</p>
              </>
            )}
            {roundType && (
              <>
                <p className="text-xs text-gray-600 mb-1 mt-2">Round Type:</p>
                <p className="text-sm font-medium text-gray-900">
                  {roundType === "McqTest"
                    ? "MCQ Test"
                    : roundType === "Manual"
                    ? "Manual Problem"
                    : roundType === "AutoEvaluation"
                    ? "Auto Evaluation"
                    : roundType}
                </p>
              </>
            )}
          </div>
        )}

        {/* Reason Field */}
        <div>
          <TextField
            label="Reason *"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder="Please provide a detailed reason for your appeal..."
            required
            helperText="Explain why you are requesting an appeal for this round"
          />
        </div>

        {/* Appeal Resolution Field */}
        {roundType === "Manual" ? (
          <div>
            <DropdownFluent
              label="Appeal Resolution *"
              value={appealResolution}
              onChange={setAppealResolution}
              options={[
                { value: "retake", label: "Retake" },
                { value: "rescore", label: "Rescore" },
              ]}
              placeholder="Select appeal resolution"
            />
            <p className="text-xs text-gray-500 mt-1">
              Choose whether to retake the round or request a rescore
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded px-3 py-2 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Appeal Resolution:</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {appealResolution}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Default resolution for {roundType === "McqTest" ? "MCQ" : roundType === "AutoEvaluation" ? "Auto Evaluation" : "this round"} rounds
            </p>
          </div>
        )}

        {/* Evidence Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidence (Optional)
          </label>
          <div className="border border-gray-300 rounded px-4 py-3 bg-gray-50">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="evidence-upload"
              accept="image/*,.pdf,.doc,.docx"
            />
            <label
              htmlFor="evidence-upload"
              className="cursor-pointer flex items-center gap-2 text-sm text-gray-700 hover:text-orange-600"
            >
              <Icon icon="mdi:paperclip" width={20} />
              <span>
                {evidences.length > 0
                  ? `${evidences.length} file(s) selected`
                  : "Click to upload evidence files"}
              </span>
            </label>
            {evidences.length > 0 && (
              <div className="mt-2 space-y-1">
                {evidences.map((file, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-gray-600 flex items-center gap-2"
                  >
                    <Icon icon="mdi:file" width={16} />
                    <span className="truncate">{file.name}</span>
                    <button
                      onClick={() =>
                        setEvidences(evidences.filter((_, i) => i !== idx))
                      }
                      className="text-red-600 hover:text-red-800 ml-auto"
                    >
                      <Icon icon="mdi:close" width={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: Images, PDF, Word documents
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
