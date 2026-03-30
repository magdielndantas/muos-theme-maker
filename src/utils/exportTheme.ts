import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useThemeStore } from '../store/themeStore';

const stripHex = (hex: string) => hex.replace('#', '').toUpperCase();

export const exportTheme = async (themeName: string = 'MyTheme') => {
  const state = useThemeStore.getState();
  
  // Phase 4: Export with exact original Archival Preservation
  if (state.loadedZip) {
    const zip = state.loadedZip; 
    
    const iniFile = zip.file("scheme/global.ini") || zip.file("scheme/default.ini");
    if (iniFile) {
      let iniContent = await iniFile.async("string");
      
      const updateKey = (key: string, val: string) => {
        // Regex replacing key = old value with key = new value preserving structure
        const regex = new RegExp(`(^|\\n)(\\s*${key}\\s*=).*`, 'g');
        iniContent = iniContent.replace(regex, `$1$2 ${val}`);
      };

      const { colors, list } = state;

      // Update Native Keys securely
      updateKey('BACKGROUND', stripHex(colors.background));
      updateKey('BACKGROUND_ALPHA', String(colors.backgroundAlpha));
      
      updateKey('LIST_FOCUS_BACKGROUND', stripHex(colors.primaryAccent));
      updateKey('BAR_PROGRESS_ACTIVE_BACKGROUND', stripHex(colors.primaryAccent));
      
      updateKey('LIST_FOCUS_TEXT', stripHex(list.textColorActive));
      updateKey('LIST_DEFAULT_TEXT', stripHex(list.textColorInactive));

      // Inject manipulated content back into zip buffer
      if (iniFile.name.includes("default.ini")) {
        zip.file("scheme/default.ini", iniContent);
      } else {
        zip.file("scheme/global.ini", iniContent);
      }
    }

    // Inject Custom Assets if they exist
    if (state.assets.wallpaper) {
      // Extract base64 part from "data:image/png;base64,....."
      const base64Data = state.assets.wallpaper.split(',')[1];
      if (base64Data) {
        // MuOS reads backgrounds from these generic paths
        zip.file("640x480/image/wall/default.png", base64Data, { base64: true });
        zip.file("720x480/image/wall/default.png", base64Data, { base64: true });
        zip.file("720x720/image/wall/default.png", base64Data, { base64: true });
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${themeName}.muxthm`);
    return;
  }

  // Phase 2 fallback: Creating a blind template from scratch if no theme imported before
  const zip = new JSZip();
  const schemeFolder = zip.folder("scheme");
  
  const fbBg = stripHex(state.colors.background);
  const fbPr = stripHex(state.colors.primaryAccent);
  
  const globalIniContent = `[background]
BACKGROUND = ${fbBg}
BACKGROUND_ALPHA = ${state.colors.backgroundAlpha}

[list]
LIST_DEFAULT_TEXT = ${stripHex(state.list.textColorInactive)}
LIST_FOCUS_TEXT = ${stripHex(state.list.textColorActive)}
LIST_FOCUS_BACKGROUND = ${fbPr}

[bar]
BAR_PROGRESS_ACTIVE_BACKGROUND = ${fbPr}
`;

  if (schemeFolder) schemeFolder.file("global.ini", globalIniContent);
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${themeName}.muxthm`);
};
