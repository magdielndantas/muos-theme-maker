import { create } from 'zustand';

interface ThemeState {
  colors: {
    background: string;
    primaryAccent: string;
    backgroundAlpha: number;
  };
  list: {
    textColorActive: string;
    textColorInactive: string;
  };
  assets: {
    wallpaper: string | null;
    font: string | null;
  };
  setColors: (colors: Partial<ThemeState['colors']>) => void;
  setList: (list: Partial<ThemeState['list']>) => void;
  setAssets: (assets: Partial<ThemeState['assets']>) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  colors: {
    background: '#121212',
    primaryAccent: '#eab308',
    backgroundAlpha: 255,
  },
  list: {
    textColorActive: '#ffffff',
    textColorInactive: '#888888',
  },
  assets: {
    wallpaper: null,
    font: null,
  },
  setColors: (colors) => set((state) => ({ colors: { ...state.colors, ...colors } })),
  setList: (list) => set((state) => ({ list: { ...state.list, ...list } })),
  setAssets: (assets) => set((state) => ({ assets: { ...state.assets, ...assets } })),
}));
