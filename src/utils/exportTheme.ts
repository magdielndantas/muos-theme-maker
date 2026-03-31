import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useThemeStore } from "../store/themeStore";

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
  };
  return map[mime] ?? "png";
}

export const exportTheme = async (themeName: string = "MyTheme") => {
  const state = useThemeStore.getState();
  const zip = new JSZip();

  const base = `${themeName}/640x480`;
  const wallDir  = `${base}/image/wall`;
  const schemeDir = `${base}/scheme`;

  // ── 1. Wallpapers por tela ───────────────────────────────────────────────
  for (const screen of state.screens) {
    if (!screen.wallpaper) continue;

    const ext = mimeToExt(screen.wallpaper);
    const b64 = dataUrlToBase64(screen.wallpaper);

    // Arquivo principal da tela: wall/muxlaunch.png
    zip.file(`${wallDir}/${screen.id}.${ext}`, b64, { base64: true });
  }

  // ── 2. Sub-assets (ex: wall/muxlaunch/apps.png) ──────────────────────────
  for (const screen of state.screens) {
    for (const sa of screen.subAssets) {
      if (!sa.src) continue;
      const ext = mimeToExt(sa.src);
      const b64 = dataUrlToBase64(sa.src);
      zip.file(`${wallDir}/${screen.id}/${sa.name}.${ext}`, b64, { base64: true });
    }
  }

  // ── 3. Overlays por tela ─────────────────────────────────────────────────
  // (overlay.png global fica na raiz de image/)
  for (const screen of state.screens) {
    if (!screen.overlay) continue;
    const ext = mimeToExt(screen.overlay);
    const b64 = dataUrlToBase64(screen.overlay);
    // Por convenção muOS, overlay fica em image/ sem subdirectory de tela
    zip.file(`${base}/image/overlay_${screen.id}.${ext}`, b64, { base64: true });
  }

  // ── 4. Scheme (default.ini) ──────────────────────────────────────────────
  // Gera um .ini básico; expansível quando o inspector de scheme for implementado
  const schemeContent = buildDefaultIni(state.globalScheme);
  zip.file(`${schemeDir}/default.ini`, schemeContent);

  // ── 5. Manifest / preview placeholder ───────────────────────────────────
  zip.file(`${themeName}/theme.json`, JSON.stringify({
    name: themeName,
    resolution: "640x480",
    screens: state.screens
      .filter((s) => s.wallpaper || s.subAssets.some((sa) => sa.src))
      .map((s) => s.id),
  }, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${themeName}.muxthm`);
};

function buildDefaultIni(overrides: Record<string, string> = {}): string {
  const defaults: Record<string, string> = {
    BAR_WIDTH:          "616",
    BAR_Y_POS:          "420",
    CHARGER_Y_POS:      "165",
    CELL_HEIGHT:        "150",
    CELL_WIDTH:         "145",
    COLUMN_COUNT:       "4",
    COLUMN_WIDTH:       "157",
    ROW_COUNT:          "2",
    ROW_HEIGHT:         "162",
    CONTENT_HEIGHT:     "336",
    CONTENT_ITEM_COUNT: "7",
    CONTENT_WIDTH:      "616",
  };

  const merged = { ...defaults, ...overrides };

  const sections: Record<string, string[]> = {
    bar:      ["BAR_WIDTH", "BAR_Y_POS"],
    charging: ["CHARGER_Y_POS"],
    grid:     ["CELL_HEIGHT", "CELL_WIDTH", "COLUMN_COUNT", "COLUMN_WIDTH", "ROW_COUNT", "ROW_HEIGHT"],
    misc:     ["CONTENT_HEIGHT", "CONTENT_ITEM_COUNT", "CONTENT_WIDTH"],
  };

  return Object.entries(sections)
    .map(([section, keys]) => {
      const lines = keys
        .filter((k) => k in merged)
        .map((k) => `${k} = ${merged[k]}`);
      return `[${section}]\n${lines.join("\n")}`;
    })
    .join("\n\n");
}
