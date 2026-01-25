import { useGame } from "./hooks/useGame";
import book from "./books/sample-books.json";
import { SentenceView } from "./components/SentenceView";
import { useSettings } from "./hooks/useSettings";
import { normalizeText } from "./game/game.utils";
import { SettingsPanel } from "./components/SettingsPanel";

function App() {
  const { state, dispatch } = useGame();
  const { settings, toggle } = useSettings();

  const currentSentence =
    book.chapters[state.chapterIndex].sentences[state.sentenceIndex];

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

    if (!normalizedTarget.startsWith(normalizedValue)) {
      dispatch({ type: "ERROR" });
      return;
    }

    if (value === currentSentence) {
      dispatch({ type: "COMPLETE_SENTENCE" });
      return;
    }

    if (normalizedValue === normalizedTarget) {
      dispatch({ type: "COMPLETE_SENTENCE" });
      return;
    }

    dispatch({ type: "TYPE", value });
  }

  const isError = state.status === "error";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text p-8">
      <SettingsPanel settings={settings} toggle={toggle} />
      <div className="max-w-2xl w-full space-y-6">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-accent tracking-wide">
          MecanoGRAF
        </h1>

        {/* Oración objetivo */}
        <SentenceView sentence={currentSentence} userInput={state.userInput} />

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
