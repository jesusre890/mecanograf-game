import type { RunResult } from "./run.types";

export function calculateScore(run: Omit<RunResult, "id" | "date" | "score">) {
  const wpmScore = run.avgWpm * 10;
  const accuracyScore = run.accuracy * 5;
  const errorPenalty = run.errors * 20;

  return Math.max(0, Math.round(wpmScore + accuracyScore - errorPenalty));
}
