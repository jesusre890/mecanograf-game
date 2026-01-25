export type GameSettings = {
  requireUppercase: boolean;
  requireAccents: boolean;
  requirePunctuation: boolean;
};

export const defaultSettings: GameSettings = {
  requireUppercase: true,
  requireAccents: true,
  requirePunctuation: true,
};
