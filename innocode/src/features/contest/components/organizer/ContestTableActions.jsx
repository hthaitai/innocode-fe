import React, { useCallback } from "react"
import { Trophy } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ContestTableActions = () => {
  const navigate = useNavigate()

  const handleAddContest = useCallback(
    () => navigate("/organizer/contests/add"),
    [navigate]
  )

  return (
    <div className="flex justify-between items-center min-h-[70px] px-5">
      <p className="text-[14px] leading-[20px] font-medium">Contests</p>

      <button className="button-orange" onClick={handleAddContest}>
        Add contest
      </button>
    </div>
  )
}

export default ContestTableActions
