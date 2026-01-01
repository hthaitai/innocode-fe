import React from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

const CertificateTemplatesToolbar = ({ contestId }) => {
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
        <span>Add template</span>
      </button>
    </div>
  )
}

export default CertificateTemplatesToolbar
