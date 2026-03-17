
const allThemeModes = ['light', 'dark'] as const;
export type ThemeMode = typeof allThemeModes[number];
export const ALL_THEME_MODES = allThemeModes as unknown as ThemeMode[];

