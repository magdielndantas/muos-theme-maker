"use client";

import { useThemeStore, ScreenScheme } from "@/store/themeStore";
import {
  MUOS_SCREENS,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
} from "@/data/muosScreens";
import { useState, useRef, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import { exportTheme } from "@/utils/exportTheme";
import { importThemeFromZip } from "@/utils/importTheme";
import {
  Download,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  Monitor,
  Wifi,
  Cpu,
  Film,
  CheckCircle2,
  Globe,
  Plus,
  Trash2,
  Layout,
  Folder,
  FileText,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SCHEME_GROUPS } from "@/data/schemeGroups";
import { GLOBAL_GLYPHS } from "@/data/muosGlyphs";

const CANVAS_W = 640;
const CANVAS_H = 480;

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

async function getImageDimensions(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  });
}

const GLOBAL_ID = "__global__";

export default function ThemeMakerStudio() {
  const store = useThemeStore();
  const {
    screens, activeScreenId, selectedLayerId, themeName,
    globalScheme, globalGlyphs,
    getActiveScreen, getEffectiveScheme, 
    setThemeName, setActiveScreenId,
    setGlobalScheme, setGlobalGlyph,
    setScreenWallpaper, setScreenOverlay, setScreenSubAsset,
    setScreenStaticImage, setScreenGlyph,
    addLayer, updateLayer, removeLayer, setSelectedLayerId,
    updateScreenScheme,
  } = store;

  const isGlobalMode = activeScreenId === GLOBAL_ID;
  const screen = getActiveScreen();
  const sc = isGlobalMode ? globalScheme : getEffectiveScheme(activeScreenId);
  const def = MUOS_SCREENS.find((d) => d.id === activeScreenId);

  const handleSchemeChange = (updates: Partial<ScreenScheme>) => {
    if (isGlobalMode) {
      setGlobalScheme(updates);
    } else {
      updateScreenScheme(activeScreenId, updates);
    }
  };

  const [activeSubAsset, setActiveSubAsset] = useState<string | null>(null);

  useEffect(() => {
    if (def?.hasSubAssets && def.subAssets?.length) {
      setActiveSubAsset(def.subAssets[0].name);
    } else {
      setActiveSubAsset(null);
    }
  }, [activeScreenId, def]);

  const wallInputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const layerInputRef = useRef<HTMLInputElement>(null);
  const subAssetInputRef = useRef<HTMLInputElement>(null);
  const staticImageInputRef = useRef<HTMLInputElement>(null);
  const glyphInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  
  const [activeGlyph, setActiveGlyph] = useState<string | null>(null);
  const [activeGlyphCategory, setActiveGlyphCategory] = useState<"screen" | "header" | "footer" | "bar">("screen");
  const [canvasZoom, setCanvasZoom] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (selectedLayerId) removeLayer(activeScreenId, selectedLayerId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedLayerId, removeLayer, activeScreenId]);

  const handleWallUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = await readFileAsDataURL(file);
    setScreenWallpaper(activeScreenId, src);
    e.target.value = "";
  }, [activeScreenId, setScreenWallpaper]);

  const handleOverlayUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = await readFileAsDataURL(file);
    setScreenOverlay(activeScreenId, src);
    e.target.value = "";
  }, [activeScreenId, setScreenOverlay]);

  const handleGlyphUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeGlyph) return;
    const src = await readFileAsDataURL(file);
    if (activeGlyphCategory === "screen") {
      setScreenGlyph(activeScreenId, activeGlyph, src);
    } else {
      setGlobalGlyph(activeGlyphCategory, activeGlyph, src);
    }
    e.target.value = "";
  }, [activeGlyph, activeGlyphCategory, activeScreenId, setScreenGlyph, setGlobalGlyph]);

  const activeSubAssetSrc = activeSubAsset
    ? screen.subAssets.find((sa) => sa.name === activeSubAsset)?.src ?? null
    : null;
  const canvasBackground = activeSubAssetSrc ?? screen.wallpaper;

  const screenHasContent = (id: string) => {
    const s = screens.find((sc) => sc.id === id);
    if (!s) return false;
    return !!(s.wallpaper || s.subAssets.some((sa) => sa.src) || s.layers.length);
  };

  const getAlignStyles = (align: number | string, padL: number | string, padR: number | string) => {
    const a = Number(align);
    const pL = Number(padL);
    const pR = Number(padR);
    if (a === 1) return { left: pL, justifyContent: "flex-start" };
    if (a === 2) return { left: 0, right: 0, justifyContent: "center" };
    if (a === 3) return { right: pR, justifyContent: "flex-end" };
    return {};
  };

  // Mock Content Renderer for Screen Glyphs
  const renderMockContent = () => {
    const getGlyphSrc = (name: string) => screen.glyphs.find(g => g.name === name)?.src;

    if (activeScreenId === "muxlaunch") {
      const items = [
        { id: "apps", label: "Applications" },
        { id: "collection", label: "Collections" },
        { id: "history", label: "History" },
        { id: "favourite", label: "Favorites" },
        { id: "explore", label: "Explore" },
        { id: "config", label: "Settings" },
      ];
      return (
        <div className="grid grid-cols-3 gap-6 p-10 pt-20">
          {items.map(item => (
            <div key={item.id} className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center p-4 border border-white/10">
                {getGlyphSrc(item.id) ? <img src={getGlyphSrc(item.id)!} className="w-full h-full object-contain" /> : <Gamepad2 className="w-8 h-8 text-white/10" />}
              </div>
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      );
    }

    if (activeScreenId === "muxplore") {
      const files = [
        { name: "Super Mario World", type: "rom" },
        { name: "Nintendo 64", type: "folder" },
        { name: "Castlevania", type: "rom" },
        { name: "Sega Genesis", type: "folder" },
      ];
      return (
        <div className="space-y-1 p-8 pt-20">
          {files.map((f, i) => (
            <div key={i} className={`flex items-center gap-4 p-3 rounded-lg border ${i === 0 ? "bg-[#eab308]/20 border-[#eab308]/30" : "bg-black/20 border-white/5"}`}>
              <div className="w-6 h-6 flex items-center justify-center">
                {getGlyphSrc(f.type) ? <img src={getGlyphSrc(f.type)!} className="w-full h-full object-contain" /> : (f.type === 'folder' ? <Folder className="w-4 h-4 text-white/20" /> : <FileText className="w-4 h-4 text-white/20" />)}
              </div>
              <span className={`text-xs font-bold ${i === 0 ? "text-[#eab308]" : "text-white/60"}`}>{f.name}</span>
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-[#0e0e0e] text-white overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      <input ref={wallInputRef} type="file" className="hidden" accept="image/*" onChange={handleWallUpload} />
      <input ref={overlayInputRef} type="file" className="hidden" accept="image/png" onChange={handleOverlayUpload} />
      <input ref={subAssetInputRef} type="file" className="hidden" accept="image/*" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file || !activeSubAsset) return;
        setScreenSubAsset(activeScreenId, activeSubAsset, await readFileAsDataURL(file));
        e.target.value = "";
      }} />
      <input ref={layerInputRef} type="file" className="hidden" accept="image/*" multiple onChange={async (e) => {
         const files = e.target.files;
         if (!files) return;
         for (const file of Array.from(files)) {
           const src = await readFileAsDataURL(file);
           const { w, h } = await getImageDimensions(src);
           addLayer(activeScreenId, { src, name: file.name, x: 0, y: 0, width: w, height: h });
         }
         e.target.value = "";
      }} />
      <input ref={staticImageInputRef} type="file" className="hidden" accept="image/png" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setScreenStaticImage(activeScreenId, await readFileAsDataURL(file));
        e.target.value = "";
      }} />
      <input ref={glyphInputRef} type="file" className="hidden" accept="image/png" onChange={handleGlyphUpload} />

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 bg-[#131313] border-b border-white/5 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#eab308] flex items-center justify-center shadow-lg shadow-[#eab308]/10">
            <Monitor className="w-4 h-4 text-[#0e0e0e]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">muOS Theme Studio</h1>
            <p className="text-[10px] text-white/30 font-medium">NEXT GEN THEME ENGINE</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Input
            className="w-48 !bg-white/5 !border-white/10 text-white/80 placeholder:text-white/20 h-8 text-xs focus:!border-[#eab308]/40"
            placeholder="Theme Name"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => importInputRef.current?.click()} className="text-white/40 hover:text-white hover:bg-white/5 text-[11px] h-8 px-3">
              <Upload className="w-3.5 h-3.5 mr-2" />
              Import
            </Button>
            <Button
              size="sm"
              onClick={() => exportTheme(themeName || "MyTheme")}
              className="font-bold text-[11px] h-8 px-4 rounded-md shadow-lg shadow-[#eab308]/5"
              style={{ background: "linear-gradient(135deg,#fdc425,#e7b102)", color: "#3a2900" }}
            >
              <Download className="w-3.5 h-3.5 mr-2" />
              Package .muxthm
            </Button>
          </div>
          <input ref={importInputRef} type="file" className="hidden" accept=".muxthm,.zip" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const ok = await importThemeFromZip(file);
            if (ok && file.name) setThemeName(file.name.replace(/\.[^/.]+$/, ""));
            e.target.value = "";
          }} />
        </div>
      </header>

      {/* Body */}
      <div className="grid grid-cols-12 flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="col-span-2 bg-[#0a0a0a] border-r border-white/5 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            <div className="px-4">
               <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveScreenId(GLOBAL_ID)}
                className={`w-full justify-start gap-3 h-10 px-3 rounded-lg border border-transparent transition-all ${activeScreenId === GLOBAL_ID ? "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20" : "text-white/40 hover:text-white hover:bg-white/5"}`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-semibold">Global Scheme</span>
              </Button>
            </div>

            {CATEGORY_ORDER.map((cat) => (
              <div key={cat} className="space-y-1">
                <div className="px-5 py-2 flex items-center gap-2">
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{CATEGORY_LABELS[cat]}</div>
                </div>
                <div className="px-2 space-y-0.5">
                  {MUOS_SCREENS.filter(s => s.category === cat).map((s) => {
                    const active = s.id === activeScreenId;
                    const hasContent = screenHasContent(s.id);
                    return (
                      <Button
                        key={s.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveScreenId(s.id)}
                        className={`w-full justify-between h-9 px-3 rounded-md group transition-all ${active ? "bg-[#eab308]/10 text-[#eab308]" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                      >
                        <span className="text-[11px] truncate font-medium">{s.label}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {hasContent && <CheckCircle2 className={`w-3 h-3 ${active ? "text-[#eab308]" : "text-green-500/40 group-hover:text-green-500/60"}`} />}
                          {active && <ChevronRight className="w-3 h-3 opacity-50" />}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="col-span-7 bg-[#050505] relative flex flex-col overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl z-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Layout className="w-3.5 h-3.5 text-[#eab308]" />
                <span className="text-[10px] font-bold text-white/60 tracking-wider uppercase">{def?.label || "Workspace"}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Zoom</span>
                  <Slider value={[canvasZoom * 100]} onValueChange={(v) => { const first = Array.isArray(v) ? v[0] : v; setCanvasZoom(Number(first) / 100); }} min={50} max={200} step={5} className="w-32" />
                  <span className="text-[10px] font-mono text-white/40 min-w-[3rem]">{Math.round(canvasZoom * 100)}%</span>
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto relative p-24 flex items-center justify-center custom-scrollbar">
            <div
              className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out"
              style={{
                width: CANVAS_W,
                height: CANVAS_H,
                transform: `scale(${canvasZoom})`,
                backgroundColor: `#${sc.BACKGROUND}`,
                imageRendering: "pixelated"
              }}
              onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedLayerId(null); }}
            >
              {canvasBackground && <img src={canvasBackground} alt="wallpaper" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />}
              {screen.overlay && <img src={screen.overlay} alt="overlay" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10" draggable={false} />}
              {screen.staticImage && <img src={screen.staticImage} alt="static" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-[8]" draggable={false} />}

              {/* muOS Header */}
              <div 
                className="absolute top-0 left-0 right-0 flex items-center overflow-hidden z-[50]"
                style={{ 
                   height: sc.HEADER_HEIGHT, 
                   backgroundColor: `rgba(${parseInt(sc.HEADER_BACKGROUND.slice(0, 2), 16)}, ${parseInt(sc.HEADER_BACKGROUND.slice(2, 4), 16)}, ${parseInt(sc.HEADER_BACKGROUND.slice(4, 6), 16)}, ${sc.HEADER_BACKGROUND_ALPHA / 255})` 
                }}
              >
                {/* Header Title alignment */}
                <div 
                  className="absolute inset-y-0 flex items-center gap-2"
                  style={{ 
                    ...getAlignStyles(sc.HEADER_TEXT_ALIGN, sc.HEADER_PADDING_LEFT, sc.HEADER_PADDING_RIGHT),
                    color: `#${sc.HEADER_TEXT}`,
                    opacity: sc.HEADER_TEXT_ALPHA / 255,
                    paddingTop: sc.FONT_HEADER_PAD_TOP,
                    paddingBottom: sc.FONT_HEADER_PAD_BOTTOM
                  }}
                >
                  <div className="w-5 h-5 flex items-center justify-center transform" style={{ transform: `translateY(${sc.FONT_HEADER_ICON_PAD_TOP}px)` }}>
                    {globalGlyphs.bar["icon_menu"] ? <img src={globalGlyphs.bar["icon_menu"]!} className="w-full h-full object-contain" alt="menu icon" /> : <Monitor className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-bold tracking-tight uppercase">{def?.label}</span>
                </div>

                {/* Clock alignment */}
                <div 
                  className="absolute inset-y-0 flex items-center"
                  style={{ 
                    ...getAlignStyles(sc.DATETIME_ALIGN, sc.DATETIME_PADDING_LEFT, sc.DATETIME_PADDING_RIGHT),
                    color: `#${sc.DATETIME_TEXT}`,
                    opacity: sc.DATETIME_ALPHA / 255
                  }}
                >
                  <span className="text-[11px] font-mono font-bold tracking-widest leading-none">12:34</span>
                </div>

                {/* Status (Wifi/Battery) alignment */}
                <div 
                   className="absolute inset-y-0 flex items-center gap-3"
                   style={{ 
                     ...getAlignStyles(sc.STATUS_ALIGN, sc.STATUS_PADDING_LEFT, sc.STATUS_PADDING_RIGHT)
                   }}
                >
                   <div className="w-4 h-4 flex items-center justify-center">
                     {globalGlyphs.header["network_normal"] ? <img src={globalGlyphs.header["network_normal"]!} className="w-full h-full object-contain" alt="wifi icon" /> : <Wifi className="w-3.5 h-3.5 text-white/50" />}
                   </div>
                   <div className="w-6 h-3 rounded-[1px] border border-white/20 relative" style={{ borderColor: `#${sc.BATTERY_NORMAL}`, opacity: sc.BATTERY_NORMAL_ALPHA / 255 }}>
                     <div className="absolute left-[1px] top-[1px] bottom-[1px] bg-white/60" style={{ width: "60%", backgroundColor: `#${sc.BATTERY_NORMAL}` }} />
                   </div>
                </div>
              </div>

              {/* Screen Content Visualization (Mock) */}
              <div className="absolute inset-0 z-[15]">
                {renderMockContent()}
              </div>

              {/* Layers */}
              {screen.layers.sort((a,b) => a.zIndex - b.zIndex).map((l) => (
                <Rnd
                  key={l.id}
                  size={{ width: l.width, height: l.height }}
                  position={{ x: l.x, y: l.y }}
                  onDragStop={(_, d) => updateLayer(activeScreenId, l.id, { x: d.x, y: d.y })}
                  onResizeStop={(_, __, ref, ___, pos) => updateLayer(activeScreenId, l.id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...pos })}
                  bounds="parent"
                  style={{ zIndex: 20 + l.zIndex }}
                  className={selectedLayerId === l.id ? "ring-2 ring-[#eab308] ring-inset" : ""}
                  onMouseDown={(e) => { e.stopPropagation(); setSelectedLayerId(l.id); }}
                >
                  <img src={l.src} alt={l.name} className="w-full h-full object-contain pointer-events-none" draggable={false} />
                </Rnd>
              ))}

              {/* muOS Footer */}
              <div 
                 className="absolute bottom-0 left-0 right-0 z-[50]"
                 style={{ 
                   height: sc.FOOTER_HEIGHT, 
                   backgroundColor: `rgba(${parseInt(sc.FOOTER_BACKGROUND.slice(0, 2), 16)}, ${parseInt(sc.FOOTER_BACKGROUND.slice(2, 4), 16)}, ${parseInt(sc.FOOTER_BACKGROUND.slice(4, 6), 16)}, ${sc.FOOTER_BACKGROUND_ALPHA / 255})` 
                 }}
              >
                 <div className="flex items-center justify-between h-full px-4" style={{ color: `#${sc.FOOTER_TEXT}`, opacity: sc.FOOTER_TEXT_ALPHA / 255 }}>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-bold bg-[#dc2626] text-white w-4 h-4 rounded-full flex items-center justify-center">B</span>
                       <span className="text-[10px] font-bold uppercase tracking-wider">Back</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold uppercase tracking-wider">Select</span>
                       <span className="text-[9px] font-bold bg-[#16a34a] text-white w-4 h-4 rounded-full flex items-center justify-center">A</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </main>

        {/* Inspector */}
        <aside className="col-span-3 bg-[#0a0a0a] border-l border-white/5 flex flex-col overflow-hidden">
          <Tabs defaultValue="scheme" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3 bg-[#0d0d0d] border-b border-white/5 h-11 shrink-0 p-0 rounded-none">
              <TabsTrigger value="scheme" className="text-[10px] uppercase font-bold tracking-widest rounded-none h-full data-[state=active]:bg-white/5 data-[state=active]:text-[#eab308] border-b-2 border-transparent data-[state=active]:border-[#eab308]">Scheme</TabsTrigger>
              <TabsTrigger value="assets" className="text-[10px] uppercase font-bold tracking-widest rounded-none h-full data-[state=active]:bg-white/5 data-[state=active]:text-[#eab308] border-b-2 border-transparent data-[state=active]:border-[#eab308]">Assets</TabsTrigger>
              <TabsTrigger value="glyphs" className="text-[10px] uppercase font-bold tracking-widest rounded-none h-full data-[state=active]:bg-white/5 data-[state=active]:text-[#eab308] border-b-2 border-transparent data-[state=active]:border-[#eab308]">Glyphs</TabsTrigger>
            </TabsList>

            <TabsContent value="scheme" className="flex-1 overflow-y-auto m-0 outline-none p-4 custom-scrollbar">
              <Accordion className="space-y-2">
                {SCHEME_GROUPS.map((group) => (
                  <AccordionItem value={group.id} key={group.id} className="border-white/5 border rounded-lg bg-white/[0.02] overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 text-[10px] font-bold text-white/50 hover:no-underline hover:text-white uppercase tracking-widest transition-colors">{group.title}</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-4">
                      {group.fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{field.label}</Label>
                            <span className="text-[10px] font-mono text-white/40">{sc[field.key]}</span>
                          </div>
                          {field.type === 'color' ? (
                            <div className="flex gap-2">
                               <Input type="color" value={`#${sc[field.key] as string}`} onChange={(e) => handleSchemeChange({ [field.key]: e.target.value.slice(1).toUpperCase() })} className="w-full h-8 p-0 border-none bg-transparent cursor-pointer" />
                               <Input value={sc[field.key] as string} onChange={(e) => handleSchemeChange({ [field.key]: e.target.value.toUpperCase() })} className="w-20 h-8 !bg-black/40 !border-white/10 font-mono text-[10px] text-center" maxLength={6} />
                            </div>
                          ) : (
                            <Slider value={[Number(sc[field.key])]} min={field.min ?? 0} max={field.max ?? (field.type === 'alpha' ? 255 : 100)} onValueChange={(v) => { const first = Array.isArray(v) ? v[0] : v; handleSchemeChange({ [field.key]: first }); }} />
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="assets" className="flex-1 overflow-y-auto m-0 outline-none p-4 space-y-6 custom-scrollbar">
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Wallpaper</p>
                  {canvasBackground && <Button variant="ghost" size="icon" onClick={() => activeSubAsset ? setScreenSubAsset(activeScreenId, activeSubAsset, null) : setScreenWallpaper(activeScreenId, null)} className="h-6 w-6 text-red-400/50 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>}
                </div>
                <div onClick={() => activeSubAsset ? subAssetInputRef.current?.click() : wallInputRef.current?.click()} className="aspect-video bg-white/5 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.08] hover:border-[#eab308]/30 transition-all group overflow-hidden">
                   {canvasBackground ? <img src={canvasBackground} className="w-full h-full object-cover" alt="Wallpaper Preview" /> : <div className="flex flex-col items-center gap-2"><ImageIcon className="w-6 h-6 text-white/10 group-hover:text-white/30" /><span className="text-[10px] font-bold text-white/20 group-hover:text-white/40">Upload Source</span></div>}
                </div>
              </section>

              <section className="space-y-3">
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Static Image Interface</p>
                 <div onClick={() => staticImageInputRef.current?.click()} className="h-14 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.08] transition-all group px-4">
                    {screen.staticImage ? <div className="flex items-center gap-2 w-full"><div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-green-500" /></div><span className="text-[10px] font-bold text-green-500/80 uppercase truncate">Interface Image Loaded</span><Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setScreenStaticImage(activeScreenId, null); }} className="ml-auto h-6 w-6 text-red-400/50 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button></div> : <><Upload className="w-4 h-4 text-white/10 group-hover:text-white/30" /><span className="text-[10px] font-bold text-white/20 group-hover:text-white/40 uppercase">Select static interface layer</span></>}
                 </div>
              </section>

              <section className="space-y-3 flex-1">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Extra Canvas Layers</p>
                    <Button variant="ghost" size="icon" onClick={() => layerInputRef.current?.click()} className="h-6 w-6 bg-white/5 hover:bg-[#eab308]/10 hover:text-[#eab308]"><Plus className="w-4 h-4" /></Button>
                 </div>
                 <div className="space-y-2">
                    {screen.layers.map(l => (
                      <div key={l.id} onClick={() => setSelectedLayerId(l.id)} className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${selectedLayerId === l.id ? "bg-[#eab308]/10 border-[#eab308]/20 text-[#eab308]" : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white"}`}>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[10px] font-bold uppercase truncate">{l.name}</span>
                          <span className="text-[9px] font-mono opacity-40">{l.width}x{l.height} at {l.x},{l.y}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeLayer(activeScreenId, l.id); }} className="h-6 w-6 text-red-400/40 hover:text-red-400 hover:bg-red-400/10"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    ))}
                 </div>
              </section>
            </TabsContent>

            <TabsContent value="glyphs" className="flex-1 overflow-y-auto m-0 outline-none p-4 space-y-4 custom-scrollbar">
              <Accordion className="space-y-2">
                <AccordionItem value="global" className="border-white/5 border rounded-lg bg-white/[0.02] overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 text-[10px] font-bold text-white/50 hover:no-underline hover:text-white uppercase tracking-widest">Global Assets</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 space-y-6">
                    {(["header", "footer", "bar"] as const).map(cat => (
                      <div key={cat} className="space-y-3">
                        <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{cat}</div>
                        <div className="grid grid-cols-3 gap-2">
                          {GLOBAL_GLYPHS[cat].map(g => {
                             const src = globalGlyphs[cat][g.name];
                             return (
                               <div key={g.name} onClick={() => { setActiveGlyph(g.name); setActiveGlyphCategory(cat); glyphInputRef.current?.click(); }} className={`aspect-square rounded-lg bg-black/40 border transition-all flex flex-col items-center justify-center cursor-pointer group p-1 ${activeGlyph === g.name && activeGlyphCategory === cat ? 'border-[#eab308] ring-1 ring-[#eab308]/20' : 'border-white/5 hover:border-white/20'}`}>
                                  <div className="flex-1 flex items-center justify-center p-2">
                                     {src ? <img src={src} className="max-w-full max-h-full object-contain" alt={g.label} /> : <div className="w-4 h-4 bg-white/5 rounded-sm group-hover:bg-white/10" />}
                                  </div>
                                  <span className="text-[8px] font-bold text-white/20 uppercase truncate w-full text-center group-hover:text-white/40">{g.label}</span>
                               </div>
                             );
                          })}
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {def?.glyphs && def.glyphs.length > 0 && (
                  <AccordionItem value="screen" className="border-white/5 border rounded-lg bg-white/[0.02] overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 text-[10px] font-bold text-white/50 hover:no-underline hover:text-white uppercase tracking-widest">Screen Glyphs</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid grid-cols-3 gap-2">
                        {def.glyphs.map(g => {
                           const src = screen.glyphs.find(sg => sg.name === g.name)?.src;
                           return (
                             <div key={g.name} onClick={() => { setActiveGlyph(g.name); setActiveGlyphCategory("screen"); glyphInputRef.current?.click(); }} className={`aspect-square rounded-lg bg-black/40 border transition-all flex flex-col items-center justify-center cursor-pointer group p-1 ${activeGlyph === g.name && activeGlyphCategory === "screen" ? 'border-[#eab308] ring-1 ring-[#eab308]/20' : 'border-white/5 hover:border-white/20'}`}>
                                <div className="flex-1 flex items-center justify-center p-2">
                                   {src ? <img src={src} className="max-w-full max-h-full object-contain" alt={g.label} /> : <div className="w-4 h-4 bg-white/5 rounded-sm group-hover:bg-white/10" />}
                                </div>
                                <span className="text-[8px] font-bold text-white/20 uppercase truncate w-full text-center group-hover:text-white/40">{g.label}</span>
                             </div>
                           );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </TabsContent>
          </Tabs>
        </aside>
      </div>

       <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
