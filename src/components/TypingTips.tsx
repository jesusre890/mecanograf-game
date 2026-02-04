import { useEffect, useState } from "react";

const TIPS = [
  "Mirá la pantalla, no el teclado",
  "Relajá los hombros mientras escribís",
  "Usá todos los dedos, no solo los índices",
  "Mantené un ritmo constante",
  "La precisión es más importante que la velocidad",
  "Respirás mejor si escribís mejor",
];

type Props = {
  intervalMs?: number;
};

export function TypingTips({ intervalMs = 8000 }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((i) => (i + 1) % TIPS.length);
        setVisible(true);
      }, 600);
    }, intervalMs);

    return () => clearInterval(cycle);
  }, [intervalMs]);

  return (
    <div
      className={`
        fixed top-6 left-16
        text-base
        text-muted-foreground
        transition-opacity duration-700
        ${visible ? "opacity-40" : "opacity-0"}
        pointer-events-none
        select-none
      `}
    >
      {TIPS[index]}
    </div>
  );
}
