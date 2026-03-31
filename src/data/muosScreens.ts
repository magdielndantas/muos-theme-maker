export interface MuosScreenDef {
  id: string;
  label: string;
  description: string;
  category: "core" | "settings" | "media" | "system" | "network";
  /**
   * layout: como o conteúdo é exibido nessa tela
   * - list   → lista vertical navégavel (maioria das telas)
   * - grid   → grade de ícones (muxlaunch)
   * - splash → tela estacionária sem UI interativa (muxcharge, muxstart)
   * - info   → conteúdo informativo fixo sem lista (muxinfo, muxsysinfo, muxtester, muxshot)
   * - keyboard → interface com teclado virtual (muxsearch)
   */
  layout: "list" | "grid" | "splash" | "info" | "keyboard";
  hasSubAssets: boolean;
  subAssets?: MuosSubAssetDef[];
  glyphs?: MuosGlyphDef[];
}

export interface MuosSubAssetDef {
  name: string;   // filename sem extensão: "apps", "explore"
  label: string;  // label legível: "Applications", "Explore"
}

export interface MuosGlyphDef {
  name: string;
  label: string;
  path: string;
}

export const MUOS_SCREENS: MuosScreenDef[] = [
  // ── CORE ──────────────────────────────────────────────────────────────────
  {
    id: "default",
    label: "Default (Fallback)",
    description: "Wallpaper padrão usado quando nenhuma tela específica está definida.",
    category: "core",
    layout: "splash",
    hasSubAssets: false,
  },
  {
    id: "muxlaunch",
    label: "Main Menu",
    description: "Menu principal do muOS com os itens de navegação.",
    category: "core",
    layout: "list",
    hasSubAssets: true,
    subAssets: [
      { name: "explore",    label: "Explore Content" },
      { name: "collection", label: "Collection" },
      { name: "history",    label: "History" },
      { name: "apps",       label: "Applications" },
      { name: "info",       label: "Information" },
      { name: "config",     label: "Configuration" },
      { name: "reboot",     label: "Reboot" },
      { name: "shutdown",   label: "Shutdown" },
    ],
    glyphs: [
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
  },
  {
    id: "muxstart",
    label: "Start Screen",
    description: "Tela inicial exibida ao ligar o console.",
    category: "core",
    layout: "splash",
    hasSubAssets: false,
  },
  {
    id: "muxcharge",
    label: "Charging Screen",
    description: "Tela exibida durante o carregamento da bateria.",
    category: "core",
    layout: "splash",
    hasSubAssets: false,
  },

  // ── MEDIA ─────────────────────────────────────────────────────────────────
  {
    id: "muxplore",
    label: "File Explorer",
    description: "Explorador de ROMs e arquivos do sistema.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
    glyphs: [
      { name: "folder", label: "List Icon: Folder", path: "muxplore/folder" },
      { name: "rom", label: "List Icon: ROM", path: "muxplore/rom" },
      { name: "history", label: "List Icon: History", path: "muxplore/history" },
      { name: "collection", label: "List Icon: Collection", path: "muxplore/collection" },
    ],
  },
  {
    id: "muxapp",
    label: "Applications",
    description: "Lista de aplicações e emuladores instalados.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxhistory",
    label: "History",
    description: "Histórico de jogos acessados recentemente.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxcollect",
    label: "Collections",
    description: "Coleções personalizadas de conteúdo.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxarchive",
    label: "Archive Manager",
    description: "Gerenciador para extração e manipulação de arquivos comprimidos.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxsearch",
    label: "Search",
    description: "Ferramenta de busca de conteúdo.",
    category: "media",
    layout: "keyboard",
    hasSubAssets: false,
  },
  {
    id: "muxcontrol",
    label: "Advanced Control",
    description: "Configurações de controle e mapeamento de inputs.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxcolfilter",
    label: "Collection Filter",
    description: "Filtros para organizar e visualizar coleções.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxtag",
    label: "Tag Manager",
    description: "Gerenciamento de tags para organização de ROMs.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxpicker",
    label: "File Picker",
    description: "Seletor de arquivos genérico do sistema.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxsnapshot",
    label: "Screenshots",
    description: "Galeria de screenshots capturados.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxshot",
    label: "Screenshot Viewer",
    description: "Visualizador individual de screenshots.",
    category: "media",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxappcon",
    label: "Application Config",
    description: "Configurações individuais por aplicação.",
    category: "media",
    layout: "list",
    hasSubAssets: false,
  },

  // ── SETTINGS ──────────────────────────────────────────────────────────────
  {
    id: "muxconfig",
    label: "Configuration",
    description: "Menu principal de configurações do sistema.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxoption",
    label: "Options",
    description: "Opções avançadas de emulação e sistema.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxvisual",
    label: "Visual Settings",
    description: "Configurações visuais e de display.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxcoladjust",
    label: "Colour Adjustment",
    description: "Ajuste de saturação, contraste e matiz do display.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxoverlay",
    label: "Retroarch Overlay",
    description: "Gerenciamento de overlays globais para emuladores.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxtweakgen",
    label: "General Tweaks",
    description: "Configurações gerais de ajuste fino do sistema.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxtweakadv",
    label: "Advanced Tweaks",
    description: "Configurações avançadas de ajuste fino.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxgov",
    label: "CPU Governor",
    description: "Configurações de governador de CPU e performance.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxassign",
    label: "Core Assignment",
    description: "Atribuição de core/emulador por sistema.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxlang",
    label: "Language",
    description: "Configuração de idioma do sistema.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxcustom",
    label: "Custom Scripts",
    description: "Scripts e extensões customizadas do sistema.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxpass",
    label: "Password",
    description: "Configuração de credenciais e senhas.",
    category: "settings",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxtimezone",
    label: "Timezone",
    description: "Configuração de fuso horário.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxrtc",
    label: "RTC (Clock)",
    description: "Configuração do relógio interno do hardware.",
    category: "settings",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxspace",
    label: "Storage Space",
    description: "Informações e gerenciamento de espaço de armazenamento.",
    category: "settings",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxstorage",
    label: "Storage Manager",
    description: "Gerenciador dos dispositivos de armazenamento.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxdanger",
    label: "Danger Zone",
    description: "Operações críticas e destrutivas de sistema.",
    category: "settings",
    layout: "list",
    hasSubAssets: false,
  },

  // ── NETWORK ───────────────────────────────────────────────────────────────
  {
    id: "muxnetwork",
    label: "Network Settings",
    description: "Configurações de rede e Wi-Fi.",
    category: "network",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxnetscan",
    label: "Network Scan",
    description: "Scanner de redes Wi-Fi disponíveis.",
    category: "network",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxnetprofile",
    label: "Network Profile",
    description: "Perfis de conexão de rede salvos.",
    category: "network",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxconnect",
    label: "Connectivity",
    description: "Interface para conexão a serviços (SSH, SAMBA, SFTP).",
    category: "network",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxnetadv",
    label: "Advanced Network",
    description: "Configurações avançadas (IP estático, DNS, etc).",
    category: "network",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxwebserv",
    label: "Web Services",
    description: "Serviços web integrados (scraper, sync, etc.).",
    category: "network",
    layout: "list",
    hasSubAssets: false,
  },

  // ── SYSTEM ────────────────────────────────────────────────────────────────
  {
    id: "muxinfo",
    label: "Information",
    description: "Informações sobre jogos e ROMs.",
    category: "system",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxactivity",
    label: "Activity Tracker",
    description: "Monitoramento de tempo de jogo e estatísticas.",
    category: "system",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxactivity-content",
    label: "Activity: Content",
    description: "Estatísticas detalhadas por jogo.",
    category: "system",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxactivity-overview",
    label: "Activity: Overview",
    description: "Visão geral do uso do sistema.",
    category: "system",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxactivity-style",
    label: "Activity: Style",
    description: "Customização visual dos gráficos de atividade.",
    category: "system",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxdevice",
    label: "Device Status",
    description: "Saúde e estados do hardware.",
    category: "system",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxnetinfo",
    label: "Network Info",
    description: "Detalhes técnicos da conexão de rede ativa.",
    category: "system",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxsysinfo",
    label: "System Info",
    description: "Informações detalhadas sobre o hardware e sistema.",
    category: "system",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxtask",
    label: "Task Manager",
    description: "Gerenciador de processos e tarefas em execução.",
    category: "system",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxtester",
    label: "Hardware Tester",
    description: "Ferramenta de diagnóstico de hardware (botões, display, etc.).",
    category: "system",
    layout: "info",
    hasSubAssets: false,
  },
  {
    id: "muxhdmi",
    label: "HDMI Settings",
    description: "Configurações de saída HDMI.",
    category: "system",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxpower",
    label: "Power Settings",
    description: "Gerenciamento de suspensão, brilho e bateria.",
    category: "system",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxbackup",
    label: "Backup Manager",
    description: "Criação e restauração de backups do sistema muOS.",
    category: "system",
    layout: "list",
    hasSubAssets: false,
  },
  {
    id: "muxkiosk",
    label: "Kiosk Mode",
    description: "Trava se seções do sistema para uso limitado.",
    category: "system",
    layout: "list",
    hasSubAssets: false,
  },
];

export const CATEGORY_LABELS: Record<MuosScreenDef["category"], string> = {
  core:    "Core",
  media:   "Media",
  settings:"Settings",
  network: "Network",
  system:  "System",
};

export const CATEGORY_ORDER: MuosScreenDef["category"][] = [
  "core", "media", "settings", "network", "system"
];
