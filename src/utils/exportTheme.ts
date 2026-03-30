import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useThemeStore } from '../store/themeStore';

export const exportTheme = async (themeName: string = 'MyTheme') => {
  const state = useThemeStore.getState();
  const zip = new JSZip();

  // muOS uses HEX with Alpha (0-255) for its components, usually set in multiple sections
  const globalIniContent = `[global]
BACKGROUND_COLOR=${state.colors.background}
BACKGROUND_ALPHA=${state.colors.backgroundAlpha}
PRIMARY_COLOR=${state.colors.primaryAccent}

[list]
TEXT_COLOR_ACTIVE=${state.list.textColorActive}
TEXT_COLOR_INACTIVE=${state.list.textColorInactive}
`;

  // 1. Create the scheme directory and inject the ini file
  const schemeFolder = zip.folder("scheme");
  if (schemeFolder) {
    schemeFolder.file("global.ini", globalIniContent);
  }

  // 2. Generate the package as a zip archive
  const blob = await zip.generateAsync({ type: "blob" });
  
  // 3. Trigger download mimicking a muxthm extension
  saveAs(blob, `${themeName}.muxthm`);
};
