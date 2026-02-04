export type ScoreInput = {
  avgWpm: number;
  accuracy: number;
  errors: number;
  sentencesCompleted?: number;
};

export function calculateScore({
  avgWpm,
  accuracy,
  errors,
  sentencesCompleted = 0,
}: ScoreInput) {
  const wpmScore = avgWpm * 10;
  const accuracyScore = accuracy * 5;
  const errorPenalty = errors * 20;

  const sentencesBonus = sentencesCompleted * 200;

  return Math.max(
    0,
    Math.round(wpmScore + accuracyScore + sentencesBonus - errorPenalty),
  );
}
