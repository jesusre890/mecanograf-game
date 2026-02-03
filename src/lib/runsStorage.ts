import type { RunResult } from "@/game/run.types";

const KEY = "mecanograf_runs";

export function getRuns(): RunResult[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRun(run: RunResult) {
  const runs = getRuns();
  localStorage.setItem(KEY, JSON.stringify([run, ...runs]));
}
