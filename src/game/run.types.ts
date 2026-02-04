import type { GameMode } from "./game.types";

export type RunResult = {
  id: string;
  date: number;

  mode: GameMode;

  // normal
  bookId?: string;
  bookTitle?: string;

  avgWpm: number;
  peakWpm: number;
  accuracy: number;
  errors: number;
  time: number;

  score: number;

  // infinite
  sentencesCompleted?: number;
};
