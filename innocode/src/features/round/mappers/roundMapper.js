export function mapRound(apiRound) {
  if (!apiRound) return null

  return {
    roundId: apiRound.roundId,
    contestId: apiRound.contestId,
    name: apiRound.name ?? apiRound.roundName ?? "Untitled Round",
    roundName: apiRound.roundName ?? apiRound.name ?? "Untitled Round",
    contestName: apiRound.contestName ?? null,
    status: apiRound.status ?? null,
    start: apiRound.start ?? null,
    end: apiRound.end ?? null,

    // Ensure problemType is always a safe string
    problemType: apiRound.problemType ?? "No Type",

    // Preserve original API objects for display
    mcqTest: apiRound.mcqTest ?? null,
    problem: apiRound.problem ?? null,

    // Also provide mapped versions for form compatibility
    mcqTestConfig: apiRound.mcqTestConfig ?? apiRound.mcqTest ?? null,
    problemConfig: apiRound.problemConfig ?? apiRound.problem ?? null,

    timeLimitSeconds: apiRound.timeLimitSeconds ?? apiRound.timeLimit ?? 0,
  }
}

export function mapRoundList(apiRounds = []) {
  return apiRounds.map(mapRound).filter(Boolean)
}
