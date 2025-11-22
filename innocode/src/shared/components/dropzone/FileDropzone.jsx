import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

export function FileDropzone({ onFileSelected, error, helperText }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0])
      }
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop,
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`w-full h-[188px] flex flex-col items-center justify-center 
          border-1 border-dashed rounded-[5px] cursor-pointer transition
          ${error ? "border-red-500" : "border-[#909090]"}
          ${
            isDragActive
              ? "border-orange-400 bg-orange-50"
              : "hover:border-orange-400"
          }
        `}
      >
        <input {...getInputProps()} />

        <Upload className="text-[#7A7574]" size={20} />

        <p className="mt-2 text-[12px] leading-[16px] text-[#7A7574]">
          Drag & drop your image here or click to select
        </p>
      </div>

      {helperText && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}
