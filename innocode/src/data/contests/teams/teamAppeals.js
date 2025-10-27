export const teamAppeals = [
  {
    appeal_id: 1,
    team_id: 1,
    target_type: "submission",
    target_id: 1, // submission_id = 1
    owner_id: 1001, // student who submitted the appeal
    state: "resolved", // open | under_review | accepted | rejected | escalated
    reason: "We believe our solution was incorrectly scored due to timeout.",
    decision: "Score adjusted after re-evaluation.",
    created_at: "2025-10-24T12:00:00Z",
  },
  {
    appeal_id: 2,
    team_id: 1,
    target_type: "submission",
    target_id: 2,
    owner_id: 1002,
    state: "under_review",
    reason: "Clarification request for partial credit.",
    decision: null,
    created_at: "2025-10-26T15:00:00Z",
  },
]
