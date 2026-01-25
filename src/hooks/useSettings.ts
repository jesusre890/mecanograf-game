import { useState } from "react";
import { defaultSettings, type GameSettings } from "../game/game.settings";

export function useSettings() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  function toggle(key: keyof GameSettings) {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return {
    settings,
    toggle,
  };
}
