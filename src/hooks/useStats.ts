import type { GameStatus } from "@/game/game.types";
import { useEffect, useRef, useState } from "react";

export function useStats(
  sentence: string,
  userInput: string,
  sentenceIndex: number,
  status: GameStatus,
) {
  const startTimeRef = useRef<number | null>(null);
  const lastInputRef = useRef("");

  const [time, setTime] = useState(0);
  const [typed, setTyped] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const [peakWpm, setPeakWpm] = useState(0);

  // reset solo referencias al cambiar de oración
  useEffect(() => {
    lastInputRef.current = "";
  }, [sentenceIndex]);

  // iniciar reloj
  useEffect(() => {
    if (userInput.length === 1 && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
  }, [userInput]);

  // reloj en vivo
  useEffect(() => {
    if (!startTimeRef.current) return;

    const i = setInterval(() => {
      setTime((Date.now() - startTimeRef.current!) / 1000);
    }, 300);

    return () => clearInterval(i);
  }, [startTimeRef.current]);

  // sincronizar cuando el input se borr
  useEffect(() => {
    if (userInput === "") {
      lastInputRef.current = "";
    }
  }, [userInput]);

  // detectar caracteres nuevos (histórico)
  useEffect(() => {
    const prev = lastInputRef.current;
    const curr = userInput;

    if (curr.length > prev.length) {
      const index = curr.length - 1;

      setTyped((t) => t + 1);

      if (curr[index] === sentence[index]) {
        setCorrect((c) => c + 1);
      } else {
        setErrors((e) => e + 1);
      }
    }

    lastInputRef.current = curr;
  }, [userInput, sentence]);

  const minutes = time / 60;
  const wpm = minutes > 0 ? Math.round(correct / 5 / minutes) : 0;
  const accuracy = typed > 0 ? Math.round((correct / typed) * 100) : 100;

  useEffect(() => {
    if (wpm > peakWpm) {
      setPeakWpm(wpm);
    }
  }, [wpm, peakWpm]);
  
  useEffect(() => {
    if (status === "finished") {
      startTimeRef.current = null;
    }
  }, [status]);
  
  const avgWpm = time > 0 ? Math.round(typed / 5 / (time / 60)) : 0;

  return { wpm, peakWpm, accuracy, errors, time, typed, avgWpm };
}
