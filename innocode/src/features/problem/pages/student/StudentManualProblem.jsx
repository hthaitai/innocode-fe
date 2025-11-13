import React, { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/PageContainer';
import { Icon } from '@iconify/react';
import { ArrowLeft, FileText, Upload, Clock, Calendar, X } from 'lucide-react';
import useContestDetail from '@/features/contest/hooks/useContestDetail';
import { useDropzone } from 'react-dropzone';
import useManualSubmission from '../../hooks/useManualSubmission';

const StudentManualProblem = () => {
  const { contestId, roundId } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const {
    submitSolution,
    loading: submitting,
    error: submitError,
    success,
  } = useManualSubmission();
  // ✅ Fetch contest data to get round information
  const { contest, loading, error } = useContestDetail(contestId);

  // ✅ Find the specific round by roundId
  const round = contest?.rounds?.find((r) => r.roundId === roundId);
  const problem = round?.problem;

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        alert('File size must be less than 10MB');
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        alert('Only .zip and .rar files are allowed');
      }
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/vnd.rar': ['.rar'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
  };
  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file to submit');
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to submit "${selectedFile.name}"? You can only submit once.`
      )
    ) {
      try {
        await submitSolution(roundId, selectedFile);
        alert('Solution submitted successfully!');
        // Optional: Navigate back or reset form
        setSelectedFile(null);
        // navigate(`/contest-detail/${contestId}`);
      } catch (err) {
        alert(
          `Failed to submit: ${err.response.data.errorMessage || err.message}`
        );
      }
    }
  };
  // ✅ Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ✅ Calculate duration
  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const diff = new Date(end) - new Date(start);
    return Math.floor(diff / (1000 * 60)); // minutes
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
          <button
            onClick={() => navigate(`/contest-detail/${contestId}`)}
            className="flex items-center gap-2 text-[#7A7574] hover:text-[#ff6b35] mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Contest</span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff6b35] text-white flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2d3748]">
                  {round.roundName || round.name || 'Manual Problem'}
                </h1>
                <p className="text-sm text-[#7A7574]">
                  {contest.name} • Round {round.roundName}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`text-xs px-3 py-1 rounded ${
                round.status === 'Closed'
                  ? 'bg-[#fde8e8] text-[#d93025]'
                  : round.status === 'Opened'
                  ? 'bg-[#e6f4ea] text-[#34a853]'
                  : 'bg-[#fef7e0] text-[#fbbc05]'
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
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-[#7A7574]" />
              <div>
                <div className="text-[#7A7574] text-xs">Duration</div>
                <div className="font-medium text-[#2d3748]">
                  {calculateDuration(round.start, round.end)} minutes
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
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:alert"
                    width="16"
                    className="text-[#7A7574]"
                  />
                  <span className="text-[#7A7574]">Penalty Rate:</span>
                  <span className="text-[#dd4b4b] font-medium">
                    {(problem.penaltyRate * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:identifier"
                    width="16"
                    className="text-[#7A7574]"
                  />
                  <span className="text-[#7A7574]">Problem ID:</span>
                  <span className="text-[#2d3748] font-mono text-xs">
                    {problem.problemId}
                  </span>
                </div>
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

          <div className="border-2 border-dashed border-[#E5E5E5] rounded-[8px] p-8 text-center">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-[8px] p-8 text-center transition-colors cursor-pointer ${
                isDragActive
                  ? 'border-[#ff6b35] bg-[#fff5f2]'
                  : 'border-[#E5E5E5] bg-white hover:border-[#ff6b35] hover:bg-[#fff5f2]'
              }`}
            >
              <input {...getInputProps()} />

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
                </div>
              ) : (
                // Hiển thị upload prompt
                <>
                  <Icon
                    icon="mdi:cloud-upload"
                    width="48"
                    className="text-[#7A7574] mx-auto mb-3"
                  />
                  <p className="text-[#7A7574] mb-4">
                    {isDragActive
                      ? 'Drop the file here...'
                      : 'Drag and drop your solution file here, or click to browse'}
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
              onClick={() => navigate(`/contest-detail/${contestId}`)}
              className="button-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="button-orange"
              // disabled={round.status !== "Opened"}
            >
              Submit Solution
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
                <li>You can submit only once, so review carefully</li>
                <li>
                  Penalty of {(problem.penaltyRate * 100).toFixed(0)}% will be
                  applied for late submissions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default StudentManualProblem;
