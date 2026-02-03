import { useGame } from "./hooks/useGame";
import book from "./books/sample-books.json";
import { SentenceView } from "./components/SentenceView";
import { useSettings } from "./hooks/useSettings";
import { normalizeText } from "./game/game.utils";
import { SettingsPanel } from "./components/SettingsPanel";
import { ProgressBar } from "./components/ProgressBar";
import { useEffect } from "react";
import { useStats } from "./hooks/useStats";

function App() {
  const { state, dispatch } = useGame();
  const { settings, toggle } = useSettings();
  
  const currentSentence =
    book.chapters[state.chapterIndex].sentences[state.sentenceIndex];
  
  const { wpm, peakWpm, accuracy, errors, time, avgWpm } = useStats(
    currentSentence,
    state.userInput,
    state.sentenceIndex,
    state.status,
  );

  const chapter = book.chapters[state.chapterIndex];

  const isLastSentence = state.sentenceIndex === chapter.sentences.length - 1;

  const isLastChapter = state.chapterIndex === book.chapters.length - 1;

  const isLast = isLastSentence && isLastChapter;

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

  if (state.status === "finished") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold">Run finalizada 🏁</h1>

        <div>Duración: {Math.round(time)}s</div>
        <div>WPM promedio: {avgWpm}</div>
        <div>WPM pico: {peakWpm}</div>
        <div>Precisión: {accuracy}%</div>
        <div>Errores totales: {errors}</div>

        <button
          className="mt-4 px-4 py-2 rounded bg-accent text-white"
          onClick={() => window.location.reload()}
        >
          Volver a intentar
        </button>
      </div>
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
          Capítulo {state.chapterIndex + 1} — Oración {state.sentenceIndex + 1}
        </div>
      </div>
    </div>
  );
}

export default App;
