import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { GameSettings } from "@/game/game.settings";

type Props = {
  settings: GameSettings;
  toggle: (key: keyof GameSettings) => void;
};

export function SettingsPanel({ settings, toggle }: Props) {
  return (
    <div className="absolute top-6 right-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">⚙️ Reglas</Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 space-y-4 bg-surface text-text border border-surface shadow-lg">
          <h3 className="font-semibold text-center">Reglas de escritura</h3>

          <div className="flex items-center justify-between">
            <span>Mayúsculas obligatorias</span>
            <Switch
              checked={settings.requireUppercase}
              onCheckedChange={() => toggle("requireUppercase")}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Tildes obligatorias</span>
            <Switch
              checked={settings.requireAccents}
              onCheckedChange={() => toggle("requireAccents")}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Puntuación obligatoria</span>
            <Switch
              checked={settings.requirePunctuation}
              onCheckedChange={() => toggle("requirePunctuation")}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
