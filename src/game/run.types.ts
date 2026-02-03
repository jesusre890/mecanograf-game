export type RunResult = {
  id: string;
  date: number;

  bookId: string;
  bookTitle: string;

  avgWpm: number;
  peakWpm: number;
  accuracy: number;
  errors: number;
  time: number;

  score: number;
};
