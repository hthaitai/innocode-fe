import React from "react";
import { Icon } from "@iconify/react";
import { Code, Play, CheckCircle } from "lucide-react";
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
}) => {
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

      <CodeEditor
        value={code}
        onChange={setCode}
        language={language}
        height="750px"
        defaultValue={CODE_SNIPPETS.python}
        theme={theme || "vs-dark"}
      />

      {/* Auto-save indicator */}
      {code && (
        <div className="flex items-center gap-1 mt-2 text-xs text-[#7A7574]">
          <Icon icon="mdi:content-save" width={14} />
          <span>Auto-saved</span>
        </div>
      )}

      {/* Clear button */}
      {code && (
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
          disabled={submitting}
          className="flex-1 button-white flex items-center justify-center gap-2"
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
          disabled={finalSubmitting || !submissionId}
          className={`flex-1 button-orange flex items-center justify-center gap-2 ${
            !submissionId ? "opacity-50 cursor-not-allowed" : ""
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
