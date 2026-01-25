export type GameStatus = "typing" | "error" | "completed";

export type GameState = {
  chapterIndex: number;
  sentenceIndex: number;
  lastCompletedSentenceIndex: number;
  userInput: string;
  status: GameStatus;
};
