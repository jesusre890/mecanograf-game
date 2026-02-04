import { useGame } from "./hooks/useGame";
//import book from "./books/sample-books.json";
import book from "./books/sample-short.json"
import infinitePhrases from "./books/infinite-phrases.json";
import { SentenceView } from "./components/SentenceView";
import { useSettings } from "./hooks/useSettings";
import { normalizeText } from "./game/game.utils";
import { SettingsPanel } from "./components/SettingsPanel";
import { ProgressBar } from "./components/ProgressBar";
import { useEffect, useRef } from "react";
import { useStats } from "./hooks/useStats";
import { getRuns, saveRun } from "./lib/runsStorage";
import { calculateScore } from "./game/scoring";
import { formatDuration } from "./lib/utils";
import { GameModeSelector } from "./components/GameModeSelector";

type CurrentPhrase = {
  text: string;
  author?: string;
};

function App() {
  const { state, dispatch } = useGame();
  const { settings, toggle } = useSettings();

  function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const infinitePoolRef = useRef(shuffleArray(infinitePhrases.sentences));

  function getCurrentPhrase(): CurrentPhrase {
    if (state.mode === "infinite") {
      const pool = infinitePoolRef.current;

      // si se agotó el pool → reshuffle
      if (state.sentenceIndex >= pool.length) {
        infinitePoolRef.current = shuffleArray(infinitePhrases.sentences);
      }

      const phrase =
        infinitePoolRef.current[
          state.sentenceIndex % infinitePoolRef.current.length
        ];

      return {
        text: phrase?.text ?? "",
        author: phrase?.author,
      };
    }

    return {
      text: book.chapters[state.chapterIndex].sentences[state.sentenceIndex],
    };
  }

  const currentPhrase = getCurrentPhrase();
  const currentSentence = currentPhrase.text;

  const { wpm, peakWpm, accuracy, errors, time, avgWpm } = useStats(
    currentSentence,
    state.userInput,
    state.sentenceIndex,
    state.status,
  );

  const isNormal = state.mode === "normal";

  const chapter = isNormal ? book.chapters[state.chapterIndex] : null;

  const isLastSentence = isNormal
    ? state.sentenceIndex === chapter!.sentences.length - 1
    : false;

  const isLastChapter = isNormal
    ? state.chapterIndex === book.chapters.length - 1
    : false;

  const isLast = isNormal && isLastSentence && isLastChapter;

  useEffect(() => {
    if (state.status !== "finished") return;

    const id = crypto.randomUUID();

    if (state.mode === "normal") {
      const run = {
        id,
        date: Date.now(),
        mode: "normal" as const,
        bookId: "sample-books",
        bookTitle: book.title,
        avgWpm,
        peakWpm,
        accuracy,
        errors,
        time,
        score: calculateScore({
          avgWpm,
          accuracy,
          errors,
          sentencesCompleted: state.sentenceIndex,
        }),
      };

      saveRun(run);
    }

    if (state.mode === "infinite") {
      const run = {
        id,
        date: Date.now(),
        mode: "infinite" as const,
        avgWpm,
        peakWpm,
        accuracy,
        errors,
        time,
        sentencesCompleted: state.sentenceIndex,
        score: calculateScore({
          avgWpm,
          accuracy,
          errors,
          sentencesCompleted: state.sentenceIndex,
        }),
      };

      saveRun(run);
    }

    localStorage.setItem("lastRunId", id);
  }, [state.status]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    const normalizedTarget = normalizeText(currentSentence, {
      uppercase: settings.requireUppercase,
      accents: settings.requireAccents,
      punctuation: settings.requirePunctuation,
    });

    const normalizedValue = normalizeText(value, {
      uppercase: settings.requireUppercase,
      accents: settings.requireAccents,
      punctuation: settings.requirePunctuation,
    });

    // ⬇️ SIEMPRE dejamos que el input crezca
    dispatch({ type: "TYPE", value });

    // error → avisamos
    if (!normalizedTarget.startsWith(normalizedValue)) {
      dispatch({ type: "ERROR" });
      return;
    }

    // ✅ oración completa
    if (value === currentSentence || normalizedValue === normalizedTarget) {
      dispatch({
        type: "COMPLETE_SENTENCE",
        isLast,
        isLastSentence,
      });
    }
  }

  const isError = state.status === "error";
  const isCompleted = state.status === "completed";

  useEffect(() => {
    if (state.status === "completed") {
      const t = setTimeout(() => {
        dispatch({ type: "CLEAR_STATUS" });
      }, 500);

      return () => clearTimeout(t);
    }

    if (state.status === "error") {
      const t = setTimeout(() => {
        dispatch({ type: "RESET_INPUT" });
        dispatch({ type: "CLEAR_STATUS" });
      }, 150);

      return () => clearTimeout(t);
    }
  }, [state.status, dispatch]);

  // PANTALLA DEL FINAL 🏁
  if (state.status === "finished") {
    const runs = getRuns()
      .filter((r) => r.mode === state.mode)
      .sort((a, b) => {
        // ♾️ Infinite: primero más frases
        if (state.mode === "infinite") {
          const aS = a.sentencesCompleted ?? 0;
          const bS = b.sentencesCompleted ?? 0;

          if (bS !== aS) return bS - aS;
          if (b.score !== a.score) return b.score - a.score;
          return b.avgWpm - a.avgWpm;
        }

        // 📖 Normal: score desc
        return b.score - a.score;
      })
      .slice(0, 10);
    const lastRunId = localStorage.getItem("lastRunId");

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center">
        {/* Título */}
        <h1 className="text-3xl font-bold">
          {state.mode === "normal" && "Run completada 📖"}
          {state.mode === "infinite" && "Run infinita finalizada ♾️"}
        </h1>

        {/* Stats de la run */}
        <div className="space-y-1 text-sm">
          <div>
            <span className="text-muted">Duración:</span>{" "}
            <span className="font-medium">{formatDuration(time)}</span>
          </div>
          <div>
            <span className="text-muted">WPM promedio:</span>{" "}
            <span className="font-medium">{avgWpm}</span>
          </div>
          <div>
            <span className="text-muted">WPM pico:</span>{" "}
            <span className="font-medium">{peakWpm}</span>
          </div>
          <div>
            <span className="text-muted">Precisión:</span>{" "}
            <span className="font-medium">{accuracy}%</span>
          </div>
          <div>
            <span className="text-muted">Errores totales:</span>{" "}
            <span className="font-medium">{errors}</span>
          </div>
        </div>

        {/* 🏆 Mejores runs */}
        <div className="w-full max-w-sm mt-6 text-left">
          <h2 className="font-semibold mb-2">Mejores runs (local)</h2>
          <p className="text-xs text-muted mb-1">
            Tu última run está resaltada
          </p>
          {runs.length === 0 ? (
            <div className="text-sm text-muted">
              Todavía no hay runs guardadas
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              {/* Header */}
              <div className="grid grid-cols-[48px_1fr_1fr_1fr_1.2fr] px-3 text-xs text-muted">
                <span>#</span>
                <span>WPM</span>
                {state.mode === "normal" && <span>Precisión</span>}
                {state.mode === "infinite" && <span>Frases</span>}
                <span>Tiempo</span>
                <span className="text-right">Score</span>
              </div>

              {/* Rows */}
              <ul className="space-y-1">
                {runs.map((run, i) => {
                  const isLastRun = run.id === lastRunId;

                  return (
                    <li
                      key={run.id}
                      className={`
                        grid grid-cols-[48px_1fr_1fr_1fr_1.2fr]
                        items-center rounded px-3 py-2
                        ${isLastRun ? "bg-accent/20 ring-1 ring-accent" : "bg-surface"}
                      `}
                    >
                      <span className="font-medium">
                        #{i + 1}{" "}
                        {isLastRun && (
                          <span className="ml-1 text-accent">←</span>
                        )}
                      </span>

                      <span>{run.avgWpm}</span>

                      <span>{run.sentencesCompleted ?? 0}</span>

                      <span>{formatDuration(run.time)}</span>

                      <span className="text-right font-semibold">
                        {run.score}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-3 mt-4">
          <button
            className="px-4 py-2 rounded bg-accent text-white"
            onClick={() => dispatch({ type: "RESET_RUN" })}
          >
            Volver a empezar
          </button>
        </div>
      </div>
    );
  }

  if (!state.mode) {
    return (
      <GameModeSelector
        onSelect={(mode, timeLimit) =>
          dispatch({ type: "SET_MODE", mode, timeLimit })
        }
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text p-8">
      <SettingsPanel settings={settings} toggle={toggle} />
      <div className="max-w-2xl w-full space-y-6">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-accent tracking-wide">
          MecanoGRAF
        </h1>

        <div className="flex justify-center gap-6 text-muted">
          <div>
            <span className="text-accent font-semibold">{wpm}</span> WPM
          </div>

          <div>
            <span className="text-accent font-semibold">{accuracy}%</span>{" "}
            Precisión
          </div>

          <div>
            <span className="text-accent font-semibold">{errors}</span> Errores
          </div>

          {/* Timer en vivo */}
          {time > 0 && (
            <div>
              <span className="text-accent font-semibold">
                {formatDuration(time)}
              </span>{" "}
              Tiempo
            </div>
          )}
        </div>

        <ProgressBar
          total={currentSentence.length}
          current={state.userInput.length}
        />

        {/* Oración objetivo */}
        <SentenceView
          sentence={currentSentence}
          userInput={state.userInput}
          isCompleted={isCompleted}
          author={state.mode === "infinite" ? currentPhrase.author : undefined}
          lastSentence={
            state.status === "completed"
              ? book.chapters[state.chapterIndex].sentences[
                  state.sentenceIndex - 1
                ]
              : undefined
          }
        />

        {/* Input */}
        <input
          autoFocus
          value={state.userInput}
          onChange={handleChange}
          className={`
            w-full p-3 text-lg
            bg-surface text-text
            border rounded
            outline-none
            transition
            ${isError ? "border-error shake" : "border-surface"}
            focus:border-accent focus:ring-2 focus:ring-accent/50
          `}
          placeholder="Escribí la oración exactamente..."
        />

        {/* Progreso */}
        <div className="text-center text-sm text-muted">
          {state.mode === "normal" && (
            <>
              Capítulo {state.chapterIndex + 1} — Oración{" "}
              {state.sentenceIndex + 1}
            </>
          )}

          {state.mode === "infinite" && (
            <>Frases completadas: {state.sentenceIndex}</>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
