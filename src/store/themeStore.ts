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
  // Extra properties needed for export consistency
  FONT_LIST_ICON_PAD_TOP: number;
  FONT_LIST_ICON_PAD_BOTTOM: number;
  FONT_LIST_PAD_TOP: number;
  FONT_LIST_PAD_BOTTOM: number;
  FONT_LIST_PAD_LEFT: number;
  FONT_MESSAGE_ICON_PAD_TOP: number;
  FONT_MESSAGE_ICON_PAD_BOTTOM: number;
  FONT_MESSAGE_PAD_TOP: number;
  FONT_MESSAGE_PAD_BOTTOM: number;
  NAVIGATION_ALIGNMENT: number;
  NAVIGATION_ICON_SIZE: number;
  LIST_DEFAULT_BACKGROUND_ALPHA: number;
  LIST_DEFAULT_TEXT_ALPHA: number;
  FOOTER_INFO_COLOR: string;
  FOOTER_INFO_COLOR_ALPHA: number;

  // Bar
  BAR_BACKGROUND: string;
  BAR_BACKGROUND_ALPHA: number;
  BAR_BORDER_ALPHA: number;
  BAR_HEIGHT: number;
  BAR_ICON: string;
  BAR_ICON_ALPHA: number;
  BAR_PROGRESS_ACTIVE_BACKGROUND: string;
  BAR_PROGRESS_ACTIVE_BACKGROUND_ALPHA: number;
  BAR_PROGRESS_BACKGROUND: string;
  BAR_PROGRESS_BACKGROUND_ALPHA: number;
  BAR_PROGRESS_HEIGHT: number;
  BAR_PROGRESS_RADIUS: number;
  BAR_RADIUS: number;

  // Battery
  BATTERY_ACTIVE: string;
  BATTERY_ACTIVE_ALPHA: number;
  BATTERY_LOW: string;
  BATTERY_LOW_ALPHA: number;
  BATTERY_NORMAL: string;
  BATTERY_NORMAL_ALPHA: number;

  // Bluetooth & Network
  BLUETOOTH_ACTIVE: string;
  BLUETOOTH_ACTIVE_ALPHA: number;
  BLUETOOTH_NORMAL: string;
  BLUETOOTH_NORMAL_ALPHA: number;
  NETWORK_ACTIVE: string;
  NETWORK_ACTIVE_ALPHA: number;
  NETWORK_NORMAL: string;
  NETWORK_NORMAL_ALPHA: number;

  // Charging
  CHARGER_BACKGROUND_ALPHA: number;
  CHARGER_TEXT: string;
  CHARGER_TEXT_ALPHA: number;

  // Counter
  COUNTER_ALIGNMENT: number;
  COUNTER_BACKGROUND: string;
  COUNTER_BACKGROUND_ALPHA: number;
  COUNTER_BORDER_ALPHA: number;
  COUNTER_BORDER_WIDTH: number;
  COUNTER_ENABLED: number;
  COUNTER_PADDING_AROUND: number;
  COUNTER_PADDING_SIDE: number;
  COUNTER_PADDING_TOP: number;
  COUNTER_RADIUS: number;
  COUNTER_TEXT: string;
  COUNTER_TEXT_ALPHA: number;
  COUNTER_TEXT_FADE_TIME: number;
  COUNTER_TEXT_SEPARATOR: string;

  // Grid / Cell
  CELL_BORDER_WIDTH: number;
  CELL_DEFAULT_BACKGROUND_ALPHA: number;
  CELL_DEFAULT_BORDER_ALPHA: number;
  CELL_DEFAULT_IMAGE_ALPHA: number;
  CELL_DEFAULT_IMAGE_RECOLOUR: string;
  CELL_DEFAULT_IMAGE_RECOLOUR_ALPHA: number;
  CELL_DEFAULT_TEXT_ALPHA: number;
  CELL_FOCUS_BACKGROUND: string;
  CELL_FOCUS_BACKGROUND_ALPHA: number;
  CELL_FOCUS_BORDER_ALPHA: number;
  CELL_FOCUS_IMAGE_ALPHA: number;
  CELL_FOCUS_IMAGE_RECOLOUR: string;
  CELL_FOCUS_IMAGE_RECOLOUR_ALPHA: number;
  CELL_FOCUS_TEXT: string;
  CELL_FOCUS_TEXT_ALPHA: number;
  CELL_IMAGE_PADDING_TOP: number;
  CELL_RADIUS: number;
  CELL_TEXT_LINE_SPACING: number;
  CELL_TEXT_PADDING_BOTTOM: number;
  CELL_TEXT_PADDING_SIDE: number;
  CURRENT_ITEM_LABEL_ALIGNMENT: number;
  CURRENT_ITEM_LABEL_BACKGROUND_ALPHA: number;
  CURRENT_ITEM_LABEL_BORDER_ALPHA: number;
  CURRENT_ITEM_LABEL_BORDER_WIDTH: number;
  CURRENT_ITEM_LABEL_OFFSET_Y: number;
  CURRENT_ITEM_LABEL_RADIUS: number;
  CURRENT_ITEM_LABEL_TEXT_ALPHA: number;
  CURRENT_ITEM_LABEL_TEXT_ALIGNMENT: number;

  // Help
  HELP_BACKGROUND: string;
  HELP_BACKGROUND_ALPHA: number;
  HELP_BORDER_ALPHA: number;
  HELP_CONTENT: string;
  HELP_RADIUS: number;
  HELP_TITLE: string;

  // List (Advanced)
  LIST_DEFAULT_GLYPH_ALPHA: number;
  LIST_DEFAULT_GLYPH_PAD_LEFT: number;
  LIST_DEFAULT_GLYPH_RECOLOUR: string;
  LIST_DEFAULT_GLYPH_RECOLOUR_ALPHA: number;
  LIST_DEFAULT_INDICATOR_ALPHA: number;
  LIST_DEFAULT_RADIUS: number;
  LIST_DISABLED_TEXT: string;
  LIST_DISABLED_TEXT_ALPHA: number;
  LIST_FOCUS_GLYPH_ALPHA: number;
  LIST_FOCUS_GLYPH_RECOLOUR: string;
  LIST_FOCUS_GLYPH_RECOLOUR_ALPHA: number;
  LIST_FOCUS_INDICATOR_ALPHA: number;

  // Images
  IMAGE_LIST_PAD_BOTTOM: number;
  IMAGE_LIST_PAD_RIGHT: number;
  IMAGE_LIST_RADIUS: number;
  IMAGE_LIST_RECOLOUR_ALPHA: number;
  IMAGE_PREVIEW_RADIUS: number;
  IMAGE_PREVIEW_RECOLOUR_ALPHA: number;

  // Keyboard (OSK)
  OSK_BACKGROUND: string;
  OSK_BACKGROUND_ALPHA: number;
  OSK_BORDER_ALPHA: number;
  OSK_ITEM_BACKGROUND: string;
  OSK_ITEM_BACKGROUND_ALPHA: number;
  OSK_ITEM_BACKGROUND_FOCUS: string;
  OSK_ITEM_BACKGROUND_FOCUS_ALPHA: number;
  OSK_ITEM_BORDER_ALPHA: number;
  OSK_ITEM_BORDER_FOCUS_ALPHA: number;
  OSK_ITEM_RADIUS: number;
  OSK_RADIUS: number;
  OSK_TEXT: string;
  OSK_TEXT_ALPHA: number;
  OSK_TEXT_FOCUS: string;
  OSK_TEXT_FOCUS_ALPHA: number;

  // Misc & Screens
  META_CUT: number;
  ANIMATED_BACKGROUND: number;
  CONTENT_PADDING_LEFT: number;
  CONTENT_PADDING_TOP: number;
  CONTENT_SIZE_TO_CONTENT: number;
  IMAGE_OVERLAY: number;
  STATIC_ALIGNMENT: number;
  DATETIME_TEXT: string;
  DATETIME_ALPHA: number;
  DATETIME_ALIGN: number;
  DATETIME_PADDING_LEFT: number;
  DATETIME_PADDING_RIGHT: number;
  STATUS_ALIGN: number;
  STATUS_PADDING_LEFT: number;
  STATUS_PADDING_RIGHT: number;
  MISC_NAVIGATION_TYPE: number;
  GRID_NAVIGATION_TYPE: number;
  GRID_BACKGROUND_ALPHA: number;
  GRID_LOCATION_X: number;
  GRID_LOCATION_Y: number;
  GRID_ACTIVE: number;
  GRID_ROW_COUNT: number;
  GRID_COLUMN_COUNT: number;

  // Notification (MSG)
  MSG_BACKGROUND: string;
  MSG_BACKGROUND_ALPHA: number;
  MSG_BORDER_ALPHA: number;
  MSG_RADIUS: number;
  MSG_TEXT: string;
  MSG_TEXT_ALPHA: number;

  // Verbose
  VERBOSE_BOOT_BACKGROUND: string;
  VERBOSE_BOOT_BACKGROUND_ALPHA: number;
  VERBOSE_BOOT_TEXT: string;
  VERBOSE_BOOT_TEXT_ALPHA: number;
  VERBOSE_BOOT_Y_POS: number;

  // Navigation (Standard A/B/X/Y)
  NAV_LR_GLYPH: string;
  NAV_LR_GLYPH_ALPHA: number;
  NAV_LR_TEXT: string;
  NAV_LR_TEXT_ALPHA: number;
  NAV_UD_GLYPH: string;
  NAV_UD_GLYPH_ALPHA: number;
  NAV_UD_TEXT: string;
  NAV_UD_TEXT_ALPHA: number;
  NAV_A_GLYPH: string;
  NAV_A_GLYPH_ALPHA: number;
  NAV_A_TEXT: string;
  NAV_A_TEXT_ALPHA: number;
  NAV_B_GLYPH: string;
  NAV_B_GLYPH_ALPHA: number;
  NAV_B_TEXT: string;
  NAV_B_TEXT_ALPHA: number;
  NAV_C_GLYPH: string;
  NAV_C_GLYPH_ALPHA: number;
  NAV_C_TEXT: string;
  NAV_C_TEXT_ALPHA: number;
  NAV_MENU_GLYPH: string;
  NAV_MENU_GLYPH_ALPHA: number;
  NAV_MENU_TEXT: string;
  NAV_MENU_TEXT_ALPHA: number;
  NAV_X_GLYPH: string;
  NAV_X_GLYPH_ALPHA: number;
  NAV_X_TEXT: string;
  NAV_X_TEXT_ALPHA: number;
  NAV_Y_GLYPH: string;
  NAV_Y_GLYPH_ALPHA: number;
  NAV_Y_TEXT: string;
  NAV_Y_TEXT_ALPHA: number;
  NAV_Z_GLYPH: string;
  NAV_Z_GLYPH_ALPHA: number;
  NAV_Z_TEXT: string;
  NAV_Z_TEXT_ALPHA: number;

  // List (Standard Focus)
  LIST_DEFAULT_BACKGROUND: string;
  LIST_DEFAULT_TEXT: string;
  LIST_FOCUS_BACKGROUND: string;
  LIST_FOCUS_TEXT: string;
  LIST_FOCUS_BACKGROUND_ALPHA: number;
  LIST_FOCUS_TEXT_ALPHA: number;

  // Terminal
  TERMINAL_BACKGROUND: string;
  TERMINAL_FOREGROUND: string;
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

  FONT_LIST_ICON_PAD_TOP: 0,
  FONT_LIST_ICON_PAD_BOTTOM: 0,
  FONT_LIST_PAD_TOP: 0,
  FONT_LIST_PAD_BOTTOM: 0,
  FONT_LIST_PAD_LEFT: 0,
  FONT_MESSAGE_ICON_PAD_TOP: 0,
  FONT_MESSAGE_ICON_PAD_BOTTOM: 0,
  FONT_MESSAGE_PAD_TOP: 0,
  FONT_MESSAGE_PAD_BOTTOM: 0,
  NAVIGATION_ALIGNMENT: 3,
  NAVIGATION_ICON_SIZE: 14,
  LIST_DEFAULT_BACKGROUND_ALPHA: 255,
  LIST_DEFAULT_TEXT_ALPHA: 255,
  FOOTER_INFO_COLOR: "FFFFFF",
  FOOTER_INFO_COLOR_ALPHA: 255,

  BAR_BACKGROUND: "222222",
  BAR_BACKGROUND_ALPHA: 255,
  BAR_BORDER_ALPHA: 50,
  BAR_HEIGHT: 14,
  BAR_ICON: "FFFFFF",
  BAR_ICON_ALPHA: 255,
  BAR_PROGRESS_ACTIVE_BACKGROUND: "EAB308",
  BAR_PROGRESS_ACTIVE_BACKGROUND_ALPHA: 255,
  BAR_PROGRESS_BACKGROUND: "444444",
  BAR_PROGRESS_BACKGROUND_ALPHA: 255,
  BAR_PROGRESS_HEIGHT: 4,
  BAR_PROGRESS_RADIUS: 2,
  BAR_RADIUS: 2,

  BATTERY_ACTIVE: "00FF00",
  BATTERY_ACTIVE_ALPHA: 255,
  BATTERY_LOW: "FF0000",
  BATTERY_LOW_ALPHA: 255,
  BATTERY_NORMAL: "FFFFFF",
  BATTERY_NORMAL_ALPHA: 255,

  BLUETOOTH_ACTIVE: "3B82F6",
  BLUETOOTH_ACTIVE_ALPHA: 255,
  BLUETOOTH_NORMAL: "FFFFFF",
  BLUETOOTH_NORMAL_ALPHA: 100,
  NETWORK_ACTIVE: "FFFFFF",
  NETWORK_ACTIVE_ALPHA: 255,
  NETWORK_NORMAL: "FFFFFF",
  NETWORK_NORMAL_ALPHA: 255,

  CHARGER_BACKGROUND_ALPHA: 180,
  CHARGER_TEXT: "FFFFFF",
  CHARGER_TEXT_ALPHA: 255,

  COUNTER_ALIGNMENT: 3,
  COUNTER_BACKGROUND: "000000",
  COUNTER_BACKGROUND_ALPHA: 100,
  COUNTER_BORDER_ALPHA: 0,
  COUNTER_BORDER_WIDTH: 0,
  COUNTER_ENABLED: 1,
  COUNTER_PADDING_AROUND: 5,
  COUNTER_PADDING_SIDE: 15,
  COUNTER_PADDING_TOP: 0,
  COUNTER_RADIUS: 10,
  COUNTER_TEXT: "FFFFFF",
  COUNTER_TEXT_ALPHA: 255,
  COUNTER_TEXT_FADE_TIME: 500,
  COUNTER_TEXT_SEPARATOR: "/",

  CELL_BORDER_WIDTH: 2,
  CELL_DEFAULT_BACKGROUND_ALPHA: 0,
  CELL_DEFAULT_BORDER_ALPHA: 0,
  CELL_DEFAULT_IMAGE_ALPHA: 255,
  CELL_DEFAULT_IMAGE_RECOLOUR: "FFFFFF",
  CELL_DEFAULT_IMAGE_RECOLOUR_ALPHA: 0,
  CELL_DEFAULT_TEXT_ALPHA: 180,
  CELL_FOCUS_BACKGROUND: "FFFFFF",
  CELL_FOCUS_BACKGROUND_ALPHA: 50,
  CELL_FOCUS_BORDER_ALPHA: 255,
  CELL_FOCUS_IMAGE_ALPHA: 255,
  CELL_FOCUS_IMAGE_RECOLOUR: "FFFFFF",
  CELL_FOCUS_IMAGE_RECOLOUR_ALPHA: 0,
  CELL_FOCUS_TEXT: "FFFFFF",
  CELL_FOCUS_TEXT_ALPHA: 255,
  CELL_IMAGE_PADDING_TOP: 10,
  CELL_RADIUS: 10,
  CELL_TEXT_LINE_SPACING: 2,
  CELL_TEXT_PADDING_BOTTOM: 5,
  CELL_TEXT_PADDING_SIDE: 10,
  CURRENT_ITEM_LABEL_ALIGNMENT: 2,
  CURRENT_ITEM_LABEL_BACKGROUND_ALPHA: 0,
  CURRENT_ITEM_LABEL_BORDER_ALPHA: 0,
  CURRENT_ITEM_LABEL_BORDER_WIDTH: 0,
  CURRENT_ITEM_LABEL_OFFSET_Y: 0,
  CURRENT_ITEM_LABEL_RADIUS: 0,
  CURRENT_ITEM_LABEL_TEXT_ALPHA: 255,
  CURRENT_ITEM_LABEL_TEXT_ALIGNMENT: 2,

  HELP_BACKGROUND: "000000",
  HELP_BACKGROUND_ALPHA: 200,
  HELP_BORDER_ALPHA: 50,
  HELP_CONTENT: "FFFFFF",
  HELP_RADIUS: 10,
  HELP_TITLE: "EAB308",

  LIST_DEFAULT_GLYPH_ALPHA: 150,
  LIST_DEFAULT_GLYPH_PAD_LEFT: 10,
  LIST_DEFAULT_GLYPH_RECOLOUR: "FFFFFF",
  LIST_DEFAULT_GLYPH_RECOLOUR_ALPHA: 0,
  LIST_DEFAULT_INDICATOR_ALPHA: 0,
  LIST_DEFAULT_RADIUS: 8,
  LIST_DISABLED_TEXT: "555555",
  LIST_DISABLED_TEXT_ALPHA: 100,
  LIST_FOCUS_GLYPH_ALPHA: 255,
  LIST_FOCUS_GLYPH_RECOLOUR: "FFFFFF",
  LIST_FOCUS_GLYPH_RECOLOUR_ALPHA: 0,
  LIST_FOCUS_INDICATOR_ALPHA: 255,

  IMAGE_LIST_PAD_BOTTOM: 10,
  IMAGE_LIST_PAD_RIGHT: 10,
  IMAGE_LIST_RADIUS: 10,
  IMAGE_LIST_RECOLOUR_ALPHA: 0,
  IMAGE_PREVIEW_RADIUS: 10,
  IMAGE_PREVIEW_RECOLOUR_ALPHA: 0,

  OSK_BACKGROUND: "111111",
  OSK_BACKGROUND_ALPHA: 255,
  OSK_BORDER_ALPHA: 50,
  OSK_ITEM_BACKGROUND: "222222",
  OSK_ITEM_BACKGROUND_ALPHA: 255,
  OSK_ITEM_BACKGROUND_FOCUS: "EAB308",
  OSK_ITEM_BACKGROUND_FOCUS_ALPHA: 255,
  OSK_ITEM_BORDER_ALPHA: 0,
  OSK_ITEM_BORDER_FOCUS_ALPHA: 0,
  OSK_ITEM_RADIUS: 4,
  OSK_RADIUS: 8,
  OSK_TEXT: "FFFFFF",
  OSK_TEXT_ALPHA: 255,
  OSK_TEXT_FOCUS: "000000",
  OSK_TEXT_FOCUS_ALPHA: 255,

  META_CUT: 0,
  ANIMATED_BACKGROUND: 1,
  CONTENT_PADDING_LEFT: 0,
  CONTENT_PADDING_TOP: 0,
  CONTENT_SIZE_TO_CONTENT: 0,
  IMAGE_OVERLAY: 0,
  STATIC_ALIGNMENT: 2,
  DATETIME_TEXT: "FFFFFF",
  DATETIME_ALPHA: 255,
  DATETIME_ALIGN: 3,
  DATETIME_PADDING_LEFT: 14,
  DATETIME_PADDING_RIGHT: 14,
  STATUS_ALIGN: 1,
  STATUS_PADDING_LEFT: 14,
  STATUS_PADDING_RIGHT: 14,
  MISC_NAVIGATION_TYPE: 1,
  GRID_NAVIGATION_TYPE: 1,
  GRID_BACKGROUND_ALPHA: 50,
  GRID_LOCATION_X: 40,
  GRID_LOCATION_Y: 40,

  MSG_BACKGROUND: "000000",
  MSG_BACKGROUND_ALPHA: 220,
  MSG_BORDER_ALPHA: 100,
  MSG_RADIUS: 12,
  MSG_TEXT: "FFFFFF",
  MSG_TEXT_ALPHA: 255,

  VERBOSE_BOOT_BACKGROUND: "000000",
  VERBOSE_BOOT_BACKGROUND_ALPHA: 255,
  VERBOSE_BOOT_TEXT: "FFFFFF",
  VERBOSE_BOOT_TEXT_ALPHA: 255,
  VERBOSE_BOOT_Y_POS: 400,

  NAV_LR_GLYPH: "FFFFFF",
  NAV_LR_GLYPH_ALPHA: 255,
  NAV_LR_TEXT: "FFFFFF",
  NAV_LR_TEXT_ALPHA: 255,
  NAV_UD_GLYPH: "FFFFFF",
  NAV_UD_GLYPH_ALPHA: 255,
  NAV_UD_TEXT: "FFFFFF",
  NAV_UD_TEXT_ALPHA: 255,
  NAV_A_GLYPH: "FFFFFF",
  NAV_A_GLYPH_ALPHA: 255,
  NAV_A_TEXT: "FFFFFF",
  NAV_A_TEXT_ALPHA: 255,
  NAV_B_GLYPH: "FFFFFF",
  NAV_B_GLYPH_ALPHA: 255,
  NAV_B_TEXT: "FFFFFF",
  NAV_B_TEXT_ALPHA: 255,
  NAV_C_GLYPH: "FFFFFF",
  NAV_C_GLYPH_ALPHA: 255,
  NAV_C_TEXT: "FFFFFF",
  NAV_C_TEXT_ALPHA: 255,
  NAV_MENU_GLYPH: "FFFFFF",
  NAV_MENU_GLYPH_ALPHA: 255,
  NAV_MENU_TEXT: "FFFFFF",
  NAV_MENU_TEXT_ALPHA: 255,
  NAV_X_GLYPH: "FFFFFF",
  NAV_X_GLYPH_ALPHA: 255,
  NAV_X_TEXT: "FFFFFF",
  NAV_X_TEXT_ALPHA: 255,
  NAV_Y_GLYPH: "FFFFFF",
  NAV_Y_GLYPH_ALPHA: 255,
  NAV_Y_TEXT: "FFFFFF",
  NAV_Y_TEXT_ALPHA: 255,
  NAV_Z_GLYPH: "FFFFFF",
  NAV_Z_GLYPH_ALPHA: 255,
  NAV_Z_TEXT: "FFFFFF",
  NAV_Z_TEXT_ALPHA: 255,

  LIST_DEFAULT_BACKGROUND: "111111",
  LIST_DEFAULT_TEXT: "FFFFFF",
  LIST_FOCUS_BACKGROUND: "EAB308",
  LIST_FOCUS_TEXT: "000000",
  LIST_FOCUS_BACKGROUND_ALPHA: 255,
  LIST_FOCUS_TEXT_ALPHA: 255,

  TERMINAL_BACKGROUND: "000000",
  TERMINAL_FOREGROUND: "00FF00",
  GRID_ACTIVE: 0,
  GRID_ROW_COUNT: 0,
  GRID_COLUMN_COUNT: 0,
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

