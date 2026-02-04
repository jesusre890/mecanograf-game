import type { Book } from "./game.book";

export type ReadingState = {
  book: Book;
  pageIndex: number;
  cursorIndex: number;
  errors: number;
  startedAt: number | null;
  finished: boolean;
};
