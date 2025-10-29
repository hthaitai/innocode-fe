export const appeals = [
  {
    appeal_id: 1,
    team_id: 1,
    target_type: "submission",
    target_id: 203,
    owner_id: 2, // Bob Tran
    state: "open",
    reason: "Output mismatch on hidden test case",
    decision: "",
    created_at: "2025-10-20T08:30:00Z",
  },
  {
    appeal_id: 2,
    team_id: 2,
    target_type: "mcq_attempt",
    target_id: 402,
    owner_id: 3, // Charlie Le
    state: "under_review",
    reason: "MCQ timer issue during submission",
    decision: "",
    created_at: "2025-10-22T14:15:00Z",
  },
  {
    appeal_id: 3,
    team_id: 3,
    target_type: "submission",
    target_id: 305,
    owner_id: 1, // Alice Nguyen
    state: "accepted",
    reason: "Incorrect grading on edge case",
    decision: "Appeal accepted; score adjusted.",
    created_at: "2025-10-23T09:45:00Z",
  },
  {
    appeal_id: 4,
    team_id: 1,
    target_type: "mcq_attempt",
    target_id: 410,
    owner_id: 2, // Bob Tran
    state: "rejected",
    reason: "Suspected cheating on MCQ",
    decision: "No evidence found; appeal rejected.",
    created_at: "2025-10-24T11:20:00Z",
  },
  {
    appeal_id: 5,
    team_id: 4,
    target_type: "submission",
    target_id: 212,
    owner_id: 3, // Charlie Le
    state: "escalated",
    reason: "Dispute over code plagiarism detection",
    decision: "",
    created_at: "2025-10-25T13:50:00Z",
  },
  {
    appeal_id: 6,
    team_id: 2,
    target_type: "mcq_attempt",
    target_id: 415,
    owner_id: 1, // Alice Nguyen
    state: "open",
    reason: "Question ambiguity in MCQ",
    decision: "",
    created_at: "2025-10-26T15:30:00Z",
  },
  {
    appeal_id: 7,
    team_id: 5,
    target_type: "submission",
    target_id: 220,
    owner_id: 2, // Bob Tran
    state: "under_review",
    reason: "Runtime error not reproducible",
    decision: "",
    created_at: "2025-10-27T10:10:00Z",
  },
  {
    appeal_id: 8,
    team_id: 3,
    target_type: "mcq_attempt",
    target_id: 422,
    owner_id: 3, // Charlie Le
    state: "accepted",
    reason: "Technical glitch during MCQ submission",
    decision: "Appeal accepted; attempt reset.",
    created_at: "2025-10-28T12:40:00Z",
  },
  {
    appeal_id: 9,
    team_id: 1,
    target_type: "submission",
    target_id: 225,
    owner_id: 1, // Alice Nguyen
    state: "rejected",
    reason: "Appeal for partial credit",
    decision: "Rules do not allow partial credit; rejected.",
    created_at: "2025-10-29T14:00:00Z",
  },
  {
    appeal_id: 10,
    team_id: 4,
    target_type: "mcq_attempt",
    target_id: 430,
    owner_id: 2, // Bob Tran
    state: "escalated",
    reason: "Disagreement on correct MCQ answer",
    decision: "",
    created_at: "2025-10-30T16:25:00Z",
  },
]
