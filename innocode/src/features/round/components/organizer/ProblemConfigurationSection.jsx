import Label from "@/shared/components/form/Label"
import DropdownFluent from "@/shared/components/DropdownFluent"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { AnimatePresence, motion } from "framer-motion"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

export default function ProblemConfigurationSection({
  formData,
  setFormData,
  errors,
  setErrors,
  handleNestedChange,
  handleFileChange,
  fileInputRef,
  isRetakeRound,
}) {
  const handleProblemTypeChange = (val) => {
    const updated = { ...formData, problemType: val }

    if (val === "McqTest") {
      updated.mcqTestConfig = { config: "" }
      updated.problemConfig = null
    } else if (val === "AutoEvaluation") {
      updated.problemConfig = {
        description: "",
        language: "Python 3",
        penaltyRate: 0.1,
        type: val,
        testType: "InputOutput",
      }
      updated.mcqTestConfig = null
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
    <div className="space-y-1">
      {!isRetakeRound && (
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 flex flex-col gap-2">
          <Label required>Problem type</Label>

          <div className="min-w-[130px] w-max">
            <DropdownFluent
              options={[
                { value: "McqTest", label: "Multiple choice questions" },
                { value: "Manual", label: "Manual test" },
                { value: "AutoEvaluation", label: "Auto test" },
              ]}
              value={formData.problemType || ""}
              onChange={handleProblemTypeChange}
              error={!!errors.problemType}
              helperText={errors.problemType}
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        {formData.problemType === "AutoEvaluation" && (
          <div className="space-y-5 border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
            <div className="flex flex-col gap-2">
              <Label required>Test type</Label>
              <div className="min-w-[150px] w-max">
                <DropdownFluent
                  options={[
                    { value: "InputOutput", label: "Input/Output" },
                    { value: "MockTest", label: "Mock Test" },
                  ]}
                  value={formData.problemConfig?.testType || "InputOutput"}
                  onChange={(val) =>
                    handleNestedChange("problemConfig", "testType", val)
                  }
                  error={!!errors.problemConfigTestType}
                  helperText={errors.problemConfigTestType}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label required>Description</Label>
              <TextFieldFluent
                multiline
                rows={4}
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
            </div>

            <div className="flex flex-col gap-2">
              <Label>Language</Label>
              <TextFieldFluent
                value={formData.problemConfig?.language || ""}
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
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
            </div>
          </div>
        )}

        {formData.problemType === "Manual" && (
          <div className="space-y-5 border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
            <div className="flex flex-col gap-2">
              <Label required>Description</Label>
              <TextFieldFluent
                multiline
                rows={4}
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
            </div>

            <div className="flex flex-col gap-2">
              <Label>Language</Label>
              <TextFieldFluent
                value={formData.problemConfig?.language || ""}
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
