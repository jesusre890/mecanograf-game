export type GameMode = "normal" | "infinite" | "time_attack" | "practice" | "reading";

export type GameStatus = "typing" | "error" | "completed" | "finished";

export type GameState = {
  mode: GameMode | null;
  timeLimit?: number;
  chapterIndex: number;
  sentenceIndex: number;
  lastCompletedSentenceIndex: number;
  userInput: string;
  status: GameStatus;
  runStartedAt: number | null;
};
