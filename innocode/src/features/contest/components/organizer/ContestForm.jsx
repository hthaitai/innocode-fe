import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { AnimatePresence, motion } from "framer-motion"
import DateTimeFieldFluent from "../../../../shared/components/DateTimeFieldFluent"

const ContestForm = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const finalValue = type === "checkbox" ? checked : value
    setFormData((prev) => ({ ...prev, [name]: finalValue }))

    // Clear field-specific error when user types
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <TextFieldFluent
        label="Year"
        name="year"
        type="number"
        value={formData.year || ""}
        onChange={handleChange}
        error={!!errors.year}
        helperText={errors.year}
      />

      <div className="flex flex-col">
        <TextFieldFluent
          label="Contest Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          data-error={!!errors.name}
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

      <TextFieldFluent
        label="Description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        multiline
        rows={4}
        error={!!errors.description}
        helperText={errors.description}
      />

      <TextFieldFluent
        label="Image URL"
        name="imgUrl"
        value={formData.imgUrl || ""}
        onChange={handleChange}
        error={!!errors.imgUrl}
        helperText={errors.imgUrl}
      />

      <DateTimeFieldFluent
        label="Registration Start"
        name="registrationStart"
        type="datetime-local"
        value={formData.registrationStart || ""}
        onChange={handleChange}
        error={!!errors.registrationStart}
        helperText={errors.registrationStart}
      />

      <DateTimeFieldFluent
        label="Registration End"
        name="registrationEnd"
        type="datetime-local"
        value={formData.registrationEnd || ""}
        onChange={handleChange}
        error={!!errors.registrationEnd}
        helperText={errors.registrationEnd}
      />

      <DateTimeFieldFluent
        label="Start"
        name="start"
        type="datetime-local"
        value={formData.start || ""}
        onChange={handleChange}
        error={!!errors.start}
        helperText={errors.start}
      />

      <DateTimeFieldFluent
        label="End"
        name="end"
        type="datetime-local"
        value={formData.end || ""}
        onChange={handleChange}
        error={!!errors.end}
        helperText={errors.end}
      />

      <TextFieldFluent
        label="Max Team Members"
        name="teamMembersMax"
        type="number"
        value={formData.teamMembersMax || ""}
        onChange={handleChange}
        error={!!errors.teamMembersMax}
        helperText={errors.teamMembersMax}
      />

      <TextFieldFluent
        label="Max Teams"
        name="teamLimitMax"
        type="number"
        value={formData.teamLimitMax || ""}
        onChange={handleChange}
        error={!!errors.teamLimitMax}
        helperText={errors.teamLimitMax}
      />

      <TextFieldFluent
        label="Rewards Text"
        name="rewardsText"
        value={formData.rewardsText || ""}
        onChange={handleChange}
        multiline
        rows={3}
        error={!!errors.rewardsText}
        helperText={errors.rewardsText}
      />
    </div>
  )
}

export default ContestForm
