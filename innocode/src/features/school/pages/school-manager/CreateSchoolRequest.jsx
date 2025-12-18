import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS, BREADCRUMB_PATHS } from '../../../../config/breadcrumbs';
import TextFieldFluent from "@/shared/components/TextFieldFluent";
import DropdownFluent from "@/shared/components/DropdownFluent";
import Label from "@/shared/components/form/Label";
import { useCreateSchoolCreationRequestMutation } from "@/services/schoolApi";
import { useGetAllProvincesQuery } from "@/services/provinceApi";
import { toast } from "react-hot-toast";
import { Icon } from "@iconify/react";

const CreateSchoolRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Address: "",
    ProvinceId: "",
    Contact: "",
    Evidences: [],
  });
  const [errors, setErrors] = useState({});

  // RTK Query hooks
  const [createSchoolRequest, { isLoading }] = useCreateSchoolCreationRequestMutation();
  const { data: provincesData, isLoading: isLoadingProvinces } = useGetAllProvincesQuery({ 
    pageNumber: 1, 
    pageSize: 100 
  });

  // Transform provinces data for dropdown
  const provinceOptions = useMemo(() => {
    if (!provincesData?.data) return [];
    return provincesData.data.map((province) => ({
      value: province.provinceId,
      label: province.provinceName || province.name,
    }));
  }, [provincesData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProvinceSelect = (value) => {
    setFormData((prev) => ({ ...prev, ProvinceId: value }));
    if (errors.ProvinceId) {
      setErrors((prev) => ({ ...prev, ProvinceId: "" }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, Evidences: files }));
    if (errors.Evidences) {
      setErrors((prev) => ({ ...prev, Evidences: "" }));
    }
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      Evidences: prev.Evidences.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = "School name is required";
    }

    if (!formData.ProvinceId) {
      newErrors.ProvinceId = "Province is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await createSchoolRequest({
        Name: formData.Name.trim(),
        ProvinceId: formData.ProvinceId,
        Address: formData.Address.trim() || undefined,
        Contact: formData.Contact.trim() || undefined,
        Evidences: formData.Evidences.length > 0 ? formData.Evidences : undefined,
      }).unwrap();

      toast.success("School creation request submitted successfully!");
      
      // Navigate back to list page
      navigate("/school-manager");
    } catch (error) {
      console.error("Error creating school request:", error);
      const errorMessage = error?.data?.errorMessage || error?.data?.message || "Failed to submit school creation request";
      toast.error(errorMessage);
    }
  };

  const disabled = isLoading || isLoadingProvinces;

  return (
    <PageContainer 
      breadcrumb={BREADCRUMBS.SCHOOL_CREATE_REQUEST}
      breadcrumbPaths={BREADCRUMB_PATHS.SCHOOL_CREATE_REQUEST}
    >
      <form onSubmit={handleSubmit}>
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 grid grid-cols-[max-content_1fr] gap-x-[28px] gap-y-5 items-start">
          {/* School Name */}
          <Label htmlFor="Name" required>
            School name
          </Label>
          <TextFieldFluent
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Enter school name"
            error={!!errors.Name}
            helperText={errors.Name}
          />

          {/* Province Dropdown */}
          <Label htmlFor="ProvinceId" required>
            Province
          </Label>
          <DropdownFluent
            id="ProvinceId"
            options={provinceOptions}
            value={formData.ProvinceId}
            onChange={handleProvinceSelect}
            placeholder={isLoadingProvinces ? "Loading provinces..." : "Select a province"}
            error={!!errors.ProvinceId}
            helperText={errors.ProvinceId}
            disabled={isLoadingProvinces}
          />

          {/* Address */}
          <Label htmlFor="Address">
            Address
          </Label>
          <TextFieldFluent
            id="Address"
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            placeholder="Enter school address"
            error={!!errors.Address}
            helperText={errors.Address}
          />

          {/* Contact */}
          <Label htmlFor="Contact">
            Contact
          </Label>
          <TextFieldFluent
            id="Contact"
            name="Contact"
            value={formData.Contact}
            onChange={handleChange}
            placeholder="Enter contact information"
            error={!!errors.Contact}
            helperText={errors.Contact}
          />

          {/* Evidence Files */}
          <Label htmlFor="evidence-upload">
            Evidence files
          </Label>
          <div className="flex flex-col w-full">
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-4">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="evidence-upload"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label
                htmlFor="evidence-upload"
                className="cursor-pointer flex items-center gap-2 text-sm text-gray-700 hover:text-orange-600"
              >
                <Icon icon="mdi:paperclip" width={20} />
                <span>
                  {formData.Evidences.length > 0
                    ? `${formData.Evidences.length} file(s) selected`
                    : "Click to upload evidence files"}
                </span>
              </label>
              {formData.Evidences.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.Evidences.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      <Icon icon="mdi:file" width={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Icon icon="mdi:close" width={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: Images, PDF, Word documents
            </p>
            {errors.Evidences && (
              <p className="text-xs text-red-500 mt-1">{errors.Evidences}</p>
            )}
          </div>

          {/* Submit Button */}
          <div></div> {/* Empty cell to align the button */}
          <div className="flex justify-start gap-2 mt-4">
            <button
              type="button"
              className="button-white"
              onClick={() => {
                setFormData({
                  Name: "",
                  Address: "",
                  ProvinceId: "",
                  Contact: "",
                  Evidences: [],
                });
                setErrors({});
              }}
              disabled={disabled}
            >
              Reset
            </button>
            <button
              type="submit"
              className={`flex items-center justify-center gap-2 ${
                disabled ? "button-gray" : "button-orange"
              }`}
              disabled={disabled}
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
              )}
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
};

export default CreateSchoolRequest;

