import { create } from "zustand";
import {
  MUOS_SCREENS,
  MuosScreenDef,
} from "../data/muosScreens";
import { GLOBAL_GLYPHS } from "../data/muosGlyphs";

export type ScreenScheme = {
  // Background
  BACKGROUND: string;
  BACKGROUND_ALPHA: number;

  // Header
  HEADER_BACKGROUND: string;
  HEADER_BACKGROUND_ALPHA: number;
  HEADER_TEXT: string;
  HEADER_TEXT_ALPHA: number;
  HEADER_HEIGHT: number;
  HEADER_TEXT_ALIGN: number;
  HEADER_PADDING_LEFT: number;
  HEADER_PADDING_RIGHT: number;
  FONT_HEADER_ICON_PAD_TOP: number;
  FONT_HEADER_ICON_PAD_BOTTOM: number;
  FONT_HEADER_PAD_TOP: number;
  FONT_HEADER_PAD_BOTTOM: number;

  // Footer
  FOOTER_BACKGROUND: string;
  FOOTER_BACKGROUND_ALPHA: number;
  FOOTER_TEXT: string;
  FOOTER_TEXT_ALPHA: number;
  FOOTER_HEIGHT: number;
  FONT_FOOTER_ICON_PAD_TOP: number;
  FONT_FOOTER_ICON_PAD_BOTTOM: number;
  FONT_FOOTER_PAD_TOP: number;
  FONT_FOOTER_PAD_BOTTOM: number;

  // Help text (Footer info)
  FOOTER_INFO_COLOR: string;
  FOOTER_INFO_COLOR_ALPHA: number;

  // List Items
  LIST_DEFAULT_BACKGROUND: string;
  LIST_DEFAULT_BACKGROUND_ALPHA: number;
  LIST_DEFAULT_TEXT: string;
  LIST_DEFAULT_TEXT_ALPHA: number;
  LIST_FOCUS_BACKGROUND: string;
  LIST_FOCUS_BACKGROUND_ALPHA: number;
  LIST_FOCUS_TEXT: string;
  LIST_FOCUS_TEXT_ALPHA: number;

  // Navigation
  NAVIGATION_ALIGNMENT: number;
  NAVIGATION_ICON_SIZE: number;

  // Date/Time
  DATETIME_TEXT: string;
  DATETIME_ALPHA: number;
  DATETIME_ALIGN: number;
  DATETIME_PADDING_LEFT: number;
  DATETIME_PADDING_RIGHT: number;

  // Status (Wifi/Battery)
  STATUS_ALIGN: number;
  STATUS_PADDING_LEFT: number;
  STATUS_PADDING_RIGHT: number;
  BATTERY_NORMAL: string;
  BATTERY_NORMAL_ALPHA: number;
  NETWORK_NORMAL: string;
  NETWORK_NORMAL_ALPHA: number;

  // Terminal
  TERMINAL_BACKGROUND: string;
  TERMINAL_FOREGROUND: string;

  // Misc
  MISC_NAVIGATION_TYPE: number;
  GRID_NAVIGATION_TYPE: number;
  GRID_BACKGROUND_ALPHA: number;
  GRID_LOCATION_X: number;
  GRID_LOCATION_Y: number;
};

