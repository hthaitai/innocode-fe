import React from "react"
import { useNavigate, useParams } from "react-router-dom"

const McqTableActions = () => {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  return (
    <div className="px-5 flex justify-between items-center min-h-[70px]">
      <p className="text-[14px] leading-[20px] font-medium">Multiple choice questions</p>

      <button
        className="button-orange"
        onClick={() =>
          navigate(
            `/organizer/contests/${contestId}/rounds/${roundId}/mcqs/new`
          )
        }
      >
        Add questions
      </button>
    </div>
  )
}

export default McqTableActions
