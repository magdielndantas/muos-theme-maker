import JSZip from "jszip";
import { useThemeStore } from "../store/themeStore";

const parseHex = (value: string) => {
  if (value.startsWith("#")) return value;
  if (/^[0-9A-Fa-f]{6}$/i.test(value)) return `#${value}`;
  return value;
};

export const importThemeFromZip = async (file: File): Promise<boolean> => {
  try {
    const zip = await JSZip.loadAsync(file);

    // Localiza o .ini de scheme em qualquer resolução
    let iniFile =
      zip.file("scheme/global.ini") ||
      zip.file("scheme/default.ini") ||
      zip.file("640x480/scheme/global.ini") ||
      zip.file("640x480/scheme/default.ini");

    if (!iniFile) {
      const schemeFiles = zip.folder("scheme")?.file(/.*\.ini$/i);
      if (schemeFiles && schemeFiles.length > 0) iniFile = schemeFiles[0];
    }

    if (!iniFile) {
      alert("Arquivo .ini não encontrado no pacote. Verifique o formato do tema.");
      return false;
    }

    const iniContent = await iniFile.async("string");
    const globalScheme: Record<string, string> = {};

    iniContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("[") || trimmed.startsWith("#")) return;
      const [key, ...valParts] = trimmed.split("=");
      const val = valParts.join("=").trim();
      if (key && val) globalScheme[key.trim().toUpperCase()] = val;
    });

    const store = useThemeStore.getState();
    store.setGlobalScheme(globalScheme);

    // Importa wallpapers por tela se existirem no ZIP
    const wallFolder = zip.folder("640x480/image/wall");
    if (wallFolder) {
      const files = wallFolder.file(/^[^/]+\.(png|jpg|jpeg|bmp)$/i);
      for (const f of files) {
        const screenId = f.name
          .split("/")
          .pop()
          ?.replace(/\.(png|jpg|jpeg|bmp)$/i, "");
        if (!screenId) continue;
        const blob = await f.async("blob");
        const src = await new Promise<string>((res) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result as string);
          reader.readAsDataURL(blob);
        });
        const screen = store.screens.find((s) => s.id === screenId);
        if (screen) store.setScreenWallpaper(screenId, src);
      }
    }

    return true;
  } catch (err) {
    console.error("Theme Import Error:", err);
    alert("Erro ao importar o arquivo .muxthm. Verifique o formato.");
    return false;
  }
};
