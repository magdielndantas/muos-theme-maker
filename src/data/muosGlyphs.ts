export interface MuosGlyphDef {
  name: string;
  label: string;
  path: string; // Ex: "header/capacity_0"
}

export const GLOBAL_GLYPHS = {
  header: [
    { name: "capacity_0", label: "Battery (0%)", path: "header/capacity_0" },
    { name: "capacity_10", label: "Battery (10%)", path: "header/capacity_10" },
    { name: "capacity_20", label: "Battery (20%)", path: "header/capacity_20" },
    { name: "capacity_30", label: "Battery (30%)", path: "header/capacity_30" },
    { name: "capacity_40", label: "Battery (40%)", path: "header/capacity_40" },
    { name: "capacity_50", label: "Battery (50%)", path: "header/capacity_50" },
    { name: "capacity_60", label: "Battery (60%)", path: "header/capacity_60" },
    { name: "capacity_70", label: "Battery (70%)", path: "header/capacity_70" },
    { name: "capacity_80", label: "Battery (80%)", path: "header/capacity_80" },
    { name: "capacity_90", label: "Battery (90%)", path: "header/capacity_90" },
    { name: "capacity_100", label: "Battery (100%)", path: "header/capacity_100" },
    { name: "capacity_charging_0", label: "Charging (0%)", path: "header/capacity_charging_0" },
    { name: "capacity_charging_100", label: "Charging (100%)", path: "header/capacity_charging_100" },
    { name: "network_active", label: "Wi-Fi Active", path: "header/network_active" },
    { name: "network_normal", label: "Wi-Fi Normal", path: "header/network_normal" },
    { name: "bluetooth", label: "Bluetooth", path: "header/bluetooth" },
  ] as MuosGlyphDef[],
  footer: [
    { name: "a", label: "Button A", path: "footer/a" },
    { name: "b", label: "Button B", path: "footer/b" },
    { name: "x", label: "Button X", path: "footer/x" },
    { name: "y", label: "Button Y", path: "footer/y" },
    { name: "menu", label: "Menu Button", path: "footer/menu" },
    { name: "c", label: "Extra Button C", path: "footer/c" },
    { name: "z", label: "Extra Button Z", path: "footer/z" },
  ] as MuosGlyphDef[],
  bar: [
    { name: "brightness", label: "Brightness", path: "bar/brightness" },
    { name: "volume_0", label: "Volume (0)", path: "bar/volume_0" },
    { name: "volume_1", label: "Volume (1)", path: "bar/volume_1" },
    { name: "volume_2", label: "Volume (2)", path: "bar/volume_2" },
    { name: "volume_3", label: "Volume (3)", path: "bar/volume_3" },
  ] as MuosGlyphDef[],
};

// Mapeamento de glyphs específicos de tela (além dos sub-assets)
export const SCREEN_GLYPHS: Record<string, MuosGlyphDef[]> = {
  muxlaunch: [
    { name: "apps", label: "Grid Icon: Apps", path: "muxlaunch/apps" },
    { name: "collection", label: "Grid Icon: Collection", path: "muxlaunch/collection" },
    { name: "config", label: "Grid Icon: Config", path: "muxlaunch/config" },
    { name: "explore", label: "Grid Icon: Explore", path: "muxlaunch/explore" },
    { name: "favourite", label: "Grid Icon: Favorite", path: "muxlaunch/favourite" },
    { name: "history", label: "Grid Icon: History", path: "muxlaunch/history" },
    { name: "info", label: "Grid Icon: Info", path: "muxlaunch/info" },
    { name: "reboot", label: "Grid Icon: Reboot", path: "muxlaunch/reboot" },
    { name: "shutdown", label: "Grid Icon: Shutdown", path: "muxlaunch/shutdown" },
  ],
  muxplore: [
    { name: "folder", label: "List Icon: Folder", path: "muxplore/folder" },
    { name: "rom", label: "List Icon: ROM", path: "muxplore/rom" },
    { name: "history", label: "List Icon: History", path: "muxplore/history" },
    { name: "collection", label: "List Icon: Collection", path: "muxplore/collection" },
  ],
  muxtheme: [
    { name: "theme", label: "Theme Icon", path: "muxtheme/theme" },
  ],
  muxsysinfo: [
    { name: "info", label: "System Info Icon", path: "muxsysinfo/info" },
  ]
};
