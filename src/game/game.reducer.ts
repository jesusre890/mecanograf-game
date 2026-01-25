import type { GameState } from "./game.types";

export type GameAction =
  | { type: "TYPE"; value: string }
  | { type: "RESET_INPUT" }
  | { type: "COMPLETE_SENTENCE" }
  | { type: "ERROR" };

export const initialGameState: GameState = {
  chapterIndex: 0,
  sentenceIndex: 0,
  lastCompletedSentenceIndex: 0,
  userInput: "",
  status: "typing",
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "TYPE":
      return {
        ...state,
        userInput: action.value,
        status: "typing",
      };

    case "COMPLETE_SENTENCE":
      return {
        ...state,
        lastCompletedSentenceIndex: state.sentenceIndex,
        sentenceIndex: state.sentenceIndex + 1,
        userInput: "",
        status: "completed",
      };

    case "ERROR":
      return {
        ...state,
        userInput: "",
        sentenceIndex: state.lastCompletedSentenceIndex,
        status: "error",
      };

    case "RESET_INPUT":
      return {
        ...state,
        userInput: "",
        status: "typing",
      };

    default:
      return state;
  }
}