export interface ResolutionData {
  screens: ScreenContext[];
  globalScheme: ScreenScheme;
  globalOverlay: string | null;
  globalGlyphs: {
    header: Record<string, string | null>;
    footer: Record<string, string | null>;
    bar: Record<string, string | null>;
  };
}

function createResolutionData(): ResolutionData {
  return {
    screens: buildInitialScreens(),
    globalScheme: { ...DEFAULT_SCHEME },
    globalOverlay: null,
    globalGlyphs: {
      header: {},
      footer: {},
      bar: {},
    },
  };
}

interface ThemeState {
  resolutions: Record<string, ResolutionData>;
  activeScreenId: string;
  selectedLayerId: string | null;
  themeName: string;
  resolution: string;

  getActiveScreen: () => ScreenContext;
  getEffectiveScheme: (screenId: string) => ScreenScheme;
  getSchemeOverrideKeys: (screenId: string) => Set<keyof ScreenScheme>;

  setThemeName: (name: string) => void;
  setResolution: (res: string) => void;
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
  cloneResolution: (from: string, to: string) => void;
  importResolution: (res: string, data: ResolutionData) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  resolutions: {
    "640x480": createResolutionData(),
  },
  activeScreenId: "muxlaunch",
  selectedLayerId: null,
  themeName: "",
  resolution: "640x480",

