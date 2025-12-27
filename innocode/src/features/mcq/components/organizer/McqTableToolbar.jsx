import React from "react"
import { useNavigate, useParams } from "react-router-dom"

const McqTableToolbar = () => {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  return (
    <div className="flex justify-end items-center mb-3">
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

export default McqTableToolbar
