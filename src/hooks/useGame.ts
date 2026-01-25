import { useReducer } from "react";
import { gameReducer, initialGameState } from "../game/game.reducer";

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return {
    state,
    dispatch,
  };
}
