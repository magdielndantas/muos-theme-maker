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
    globalScheme: {} as any, // Only collect overrides during initial parse
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
      const match = path.match(/([0-9]+x[0-9]+)/);
      return match ? match[1] : "640x480";
    };

    const getResData = (res: string) => {
      if (!resMap[res]) resMap[res] = createEmptyResolutionData();
      return resMap[res];
    };

    const isImage = (path: string) => /\.(png|jpg|jpeg|bmp)$/i.test(path);
    const getBase64 = async (f: JSZip.JSZipObject): Promise<string> => {
      const b64 = await f.async("base64");
      const ext = f.name.split('.').pop()?.toLowerCase();
      let mime = "image/png";
      if (ext === "jpg" || ext === "jpeg") mime = "image/jpeg";
      if (ext === "bmp") mime = "image/bmp";
      return `data:${mime};base64,${b64}`;
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

      if (normPath.endsWith(".ini") && (normPath.match(/^[^\/]*\/scheme\/global\.ini$/) || normPath === "scheme/global.ini")) {
        const content = await file.async("string");
        const parsed = parseIni(content);
        rootGlobalScheme = { ...rootGlobalScheme, ...parsed };
        continue;
      }

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

      if (isImage(normPath)) {
        if (normPath.includes("image/overlay.png")) {
          promises.push(getBase64(file).then(src => { resData.globalOverlay = src; }));
          continue;
        }
        if (normPath.endsWith("bootlogo.bmp") || normPath.endsWith("bootlogo.png")) {
          promises.push(getBase64(file).then(src => { resData.bootLogo = src; }));
          continue;
        }
        if (normPath.match(/\/preview\.(png|jpg|jpeg)$/)) {
          promises.push(getBase64(file).then(src => { resData.previewImage = src; }));
          continue;
        }
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
      const soundMatch = normPath.match(/\/sound\/([^\/]+)\.(wav|mp3|ogg)$/);
      if (soundMatch) {
        const name = soundMatch[1];
        promises.push(getBase64(file).then(src => { resData.sounds[name] = src; }));
        continue;
      }
    }

    await Promise.all(promises);

    for (const data of Object.values(resMap)) {
      data.globalScheme = { 
        ...DEFAULT_SCHEME, 
        ...rootGlobalScheme, 
        ...data.globalScheme 
      };
    }

    const nameTxt = files.find(f => f.name.toLowerCase() === "name.txt" || f.name.toLowerCase() === "theme_name.txt");
    if (nameTxt) {
      const content = await nameTxt.async("string");
      store.setThemeName(content.trim());
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
  } catch (error) {
    console.error("Theme import failed:", error);
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
    const rawVal = valParts.join("=").split(";")[0].trim();
    
    if (rawKey && rawVal) {
      let cleanKey = rawKey.trim().toUpperCase();
      const val = rawVal;

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
      } else if (currentSection === "grid") {
        if (cleanKey === "ACTIVE") cleanKey = "GRID_ACTIVE";
        if (cleanKey === "LOCATION_X") cleanKey = "GRID_LOCATION_X";
        if (cleanKey === "LOCATION_Y") cleanKey = "GRID_LOCATION_Y";
        if (cleanKey === "COLUMN_WIDTH") cleanKey = "GRID_COLUMN_WIDTH";
        if (cleanKey === "ROW_HEIGHT") cleanKey = "GRID_ROW_HEIGHT";
        if (cleanKey === "COLUMN_PADDING") cleanKey = "GRID_COLUMN_PADDING";
        if (cleanKey === "ROW_PADDING") cleanKey = "GRID_ROW_PADDING";
        if (cleanKey === "ALIGNMENT") cleanKey = "GRID_ALIGNMENT";
        if (cleanKey === "COLUMN_COUNT") cleanKey = "GRID_COLUMN_COUNT";
        if (cleanKey === "ROW_COUNT") cleanKey = "GRID_ROW_COUNT";
        if (cleanKey === "NAVIGATION_TYPE") cleanKey = "GRID_NAVIGATION_TYPE";

        const numVal = Number(val);
        if (!isNaN(numVal)) {
          if (cleanKey === "GRID_ACTIVE") {
            parsedScheme.GRID_ACTIVE = numVal;
          } else if ((cleanKey === "GRID_ROW_COUNT" || cleanKey === "GRID_COLUMN_COUNT") && numVal > 0) {
            if (parsedScheme.GRID_ACTIVE === undefined) parsedScheme.GRID_ACTIVE = 1;
          }
        }
      } else if (currentSection === "navigation") {
        if (cleanKey === "ALIGNMENT") cleanKey = "NAVIGATION_ALIGNMENT";
        if (cleanKey === "SPACING") cleanKey = "NAV_SPACING";
        if (cleanKey === "ICON_SIZE") cleanKey = "NAVIGATION_ICON_SIZE";
        if (!cleanKey.startsWith("NAV_") && !cleanKey.startsWith("NAVIGATION_")) cleanKey = `NAV_${cleanKey}`;
      } else if (currentSection === "font") {
        if (!cleanKey.startsWith("FONT_")) cleanKey = `FONT_${cleanKey}`;
      } else if (currentSection === "misc") {
        if (cleanKey === "NAVIGATION_TYPE") cleanKey = "MISC_NAVIGATION_TYPE";
        if (cleanKey === "PADDING_LEFT") cleanKey = "CONTENT_PADDING_LEFT";
        if (cleanKey === "PADDING_TOP") cleanKey = "CONTENT_PADDING_TOP";
        if (cleanKey === "WIDTH") cleanKey = "CONTENT_WIDTH";
        if (cleanKey === "HEIGHT") cleanKey = "CONTENT_HEIGHT";
        if (cleanKey === "ALIGNMENT") cleanKey = "CONTENT_ALIGNMENT";
        
        const valNum = Number(val);
        if (cleanKey === "MISC_NAVIGATION_TYPE" && valNum >= 1) {
          if (parsedScheme.GRID_ACTIVE === undefined) parsedScheme.GRID_ACTIVE = 1;
        }
      } else if (currentSection === "terminal") {
        if (cleanKey === "BACKGROUND") cleanKey = "TERMINAL_BACKGROUND";
        if (cleanKey === "FOREGROUND") cleanKey = "TERMINAL_FOREGROUND";
        if (!cleanKey.startsWith("TERMINAL_")) cleanKey = `TERMINAL_${cleanKey}`;
      } else if (currentSection === "counter") {
        if (!cleanKey.startsWith("COUNTER_")) cleanKey = `COUNTER_${cleanKey}`;
      } else if (currentSection === "bar") {
        if (!cleanKey.startsWith("BAR_") && !cleanKey.startsWith("PANEL_")) cleanKey = `BAR_${cleanKey}`;
      } else if (currentSection === "image_list") {
        if (!cleanKey.startsWith("IMAGE_LIST_")) cleanKey = `IMAGE_LIST_${cleanKey}`;
      } else if (currentSection === "image_preview") {
        if (!cleanKey.startsWith("IMAGE_PREVIEW_")) cleanKey = `IMAGE_PREVIEW_${cleanKey}`;
      } else if (currentSection === "background") {
        if (!cleanKey.startsWith("BACKGROUND_")) cleanKey = `BACKGROUND_${cleanKey}`;
      } else if (currentSection === "keyboard") {
        if (!cleanKey.startsWith("OSK_")) cleanKey = `OSK_${cleanKey}`;
      } else if (currentSection === "help") {
        if (!cleanKey.startsWith("HELP_")) cleanKey = `HELP_${cleanKey}`;
      } else if (currentSection === "notification") {
        if (!cleanKey.startsWith("MSG_")) cleanKey = `MSG_${cleanKey}`;
      } else if (currentSection === "date") {
        if (!cleanKey.startsWith("DATETIME_")) cleanKey = `DATETIME_${cleanKey}`;
      } else if (currentSection === "status") {
        if (!cleanKey.startsWith("STATUS_")) cleanKey = `STATUS_${cleanKey}`;
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