export const DEFAULT_SCHEME: ScreenScheme = {
  BACKGROUND: "000000",
  BACKGROUND_ALPHA: 255,

  HEADER_BACKGROUND: "111111",
  HEADER_BACKGROUND_ALPHA: 255,
  HEADER_TEXT: "FFFFFF",
  HEADER_TEXT_ALPHA: 255,
  HEADER_HEIGHT: 36,
  HEADER_TEXT_ALIGN: 1, // Left
  HEADER_PADDING_LEFT: 14,
  HEADER_PADDING_RIGHT: 14,
  FONT_HEADER_ICON_PAD_TOP: 0,
  FONT_HEADER_ICON_PAD_BOTTOM: 0,
  FONT_HEADER_PAD_TOP: 0,
  FONT_HEADER_PAD_BOTTOM: 0,

  FOOTER_BACKGROUND: "111111",
  FOOTER_BACKGROUND_ALPHA: 255,
  FOOTER_TEXT: "FFFFFF",
  FOOTER_TEXT_ALPHA: 255,
  FOOTER_HEIGHT: 32,
  FONT_FOOTER_ICON_PAD_TOP: 0,
  FONT_FOOTER_ICON_PAD_BOTTOM: 0,
  FONT_FOOTER_PAD_TOP: 0,
  FONT_FOOTER_PAD_BOTTOM: 0,

  FOOTER_INFO_COLOR: "AAAAAA",
  FOOTER_INFO_COLOR_ALPHA: 255,

  LIST_DEFAULT_BACKGROUND: "000000",
  LIST_DEFAULT_BACKGROUND_ALPHA: 0,
  LIST_DEFAULT_TEXT: "AAAAAA",
  LIST_DEFAULT_TEXT_ALPHA: 255,
  LIST_FOCUS_BACKGROUND: "FBBF24",
  LIST_FOCUS_BACKGROUND_ALPHA: 255,
  LIST_FOCUS_TEXT: "000000",
  LIST_FOCUS_TEXT_ALPHA: 255,

  NAVIGATION_ALIGNMENT: 1,
  NAVIGATION_ICON_SIZE: 24,

  DATETIME_TEXT: "FFFFFF",
  DATETIME_ALPHA: 255,
  DATETIME_ALIGN: 1,
  DATETIME_PADDING_LEFT: 270,
  DATETIME_PADDING_RIGHT: 14,

  STATUS_ALIGN: 3, // Right
  STATUS_PADDING_LEFT: 14,
  STATUS_PADDING_RIGHT: 14,
  BATTERY_NORMAL: "FFFFFF",
  BATTERY_NORMAL_ALPHA: 255,
  NETWORK_NORMAL: "FFFFFF",
  NETWORK_NORMAL_ALPHA: 255,

  TERMINAL_BACKGROUND: "000000",
  TERMINAL_FOREGROUND: "00FF00",

  MISC_NAVIGATION_TYPE: 1,
  GRID_NAVIGATION_TYPE: 1,
  GRID_BACKGROUND_ALPHA: 128,
  GRID_LOCATION_X: 0,
  GRID_LOCATION_Y: 0,
};

export interface CanvasLayer {
  id: string;
  src: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export type GlyphFile = {
  name: string;
  src: string | null;
};

export interface ScreenContext {
  id: string;
  wallpaper: string | null;
  overlay: string | null;
  staticImage: string | null;
  scheme: Partial<ScreenScheme>;
  glyphs: GlyphFile[];
  subAssets: { name: string; src: string | null }[];
  layers: CanvasLayer[];
}

function buildInitialScreens(): ScreenContext[] {
  return MUOS_SCREENS.map((def: MuosScreenDef) => ({
    id: def.id,
    wallpaper: null,
    overlay: null,
    staticImage: null,
    scheme: {},
    glyphs: (def.glyphs ?? []).map((g) => ({ name: g.name, src: null })),
    subAssets: (def.subAssets ?? []).map((sa) => ({ name: sa.name, src: null })),
    layers: [],
  }));
}

interface ThemeState {
  screens: ScreenContext[];
  activeScreenId: string;
  globalScheme: ScreenScheme;
  globalOverlay: string | null;
  globalGlyphs: {
    header: Record<string, string | null>;
    footer: Record<string, string | null>;
    bar: Record<string, string | null>;
  };
  selectedLayerId: string | null;
  themeName: string;

  getActiveScreen: () => ScreenContext;
  getEffectiveScheme: (screenId: string) => ScreenScheme;
  getSchemeOverrideKeys: (screenId: string) => Set<keyof ScreenScheme>;

  setThemeName: (name: string) => void;
  setGlobalOverlay: (src: string | null) => void;
  setGlobalScheme: (updates: Partial<ScreenScheme>) => void;
  setGlobalGlyph: (category: "header" | "footer" | "bar", name: string, src: string | null) => void;
  applyGlobalToAll: () => void;
  copySchemeToScreen: (fromId: string, toId: string) => void;
  resetScreenSchemeToGlobal: (screenId: string) => void;
  setActiveScreenId: (id: string) => void;
  setScreenWallpaper: (screenId: string, src: string | null) => void;
  setScreenOverlay: (screenId: string, src: string | null) => void;
  setScreenSubAsset: (screenId: string, name: string, src: string | null) => void;
  setScreenStaticImage: (screenId: string, src: string | null) => void;
  setScreenGlyph: (screenId: string, name: string, src: string | null) => void;
  updateScreenScheme: (screenId: string, updates: Partial<ScreenScheme>) => void;
  addLayer: (screenId: string, layer: Omit<CanvasLayer, "id" | "zIndex">) => void;
  updateLayer: (screenId: string, layerId: string, updates: Partial<CanvasLayer>) => void;
  removeLayer: (screenId: string, layerId: string) => void;
  setSelectedLayerId: (id: string | null) => void;
  importScreens: (screens: ScreenContext[]) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  screens: buildInitialScreens(),
  activeScreenId: "muxlaunch",
  globalOverlay: null,
  globalGlyphs: {
    header: {},
    footer: {},
    bar: {},
  },
  globalScheme: { ...DEFAULT_SCHEME },
  selectedLayerId: null,
  themeName: "",

