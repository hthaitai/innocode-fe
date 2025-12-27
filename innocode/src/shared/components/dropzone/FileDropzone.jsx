import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import toast from "react-hot-toast"

export function FileDropzone({
  onFileSelected,
  error,
  helperText,
  accept = { "image/*": [] },
  label,
  selectedFile, // new prop
  noBorder = false,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0])
      }
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept, // <-- use the prop dynamically
    multiple: false,
    onDrop,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0]
      if (!rejection) return

      const error = rejection.errors[0]
      if (!error) return

      switch (error.code) {
        case "file-invalid-type":
          toast.error("This file type is not allowed.")
          break
        case "file-too-large":
          toast.error("File is too large.")
          break
        case "too-many-files":
          toast.error("Only one file can be uploaded.")
          break
        default:
          toast.error(error.message)
      }
    },
  })

  return (
    <div className="w-full h-full">
      <div
        {...getRootProps()}
        className={`h-full flex flex-col items-center justify-center 
          rounded-[5px] cursor-pointer transition
          ${!noBorder ? "border border-dashed" : ""}
          ${!noBorder ? (error ? "border-red-500" : "border-[#909090]") : ""}
          ${
            isDragActive
              ? !noBorder
                ? "border-orange-400 bg-orange-50"
                : "bg-orange-50"
              : !noBorder
              ? "hover:border-orange-400"
              : ""
          }
        `}
      >
        <input {...getInputProps()} />

        <Upload className="text-[#7A7574]" size={20} />

        {selectedFile ? (
          <p className="mt-2 text-[12px] leading-[16px] text-[#7A7574] text-center">
            {selectedFile.name}
          </p>
        ) : (
          <p className="mt-3 text-sm leading-5 text-[#7A7574] text-center">
            {label || "Drag & drop your file here or click to select"}
          </p>
        )}
      </div>

      {helperText && (
        <p className={"mt-2 text-xs leading-4 text-[#7A7574]"}>{helperText}</p>
      )}
    </div>
  )
}
