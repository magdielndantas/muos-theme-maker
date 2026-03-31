import JSZip from "jszip";
import { useThemeStore, ScreenScheme, DEFAULT_SCHEME, ResolutionData } from "../store/themeStore";
import { MUOS_SCREENS } from "../data/muosScreens";

const parseHex = (value: string) => {
  let cleanValue = value.trim();
  if (cleanValue.startsWith("0x")) cleanValue = cleanValue.slice(2);
  if (cleanValue.startsWith("#")) cleanValue = cleanValue.slice(1);
  return cleanValue.toUpperCase().padStart(6, "0").slice(-6);
};

function buildInitialScreens() {
  return MUOS_SCREENS.map((def) => ({
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

function createEmptyResolutionData(): ResolutionData {
  return {
    screens: buildInitialScreens(),
    globalScheme: { ...DEFAULT_SCHEME },
    globalOverlay: null,
    globalGlyphs: {
      header: {},
      footer: {},
      bar: {},
    },
    defaultWallpaper: null,
    bootLogo: null,
    previewImage: null,
    fonts: { default: null, header: null, footer: null, panel: null },
    sounds: {},
  };
}

export const importThemeFromZip = async (file: File): Promise<boolean> => {
  try {
    const zip = await JSZip.loadAsync(file);
    const store = useThemeStore.getState();

    const resMap: Record<string, ResolutionData> = {};

    const getResFromPath = (path: string): string => {
      // Matches resolution pattern even if nested (e.g., Theme/640x480/...)
      const match = path.match(/([0-9]+x[0-9]+)/);
      return match ? match[1] : "640x480";
    };

    const getResData = (res: string) => {
      if (!resMap[res]) resMap[res] = createEmptyResolutionData();
      return resMap[res];
    };

    const isImage = (path: string) => /\.(png|jpg|jpeg|bmp)$/i.test(path);
    const getBase64 = async (f: JSZip.JSZipObject): Promise<string> => {
      const blob = await f.async("blob");
      return new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result as string);
        reader.readAsDataURL(blob);
      });
    };

    const promises: Promise<void>[] = [];
    const files = Object.values(zip.files);
    let rootGlobalScheme: Partial<ScreenScheme> = {};

    for (const file of files) {
      if (file.dir) continue;
      const path = file.name;
      const normPath = path.toLowerCase();
      const res = getResFromPath(normPath);
      const resData = getResData(res);

      // Root-level scheme/global.ini — applies to all resolutions
      if (normPath.endsWith(".ini") && (normPath.match(/^[^\/]*\/scheme\/global\.ini$/) || normPath === "scheme/global.ini")) {
        const content = await file.async("string");
        const parsed = parseIni(content);
        rootGlobalScheme = { ...rootGlobalScheme, ...parsed };
        continue;
      }

      // --- Process INIs (Schemes) ---
      if (normPath.endsWith(".ini") && normPath.includes("scheme/")) {
        const content = await file.async("string");
        const parsed = parseIni(content);
        const fileName = normPath.split("/").pop() || "";
        
        if (fileName === "global.ini" || fileName === "default.ini") {
          resData.globalScheme = { ...resData.globalScheme, ...parsed };
        } else {
          const screenId = fileName.replace(".ini", "");
          const screen = resData.screens.find(s => s.id === screenId);
          if (screen) screen.scheme = { ...screen.scheme, ...parsed };
        }
        continue;
      }

      // --- Process Images ---
      if (isImage(normPath)) {
        if (normPath.includes("image/overlay.png")) {
          promises.push(getBase64(file).then(src => { resData.globalOverlay = src; }));
          continue;
        }

        // Boot logo
        if (normPath.endsWith("bootlogo.bmp") || normPath.endsWith("bootlogo.png")) {
          promises.push(getBase64(file).then(src => { resData.bootLogo = src; }));
          continue;
        }

        // Preview image
        if (normPath.match(/\/preview\.(png|jpg|jpeg)$/)) {
          promises.push(getBase64(file).then(src => { resData.previewImage = src; }));
          continue;
        }

        // wall/default.png — fallback global wallpaper
        const wallDefaultMatch = normPath.match(/image\/wall\/default\.(png|jpg|jpeg|bmp)$/);
        if (wallDefaultMatch) {
          promises.push(getBase64(file).then(src => { resData.defaultWallpaper = src; }));
          continue;
        }

        const wallMatch = normPath.match(/image\/wall\/([^\/]+)\.(png|jpg|jpeg|bmp)$/);
        if (wallMatch) {
          const screenId = wallMatch[1];
          const screen = resData.screens.find(s => s.id === screenId);
          if (screen) promises.push(getBase64(file).then(src => { screen.wallpaper = src; }));
          continue;
        }

        const staticMatch = normPath.match(/image\/static\/([^\/]+)\.(png|jpg|jpeg|bmp)$/);
        if (staticMatch) {
          const screenId = staticMatch[1];
          const screen = resData.screens.find(s => s.id === screenId);
          if (screen) promises.push(getBase64(file).then(src => { screen.staticImage = src; }));
          continue;
        }

        const glyphMatch = normPath.match(/glyph\/([^\/]+)\/([^\/]+)\.(png|jpg|jpeg|bmp)$/);
        if (glyphMatch) {
          const category = glyphMatch[1];
          const glyphName = glyphMatch[2];
          if (["header", "footer", "bar"].includes(category)) {
            promises.push(getBase64(file).then(src => { 
              resData.globalGlyphs[category as "header"|"footer"|"bar"][glyphName] = src; 
            }));
          } else {
            const screen = resData.screens.find(s => s.id === category);
            if (screen) {
              const g = screen.glyphs.find(gl => gl.name === glyphName);
              if (g) promises.push(getBase64(file).then(src => { g.src = src; }));
            }
          }
          continue;
        }

        const subAssetMatch = normPath.match(/image\/wall\/([^\/]+)\/([^\/]+)\.(png|jpg|jpeg|bmp)$/);
        if (subAssetMatch) {
          const screenId = subAssetMatch[1];
          const assetName = subAssetMatch[2];
          const screen = resData.screens.find(s => s.id === screenId);
          if (screen) {
            const sa = screen.subAssets.find(a => a.name === assetName);
            if (sa) promises.push(getBase64(file).then(src => { sa.src = src; }));
          }
          continue;
        }
      }

      // --- Process Fonts ---
      const fontSlotMatch = normPath.match(/\/font\/(header|footer|panel)\/default\.bin$/);
      if (fontSlotMatch) {
        const slot = fontSlotMatch[1] as "header" | "footer" | "panel";
        promises.push(getBase64(file).then(src => { resData.fonts[slot] = src; }));
        continue;
      }
      const fontDefaultMatch = normPath.match(/\/font\/default\.bin$/);
      if (fontDefaultMatch) {
        promises.push(getBase64(file).then(src => { resData.fonts.default = src; }));
        continue;
      }

      // --- Process Sounds ---
      const soundMatch = normPath.match(/\/sound\/([^\/]+)\.(wav|mp3|ogg)$/);
      if (soundMatch) {
        const name = soundMatch[1];
        promises.push(getBase64(file).then(src => { resData.sounds[name] = src; }));
        continue;
      }
    }

    await Promise.all(promises);

    // Apply root-level global scheme to all resolutions
    if (Object.keys(rootGlobalScheme).length > 0) {
      for (const data of Object.values(resMap)) {
        data.globalScheme = { ...data.globalScheme, ...rootGlobalScheme };
      }
    }

    // Import metadata files
    const nameTxt = files.find(f => f.name.toLowerCase() === "name.txt");
    if (nameTxt) {
      const content = await nameTxt.async("string");
      store.setThemeName(content.trim());
    } else {
      const themeNameTxt = files.find(f => f.name.toLowerCase() === "theme_name.txt");
      if (themeNameTxt) {
        const content = await themeNameTxt.async("string");
        store.setThemeName(content.trim());
      }
    }

    const creditsTxt = files.find(f => f.name.toLowerCase() === "credits.txt");
    if (creditsTxt) {
      const content = await creditsTxt.async("string");
      store.setThemeCredits(content.trim());
    }

    const versionTxt = files.find(f => f.name.toLowerCase() === "version.txt");
    if (versionTxt) {
      const content = await versionTxt.async("string");
      store.setThemeVersion(content.trim());
    }

    for (const [res, data] of Object.entries(resMap)) {
      store.importResolution(res, data);
    }

    const resolutions = Object.keys(resMap);
    if (resolutions.length > 0) {
      const bestRes = resolutions.includes("640x480") ? "640x480" : resolutions[0];
      store.setResolution(bestRes);
    }

    return true;
  } catch (err) {
    console.error("Theme Import Error:", err);
    return false;
  }
};

function parseIni(content: string): Partial<ScreenScheme> {
  const parsedScheme: Partial<ScreenScheme> = {};
  let currentSection = "";

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(";")) return;
    if (trimmed.startsWith("[")) {
      currentSection = trimmed.replace("[", "").replace("]", "").trim().toLowerCase();
      return;
    }

    const [rawKey, ...valParts] = trimmed.split("=");
    const val = valParts.join("=").trim();
    if (rawKey && val) {
      let cleanKey = rawKey.trim().toUpperCase();

      // Exhaustive Mapping Logic
      if (currentSection === "header") {
        if (cleanKey === "HEIGHT") cleanKey = "HEADER_HEIGHT";
        if (cleanKey === "BACKGROUND") cleanKey = "HEADER_BACKGROUND";
        if (cleanKey === "BACKGROUND_ALPHA") cleanKey = "HEADER_BACKGROUND_ALPHA";
        if (cleanKey === "TEXT") cleanKey = "HEADER_TEXT";
        if (cleanKey === "TEXT_ALPHA") cleanKey = "HEADER_TEXT_ALPHA";
        if (cleanKey === "PADDING_LEFT") cleanKey = "HEADER_PADDING_LEFT";
        if (cleanKey === "PADDING_RIGHT") cleanKey = "HEADER_PADDING_RIGHT";
        if (cleanKey === "TEXT_ALIGN") cleanKey = "HEADER_TEXT_ALIGN";
      } else if (currentSection === "footer") {
        if (cleanKey === "HEIGHT") cleanKey = "FOOTER_HEIGHT";
        if (cleanKey === "BACKGROUND") cleanKey = "FOOTER_BACKGROUND";
        if (cleanKey === "BACKGROUND_ALPHA") cleanKey = "FOOTER_BACKGROUND_ALPHA";
        if (cleanKey === "TEXT") cleanKey = "FOOTER_TEXT";
        if (cleanKey === "TEXT_ALPHA") cleanKey = "FOOTER_TEXT_ALPHA";
      } else if (currentSection === "battery") {
        if (cleanKey === "NORMAL") cleanKey = "BATTERY_NORMAL";
        if (cleanKey === "ACTIVE") cleanKey = "BATTERY_ACTIVE";
        if (cleanKey === "LOW") cleanKey = "BATTERY_LOW";
      } else if (currentSection === "network") {
        if (cleanKey === "NORMAL") cleanKey = "NETWORK_NORMAL";
        if (cleanKey === "ACTIVE") cleanKey = "NETWORK_ACTIVE";
      } else if (currentSection === "bluetooth") {
        if (cleanKey === "NORMAL") cleanKey = "BLUETOOTH_NORMAL";
        if (cleanKey === "ACTIVE") cleanKey = "BLUETOOTH_ACTIVE";
      } else if (currentSection === "date") {
        if (cleanKey === "PADDING_LEFT") cleanKey = "DATETIME_PADDING_LEFT";
        if (cleanKey === "PADDING_RIGHT") cleanKey = "DATETIME_PADDING_RIGHT";
        if (cleanKey === "ALIGN") cleanKey = "DATETIME_ALIGN";
      } else if (currentSection === "status") {
        if (cleanKey === "PADDING_LEFT") cleanKey = "STATUS_PADDING_LEFT";
        if (cleanKey === "PADDING_RIGHT") cleanKey = "STATUS_PADDING_RIGHT";
        if (cleanKey === "ALIGN") cleanKey = "STATUS_ALIGN";
      } else if (currentSection === "misc") {
        if (cleanKey === "NAVIGATION_TYPE") cleanKey = "MISC_NAVIGATION_TYPE";
      } else if (currentSection === "grid") {
        if (cleanKey === "BACKGROUND_ALPHA") cleanKey = "GRID_BACKGROUND_ALPHA";
        if (cleanKey === "LOCATION_X") cleanKey = "GRID_LOCATION_X";
        if (cleanKey === "LOCATION_Y") cleanKey = "GRID_LOCATION_Y";
        if (cleanKey === "NAVIGATION_TYPE") cleanKey = "GRID_NAVIGATION_TYPE";
        if (cleanKey === "ROW_COUNT") cleanKey = "GRID_ROW_COUNT";
        if (cleanKey === "COLUMN_COUNT") cleanKey = "GRID_COLUMN_COUNT";
        
        const row = Number(val);
        if (cleanKey === "GRID_ROW_COUNT" && row > 0) parsedScheme.GRID_ACTIVE = 1;
      } else if (currentSection === "navigation") {
        if (cleanKey === "ALIGNMENT") cleanKey = "NAVIGATION_ALIGNMENT";
        if (cleanKey === "SPACING") cleanKey = "NAV_SPACING";
      } else if (currentSection === "terminal") {
        if (cleanKey === "BACKGROUND") cleanKey = "TERMINAL_BACKGROUND";
        if (cleanKey === "FOREGROUND") cleanKey = "TERMINAL_FOREGROUND";
      } else if (currentSection === "counter") {
        if (cleanKey === "BORDER_COLOUR") cleanKey = "COUNTER_BORDER_COLOUR";
        if (cleanKey === "BACKGROUND_GRADIENT") cleanKey = "COUNTER_BACKGROUND_GRADIENT";
      } else if (currentSection === "roll") {
        // ROLL_* keys map directly — ROLL_TEXT, ROLL_BACKGROUND, ROLL_SELECT_TEXT, etc.
      } else if (currentSection === "animation") {
        if (cleanKey === "ANIMATION_DELAY") cleanKey = "ANIMATION_DELAY";
        if (cleanKey === "ANIMATION_REPEAT") cleanKey = "ANIMATION_REPEAT";
      } else if (currentSection === "list") {
        // LIST_* keys map directly
      } else if (currentSection === "bar") {
        // BAR_* keys map directly
      } else if (currentSection === "image_list") {
        // IMAGE_LIST_* and IMAGE_PREVIEW_* keys map directly
      } else if (currentSection === "charging") {
        // CHARGER_* keys map directly
      } else if (currentSection === "verbose") {
        // VERBOSE_BOOT_* keys map directly
      }

      const typedKey = cleanKey as keyof ScreenScheme;

      if (typedKey in DEFAULT_SCHEME) {
        const expectedType = typeof DEFAULT_SCHEME[typedKey];
        if (expectedType === "number") {
          const num = Number(val);
          if (!isNaN(num)) parsedScheme[typedKey] = num as never;
        } else if (expectedType === "string") {
          const hex = parseHex(val);
          if (hex) parsedScheme[typedKey] = hex as never;
        }
      }
    }
  });
  return parsedScheme;
}
