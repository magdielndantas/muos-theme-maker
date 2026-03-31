import { ScreenScheme } from "@/store/themeStore";

type SchemeInputType = "color" | "alpha" | "align" | "number";

export interface SchemeField {
  key: keyof ScreenScheme;
  label: string;
  type: SchemeInputType;
  min?: number;
  max?: number;
}

export interface SchemeGroup {
  id: string;
  title: string;
  fields: SchemeField[];
}

export const SCHEME_GROUPS: SchemeGroup[] = [
  {
    id: "background",
    title: "Background",
    fields: [
      { key: "BACKGROUND", label: "Bg Color", type: "color" },
      { key: "BACKGROUND_ALPHA", label: "Bg Alpha", type: "alpha" },
      { key: "BACKGROUND_GRADIENT_COLOR", label: "Gradient Color", type: "color" },
      { key: "BACKGROUND_GRADIENT_DIRECTION", label: "Gradient Direction", type: "number", min: 0, max: 2 },
      { key: "BACKGROUND_GRADIENT_START", label: "Gradient Start", type: "number", min: 0, max: 255 },
      { key: "BACKGROUND_GRADIENT_STOP", label: "Gradient Stop", type: "number", min: 0, max: 255 },
      { key: "BACKGROUND_GRADIENT_DITHER", label: "Gradient Dither", type: "number", min: 0, max: 1 },
      { key: "BACKGROUND_GRADIENT_BLUR", label: "Gradient Blur", type: "number", min: 0, max: 10 },
    ],
  },
  {
    id: "header",
    title: "Header",
    fields: [
      { key: "HEADER_HEIGHT", label: "Height", type: "number", max: 120 },
      { key: "HEADER_BACKGROUND", label: "Bg Color", type: "color" },
      { key: "HEADER_BACKGROUND_ALPHA", label: "Bg Alpha", type: "alpha" },
      { key: "HEADER_TEXT", label: "Text Color", type: "color" },
      { key: "HEADER_TEXT_ALPHA", label: "Text Alpha", type: "alpha" },
      { key: "HEADER_TEXT_ALIGN", label: "Text Align", type: "align" },
      { key: "HEADER_PADDING_LEFT", label: "Pad Left", type: "number", max: 200 },
      { key: "HEADER_PADDING_RIGHT", label: "Pad Right", type: "number", max: 200 },
      { key: "FONT_HEADER_PAD_TOP", label: "Text Y", type: "number", min: -50, max: 100 },
      { key: "FONT_HEADER_ICON_PAD_TOP", label: "Icon Y", type: "number", min: -50, max: 100 },
    ],
  },
  {
    id: "bar",
    title: "Top Bar (Global)",
    fields: [
      { key: "BAR_HEIGHT", label: "Height", type: "number", max: 120 },
      { key: "BAR_BACKGROUND", label: "Bg Color", type: "color" },
      { key: "BAR_BACKGROUND_ALPHA", label: "Bg Alpha", type: "alpha" },
      { key: "BAR_ICON", label: "Icon Color", type: "color" },
      { key: "BAR_ICON_ALPHA", label: "Icon Alpha", type: "alpha" },
    ],
  },
  {
    id: "status-date",
    title: "Status & Date",
    fields: [
      { key: "DATETIME_ALIGN", label: "Time Align", type: "align" },
      { key: "DATETIME_TEXT", label: "Time Color", type: "color" },
      { key: "DATETIME_ALPHA", label: "Time Alpha", type: "alpha" },
      { key: "DATETIME_PADDING_LEFT", label: "Time Pad L", type: "number", max: 200 },
      { key: "DATETIME_PADDING_RIGHT", label: "Time Pad R", type: "number", max: 200 },
      { key: "STATUS_ALIGN", label: "Icons Align", type: "align" },
      { key: "STATUS_PADDING_LEFT", label: "Icons Pad L", type: "number", max: 200 },
      { key: "STATUS_PADDING_RIGHT", label: "Icons Pad R", type: "number", max: 200 },
    ]
  },
  {
    id: "battery-network",
    title: "Battery & Network",
    fields: [
      { key: "BATTERY_NORMAL", label: "Bat. Normal", type: "color" },
      { key: "BATTERY_NORMAL_ALPHA", label: "Bat. Normal Alpha", type: "alpha" },
      { key: "BATTERY_LOW", label: "Bat. Low", type: "color" },
      { key: "BATTERY_LOW_ALPHA", label: "Bat. Low Alpha", type: "alpha" },
      { key: "BATTERY_ACTIVE", label: "Bat. Active", type: "color" },
      { key: "BATTERY_ACTIVE_ALPHA", label: "Bat. Active Alpha", type: "alpha" },
      { key: "NETWORK_NORMAL", label: "Net Normal", type: "color" },
      { key: "NETWORK_NORMAL_ALPHA", label: "Net Normal Alpha", type: "alpha" },
      { key: "NETWORK_ACTIVE", label: "Net Active", type: "color" },
      { key: "NETWORK_ACTIVE_ALPHA", label: "Net Active Alpha", type: "alpha" },
    ]
  },
  {
    id: "footer",
    title: "Footer",
    fields: [
      { key: "FOOTER_HEIGHT", label: "Height", type: "number", max: 120 },
      { key: "FOOTER_BACKGROUND", label: "Bg Color", type: "color" },
      { key: "FOOTER_BACKGROUND_ALPHA", label: "Bg Alpha", type: "alpha" },
      { key: "FOOTER_TEXT", label: "Text Color", type: "color" },
      { key: "FOOTER_TEXT_ALPHA", label: "Text Alpha", type: "alpha" },
      { key: "FONT_FOOTER_PAD_TOP", label: "Text Y", type: "number", min: -50, max: 100 },
      { key: "FONT_FOOTER_ICON_PAD_TOP", label: "Icon Y", type: "number", min: -50, max: 100 },
    ],
  },
  {
    id: "list",
    title: "List & Menus",
    fields: [
      { key: "LIST_DEFAULT_TEXT", label: "Text Color", type: "color" },
      { key: "LIST_DEFAULT_TEXT_ALPHA", label: "Text Alpha", type: "alpha" },
      { key: "LIST_FOCUS_TEXT", label: "Focus Text", type: "color" },
      { key: "LIST_FOCUS_TEXT_ALPHA", label: "Focus Text Alpha", type: "alpha" },
      { key: "LIST_FOCUS_BACKGROUND", label: "Focus Bg", type: "color" },
      { key: "LIST_FOCUS_BACKGROUND_ALPHA", label: "Focus Bg Alpha", type: "alpha" },
      { key: "LIST_DEFAULT_GLYPH_RECOLOUR", label: "Glyph Color", type: "color" },
      { key: "LIST_DEFAULT_GLYPH_RECOLOUR_ALPHA", label: "Glyph Alpha", type: "alpha" },
      { key: "LIST_FOCUS_GLYPH_RECOLOUR", label: "Focus Glyph", type: "color" },
      { key: "LIST_FOCUS_GLYPH_RECOLOUR_ALPHA", label: "Focus Glyph α", type: "alpha" },
      { key: "LIST_DEFAULT_RADIUS", label: "Radius", type: "number", max: 64 },
    ],
  },
  {
    id: "grid",
    title: "Grid View",
    fields: [
      { key: "GRID_BACKGROUND_ALPHA", label: "Grid Bg Alpha", type: "alpha" },
      { key: "CELL_FOCUS_BACKGROUND", label: "Focus Bg", type: "color" },
      { key: "CELL_FOCUS_BACKGROUND_ALPHA", label: "Focus Bg Alpha", type: "alpha" },
      { key: "CELL_FOCUS_TEXT", label: "Focus Text", type: "color" },
      { key: "CELL_FOCUS_TEXT_ALPHA", label: "Focus Text Alpha", type: "alpha" },
      { key: "CELL_RADIUS", label: "Cell Radius", type: "number", max: 64 },
    ]
  },
  {
    id: "navigation",
    title: "Navigation Hints",
    fields: [
      { key: "NAV_A_GLYPH", label: "A Glyph", type: "color" },
      { key: "NAV_A_GLYPH_ALPHA", label: "A Glyph Alpha", type: "alpha" },
      { key: "NAV_B_GLYPH", label: "B Glyph", type: "color" },
      { key: "NAV_B_GLYPH_ALPHA", label: "B Glyph Alpha", type: "alpha" },
      { key: "NAV_X_GLYPH", label: "X Glyph", type: "color" },
      { key: "NAV_X_GLYPH_ALPHA", label: "X Glyph Alpha", type: "alpha" },
      { key: "NAV_Y_GLYPH", label: "Y Glyph", type: "color" },
      { key: "NAV_Y_GLYPH_ALPHA", label: "Y Glyph Alpha", type: "alpha" },
      { key: "NAV_MENU_GLYPH", label: "Menu Glyph", type: "color" },
      { key: "NAV_MENU_GLYPH_ALPHA", label: "Menu Glyph Alpha", type: "alpha" },
      { key: "NAVIGATION_ALIGNMENT", label: "Align", type: "align" },
    ]
  }
];
