import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";
import { useUpdateUserMeMutation } from "../../../../services/userApi";

const InfoField = ({
  label,
  value,
  icon,
  showEdit = true,
  field,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  isLoading,
}) => {
  const [editValue, setEditValue] = useState(value || "");
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (isEditing) {
      setEditValue(value || "");
      setError("");
    }
  }, [isEditing, value]);

  if (!value && !isEditing) return null;

  const validate = () => {
    if (!editValue || editValue.trim() === "") {
      setError(`${label} is required`);
      return false;
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editValue.trim())) {
        setError("Please enter a valid email address");
        return false;
      }
    }

    if (field === "fullName" && editValue.trim().length < 2) {
      setError("Full name must be at least 2 characters");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(editValue.trim());
    }
  };

  const handleCancel = () => {
    setEditValue(value || "");
    setError("");
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="group">
      <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        {label}
      </label>
      <div
        className={`relative bg-gray-50 border-2 rounded-xl p-2 transition-all duration-200 ${
          isEditing
            ? "border-orange-400 ring-2 ring-orange-100"
            : "border-gray-200 hover:border-orange-300 group-hover:shadow-md"
        }`}
      >
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Icon icon={icon} className="h-5 w-5 text-gray-400" />
              <input
                type={field === "email" ? "email" : "text"}
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                autoFocus
                className="flex-1 text-base text-gray-800 font-medium bg-transparent border-none outline-none focus:outline-none"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
            {error && <p className="text-sm text-red-500 ml-8">{error}</p>}
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || editValue.trim() === value}
                className={`px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading || editValue.trim() === value
                    ? "bg-gray-400"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon icon={icon} className="h-5 w-5 text-gray-400" />
              <span className="text-base text-gray-800 font-medium">
                {value}
              </span>
            </div>
            {showEdit && (
              <button
                onClick={() => onEdit(field)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-orange-100 rounded-lg transition-all duration-200"
              >
                <Icon icon="mdi:pencil" className="h-5 w-5 text-orange-500" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function AboutTab({ user }) {
  const details = user?.details || {};
  const [editingField, setEditingField] = useState(null);
  const [updateUserMe, { isLoading }] = useUpdateUserMeMutation();

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleSave = async (newValue) => {
    try {
      const payload = {
        [editingField]: newValue,
      };

      await updateUserMe(payload).unwrap();
      toast.success(
        `${
          editingField === "fullName" ? "Full Name" : "Email"
        } updated successfully`
      );
      setEditingField(null);
    } catch (error) {
      toast.error(error?.data?.message || `Failed to update ${editingField}`);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Personal Information
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <InfoField
          label="Full Name"
          value={user?.fullName}
          icon="mdi:account-box-outline"
          field="fullName"
          isEditing={editingField === "fullName"}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          isLoading={isLoading}
        />

        <InfoField
          label="Email Address"
          value={user?.email}
          icon="mdi:email-outline"
          isLoading={isLoading}
          showEdit={false}
        />

        {details.grade && (
          <InfoField
            label="Grade"
            value={`Grade ${details.grade}`}
            icon="mdi:school-outline"
            showEdit={false}
          />
        )}

        {details.province && (
          <InfoField
            label="Province"
            value={details.province}
            icon="mdi:map-marker-outline"
            showEdit={false}
          />
        )}

        {details.schoolName && (
          <InfoField
            label="School"
            value={details.schoolName}
            icon="mdi:school"
            showEdit={false}
          />
        )}
      </div>
    </div>
  );
}