  getActiveScreen: () => {
    const { resolutions, resolution, activeScreenId } = get();
    const data = resolutions[resolution] || resolutions["640x480"];
    return data.screens.find((s) => s.id === activeScreenId) ?? data.screens[0];
  },

  getEffectiveScheme: (screenId) => {
    const { resolutions, resolution } = get();
    const data = resolutions[resolution] || resolutions["640x480"];
    const sc = data.screens.find((s) => s.id === screenId);
    if (!sc) return data.globalScheme;
    return { ...data.globalScheme, ...sc.scheme };
  },

  getSchemeOverrideKeys: (screenId) => {
    const { resolutions, resolution } = get();
    const data = resolutions[resolution] || resolutions["640x480"];
    const sc = data.screens.find((s) => s.id === screenId);
    if (!sc) return new Set();
    const keys = new Set<keyof ScreenScheme>();
    (Object.keys(sc.scheme) as (keyof ScreenScheme)[]).forEach((k) => {
      if (sc.scheme[k] !== data.globalScheme[k]) {
        keys.add(k);
      }
    });
    return keys;
  },

  setThemeName: (themeName) => set({ themeName }),
  setResolution: (resolution) => set((state) => {
    if (!state.resolutions[resolution]) {
      return { 
        resolution, 
        resolutions: { ...state.resolutions, [resolution]: createResolutionData() } 
      };
    }
    return { resolution };
  }),

