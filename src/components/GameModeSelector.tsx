import type { GameMode } from "@/game/game.types";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type Props = {
  onSelect: (mode: GameMode, timeLimit?: number) => void;
};

type ModeOption = {
  mode: GameMode;
  label: string;
  description: string;
  icon: string;
  timeLimit?: number;
  disabled?: boolean;
};

const MODES: ModeOption[] = [
  {
    mode: "practice",
    label: "Práctica",
    description: "Sin presión, solo practicar",
    icon: "🧪",
    disabled: false,
  },
  {
    mode: "normal",
    label: "Normal",
    description: "Jugá el libro completo, a tu ritmo",
    icon: "📖",
  },
  {
    mode: "infinite",
    label: "Infinito",
    description: "Frases sin fin hasta que fallás",
    icon: "♾️",
    disabled: false,
  },
  {
    mode: "time_attack",
    label: "Time Attack (60s)",
    description: "Escribí todo lo que puedas en 60 segundos",
    icon: "⏱️",
    timeLimit: 60,
    disabled: true,
  },
  {
    mode: "my_book",
    label: "Libro cargado",
    description: "Carga un libro y leelo escribiendo",
    icon: "⏱️",
    timeLimit: 60,
    disabled: true,
  },
];

export function GameModeSelector({ onSelect }: Props) {
  const [selected, setSelected] = useState<ModeOption | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text px-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-8 space-y-6 text-center">
          <h1 className="text-3xl font-bold">MecanoGRAF</h1>

          <p className=" text-muted">
            {!selected
              ? "Primero, vamos a elegir el modo que quieras"
              : "Ahora, cómo vas a querer jugar?"}
          </p>

          <div className="space-y-3">
            {MODES.map((option) => {
              const isActive = selected?.mode === option.mode;
              const isDisabled = option.disabled;

              return (
                <Button
                  key={option.mode}
                  variant={isActive ? "default" : "outline"}
                  disabled={isDisabled}
                  className={`
                    w-full flex items-center gap-4 px-4 py-6 text-left justify-start
                    transition relative
                    ${isActive ? "ring-2 ring-accent/40" : ""}
                    ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-accent/10"}
                  `}
                  onClick={() => {
                    if (!isDisabled) setSelected(option);
                  }}
                >
                  {/* Icono */}
                  <span className="text-2xl w-8 text-center">
                    {option.icon}
                  </span>

                  {/* Texto */}
                  <span className="flex flex-col flex-1">
                    <span className="font-semibold leading-tight">
                      {option.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </span>

                  {/* Badge Próximamente */}
                  {isDisabled && (
                    <span className="text-[10px] px-2 py-1 rounded-full text-amber-600">
                      Próximamente
                    </span>
                  )}
                </Button>
              );
            })}
          </div>

          <Button
            className="w-full mt-4 bg-blue-800 disabled:opacity-50"
            size="lg"
            disabled={!selected || selected.disabled}
            onClick={() => {
              if (!selected || selected.disabled) return;
              onSelect(selected.mode, selected.timeLimit);
            }}
          >
            {!selected
              ? "Elegí un modo para empezar"
              : selected.disabled
                ? "Modo no disponible"
                : "Empezar 🚀"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}