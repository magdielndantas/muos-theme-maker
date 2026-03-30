import JSZip from 'jszip';
import { useThemeStore } from '../store/themeStore';

const parseHex = (value: string) => {
  if (value.startsWith('#')) return value;
  if (/^[0-9A-Fa-f]{6}$/i.test(value)) return `#${value}`;
  return value;
};

export const importThemeFromZip = async (file: File) => {
  try {
    const zip = await JSZip.loadAsync(file);
    
    // muoS stores configuration in scheme/global.ini or default.ini
    let iniFile = zip.file("scheme/global.ini") || zip.file("scheme/default.ini");
    
    if (!iniFile) {
      const schemeFiles = zip.folder("scheme")?.file(/.*\.ini$/i);
      if (schemeFiles && schemeFiles.length > 0) {
        iniFile = schemeFiles[0];
      }
    }

    if (!iniFile) {
      alert("Theme validation failed: No scheme/ INI file found in the archive.");
      return false;
    }

    const iniContent = await iniFile.async("string");
    const lines = iniContent.split('\n');

    const newColors: any = {};
    const newList: any = {};

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('[') || trimmed.startsWith('#')) return;

      const [key, ...valParts] = trimmed.split('=');
      const val = valParts.join('=').trim();
      if (!key || !val) return;

      const k = key.trim().toUpperCase();

      switch (k) {
        case 'BACKGROUND':
          newColors.background = parseHex(val);
          break;
        case 'LIST_FOCUS_BACKGROUND':
        case 'BAR_PROGRESS_ACTIVE_BACKGROUND':
          newColors.primaryAccent = parseHex(val);
          break;
        case 'BACKGROUND_ALPHA':
          newColors.backgroundAlpha = parseInt(val, 10);
          break;
        case 'LIST_FOCUS_TEXT':
          newList.textColorActive = parseHex(val);
          break;
        case 'LIST_DEFAULT_TEXT':
          newList.textColorInactive = parseHex(val);
          break;
      }
    });

    const store = useThemeStore.getState();
    if (Object.keys(newColors).length > 0) store.setColors(newColors);
    if (Object.keys(newList).length > 0) store.setList(newList);
    
    // Save the intact original zip in memory for exportation retaining all assets
    store.setLoadedZip(zip);

    return true;
  } catch (error) {
    console.error("Theme Import Error:", error);
    alert("Error parsing the .muxthm archive. Verify the file format.");
    return false;
  }
};