  getActiveScreen: () => {
    const { screens, activeScreenId } = get();
    return screens.find((s) => s.id === activeScreenId) ?? screens[0];
  },

  getEffectiveScheme: (screenId) => {
    const { screens, globalScheme } = get();
    const sc = screens.find((s) => s.id === screenId);
    if (!sc) return globalScheme;
    return { ...globalScheme, ...sc.scheme };
  },

  getSchemeOverrideKeys: (screenId) => {
    const { screens, globalScheme } = get();
    const sc = screens.find((s) => s.id === screenId);
    if (!sc) return new Set();
    const keys = new Set<keyof ScreenScheme>();
    (Object.keys(sc.scheme) as (keyof ScreenScheme)[]).forEach((k) => {
      if (sc.scheme[k] !== globalScheme[k]) {
        keys.add(k);
      }
    });
    return keys;
  },

  setThemeName: (themeName) => set({ themeName }),

  setGlobalOverlay: (globalOverlay) => set({ globalOverlay }),

  setGlobalScheme: (updates) =>
    set((state) => ({
      globalScheme: { ...state.globalScheme, ...updates },
    })),

  setGlobalGlyph: (category, name, src) =>
    set((state) => ({
      globalGlyphs: {
        ...state.globalGlyphs,
        [category]: {
          ...state.globalGlyphs[category],
          [name]: src,
        },
      },
    })),

  applyGlobalToAll: () =>
    set((state) => ({
      screens: state.screens.map((s) => ({ ...s, scheme: {} })),
    })),

  copySchemeToScreen: (fromId, toId) =>
    set((state) => {
      const fromScreen = state.screens.find((s) => s.id === fromId);
      if (!fromScreen) return state;
      return {
        screens: state.screens.map((s) =>
          s.id === toId ? { ...s, scheme: { ...fromScreen.scheme } } : s
        ),
      };
    }),

  resetScreenSchemeToGlobal: (screenId) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId ? { ...s, scheme: {} } : s
      ),
    })),

  setActiveScreenId: (id) => set({ activeScreenId: id, selectedLayerId: null }),

  setScreenWallpaper: (screenId, src) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId ? { ...s, wallpaper: src } : s
      ),
    })),

  setScreenOverlay: (screenId, src) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId ? { ...s, overlay: src } : s
      ),
    })),

  setScreenSubAsset: (screenId, name, src) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId
          ? {
              ...s,
              subAssets: s.subAssets.map((sa) =>
                sa.name === name ? { ...sa, src } : sa
              ),
            }
          : s
      ),
    })),

  setScreenStaticImage: (screenId, src) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId ? { ...s, staticImage: src } : s
      ),
    })),

  setScreenGlyph: (screenId, name, src) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId
          ? {
              ...s,
              glyphs: s.glyphs.map((g) =>
                g.name === name ? { ...g, src } : g
              ),
            }
          : s
      ),
    })),

  updateScreenScheme: (screenId, updates) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId
          ? { ...s, scheme: { ...s.scheme, ...updates } }
          : s
      ),
    })),

  addLayer: (screenId, layer) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId
          ? {
              ...s,
              layers: [
                ...s.layers,
                { ...layer, id: crypto.randomUUID(), zIndex: s.layers.length },
              ],
            }
          : s
      ),
    })),

  updateLayer: (screenId, layerId, updates) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId
          ? {
              ...s,
              layers: s.layers.map((l) =>
                l.id === layerId ? { ...l, ...updates } : l
              ),
            }
          : s
      ),
    })),

  removeLayer: (screenId, layerId) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId
          ? {
              ...s,
              layers: s.layers.filter((l) => l.id !== layerId),
            }
          : s
      ),
      selectedLayerId: null,
    })),

  setSelectedLayerId: (id) => set({ selectedLayerId: id }),

  importScreens: (screens) => set({ screens }),
}));
