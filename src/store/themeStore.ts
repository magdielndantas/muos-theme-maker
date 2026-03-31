import { create } from "zustand";
import { MUOS_SCREENS, MuosScreenDef } from "@/data/muosScreens";

export interface CanvasLayer {
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface SubAssetEntry {
  name: string;   // "apps", "explore", etc.
  src: string | null;
}

export interface GlyphEntry {
  name: string;   // "apps", "explore", etc.
  label: string;  // label legível
  src: string | null;
}

// Subconjunto de propriedades do scheme .ini relevantes para o simulador visual
export interface ScreenScheme {
  // [header]
  HEADER_HEIGHT: number;
  HEADER_BACKGROUND_ALPHA: number;  // 0-255
  HEADER_BACKGROUND: string;        // hex sem #
  HEADER_TEXT: string;
  HEADER_TEXT_ALPHA: number;
  HEADER_TEXT_ALIGN: number;        // 1=left, 2=center, 3=right
  // [footer]
  FOOTER_HEIGHT: number;
  FOOTER_BACKGROUND_ALPHA: number;
  FOOTER_BACKGROUND: string;
  FOOTER_TEXT_ALPHA: number;
  // [background]
  BACKGROUND: string;
  BACKGROUND_ALPHA: number;
  // [list]
  LIST_DEFAULT_BACKGROUND_ALPHA: number;
  LIST_FOCUS_BACKGROUND: string;
  LIST_FOCUS_BACKGROUND_ALPHA: number;
  LIST_DEFAULT_TEXT: string;
  LIST_DEFAULT_TEXT_ALPHA: number;
  LIST_FOCUS_TEXT: string;
  LIST_FOCUS_TEXT_ALPHA: number;
}

export const DEFAULT_SCHEME: ScreenScheme = {
  HEADER_HEIGHT: 44,
  HEADER_BACKGROUND_ALPHA: 200,
  HEADER_BACKGROUND: "000000",
  HEADER_TEXT: "FFFFFF",
  HEADER_TEXT_ALPHA: 255,
  HEADER_TEXT_ALIGN: 1,
  FOOTER_HEIGHT: 60,
  FOOTER_BACKGROUND_ALPHA: 200,
  FOOTER_BACKGROUND: "000000",
  FOOTER_TEXT_ALPHA: 255,
  BACKGROUND: "111111",
  BACKGROUND_ALPHA: 255,
  LIST_DEFAULT_BACKGROUND_ALPHA: 0,
  LIST_FOCUS_BACKGROUND: "eab308",
  LIST_FOCUS_BACKGROUND_ALPHA: 50,
  LIST_DEFAULT_TEXT: "FFFFFF",
  LIST_DEFAULT_TEXT_ALPHA: 200,
  LIST_FOCUS_TEXT: "FFFFFF",
  LIST_FOCUS_TEXT_ALPHA: 255,
};

export interface ScreenContext {
  id: string;
  wallpaper: string | null;
  subAssets: SubAssetEntry[];   // wall/muxlaunch/apps.png etc.
  staticImage: string | null;   // image/static/{screenid}.png
  glyphs: GlyphEntry[];         // glyph/{screenid}/{name}.png
  overlay: string | null;       // image/overlay.png (per-screen)
  layers: CanvasLayer[];
  scheme: ScreenScheme;         // scheme .ini overrides for this screen
}

// Inicializa um ScreenContext vazio para cada tela do muOS
function buildInitialScreens(): ScreenContext[] {
  return MUOS_SCREENS.map((def: MuosScreenDef) => ({
    id: def.id,
    wallpaper: null,
    overlay: null,
    staticImage: null,
    scheme: { ...DEFAULT_SCHEME },
    glyphs: (def.subAssets ?? []).map((sa) => ({
      name: sa.name,
      label: sa.label,
      src: null,
    })),
    subAssets: (def.subAssets ?? []).map((sa) => ({
      name: sa.name,
      src: null,
    })),
    layers: [],
  }));
}

interface ThemeState {
  // Multi-screen state
  screens: ScreenContext[];
  activeScreenId: string;

  // Global scheme — base for all screens (mirrors global.ini)
  globalScheme: ScreenScheme;

  // Global overlay
  globalOverlay: string | null;

  // UI state
  selectedLayerId: string | null;
  themeName: string;

  // Selectors
  getActiveScreen: () => ScreenContext;
  /** Returns the effective scheme: globalScheme merged with per-screen overrides */
  getEffectiveScheme: (screenId: string) => ScreenScheme;
  /** Returns which keys in screen.scheme differ from globalScheme */
  getSchemeOverrideKeys: (screenId: string) => Set<keyof ScreenScheme>;

  // Setters - global
  setThemeName: (name: string) => void;
  setGlobalOverlay: (src: string | null) => void;
  setGlobalScheme: (updates: Partial<ScreenScheme>) => void;

  // Propagation
  /** Push globalScheme to all screens (replaces per-screen schemes) */
  applyGlobalToAll: () => void;
  /** Copy scheme from one screen to another */
  copySchemeToScreen: (fromId: string, toId: string) => void;
  /** Reset screen scheme back to current globalScheme */
  resetScreenSchemeToGlobal: (screenId: string) => void;

