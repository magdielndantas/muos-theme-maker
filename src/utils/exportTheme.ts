import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useThemeStore, ScreenScheme } from "../store/themeStore";

// Converte data URL (data:image/png;base64,...) para base64 puro
function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(",")[1] ?? "";
}

// Detecta extensão a partir do data URL mime type
function mimeToExt(dataUrl: string): string {
  const mime = dataUrl.split(";")[0].replace("data:", "");
  const map: Record<string, string> = {
    "image/png":  "png",
    "image/jpeg": "jpg",
    "image/gif":  "gif",
    "image/webp": "webp",
    "image/bmp":  "bmp",
    "audio/wav":  "wav",
    "audio/wave": "wav",
    "audio/mpeg": "mp3",
    "audio/ogg":  "ogg",
  };
  return map[mime] ?? "png";
}

export const exportTheme = async (themeName: string = "MyTheme") => {
  const state = useThemeStore.getState();
  const zip = new JSZip();

  const resolutions = Object.keys(state.resolutions);

  for (const res of resolutions) {
    const data = state.resolutions[res];
    if (!data) continue;

    const base = `${themeName}/${res}`;
    const wallDir  = `${base}/image/wall`;
    const staticDir = `${base}/image/static`;
    const glyphDir = `${base}/glyph`;
    const schemeDir = `${base}/scheme`;

    // 1. Global Overlay (image/overlay.png)
    if (data.globalOverlay) {
      const ext = mimeToExt(data.globalOverlay);
      const b64 = dataUrlToBase64(data.globalOverlay);
      zip.file(`${base}/image/overlay.${ext}`, b64, { base64: true });
    }

    // Default Wallpaper (image/wall/default.png)
    if (data.defaultWallpaper) {
      const ext = mimeToExt(data.defaultWallpaper);
      const b64 = dataUrlToBase64(data.defaultWallpaper);
      zip.file(`${wallDir}/default.${ext}`, b64, { base64: true });
    }

    // Boot Logo (image/bootlogo.bmp)
    if (data.bootLogo) {
      const b64 = dataUrlToBase64(data.bootLogo);
      zip.file(`${base}/image/bootlogo.bmp`, b64, { base64: true });
    }

    // Preview Image (preview.png)
    if (data.previewImage) {
      const ext = mimeToExt(data.previewImage);
      const b64 = dataUrlToBase64(data.previewImage);
      zip.file(`${base}/preview.${ext}`, b64, { base64: true });
    }

    // Fonts
    for (const [slot, fontData] of Object.entries(data.fonts)) {
      if (!fontData) continue;
      const b64 = dataUrlToBase64(fontData);
      if (slot === "default") {
        zip.file(`${base}/font/default.bin`, b64, { base64: true });
      } else {
        zip.file(`${base}/font/${slot}/default.bin`, b64, { base64: true });
      }
    }

    // Sounds
    for (const [name, src] of Object.entries(data.sounds)) {
      if (!src) continue;
      const ext = mimeToExt(src);
      const b64 = dataUrlToBase64(src);
      zip.file(`${themeName}/sound/${name}.${ext}`, b64, { base64: true });
    }

    for (const screen of data.screens) {
      // 2. Wallpapers (image/wall/[screenid].png)
      if (screen.wallpaper) {
        const ext = mimeToExt(screen.wallpaper);
        const b64 = dataUrlToBase64(screen.wallpaper);
        zip.file(`${wallDir}/${screen.id}.${ext}`, b64, { base64: true });
      }

      // 3. Static Images (image/static/[screenid].png)
      if (screen.staticImage) {
        const ext = mimeToExt(screen.staticImage);
        const b64 = dataUrlToBase64(screen.staticImage);
        zip.file(`${staticDir}/${screen.id}.${ext}`, b64, { base64: true });
      }

      // 4. Overlays (image/overlay_[screenid].png) per screen
      if (screen.overlay) {
        const ext = mimeToExt(screen.overlay);
        const b64 = dataUrlToBase64(screen.overlay);
        zip.file(`${base}/image/overlay_${screen.id}.${ext}`, b64, { base64: true });
      }

      // 5. Sub Assets (image/wall/[screenid]/[name].png)
      for (const sa of screen.subAssets) {
        if (!sa.src) continue;
        const ext = mimeToExt(sa.src);
        const b64 = dataUrlToBase64(sa.src);
        zip.file(`${wallDir}/${screen.id}/${sa.name}.${ext}`, b64, { base64: true });
      }

      // 6. Glyphs (glyph/[screenid]/[name].png)
      for (const gl of screen.glyphs) {
        if (!gl.src) continue;
        const ext = mimeToExt(gl.src);
        const b64 = dataUrlToBase64(gl.src);
        zip.file(`${glyphDir}/${screen.id}/${gl.name}.${ext}`, b64, { base64: true });
      }

      // 7. Screen specific INI ([screenid].ini)
      if (Object.keys(screen.scheme).length > 0) {
        const screenSchemeContent = buildIniContent(screen.scheme);
        zip.file(`${schemeDir}/${screen.id}.ini`, screenSchemeContent);
      }
    }

    // 8. Resolution default scheme ({res}/scheme/default.ini)
    const defaultSchemeContent = buildIniContent(data.globalScheme);
    zip.file(`${schemeDir}/default.ini`, defaultSchemeContent);

    // 9. Global Glyphs (glyph/header, glyph/footer, glyph/bar)
    for (const cat of ["header", "footer", "bar"] as const) {
      const catGlyphs = data.globalGlyphs[cat];
      for (const [name, src] of Object.entries(catGlyphs)) {
        if (!src) continue;
        const ext = mimeToExt(src as string);
        const b64 = dataUrlToBase64(src as string);
        zip.file(`${glyphDir}/${cat}/${name}.${ext}`, b64, { base64: true });
      }
    }
  }

  // 9b. Root-level global.ini (from active resolution — applies to all resolutions)
  const activeData = state.resolutions[state.resolution];
  if (activeData) {
    zip.file(`${themeName}/scheme/global.ini`, buildIniContent(activeData.globalScheme));
  }

  // 10. Metadata files required by muOS
  zip.file(`${themeName}/active.txt`, themeName);
  zip.file(`${themeName}/credits.txt`, `Theme: ${themeName}\nCreated with muOS Theme Studio`);

  // 11. Manifest (theme.json) - includes all resolutions
  zip.file(`${themeName}/theme.json`, JSON.stringify({
    name: themeName,
    resolutions,
    active_resolution: state.resolution,
    version: "2.0 (Multi-Res)"
  }, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${themeName}.muxthm`);
};

function buildIniContent(overrides: Partial<ScreenScheme> = {}): string {
  // Map sections based on prefix or explicit mapping
  const sectionMapping: Record<string, (keyof ScreenScheme)[]> = {
    background: ["BACKGROUND", "BACKGROUND_ALPHA", "BACKGROUND_GRADIENT_COLOR", "BACKGROUND_GRADIENT_START", "BACKGROUND_GRADIENT_STOP", "BACKGROUND_GRADIENT_DIRECTION", "BACKGROUND_GRADIENT_DITHER", "BACKGROUND_GRADIENT_BLUR"],
    bar: ["BAR_BACKGROUND", "BAR_BACKGROUND_ALPHA", "BAR_BORDER_ALPHA", "BAR_HEIGHT", "BAR_ICON", "BAR_ICON_ALPHA", "BAR_PROGRESS_ACTIVE_BACKGROUND", "BAR_PROGRESS_ACTIVE_BACKGROUND_ALPHA", "BAR_PROGRESS_BACKGROUND", "BAR_PROGRESS_BACKGROUND_ALPHA", "BAR_PROGRESS_HEIGHT", "BAR_PROGRESS_RADIUS", "BAR_RADIUS"],
    battery: ["BATTERY_ACTIVE", "BATTERY_ACTIVE_ALPHA", "BATTERY_LOW", "BATTERY_LOW_ALPHA", "BATTERY_NORMAL", "BATTERY_NORMAL_ALPHA"],
    bluetooth: ["BLUETOOTH_ACTIVE", "BLUETOOTH_ACTIVE_ALPHA", "BLUETOOTH_NORMAL", "BLUETOOTH_NORMAL_ALPHA"],
    charging: ["CHARGER_BACKGROUND_ALPHA", "CHARGER_TEXT", "CHARGER_TEXT_ALPHA"],
    counter: ["COUNTER_ALIGNMENT", "COUNTER_BACKGROUND", "COUNTER_BACKGROUND_ALPHA", "COUNTER_BORDER_ALPHA", "COUNTER_BORDER_WIDTH", "COUNTER_ENABLED", "COUNTER_PADDING_AROUND", "COUNTER_PADDING_SIDE", "COUNTER_PADDING_TOP", "COUNTER_RADIUS", "COUNTER_TEXT", "COUNTER_TEXT_ALPHA", "COUNTER_TEXT_FADE_TIME", "COUNTER_TEXT_SEPARATOR"],
    date: ["DATETIME_ALIGN", "DATETIME_TEXT", "DATETIME_ALPHA", "DATETIME_PADDING_LEFT", "DATETIME_PADDING_RIGHT"],
    font: ["FONT_FOOTER_ICON_PAD_BOTTOM", "FONT_FOOTER_ICON_PAD_TOP", "FONT_FOOTER_PAD_BOTTOM", "FONT_FOOTER_PAD_TOP", "FONT_HEADER_ICON_PAD_BOTTOM", "FONT_HEADER_ICON_PAD_TOP", "FONT_HEADER_PAD_BOTTOM", "FONT_HEADER_PAD_TOP", "FONT_LIST_ICON_PAD_BOTTOM", "FONT_LIST_ICON_PAD_TOP", "FONT_LIST_PAD_BOTTOM", "FONT_LIST_PAD_LEFT", "FONT_LIST_PAD_TOP", "FONT_MESSAGE_ICON_PAD_BOTTOM", "FONT_MESSAGE_ICON_PAD_TOP", "FONT_MESSAGE_PAD_BOTTOM", "FONT_MESSAGE_PAD_TOP"],
    grid: ["GRID_BACKGROUND_ALPHA", "CELL_BORDER_WIDTH", "CELL_DEFAULT_BACKGROUND_ALPHA", "CELL_DEFAULT_BORDER_ALPHA", "CELL_DEFAULT_IMAGE_ALPHA", "CELL_DEFAULT_IMAGE_RECOLOUR", "CELL_DEFAULT_IMAGE_RECOLOUR_ALPHA", "CELL_DEFAULT_TEXT_ALPHA", "CELL_FOCUS_BACKGROUND", "CELL_FOCUS_BACKGROUND_ALPHA", "CELL_FOCUS_BORDER_ALPHA", "CELL_FOCUS_IMAGE_ALPHA", "CELL_FOCUS_IMAGE_RECOLOUR", "CELL_FOCUS_IMAGE_RECOLOUR_ALPHA", "CELL_FOCUS_TEXT", "CELL_FOCUS_TEXT_ALPHA", "CELL_IMAGE_PADDING_TOP", "CELL_RADIUS", "CELL_TEXT_LINE_SPACING", "CELL_TEXT_PADDING_BOTTOM", "CELL_TEXT_PADDING_SIDE", "CURRENT_ITEM_LABEL_ALIGNMENT", "CURRENT_ITEM_LABEL_BACKGROUND_ALPHA", "CURRENT_ITEM_LABEL_BORDER_ALPHA", "CURRENT_ITEM_LABEL_BORDER_WIDTH", "CURRENT_ITEM_LABEL_OFFSET_Y", "CURRENT_ITEM_LABEL_RADIUS", "CURRENT_ITEM_LABEL_TEXT_ALPHA", "CURRENT_ITEM_LABEL_TEXT_ALIGNMENT", "GRID_LOCATION_X", "GRID_LOCATION_Y", "GRID_NAVIGATION_TYPE"],
    header: ["HEADER_BACKGROUND_ALPHA", "HEADER_BACKGROUND", "HEADER_HEIGHT", "HEADER_TEXT", "HEADER_TEXT_ALPHA", "HEADER_TEXT_ALIGN", "HEADER_PADDING_LEFT", "HEADER_PADDING_RIGHT"],
    help: ["HELP_BACKGROUND", "HELP_BACKGROUND_ALPHA", "HELP_BORDER_ALPHA", "HELP_CONTENT", "HELP_RADIUS", "HELP_TITLE"],
    image_list: ["IMAGE_LIST_PAD_BOTTOM", "IMAGE_LIST_PAD_RIGHT", "IMAGE_LIST_RADIUS", "IMAGE_LIST_RECOLOUR_ALPHA", "IMAGE_PREVIEW_RADIUS", "IMAGE_PREVIEW_RECOLOUR_ALPHA"],
    keyboard: ["OSK_BACKGROUND", "OSK_BACKGROUND_ALPHA", "OSK_BORDER_ALPHA", "OSK_ITEM_BACKGROUND", "OSK_ITEM_BACKGROUND_ALPHA", "OSK_ITEM_BACKGROUND_FOCUS", "OSK_ITEM_BACKGROUND_FOCUS_ALPHA", "OSK_ITEM_BORDER_ALPHA", "OSK_ITEM_BORDER_FOCUS_ALPHA", "OSK_ITEM_RADIUS", "OSK_RADIUS", "OSK_TEXT", "OSK_TEXT_ALPHA", "OSK_TEXT_FOCUS", "OSK_TEXT_FOCUS_ALPHA"],
    list: ["LIST_DEFAULT_BACKGROUND_ALPHA", "LIST_DEFAULT_GLYPH_ALPHA", "LIST_DEFAULT_GLYPH_PAD_LEFT", "LIST_DEFAULT_GLYPH_RECOLOUR", "LIST_DEFAULT_GLYPH_RECOLOUR_ALPHA", "LIST_DEFAULT_INDICATOR_ALPHA", "LIST_DEFAULT_RADIUS", "LIST_DEFAULT_TEXT", "LIST_DEFAULT_TEXT_ALPHA", "LIST_DISABLED_TEXT", "LIST_DISABLED_TEXT_ALPHA", "LIST_FOCUS_BACKGROUND", "LIST_FOCUS_BACKGROUND_ALPHA", "LIST_FOCUS_GLYPH_ALPHA", "LIST_FOCUS_GLYPH_RECOLOUR", "LIST_FOCUS_GLYPH_RECOLOUR_ALPHA", "LIST_FOCUS_INDICATOR_ALPHA", "LIST_FOCUS_TEXT", "LIST_FOCUS_TEXT_ALPHA"],
    meta: ["META_CUT"],
    misc: ["ANIMATED_BACKGROUND", "CONTENT_PADDING_LEFT", "CONTENT_PADDING_TOP", "CONTENT_SIZE_TO_CONTENT", "IMAGE_OVERLAY", "MISC_NAVIGATION_TYPE", "STATIC_ALIGNMENT"],
    navigation: ["NAVIGATION_ALIGNMENT", "NAV_LR_GLYPH", "NAV_LR_GLYPH_ALPHA", "NAV_LR_TEXT", "NAV_LR_TEXT_ALPHA", "NAV_UD_GLYPH", "NAV_UD_GLYPH_ALPHA", "NAV_UD_TEXT", "NAV_UD_TEXT_ALPHA", "NAV_A_GLYPH", "NAV_A_GLYPH_ALPHA", "NAV_A_TEXT", "NAV_A_TEXT_ALPHA", "NAV_B_GLYPH", "NAV_B_GLYPH_ALPHA", "NAV_B_TEXT", "NAV_B_TEXT_ALPHA", "NAV_C_GLYPH", "NAV_C_GLYPH_ALPHA", "NAV_C_TEXT", "NAV_C_TEXT_ALPHA", "NAV_MENU_GLYPH", "NAV_MENU_GLYPH_ALPHA", "NAV_MENU_TEXT", "NAV_MENU_TEXT_ALPHA", "NAV_X_GLYPH", "NAV_X_GLYPH_ALPHA", "NAV_X_TEXT", "NAV_X_TEXT_ALPHA", "NAV_Y_GLYPH", "NAV_Y_GLYPH_ALPHA", "NAV_Y_TEXT", "NAV_Y_TEXT_ALPHA", "NAV_Z_GLYPH", "NAV_Z_GLYPH_ALPHA", "NAV_Z_TEXT", "NAV_Z_TEXT_ALPHA"],
    network: ["NETWORK_ACTIVE", "NETWORK_ACTIVE_ALPHA", "NETWORK_NORMAL", "NETWORK_NORMAL_ALPHA"],
    notification: ["MSG_BACKGROUND", "MSG_BACKGROUND_ALPHA", "MSG_BORDER_ALPHA", "MSG_RADIUS", "MSG_TEXT", "MSG_TEXT_ALPHA"],
    status: ["STATUS_ALIGN", "STATUS_PADDING_LEFT", "STATUS_PADDING_RIGHT"],
    terminal: ["TERMINAL_BACKGROUND", "TERMINAL_FOREGROUND"],
    verbose: ["VERBOSE_BOOT_BACKGROUND", "VERBOSE_BOOT_BACKGROUND_ALPHA", "VERBOSE_BOOT_TEXT", "VERBOSE_BOOT_TEXT_ALPHA", "VERBOSE_BOOT_Y_POS"],
    footer: ["FOOTER_HEIGHT", "FOOTER_BACKGROUND", "FOOTER_BACKGROUND_ALPHA", "FOOTER_TEXT", "FOOTER_TEXT_ALPHA"],
  };

  const lines: string[] = [];

  for (const [section, keys] of Object.entries(sectionMapping)) {
    const sectionLines: string[] = [];

    for (const key of keys) {
      if (overrides[key] !== undefined && overrides[key] !== null) {
        let outKey: string = key;
        const val = overrides[key];

        // Resolve reverse name collisions
        if (section === "header") {
          if (key === "HEADER_PADDING_LEFT") outKey = "PADDING_LEFT";
          if (key === "HEADER_PADDING_RIGHT") outKey = "PADDING_RIGHT";
        } else if (section === "date") {
          if (key === "DATETIME_PADDING_LEFT") outKey = "PADDING_LEFT";
          if (key === "DATETIME_PADDING_RIGHT") outKey = "PADDING_RIGHT";
        } else if (section === "status") {
          if (key === "STATUS_PADDING_LEFT") outKey = "PADDING_LEFT";
          if (key === "STATUS_PADDING_RIGHT") outKey = "PADDING_RIGHT";
        } else if (section === "misc") {
          if (key === "MISC_NAVIGATION_TYPE") outKey = "NAVIGATION_TYPE";
        } else if (section === "grid") {
          if (key === "GRID_BACKGROUND_ALPHA") outKey = "BACKGROUND_ALPHA";
          if (key === "GRID_LOCATION_X") outKey = "LOCATION_X";
          if (key === "GRID_LOCATION_Y") outKey = "LOCATION_Y";
          if (key === "GRID_NAVIGATION_TYPE") outKey = "NAVIGATION_TYPE";
        } else if (section === "navigation") {
          if (key === "NAVIGATION_ALIGNMENT") outKey = "ALIGNMENT";
        } else if (section === "terminal") {
          if (key === "TERMINAL_BACKGROUND") outKey = "BACKGROUND";
          if (key === "TERMINAL_FOREGROUND") outKey = "FOREGROUND";
        }

        sectionLines.push(`${outKey} = ${val}`);
      }
    }

    if (sectionLines.length > 0) {
      lines.push(`[${section}]\n${sectionLines.join("\n")}`);
    }
  }

  return lines.join("\n\n");
}
