import React, { useEffect, useRef, useState } from "react"
import { FileDropzone } from "../../../../shared/components/dropzone/FileDropzone"
import Label from "../../../../shared/components/form/Label"
import { AnimatePresence, motion } from "framer-motion"

const ContestImageField = ({ imgFile, imgUrl, error, onChange }) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!imgFile) {
      setPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(imgFile)
    setPreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [imgFile])

  const handleFileSelect = (file) => {
    if (file) {
      onChange(file)
    }
  }

  return (
    <>
      {/* Image Preview / Dropzone */}
      <div>
        {previewUrl ? (
          <div className="mb-4 flex w-[335px] h-[188px] border border-[#E5E5E5]">
            <img
              src={previewUrl}
              alt="Contest image preview"
              className="w-full h-full object-cover rounded-[5px]"
            />
          </div>
        ) : imgUrl ? (
          <div className="mb-4 flex w-[335px] h-[188px] border border-[#E5E5E5]">
            <img
              src={imgUrl}
              alt="Current contest image"
              className="w-full h-full object-cover rounded-[5px]"
            />
          </div>
        ) : (
          <div className="mb-10 flex w-[335px] h-[188px]">
            <FileDropzone
              onFileSelected={handleFileSelect}
              error={!!error}
              accept={{
                "image/png": [],
                "image/jpeg": [],
              }}
              helperText="Only PNG and JPG, JPEG files are allowed."
            />
          </div>
        )}
      </div>

      {/* Upload Control */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
        <div className="mb-2">
          <Label htmlFor="imgFile" required>
            Image upload
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            id="imgFile"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="button-orange"
          >
            {imgFile ? "Change" : "Browse"}
          </button>

          {imgFile && (
            <span className="text-sm leading-5 text-[#7A7574]">
              {imgFile.name}
            </span>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs mt-1 text-[#D32F2F]"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default ContestImageField
