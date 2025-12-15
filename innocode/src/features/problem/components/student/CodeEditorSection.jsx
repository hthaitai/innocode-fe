import React, { useCallback } from "react";
import { Icon } from "@iconify/react";
import { Code, Play, CheckCircle, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import CodeEditor from "./CodeEditor";
import ErrorMessage from "./ErrorMessage";
import { CODE_SNIPPETS } from "@/constants/constants";

/**
 * Component chứa code editor và các controls
 */

const CodeEditorSection = ({
  code,
  setCode,
  language,
  submitting,
  finalSubmitting,
  submissionId,
  submitError,
  finalSubmitError,
  finalSubmitResult,
  onClearCode,
  onRunCode,
  onFinalSubmit,
  theme,
  setTheme,
  isTimeUp = false,
}) => {
  const handleFileRead = useCallback(
    async (file) => {
      try {
        const text = await file.text();
        setCode(text);
        toast.success("File loaded successfully");
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Failed to read file. Please try again.");
      }
    },
    [setCode]
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (isTimeUp) {
        toast.error("Time is up! You can no longer upload files.");
        return;
      }

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0].code === "file-too-large") {
          toast.error("File size must be less than 10MB");
        } else if (rejection.errors[0].code === "file-invalid-type") {
          toast.error("Only .py (Python) files are allowed");
        }
      }

      if (acceptedFiles.length > 0) {
        handleFileRead(acceptedFiles[0]);
      }
    },
    [handleFileRead, isTimeUp]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/x-python": [".py"],
      "application/x-python-code": [".py"],
    },
    maxSize: 10 * 1024 * 1024, //
    multiple: false,
    disabled: isTimeUp,
  });

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#2d3748] flex items-center gap-2">
          <Code size={20} className="text-[#ff6b35]" />
          Your Solution
        </h2>
        <button
          onClick={() => setTheme(theme === "vs-dark" ? "vs-light" : "vs-dark")}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 cursor-pointer  ${
            theme === "vs-dark" ? "bg-gray-500" : "bg-gray-300"
          }`}
          role="switch"
          aria-checked={theme === "vs-dark"}
          aria-label="Toggle theme"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
              theme === "vs-dark" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="mb-4 font-semibold">
        <span>Language: </span>
        <span className="text-[#2d3748] rounded-sm bg-gray-300 px-2 py-1 font-medium">
          {language}
        </span>
      </div>

      {/* Time Up Warning */}
      {isTimeUp && (
        <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-[8px] p-4">
          <div className="flex items-center gap-2 text-red-700">
            <Icon icon="mdi:alert-circle" width={20} />
            <span className="font-semibold">Time is up! You can no longer edit or submit your code.</span>
          </div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        {...(isTimeUp ? {} : getRootProps())}
        className={`mb-4 border-2 border-dashed rounded-[8px] p-4 text-center transition-colors ${
          isTimeUp
            ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
            : isDragActive
            ? "border-[#ff6b35] bg-[#fff5f2] cursor-pointer"
            : "border-[#E5E5E5] bg-white hover:border-[#ff6b35] hover:bg-[#fff5f2] cursor-pointer"
        }`}
      >
        {!isTimeUp && <input {...getInputProps()} />}
        <div className="flex items-center justify-center gap-2">
          <Upload size={18} className={isTimeUp ? "text-gray-400" : "text-[#7A7574]"} />
          <span className={`text-sm ${isTimeUp ? "text-gray-400" : "text-[#7A7574]"}`}>
            {isTimeUp
              ? "File upload disabled (Time is up)"
              : isDragActive
              ? "Drop Python file here..."
              : "Drag & drop a .py file here, or click to browse"}
          </span>
        </div>
      </div>

      <CodeEditor
        value={code}
        onChange={isTimeUp ? undefined : setCode}
        language={language}
        height="750px"
        defaultValue={CODE_SNIPPETS.python}
        theme={theme || "vs-dark"}
        readOnly={isTimeUp}
      />

      {/* Auto-save indicator */}
      {code && (
        <div className="flex items-center gap-1 mt-2 text-xs text-[#7A7574]">
          <Icon icon="mdi:content-save" width={14} />
          <span>Auto-saved</span>
        </div>
      )}

      {/* Clear button */}
      {code && !isTimeUp && (
        <button
          onClick={onClearCode}
          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <Icon icon="mdi:delete" width={14} />
          Clear
        </button>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onRunCode}
          disabled={submitting || isTimeUp}
          className={`flex-1 button-white flex items-center justify-center gap-2 ${
            isTimeUp ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? (
            <>
              <Icon icon="mdi:loading" className="animate-spin" width={16} />
              Running...
            </>
          ) : (
            <>
              <Play size={16} />
              Run Code
            </>
          )}
        </button>
        <button
          onClick={onFinalSubmit}
          disabled={finalSubmitting || !submissionId || isTimeUp}
          className={`flex-1 button-orange flex items-center justify-center gap-2 ${
            !submissionId || isTimeUp ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {finalSubmitting ? (
            <>
              <Icon icon="mdi:loading" className="animate-spin" width={16} />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Submit
            </>
          )}
        </button>
      </div>

      {/* Error messages - chỉ hiển thị khi có error hoặc success */}
      {submitError && (
        <ErrorMessage
          type="error"
          title="Run Code Error"
          message={
            submitError?.data?.errorMessage ||
            submitError?.message ||
            "Failed to submit code"
          }
        />
      )}

      {finalSubmitError && (
        <ErrorMessage
          type="error"
          title="Submit Error"
          message={
            finalSubmitError?.data?.errorMessage ||
            finalSubmitError?.data?.message ||
            finalSubmitError?.data?.title ||
            finalSubmitError?.message ||
            "Failed to submit final test"
          }
        />
      )}

      {finalSubmitResult && (
        <ErrorMessage
          type="success"
          title="Submission Successful!"
          message="Your code has been submitted for final evaluation."
        />
      )}
    </div>
  );
};

export default CodeEditorSection;