  cloneResolution: (from: string, to: string) => set((state) => {
    const fromData = state.resolutions[from];
    if (!fromData) return state;
    // Deep clone basic objects
    const newData: ResolutionData = JSON.parse(JSON.stringify(fromData));
    return {
      resolutions: { ...state.resolutions, [to]: newData }
    };
  }),

  setGlobalOverlay: (globalOverlay) =>
    set((state) => ({
      resolutions: {
        ...state.resolutions,
        [state.resolution]: {
          ...state.resolutions[state.resolution],
          globalOverlay,
        },
      },
    })),

  setGlobalScheme: (updates) =>
    set((state) => ({
      resolutions: {
        ...state.resolutions,
        [state.resolution]: {
          ...state.resolutions[state.resolution],
          globalScheme: { ...state.resolutions[state.resolution].globalScheme, ...updates },
        },
      },
    })),

  setGlobalGlyph: (category, name, src) =>
    set((state) => ({
      resolutions: {
        ...state.resolutions,
        [state.resolution]: {
          ...state.resolutions[state.resolution],
          globalGlyphs: {
            ...state.resolutions[state.resolution].globalGlyphs,
            [category]: {
              ...state.resolutions[state.resolution].globalGlyphs[category],
              [name]: src,
            },
          },
        },
      },
    })),

