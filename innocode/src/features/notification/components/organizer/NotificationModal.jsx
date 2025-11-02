import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import NotificationForm from "./NotificationForm"
import { validateNotification } from "@/shared/validators/notificationValidator"

export default function NotificationModal({ isOpen, onSubmit, onClose }) {
  const emptyData = {
    type: "",
    channel: "web",
    payload: "",
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData(emptyData)
      setErrors({})
    }
  }, [isOpen])

  const handleSubmit = async () => {
    const validationErrors = validateNotification(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData) // sendNotification() in parent
      onClose()
    }
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="button-orange" onClick={handleSubmit}>
        Send Notification
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Notification"
      size="md"
      footer={footer}
    >
      <NotificationForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />
    </BaseModal>
  )
}
