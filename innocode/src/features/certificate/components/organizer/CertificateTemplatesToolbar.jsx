import React from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"

const CertificateTemplatesToolbar = ({ contestId }) => {
  const { t } = useTranslation(["certificate"])
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-end mb-3">
      <button
        onClick={() =>
          navigate(
            `/organizer/contests/${contestId}/certificates/templates/new`
          )
        }
        className="button-orange"
      >
        <span>{t("certificate:addTemplate")}</span>
      </button>
    </div>
  )
}

export default CertificateTemplatesToolbar