  applyGlobalToAll: () =>
    set((state) => ({
      resolutions: {
        ...state.resolutions,
        [state.resolution]: {
          ...state.resolutions[state.resolution],
          screens: state.resolutions[state.resolution].screens.map((s) => ({ ...s, scheme: {} })),
        },
      },
    })),

  copySchemeToScreen: (fromId, toId) =>
    set((state) => {
      const data = state.resolutions[state.resolution];
      const fromScreen = data.screens.find((s) => s.id === fromId);
      if (!fromScreen) return state;
      return {
        resolutions: {
          ...state.resolutions,
          [state.resolution]: {
            ...data,
            screens: data.screens.map((s) =>
              s.id === toId ? { ...s, scheme: { ...fromScreen.scheme } } : s
            ),
          },
        },
      };
    }),

  resetScreenSchemeToGlobal: (screenId) =>
    set((state) => ({
      resolutions: {
        ...state.resolutions,
        [state.resolution]: {
          ...state.resolutions[state.resolution],
          screens: state.resolutions[state.resolution].screens.map((s) =>
            s.id === screenId ? { ...s, scheme: {} } : s
          ),
        },
      },
    })),

  setActiveScreenId: (id) => set({ activeScreenId: id, selectedLayerId: null }),

  setScreenWallpaper: (screenId, src) =>
    set((state) => ({
      resolutions: {
        ...state.resolutions,
        [state.resolution]: {
          ...state.resolutions[state.resolution],
          screens: state.resolutions[state.resolution].screens.map((s) =>
            s.id === screenId ? { ...s, wallpaper: src } : s
          ),
        },
      },
    })),

