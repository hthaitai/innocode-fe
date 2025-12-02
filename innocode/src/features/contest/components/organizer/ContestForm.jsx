import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { AnimatePresence, motion } from "framer-motion"
import DateTimeFieldFluent from "../../../../shared/components/datetimefieldfluent/DateTimeFieldFluent"
import { toast } from "react-hot-toast"
import { FileDropzone } from "../../../../shared/components/dropzone/FileDropzone"
import Label from "../../../../shared/components/form/Label"

const ContestForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit,
  isSubmitting,
  mode = "create",
  hasChanges,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const finalValue = type === "checkbox" ? checked : value
    setFormData((prev) => ({ ...prev, [name]: finalValue }))

    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmitClick = () => {
    if (!onSubmit) {
      toast.error("No submit handler provided")
      return
    }
    onSubmit()
  }

  const disabled = !!isSubmitting || (mode === "edit" && !hasChanges)

  return (
    <>
      <div className="mb-4 flex w-[335px] h-[188px] rounded-[5px] overflow-hidden">
        {formData.imgFile ? (
          <img
            src={URL.createObjectURL(formData.imgFile)}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : formData.imgUrl ? (
          <img
            src={formData.imgUrl}
            alt="Current"
            className="w-full h-full object-cover"
          />
        ) : (
          <FileDropzone
            onFileSelected={(file) =>
              setFormData((prev) => ({ ...prev, imgFile: file }))
            }
            error={!!errors.imgFile}
            helperText={errors.imgFile}
          />
        )}
      </div>

      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 grid grid-cols-[max-content_1fr] gap-x-[28px] gap-y-5 items-start">
        {/* Image Upload Button */}
        <Label htmlFor="imgFile">Image upload</Label>
        <div className="flex flex-col">
          <div>
            <input
              id="imgFile"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setFormData((prev) => ({ ...prev, imgFile: file }))
                }
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById("imgFile").click()}
              className="button-orange"
            >
              {formData.imgFile ? "Change" : "Browse"}
            </button>
          </div>

          {errors.imgFile && (
            <span className="text-xs leading-4 mt-1 text-[#D32F2F]">
              {errors.imgFile}
            </span>
          )}
        </div>

        {/* Contest Name */}
        <Label htmlFor="name" required>
          Contest name
        </Label>
        <div className="flex flex-col w-full">
          <TextFieldFluent
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <AnimatePresence>
            {errors.nameSuggestion && (
              <motion.button
                key="name-suggestion"
                type="button"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    name: errors.nameSuggestion,
                  }))
                  setErrors((prev) => ({
                    ...prev,
                    name: "",
                    nameSuggestion: "",
                  }))
                }}
                className="text-[#D32F2F] text-xs leading-4 mt-1 self-start"
              >
                Use suggested name:{" "}
                <span className="hover:underline cursor-pointer">
                  {errors.nameSuggestion}
                </span>
                .
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Description */}
        <Label htmlFor="description">Description</Label>
        <TextFieldFluent
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description}
        />

        {/* Registration Start */}
        <Label htmlFor="registrationStart" required>
          Registration start
        </Label>
        <DateTimeFieldFluent
          id="registrationStart"
          name="registrationStart"
          type="datetime-local"
          value={formData.registrationStart || ""}
          onChange={handleChange}
          error={!!errors.registrationStart}
          helperText={errors.registrationStart}
        />

        {/* Registration End */}
        <Label htmlFor="registrationEnd" required>
          Registration end
        </Label>
        <DateTimeFieldFluent
          id="registrationEnd"
          name="registrationEnd"
          type="datetime-local"
          value={formData.registrationEnd || ""}
          onChange={handleChange}
          error={!!errors.registrationEnd}
          helperText={errors.registrationEnd}
        />

        {/* Contest Start */}
        <Label htmlFor="start" required>
          Contest start date
        </Label>
        <DateTimeFieldFluent
          id="start"
          name="start"
          type="datetime-local"
          value={formData.start || ""}
          onChange={handleChange}
          error={!!errors.start}
          helperText={errors.start}
        />

        {/* Contest End */}
        <Label htmlFor="end" required>
          Contest end date
        </Label>
        <DateTimeFieldFluent
          id="end"
          name="end"
          type="datetime-local"
          value={formData.end || ""}
          onChange={handleChange}
          error={!!errors.end}
          helperText={errors.end}
        />

        {/* Max Team Members */}
        <Label htmlFor="teamMembersMax" required>
          Max team members
        </Label>
        <TextFieldFluent
          id="teamMembersMax"
          name="teamMembersMax"
          type="number"
          value={formData.teamMembersMax || ""}
          onChange={handleChange}
          error={!!errors.teamMembersMax}
          helperText={errors.teamMembersMax}
        />

        {/* Max Teams */}
        <Label htmlFor="teamLimitMax" required>
          Max teams
        </Label>
        <TextFieldFluent
          id="teamLimitMax"
          name="teamLimitMax"
          type="number"
          value={formData.teamLimitMax || ""}
          onChange={handleChange}
          error={!!errors.teamLimitMax}
          helperText={errors.teamLimitMax}
        />

        {/* Rewards Text */}
        <Label htmlFor="rewardsText">Rewards text</Label>
        <TextFieldFluent
          id="rewardsText"
          name="rewardsText"
          value={formData.rewardsText || ""}
          onChange={handleChange}
          multiline
          rows={3}
          error={!!errors.rewardsText}
          helperText={errors.rewardsText}
        />

        {/* Submit Button */}
        {onSubmit && (
          <>
            <div></div> {/* Empty cell to align the button */}
            <div className="flex justify-start mt-4">
              <button
                type="button"
                onClick={handleSubmitClick}
                disabled={disabled}
                className={`flex items-center justify-center gap-2 ${
                  disabled ? "button-gray" : "button-orange"
                }`}
              >
                {isSubmitting && (
                  <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
                )}

                {isSubmitting
                  ? mode === "edit"
                    ? "Saving..."
                    : "Creating..."
                  : mode === "edit"
                  ? "Save"
                  : "Create"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ContestForm
