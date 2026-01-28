interface Props {
  total: number;
  current: number;
}

export function ProgressBar({ total, current }: Props) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="relative w-full flex items-center">
      {/* Punto inicial */}
      <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_8px_#F08A24]" />

      {/* Barra base */}
      <div className="ml-2 w-full h-2 bg-surface rounded overflow-hidden">
        {/* Progreso */}
        <div
          className="h-full bg-accent transition-all duration-200 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