  setScreenOverlay: (screenId, src) =>
    set((state) => ({
      resolutions: {
        ...state.resolutions,
        [state.resolution]: {
          ...state.resolutions[state.resolution],
          screens: state.resolutions[state.resolution].screens.map((s) =>
            s.id === screenId ? { ...s, overlay: src } : s
          ),
        },
      },
    })),

  setScreenSubAsset: (screenId, name, src) =>
    set((state) => {
      const data = state.resolutions[state.resolution];
      return {
        resolutions: {
          ...state.resolutions,
          [state.resolution]: {
            ...data,
            screens: data.screens.map((s) =>
              s.id === screenId
                ? {
                    ...s,
                    subAssets: s.subAssets.map((sa) =>
                      sa.name === name ? { ...sa, src } : sa
                    ),
                  }
                : s
            ),
          },
        },
      };
    }),

  setScreenStaticImage: (screenId, src) =>
    set((state) => ({
      resolutions: {
        ...state.resolutions,
        [state.resolution]: {
          ...state.resolutions[state.resolution],
          screens: state.resolutions[state.resolution].screens.map((s) =>
            s.id === screenId ? { ...s, staticImage: src } : s
          ),
        },
      },
    })),

  setScreenGlyph: (screenId, name, src) =>
    set((state) => {
      const data = state.resolutions[state.resolution];
      return {
        resolutions: {
          ...state.resolutions,
          [state.resolution]: {
            ...data,
            screens: data.screens.map((s) =>
              s.id === screenId
                ? {
                    ...s,
                    glyphs: s.glyphs.map((g) =>
                      g.name === name ? { ...g, src } : g
                    ),
                  }
                : s
            ),
          },
        },
      };
    }),

