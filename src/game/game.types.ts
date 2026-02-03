export type GameStatus = "typing" | "error" | "completed" | "finished";

export type GameState = {
  chapterIndex: number;
  sentenceIndex: number;
  lastCompletedSentenceIndex: number;
  userInput: string;
  status: GameStatus;
  runStartedAt: number | null;
};
