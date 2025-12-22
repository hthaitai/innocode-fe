import Label from "@/shared/components/form/Label"
import DropdownFluent from "@/shared/components/DropdownFluent"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { AnimatePresence, motion } from "framer-motion"

export default function ProblemConfigurationSection({
  formData,
  setFormData,
  errors,
  setErrors,
  handleNestedChange,
  handleFileChange,
  fileInputRef,
}) {
  const handleProblemTypeChange = (val) => {
    const updated = { ...formData, problemType: val }

    if (val === "McqTest") {
      updated.mcqTestConfig = { name: "", config: "" }
      updated.problemConfig = null
    } else {
      updated.problemConfig = {
        description: "",
        language: "Python 3",
        penaltyRate: 0.1,
        type: val,
      }
      updated.mcqTestConfig = null
    }

    setFormData(updated)
    if (errors.problemType) {
      setErrors((prev) => ({ ...prev, problemType: "" }))
    }
  }

  return (
    <>
      {/* {!formData.isRetakeRound && (
        <> */}
          <Label required>Problem type</Label>
          <DropdownFluent
            options={[
              { value: "McqTest", label: "MCQ" },
              { value: "Manual", label: "Manual Problem" },
              { value: "AutoEvaluation", label: "Auto Evaluation" },
            ]}
            value={formData.problemType || ""}
            onChange={handleProblemTypeChange}
            error={!!errors.problemType}
            helperText={errors.problemType}
          />

          {formData.problemType === "McqTest" && (
            <>
              <Label>Test name</Label>
              <TextFieldFluent
                value={formData.mcqTestConfig?.name || ""}
                onChange={(e) =>
                  handleNestedChange("mcqTestConfig", "name", e.target.value)
                }
                error={!!errors.mcqName}
                helperText={errors.mcqName}
              />
            </>
          )}

          {["Manual", "AutoEvaluation"].includes(formData.problemType) && (
            <>
              <Label required>Description</Label>
              <TextFieldFluent
                multiline
                rows={10}
                value={formData.problemConfig?.description || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "problemConfig",
                    "description",
                    e.target.value
                  )
                }
                error={!!errors.problemConfigDescription}
                helperText={errors.problemConfigDescription}
              />

              <Label>Language</Label>
              <TextFieldFluent
                value={formData.problemConfig?.language || ""}
                disabled
              />

              <Label>Penalty rate</Label>
              <TextFieldFluent
                type="number"
                value={formData.problemConfig?.penaltyRate ?? 0.1}
                onChange={(e) =>
                  handleNestedChange(
                    "problemConfig",
                    "penaltyRate",
                    parseFloat(e.target.value)
                  )
                }
              />

              <Label>Template file</Label>
              <div>
                <input
                  type="file"
                  accept=".py"
                  hidden
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />

                <button
                  type="button"
                  className="button-orange px-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.TemplateFile ? "Change file" : "Browse"}
                </button>

                {formData.TemplateFile && (
                  <span className="ml-2 text-sm text-[#7A7574]">
                    {formData.TemplateFile.name}
                  </span>
                )}

                <AnimatePresence>
                  {errors.templateFile && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs mt-1 text-[#D32F2F]"
                    >
                      {errors.templateFile}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </>
    //   )}
    // </>
  )
}