  updateScreenScheme: (screenId, updates) =>
    set((state) => {
      const data = state.resolutions[state.resolution];
      return {
        resolutions: {
          ...state.resolutions,
          [state.resolution]: {
            ...data,
            screens: data.screens.map((s) =>
              s.id === screenId
                ? { ...s, scheme: { ...s.scheme, ...updates } }
                : s
            ),
          },
        },
      };
    }),

  addLayer: (screenId, layer) =>
    set((state) => {
      const data = state.resolutions[state.resolution];
      return {
        resolutions: {
          ...state.resolutions,
          [state.resolution]: {
            ...data,
            screens: data.screens.map((s) =>
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
          },
        },
      };
    }),

  updateLayer: (screenId, layerId, updates) =>
    set((state) => {
      const data = state.resolutions[state.resolution];
      return {
        resolutions: {
          ...state.resolutions,
          [state.resolution]: {
            ...data,
            screens: data.screens.map((s) =>
              s.id === screenId
                ? {
                    ...s,
                    layers: s.layers.map((l) =>
                      l.id === layerId ? { ...l, ...updates } : l
                    ),
                  }
                : s
            ),
          },
        },
      };
    }),

  removeLayer: (screenId, layerId) =>
    set((state) => {
      const data = state.resolutions[state.resolution];
      return {
        resolutions: {
          ...state.resolutions,
          [state.resolution]: {
            ...data,
            screens: data.screens.map((s) =>
              s.id === screenId
                ? {
                    ...s,
                    layers: s.layers.filter((l) => l.id !== layerId),
                  }
                : s
            ),
          },
        },
        selectedLayerId: null,
      };
    }),

  setSelectedLayerId: (id) => set({ selectedLayerId: id }),

  importScreens: (screens) => set((state) => ({
    resolutions: {
      ...state.resolutions,
      [state.resolution]: {
        ...state.resolutions[state.resolution],
        screens
      }
    }
  })),

  importResolution: (res: string, data: ResolutionData) => set((state) => ({
    resolutions: {
      ...state.resolutions,
      [res]: data
    },
    resolution: res
  })),
}));
