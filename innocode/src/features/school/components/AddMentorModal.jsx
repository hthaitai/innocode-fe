import React, { useState, useEffect } from "react";
import BaseModal from "@/shared/components/BaseModal";
import TextFieldFluent from "@/shared/components/TextFieldFluent";
import { useAddMentorToSchoolMutation } from "@/services/schoolApi";
import { toast } from "react-hot-toast";
import { Icon } from "@iconify/react";

export default function AddMentorModal({
  isOpen,
  onClose,
  schoolId,
}) {
  const emptyData = {
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  };

  const [formData, setFormData] = useState(emptyData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [addMentor, { isLoading }] = useAddMentorToSchoolMutation();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(emptyData);
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate fullname
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s\u00C0-\u1EF9]+$/.test(formData.fullname.trim())) {
      newErrors.fullname = "Full name can only contain letters and spaces";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Invalid email format";
      }
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = "Phone number contains invalid characters";
      } else if (formData.phone.trim().replace(/[^0-9]/g, "").length < 10) {
        newErrors.phone = "Phone number must contain at least 10 digits";
      }
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else {
      // Check password strength
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        newErrors.password = "Password must contain uppercase, lowercase, and number";
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {

    try {
      await addMentor({
        schoolId,
        data: {
          fullname: formData.fullname.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone.trim(),
        },
      }).unwrap();

      toast.success("Mentor added successfully");
      onClose();
    } catch (error) {
      const errorMessage =
        error?.data?.errorMessage ||
        error?.data?.message ||
        error?.message ||
        "Failed to add mentor";
      toast.error(errorMessage);
    }
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="button-white"
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        type="button"
        className="button-orange"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Mentor"}
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Mentor"
      size="lg"
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        {/* Full Name */}
        <TextFieldFluent
          label="Full Name"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          error={!!errors.fullname}
          helperText={errors.fullname}
          placeholder="Enter full name"
        />

        {/* Email */}
        <TextFieldFluent
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          placeholder="Enter email address"
        />

        {/* Phone */}
        <TextFieldFluent
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          placeholder="Enter phone number"
        />

        {/* Password */}
        <TextFieldFluent
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          placeholder="Enter password"
          endButton={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:bg-orange-100 rounded transition-colors"
              tabIndex={-1}
            >
              <Icon
                icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                className="h-5 w-5 text-gray-500 hover:text-orange-500"
              />
            </button>
          }
        />

        {/* Confirm Password */}
        <TextFieldFluent
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          placeholder="Confirm password"
          endButton={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-1 hover:bg-orange-100 rounded transition-colors"
              tabIndex={-1}
            >
              <Icon
                icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                className="h-5 w-5 text-gray-500 hover:text-orange-500"
              />
            </button>
          }
        />
      </div>
    </BaseModal>
  );
}

