import React, { useRef } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FileUp, FileCode } from "lucide-react"
import {
  useUploadMockTestMutation,
  useGetRoundMockTestUrlQuery,
} from "@/services/roundApi"
import { toast } from "react-hot-toast"
import { Spinner } from "@/shared/components/SpinnerFluent"

const RoundMockTestUpload = ({ roundId }) => {
  const fileInputRef = useRef(null)
  const { contestId } = useParams()
  const { t } = useTranslation("round")
  const [uploadMockTest, { isLoading }] = useUploadMockTestMutation()
  const { data: mockTestUrl } = useGetRoundMockTestUrlQuery(roundId, {
    skip: !roundId,
  })

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.endsWith(".py")) {
      toast.error(t("mockTest.errorExtension"))
      return
    }

    try {
      await uploadMockTest({ roundId, contestId, file }).unwrap()
      toast.success(t("mockTest.success"))
    } catch (error) {
      console.error("Upload failed", error)
      toast.error(t("mockTest.errorGeneric"))
    } finally {
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <div
            className="flex gap-5 items-center cursor-pointer"
            onClick={triggerFileUpload}
          >
            <FileCode size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">
                {t("mockTest.title")}
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                {t("mockTest.description")}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={triggerFileUpload}
          className={`${isLoading ? "button-gray" : "button-orange"} px-3`}
          disabled={isLoading}
        >
          {mockTestUrl ? t("mockTest.changeFile") : t("mockTest.upload")}
        </button>
      </div>

      {/* Existing File Section */}
      {mockTestUrl && (
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px] text-sm leading-5">
          <div className="flex gap-5 items-center">
            <FileUp size={20} />
            <div>{mockTestUrl.split("/").pop()}</div>
          </div>

          <button
            type="button"
            className="button-white px-3"
            onClick={() => {
              const link = document.createElement("a")
              link.href = mockTestUrl
              link.setAttribute("download", "")
              link.target = "_blank"
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            {t("mockTest.download")}
          </button>
        </div>
      )}

      <input
        type="file"
        accept=".py"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}

export default RoundMockTestUpload
