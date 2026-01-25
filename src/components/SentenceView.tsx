type Props = {
  sentence: string;
  userInput: string;
};

export function SentenceView({ sentence, userInput }: Props) {
  return (
    <div className="text-xl text-center bg-surface border border-surface p-4 rounded font-mono leading-relaxed">
      {sentence.split("").map((char, index) => {
        let className = "text-text";

        if (index < userInput.length) {
          if (userInput[index] === char) {
            className = "text-accent"; // letra correcta
          } else {
            className = "text-error"; // letra incorrecta
          }
        }

        return (
          <span key={index} className={className}>
            {char}
          </span>
        );
      })}
    </div>
  );
}