  // Setters - screen navigation
  setActiveScreenId: (id: string) => void;

  // Setters - screen-level assets
  setScreenWallpaper: (screenId: string, src: string | null) => void;
  setScreenOverlay: (screenId: string, src: string | null) => void;
  setScreenSubAsset: (screenId: string, name: string, src: string | null) => void;
  setScreenStaticImage: (screenId: string, src: string | null) => void;
  setScreenGlyph: (screenId: string, name: string, src: string | null) => void;

  // Setters - scheme
  updateScreenScheme: (screenId: string, updates: Partial<ScreenScheme>) => void;

  // Setters - layers
  addLayer: (screenId: string, layer: Omit<CanvasLayer, "id" | "zIndex">) => void;
  updateLayer: (screenId: string, layerId: string, updates: Partial<CanvasLayer>) => void;
  removeLayer: (screenId: string, layerId: string) => void;
  setSelectedLayerId: (id: string | null) => void;

  // Import
  importScreens: (screens: ScreenContext[]) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  screens: buildInitialScreens(),
  activeScreenId: "muxlaunch",
  globalOverlay: null,
  globalScheme: { ...DEFAULT_SCHEME },
  selectedLayerId: null,
  themeName: "",

  getActiveScreen: () => {
    const { screens, activeScreenId } = get();
    return screens.find((s) => s.id === activeScreenId) ?? screens[0];
  },

  getEffectiveScheme: (screenId) => {
    const { screens, globalScheme } = get();
    const screen = screens.find((s) => s.id === screenId);
    if (!screen) return globalScheme;
    return { ...globalScheme, ...screen.scheme };
  },

  getSchemeOverrideKeys: (screenId) => {
    const { screens, globalScheme } = get();
    const screen = screens.find((s) => s.id === screenId);
    if (!screen) return new Set();
    const overrides = new Set<keyof ScreenScheme>();
    (Object.keys(globalScheme) as (keyof ScreenScheme)[]).forEach((k) => {
      if (screen.scheme[k] !== globalScheme[k]) overrides.add(k);
    });
    return overrides;
  },

  setThemeName: (name) => set({ themeName: name }),

  setGlobalOverlay: (src) => set({ globalOverlay: src }),

  setGlobalScheme: (updates) =>
    set((state) => ({
      globalScheme: { ...state.globalScheme, ...updates },
    })),

  applyGlobalToAll: () =>
    set((state) => ({
      screens: state.screens.map((s) => ({
        ...s,
        scheme: { ...state.globalScheme },
      })),
    })),

  copySchemeToScreen: (fromId, toId) =>
    set((state) => {
      const source = state.screens.find((s) => s.id === fromId);
      if (!source) return state;
      return {
        screens: state.screens.map((s) =>
          s.id === toId ? { ...s, scheme: { ...source.scheme } } : s
        ),
      };
    }),

  resetScreenSchemeToGlobal: (screenId) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId
          ? { ...s, scheme: { ...state.globalScheme } }
          : s
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
      screens: state.screens.map((s) => {
        if (s.id !== screenId) return s;
        return {
          ...s,
          subAssets: s.subAssets.map((sa) =>
            sa.name === name ? { ...sa, src } : sa
          ),
        };
      }),
    })),

  setScreenStaticImage: (screenId, src) =>
    set((state) => ({
      screens: state.screens.map((s) =>
        s.id === screenId ? { ...s, staticImage: src } : s
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

  setScreenGlyph: (screenId, name, src) =>
    set((state) => ({
      screens: state.screens.map((s) => {
        if (s.id !== screenId) return s;
        return {
          ...s,
          glyphs: s.glyphs.map((g) =>
            g.name === name ? { ...g, src } : g
          ),
        };
      }),
    })),

  addLayer: (screenId, layer) =>
    set((state) => {
      const screen = state.screens.find((s) => s.id === screenId);
      if (!screen) return state;
      const newId = Math.random().toString(36).substring(2, 9);
      const zIndex = screen.layers.length;
      const newLayer: CanvasLayer = { ...layer, id: newId, zIndex };
      return {
        screens: state.screens.map((s) =>
          s.id === screenId
            ? { ...s, layers: [...s.layers, newLayer] }
            : s
        ),
        selectedLayerId: newId,
      };
    }),

  updateLayer: (screenId, layerId, updates) =>
    set((state) => ({
      screens: state.screens.map((s) => {
        if (s.id !== screenId) return s;
        return {
          ...s,
          layers: s.layers.map((l) =>
            l.id === layerId ? { ...l, ...updates } : l
          ),
        };
      }),
    })),

  removeLayer: (screenId, layerId) =>
    set((state) => ({
      screens: state.screens.map((s) => {
        if (s.id !== screenId) return s;
        return {
          ...s,
          layers: s.layers.filter((l) => l.id !== layerId),
        };
      }),
      selectedLayerId:
        get().selectedLayerId === layerId ? null : get().selectedLayerId,
    })),

  setSelectedLayerId: (id) => set({ selectedLayerId: id }),

  importScreens: (screens) => set({ screens }),
}));
