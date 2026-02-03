import type { GameMode, GameState } from "./game.types";

export type GameAction =
  | { type: "SET_MODE"; mode: GameMode; timeLimit?: number }
  | { type: "TYPE"; value: string }
  | { type: "RESET_INPUT" }
  | {
      type: "COMPLETE_SENTENCE";
      isLast: boolean;
      isLastSentence: boolean;
    }
  | { type: "ERROR" }
  | { type: "CLEAR_STATUS" }
  | { type: "RESET_RUN" }
  | { type: "SET_MODE"; mode: GameMode; timeLimit?: number };

export const initialGameState: GameState = {
  mode: null,
  timeLimit: undefined,
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
      // ♾️ MODO INFINITO
      if (state.mode === "infinite") {
        return {
          ...state,
          sentenceIndex: state.sentenceIndex + 1,
          userInput: "",
        };
      }

      // 🧪 PRÁCTICA (nunca termina)
      if (state.mode === "practice") {
        return {
          ...state,
          sentenceIndex: state.sentenceIndex + 1,
          userInput: "",
        };
      }

      // 📖 NORMAL (lo que ya tenías)
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
      // infinito y time_attack terminan
      if (state.mode === "infinite" || state.mode === "time_attack") {
        return { ...state, status: "finished" };
      }

      return { ...state, status: "error" };

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
    case "SET_MODE":
      return {
        ...initialGameState,
        mode: action.mode,
        timeLimit: action.timeLimit,
      };

    default:
      return state;
  }
}
