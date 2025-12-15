import React, { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { Icon } from "@iconify/react";
import { ArrowLeft, FileText, Upload, Clock, Calendar, X } from "lucide-react";
import useContestDetail from "@/features/contest/hooks/useContestDetail";
import { useRoundTimer } from "../../hooks/useRoundTimer";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import {
  useSaveManualSubmissionMutation,
  useFinishRoundMutation,
} from "@/services/manualProblemApi";
import { useModal } from "@/shared/hooks/useModal";

const StudentManualProblem = () => {
  const { contestId, roundId } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const [selectedFile, setSelectedFile] = useState(null);
  const [savedSubmissionId, setSavedSubmissionId] = useState(null); // Store submissionId after save

  // RTK Query mutations
  const [saveManualSubmission, { isLoading: saving }] =
    useSaveManualSubmissionMutation();
  const [finishRound, { isLoading: finishing }] = useFinishRoundMutation();

  // ✅ Fetch contest data to get round information
  const { contest, loading, error } = useContestDetail(contestId);

  // ✅ Find the specific round by roundId
  const round = contest?.rounds?.find((r) => r.roundId === roundId);
  const problem = round?.problem;

  // Auto-submit when time expires (direct submit without modal)
  // Submit ngay cả khi chưa có file (submit file trống)
  const handleAutoSubmit = useCallback(async () => {
    if (!finishing) {
      try {
        await finishRound(roundId).unwrap();
      } catch (err) {
        // Silent error handling - no UI feedback
        console.error("Auto-submit failed:", err);
      }
    }
  }, [finishing, finishRound, roundId, contestId, navigate]);

  // Timer for round
  const { timeRemaining, formatTime, isExpired } = useRoundTimer(
    round,
    handleAutoSubmit
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (isExpired) {
        toast.dismiss();
        toast.error("Time is up! You can no longer upload files.");
        return;
      }

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        toast.dismiss();
        if (rejection.errors[0].code === "file-too-large") {
          toast.error("File size must be less than 10MB");
        } else if (rejection.errors[0].code === "file-invalid-type") {
          toast.error("Only .zip and .rar files are allowed");
        }
      }

      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setSavedSubmissionId(null); // Reset saved submissionId when new file is selected
      }
    },
    [isExpired]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
      "application/x-rar-compressed": [".rar"],
      "application/vnd.rar": [".rar"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isExpired,
  });
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSavedSubmissionId(null); // Reset saved submissionId when file is removed
  };

  // Handle Save: Save file without finishing
  const handleSave = async () => {
    if (!selectedFile) {
      toast.dismiss();
      toast.error("Please select a file to save");
      return;
    }

    // Check if file is empty
    if (selectedFile.size === 0) {
      toast.dismiss();
      toast.error("Cannot save empty file. Please select a valid file.");
      return;
    }

    try {
      const response = await saveManualSubmission({
        roundId,
        file: selectedFile,
      }).unwrap();

      // Extract submissionId from response
      // Response structure: { data: 'submissionId', message: '...', statusCode: 201 }
      const submissionId = response?.data || response;

      if (!submissionId) {
        console.error("❌ No submission ID in response:", response);
        toast.error("Failed to get submission ID. Please try again.");
        return;
      }

      console.log("✅ File saved, submissionId:", submissionId);
      setSavedSubmissionId(submissionId);
      toast.dismiss();
      toast.success("File saved successfully! You can submit it later.");
    } catch (err) {
      toast.dismiss();
      toast.error(
        `Failed to save: ${
          err?.data?.errorMessage ||
          err?.data?.message ||
          err?.message ||
          "Unknown error"
        }`
      );
    }
  };

  // Handle Submit: Finish the round
  const handleSubmit = () => {
    if (!savedSubmissionId) {
      toast.dismiss();
      toast.error("Please save your file first before submitting");
      return;
    }

    if (!selectedFile) {
      toast.dismiss();
      toast.error("File not found. Please select a file and save it first.");
      return;
    }

    // Check if file is empty
    if (selectedFile.size === 0) {
      toast.dismiss();
      toast.error("Cannot submit empty file. Please select a valid file.");
      return;
    }

    // Show confirm modal
    openModal("confirm", {
      title: "Confirm Submission",
      description: (
        <div className="space-y-3">
          <p className="text-[#2d3748]">
            Are you sure you want to submit{" "}
            <strong>"{selectedFile.name}"</strong>?
          </p>
          <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#7A7574]">File name:</span>
              <span className="font-semibold text-[#2d3748]">
                {selectedFile.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#7A7574]">File size:</span>
              <span className="font-semibold text-[#2d3748]">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-[5px] p-3">
            <div className="flex items-start gap-2">
              <Icon
                icon="mdi:alert"
                width="18"
                className="text-yellow-600 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-yellow-800">
                This will mark the round as finished. Once submitted, you cannot
                change your submission.
              </p>
            </div>
          </div>
        </div>
      ),
      onConfirm: async () => {
        try {
          await finishRound(roundId).unwrap();
          toast.dismiss();
          toast.success("Solution submitted and round finished successfully!");

          // Navigate back to contest detail
          setSelectedFile(null);
          setSavedSubmissionId(null);
          navigate(`/contest-detail/${contestId}`);
        } catch (err) {
          toast.dismiss();
          toast.error(
            `Failed to submit: ${
              err?.data?.errorMessage ||
              err?.data?.message ||
              err?.message ||
              "Unknown error"
            }`
          );
        }
      },
    });
  };
  // ✅ Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <PageContainer bg={false}>
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <Icon
              icon="mdi:loading"
              width="48"
              className="mx-auto mb-2 text-[#ff6b35] animate-spin"
            />
            <p className="text-[#7A7574]">Loading problem...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContainer bg={false}>
        <div className="max-w-5xl mt-[38px] mx-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 text-center">
            <Icon
              icon="mdi:alert-circle"
              width="48"
              className="mx-auto mb-2 text-red-500"
            />
            <p className="text-[#7A7574]">Failed to load problem</p>
            <p className="text-sm text-[#7A7574] mt-1">{error}</p>
            <button
              onClick={() => navigate(`/contest-detail/${contestId}`)}
              className="button-orange mt-4"
            >
              Back to Contest
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Not found state
  if (!round || !problem) {
    return (
      <PageContainer bg={false}>
        <div className="max-w-5xl mt-[38px] mx-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 text-center">
            <Icon
              icon="mdi:file-question"
              width="48"
              className="mx-auto mb-2 text-[#7A7574]"
            />
            <p className="text-[#7A7574]">Problem not found</p>
            <button
              onClick={() => navigate(`/contest-detail/${contestId}`)}
              className="button-orange mt-4"
            >
              Back to Contest
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer bg={false}>
      <div className="max-w-5xl mt-[38px] mx-auto">
        {/* Header */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(`/contest-detail/${contestId}`)}
              className="flex items-center gap-2 text-[#7A7574] hover:text-[#ff6b35] transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm">Back to Contest</span>
            </button>

            {/* Timer */}
            {timeRemaining !== null && (
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#7A7574]" />
                <div className="text-right">
                  <p className="text-xs text-[#7A7574]">Time Remaining</p>
                  <p
                    className={`text-lg font-bold ${
                      timeRemaining < 300 ? "text-red-600" : "text-[#2d3748]"
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff6b35] text-white flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2d3748]">
                  {round.roundName || round.name || "Manual Problem"}
                </h1>
                <p className="text-sm text-[#7A7574]">
                  {contest.name} • Round {round.roundName}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`text-xs px-3 py-1 rounded ${
                round.status === "Closed"
                  ? "bg-[#fde8e8] text-[#d93025]"
                  : round.status === "Opened"
                  ? "bg-[#e6f4ea] text-[#34a853]"
                  : "bg-[#fef7e0] text-[#fbbc05]"
              }`}
            >
              {round.status}
            </span>
          </div>

          {/* Round Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E5E5]">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-[#7A7574]" />
              <div>
                <div className="text-[#7A7574] text-xs">Start Time</div>
                <div className="font-medium text-[#2d3748]">
                  {formatDate(round.start)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mb-4">
          <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
            Problem Description
          </h2>
          <div className="text-[#4a5568] space-y-3">
            {problem.description ? (
              <div className="whitespace-pre-line">{problem.description}</div>
            ) : (
              <p>There are no scription!.</p>
            )}

            {/* Problem Details */}
            <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4 mt-4">
              <h3 className="font-semibold text-[#2d3748] mb-2 text-sm">
                Problem Details
              </h3>
              <div className="space-y-2 text-sm">
                {problem.language && (
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:code-braces"
                      width="16"
                      className="text-[#7A7574]"
                    />
                    <span className="text-[#7A7574]">Language:</span>
                    <span className="text-[#2d3748] font-medium">
                      {problem.language}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-[#7A7574]">
              <Icon
                icon="mdi:information-outline"
                className="inline mr-1"
                width="16"
              />
              Your submission will be manually reviewed and scored by the judge.
            </p>
          </div>
        </div>

        {/* Submission Section */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
          <h2 className="text-lg font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
            <Upload size={20} className="text-[#ff6b35]" />
            Submit Your Solution
          </h2>

          {/* Time Up Warning */}
          {isExpired && (
            <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-[8px] p-4">
              <div className="flex items-center gap-2 text-red-700">
                <Icon icon="mdi:alert-circle" width={20} />
                <span className="font-semibold">
                  Time is up! You can no longer upload or submit files.
                </span>
              </div>
            </div>
          )}

          <div className="border-2 border-dashed border-[#E5E5E5] rounded-[8px] p-8 text-center">
            <div
              {...(isExpired ? {} : getRootProps())}
              className={`border-2 border-dashed rounded-[8px] p-8 text-center transition-colors ${
                isExpired
                  ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                  : isDragActive
                  ? "border-[#ff6b35] bg-[#fff5f2] cursor-pointer"
                  : "border-[#E5E5E5] bg-white hover:border-[#ff6b35] hover:bg-[#fff5f2] cursor-pointer"
              }`}
            >
              {!isExpired && <input {...getInputProps()} />}

              {selectedFile ? (
                // Hiển thị file đã chọn
                <div className="flex items-center justify-between bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:file-zip"
                      width="32"
                      className="text-[#ff6b35]"
                    />
                    <div className="text-left">
                      <p className="font-medium text-[#2d3748] text-sm">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-[#7A7574]">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  {!isExpired && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="p-1 hover:bg-[#fde8e8] rounded transition-colors"
                      title="Remove file"
                    >
                      <X size={18} className="text-[#d93025]" />
                    </button>
                  )}
                </div>
              ) : (
                // Hiển thị upload prompt
                <>
                  <Icon
                    icon="mdi:cloud-upload"
                    width="48"
                    className="text-[#7A7574] mx-auto mb-3"
                  />
                  <p
                    className={`mb-4 ${
                      isExpired ? "text-gray-400" : "text-[#7A7574]"
                    }`}
                  >
                    {isExpired
                      ? "File upload disabled (Time is up)"
                      : isDragActive
                      ? "Drop the file here..."
                      : "Drag and drop your solution file here, or click to browse"}
                  </p>
                  <div className="button-orange inline-flex items-center gap-2">
                    <div className="ml-[5px]">
                      <Icon icon="mdi:file-upload" />
                    </div>
                    Choose File
                  </div>
                  <p className="text-xs text-[#7A7574] mt-3">
                    Accepted formats: .rar, .zip (Max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={(e) => {
                const isDisabled =
                  saving ||
                  finishing ||
                  !selectedFile ||
                  (selectedFile && selectedFile.size === 0) ||
                  round.status !== "Opened" ||
                  isExpired;
                if (isDisabled) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                handleSave();
              }}
              className="button-white disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              disabled={
                saving ||
                finishing ||
                !selectedFile ||
                (selectedFile && selectedFile.size === 0) ||
                round.status !== "Opened" ||
                isExpired
              }
              title={
                isExpired
                  ? "Time is up"
                  : !selectedFile
                  ? "Please select a file"
                  : selectedFile && selectedFile.size === 0
                  ? "File is empty"
                  : ""
              }
            >
              {saving ? (
                <>
                  <Icon
                    icon="mdi:loading"
                    className="inline mr-2 animate-spin"
                    width="16"
                  />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              onClick={(e) => {
                const isDisabled =
                  saving ||
                  finishing ||
                  !savedSubmissionId ||
                  !selectedFile ||
                  (selectedFile && selectedFile.size === 0) ||
                  round.status !== "Opened" ||
                  isExpired;
                if (isDisabled) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                handleSubmit();
              }}
              className="button-orange disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              disabled={
                saving ||
                finishing ||
                !savedSubmissionId ||
                !selectedFile ||
                (selectedFile && selectedFile.size === 0) ||
                round.status !== "Opened" ||
                isExpired
              }
              title={
                isExpired
                  ? "Time is up"
                  : !savedSubmissionId
                  ? "Please save your file first"
                  : !selectedFile
                  ? "File not found"
                  : selectedFile && selectedFile.size === 0
                  ? "File is empty"
                  : ""
              }
            >
              {finishing ? (
                <>
                  <Icon
                    icon="mdi:loading"
                    className="inline mr-2 animate-spin"
                    width="16"
                  />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-[#fef7e0] border border-[#fbbc05] rounded-[8px] p-4 mt-4">
          <div className="flex items-start gap-2">
            <Icon
              icon="mdi:alert-circle"
              width="20"
              className="text-[#fbbc05] flex-shrink-0 mt-0.5"
            />
            <div className="text-sm">
              <p className="font-semibold text-[#2d3748] mb-1">
                Important Instructions
              </p>
              <ul className="text-[#4a5568] space-y-1 list-disc list-inside">
                <li>Make sure your file is properly formatted</li>
                <li>Include all required documentation</li>
                <li>
                  <strong>Save:</strong> Save your file first (required before
                  submitting)
                </li>
                <li>
                  <strong>Submit:</strong> Submit and finish the round (marks
                  round as finished) - Only available after saving
                </li>
              </ul>
              {savedSubmissionId && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <Icon
                    icon="mdi:check-circle"
                    className="inline mr-1 text-green-600"
                    width="14"
                  />
                  File saved successfully. You can submit it now.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default StudentManualProblem;
