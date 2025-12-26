import React, { useState, useEffect } from "react";
import BaseModal from "@/shared/components/BaseModal";
import { TextField } from "@mui/material";
import { useCreateAppealMutation } from "@/services/appealApi";
import { toast } from "react-hot-toast";
import { Icon } from "@iconify/react";
import DropdownFluent from "@/shared/components/DropdownFluent";
import TextFieldFluent from "@/shared/components/TextFieldFluent";

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
  const [evidences, setEvidences] = useState([]); // Array of { file, note }
  const [appealResolution, setAppealResolution] = useState(""); // Single selected resolution
  const [createAppeal, { isLoading }] = useCreateAppealMutation();

  // Get available resolution options based on roundType
  const getResolutionOptions = () => {
    if (roundType === "McqTest") {
      return [{ value: "Retake", label: "Retake" }];
    } else if (roundType === "AutoEvaluation") {
      return [
        { value: "Retake", label: "Retake" },
        { value: "RecheckPlagiarism", label: "Recheck Plagiarism" },
      ];
    } else if (roundType === "Manual") {
      return [
        { value: "Retake", label: "Retake" },
        { value: "Rescore", label: "Rescore" },
        { value: "RecheckPlagiarism", label: "Recheck Plagiarism" },
      ];
    }
    return [];
  };

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setEvidences([]);
      // Set default appealResolution based on roundType
      if (roundType === "McqTest") {
        setAppealResolution("Retake");
      } else if (roundType === "AutoEvaluation") {
        setAppealResolution("Retake");
      } else if (roundType === "Manual") {
        setAppealResolution("Retake");
      } else {
        setAppealResolution("");
      }
    }
  }, [isOpen, roundType]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newEvidences = files.map((file) => ({
      file,
      note: "",
      id: Date.now() + Math.random(), // Unique ID for each evidence
    }));
    setEvidences((prev) => [...prev, ...newEvidences]);
    // Reset input to allow selecting the same file again
    e.target.value = "";
  };

  const handleRemoveEvidence = (id) => {
    setEvidences((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleEvidenceNoteChange = (id, note) => {
    setEvidences((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, note } : ev))
    );
  };

  const handleResolutionChange = (value) => {
    setAppealResolution(value);
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

    if (!appealResolution || appealResolution.trim() === "") {
      toast.error("Please select an appeal resolution");
      return;
    }

    console.log("Appeal Resolution:", appealResolution);

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appeal Resolution *
          </label>
          {roundType === "McqTest" ? (
            <div className="bg-gray-50 rounded px-3 py-2 border border-gray-200">
              <p className="text-sm font-medium text-gray-900">Retake</p>
              <p className="text-xs text-gray-500 mt-1">
                Default resolution for MCQ rounds
              </p>
            </div>
          ) : (
            <div className="space-y-2 border border-gray-300 rounded px-4 py-3 bg-white">
              {getResolutionOptions().map((option) => {
                const isChecked = appealResolution === option.value;
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="appeal-resolution"
                      value={option.value}
                      checked={isChecked}
                      onChange={() => handleResolutionChange(option.value)}
                      className="w-4 h-4 text-[#E05307] accent-[#E05307] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                );
              })}
            </div>
          )}
          {appealResolution && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: {appealResolution}
            </p>
          )}
        </div>

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
          </div>
          {evidences.length > 0 && (
            <div className="mt-3 space-y-3">
              {evidences.map((evidence) => (
                <div
                  key={evidence.id}
                  className="border border-gray-300 rounded px-4 py-3 bg-white"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon icon="mdi:file" width={16} className="text-gray-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {evidence.file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveEvidence(evidence.id)}
                      className="text-red-600 hover:text-red-800 flex-shrink-0"
                      type="button"
                    >
                      <Icon icon="mdi:close" width={18} />
                    </button>
                  </div>
                  <TextFieldFluent
                    label="Note (Optional)"
                    value={evidence.note}
                    onChange={(e) =>
                      handleEvidenceNoteChange(evidence.id, e.target.value)
                    }
                    placeholder="Add a note for this evidence..."
                    multiline
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: Images, PDF, Word documents
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
