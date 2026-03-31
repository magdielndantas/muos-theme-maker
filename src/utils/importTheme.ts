import JSZip from "jszip";
import { useThemeStore, ScreenScheme, DEFAULT_SCHEME } from "../store/themeStore";

const parseHex = (value: string) => {
  let cleanValue = value.trim();
  if (cleanValue.startsWith("#")) cleanValue = cleanValue.slice(1);
  return cleanValue.toUpperCase();
};

export const importThemeFromZip = async (file: File): Promise<boolean> => {
  try {
    const zip = await JSZip.loadAsync(file);
    const store = useThemeStore.getState();

    // Encontra a pasta 'scheme' ou '640x480/scheme'
    let schemeFolder = zip.folder("scheme");
    if (!schemeFolder || schemeFolder.file(/.*\.ini$/i).length === 0) {
      schemeFolder = zip.folder("640x480/scheme");
    }

    if (schemeFolder) {
      const iniFiles = schemeFolder.file(/.*\.ini$/i);

      for (const iniFile of iniFiles) {
        const fileName = iniFile.name.split("/").pop()?.toLowerCase() || "";
        const iniContent = await iniFile.async("string");
        const parsedScheme: Partial<ScreenScheme> = {};

        let currentSection = "";

        iniContent.split("\n").forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) return;
          if (trimmed.startsWith("[")) {
            currentSection = trimmed.replace("[", "").replace("]", "").trim().toLowerCase();
            return;
          }

          const [rawKey, ...valParts] = trimmed.split("=");
          const val = valParts.join("=").trim();
          if (rawKey && val) {
            let cleanKey = rawKey.trim().toUpperCase();

            // Resolve name collisions based on section
            if (currentSection === "header") {
              if (cleanKey === "PADDING_LEFT") cleanKey = "HEADER_PADDING_LEFT";
              if (cleanKey === "PADDING_RIGHT") cleanKey = "HEADER_PADDING_RIGHT";
            } else if (currentSection === "date") {
              if (cleanKey === "PADDING_LEFT") cleanKey = "DATETIME_PADDING_LEFT";
              if (cleanKey === "PADDING_RIGHT") cleanKey = "DATETIME_PADDING_RIGHT";
            } else if (currentSection === "status") {
              if (cleanKey === "PADDING_LEFT") cleanKey = "STATUS_PADDING_LEFT";
              if (cleanKey === "PADDING_RIGHT") cleanKey = "STATUS_PADDING_RIGHT";
            } else if (currentSection === "misc") {
              if (cleanKey === "NAVIGATION_TYPE") cleanKey = "MISC_NAVIGATION_TYPE";
            } else if (currentSection === "grid") {
              if (cleanKey === "BACKGROUND_ALPHA") cleanKey = "GRID_BACKGROUND_ALPHA";
              if (cleanKey === "LOCATION_X") cleanKey = "GRID_LOCATION_X";
              if (cleanKey === "LOCATION_Y") cleanKey = "GRID_LOCATION_Y";
              if (cleanKey === "NAVIGATION_TYPE") cleanKey = "GRID_NAVIGATION_TYPE";
            } else if (currentSection === "navigation") {
              if (cleanKey === "ALIGNMENT") cleanKey = "NAVIGATION_ALIGNMENT";
            } else if (currentSection === "terminal") {
              if (cleanKey === "BACKGROUND") cleanKey = "TERMINAL_BACKGROUND";
              if (cleanKey === "FOREGROUND") cleanKey = "TERMINAL_FOREGROUND";
            }

            const typedKey = cleanKey as keyof ScreenScheme;

            // Apply parsed property
            if (typedKey in DEFAULT_SCHEME) {
              const expectedType = typeof DEFAULT_SCHEME[typedKey];
              if (expectedType === "number") {
                const num = Number(val);
                if (!isNaN(num)) parsedScheme[typedKey] = num as never;
              } else {
                parsedScheme[typedKey] = parseHex(val) as never;
              }
            }
          }
        });

        if (fileName === "global.ini" || fileName === "default.ini") {
          store.setGlobalScheme(parsedScheme);
        } else {
          const screenId = fileName.replace(".ini", "");
          if (store.screens.some((s) => s.id === screenId)) {
            store.updateScreenScheme(screenId, parsedScheme);
          }
        }
      }
    }

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

    zip.forEach((relativePath, file) => {
      if (file.dir || !isImage(relativePath)) return;

      const normPath = relativePath.toLowerCase();

      // Global Overlay
      if (normPath.endsWith("image/overlay.png")) {
        promises.push(getBase64(file).then(src => store.setGlobalOverlay(src)));
        return;
      }

      // Wallpapers
      const wallMatch = normPath.match(/image\/wall\/([^\/]+)\.(png|jpg|jpeg|bmp)$/);
      if (wallMatch) {
        const screenId = wallMatch[1];
        if (store.screens.some(s => s.id === screenId)) {
          promises.push(getBase64(file).then(src => store.setScreenWallpaper(screenId, src)));
        }
        return;
      }

      // Static Images
      const staticMatch = normPath.match(/image\/static\/([^\/]+)\.(png|jpg|jpeg|bmp)$/);
      if (staticMatch) {
        const screenId = staticMatch[1];
        if (store.screens.some(s => s.id === screenId)) {
          promises.push(getBase64(file).then(src => store.setScreenStaticImage(screenId, src)));
        }
        return;
      }

      // Screen Glyphs -> "glyph/[screenid]/[name].png"
      const glyphMatch = normPath.match(/glyph\/([^\/]+)\/([^\/]+)\.(png|jpg|jpeg|bmp)$/);
      if (glyphMatch) {
        const screenId = glyphMatch[1];
        const glyphName = glyphMatch[2];

        if (["header", "footer", "bar"].includes(screenId)) {
          // Global Glyphs
          promises.push(getBase64(file).then(src => store.setGlobalGlyph(screenId as any, glyphName, src)));
        } else if (store.screens.some(s => s.id === screenId)) {
          // Screen Specific
          promises.push(getBase64(file).then(src => store.setScreenGlyph(screenId, glyphName, src)));
        }
        return;
      }

      // Sub Assets
      const subAssetMatch = normPath.match(/image\/wall\/([^\/]+)\/([^\/]+)\.(png|jpg|jpeg|bmp)$/);
      if (subAssetMatch) {
        const screenId = subAssetMatch[1];
        const subAssetName = subAssetMatch[2];
        if (store.screens.some(s => s.id === screenId)) {
          promises.push(getBase64(file).then(src => store.setScreenSubAsset(screenId, subAssetName, src)));
        }
        return;
      }
    });

    await Promise.all(promises);
    return true;
  } catch (err) {
    console.error("Theme Import Error:", err);
    return false;
  }
};
