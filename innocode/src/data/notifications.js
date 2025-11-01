export const notifications = [
  {
    notification_id: 1,
    user_id: 1,
    type: "round_opened",
    channel: "web",
    payload: "Qualification round has been opened for all teams!",
    sent_at: "2025-10-28T09:30:00Z",
  },
  {
    notification_id: 2,
    user_id: 2,
    type: "result_published",
    channel: "email",
    payload: "Semi-final results are now published. Check your ranking!",
    sent_at: "2025-10-29T15:45:00Z",
  },
  {
    notification_id: 3,
    user_id: 0, // system-wide or broadcast
    type: "round_opened",
    channel: "web",
    payload: "Final round will start at 9:00 AM on November 3.",
    sent_at: "2025-10-31T11:00:00Z",
  },
  {
    notification_id: 4,
    user_id: 3,
    type: "result_published",
    channel: "web",
    payload: "Congratulations! Your team ranked in the top 10!",
    sent_at: "2025-11-01T08:15:00Z",
  },
]
