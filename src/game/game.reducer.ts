import type { GameState } from "./game.types";

export type GameAction =
  | { type: "TYPE"; value: string }
  | { type: "RESET_INPUT" }
  | {
      type: "COMPLETE_SENTENCE";
      isLast: boolean;
      isLastSentence: boolean;
    }
  | { type: "ERROR" }
  | { type: "CLEAR_STATUS" }
  | { type: "RESET_RUN" };

export const initialGameState: GameState = {
  chapterIndex: 0,
  sentenceIndex: 0,
  lastCompletedSentenceIndex: 0,
  userInput: "",
  status: "typing",
  runStartedAt: null,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "TYPE":
      return {
        ...state,
        userInput: action.value,
        status: "typing",
        runStartedAt: state.runStartedAt ?? Date.now(),
      };

    case "COMPLETE_SENTENCE": {
      if (action.isLast) {
        return {
          ...state,
          userInput: "",
          status: "finished",
        };
      }

      if (action.isLastSentence) {
        return {
          ...state,
          chapterIndex: state.chapterIndex + 1,
          sentenceIndex: 0,
          userInput: "",
          status: "completed",
        };
      }

      return {
        ...state,
        sentenceIndex: state.sentenceIndex + 1,
        userInput: "",
        status: "completed",
      };
    }

    case "ERROR":
      return {
        ...state,
        //userInput: "",
        //sentenceIndex: state.lastCompletedSentenceIndex,
        status: "error",
      };

    case "RESET_INPUT":
      return {
        ...state,
        userInput: "",
        status: "typing",
      };

    case "CLEAR_STATUS":
      return {
        ...state,
        status: "typing",
      };
    case "RESET_RUN":
      return initialGameState;

    default:
      return state;
  }
}
