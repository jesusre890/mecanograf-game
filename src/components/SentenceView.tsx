interface Props {
  sentence: string;
  userInput: string;
  isCompleted?: boolean;
  lastSentence?: string;
}

export function SentenceView({
  sentence,
  userInput,
  isCompleted,
  lastSentence,
}: Props) {
  return (
    <div className="relative">
      {/* Oración anterior (difuminada arriba) */}
      {lastSentence && (
        <div
          className="
            absolute -top-10 left-0 right-0 
            text-center text-sm text-muted 
            opacity-40 blur-[1px] 
            animate-float
            pointer-events-none select-none
          "
        >
          {lastSentence}
        </div>
      )}

      {/* Oración actual */}
      <div
        className={`
          text-xl text-center bg-surface border p-4 rounded font-mono tracking-wide
          transition
          ${isCompleted ? "border-accent shadow-[0_0_20px_#F08A24]" : "border-surface"}
        `}
      >
        {sentence.split("").map((char, index) => {
          const typedChar = userInput[index];

          let className = "text-muted";

          if (index < userInput.length) {
            if (typedChar === char) {
              className = "text-accent";
            } else {
              className = "text-error";
            }
          }

          if (index === userInput.length && !isCompleted) {
            className =
              "text-text underline decoration-accent decoration-2 animate-pulse";
          }

          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
