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
  Layers,
  Trash2,
  ChevronRight,
  Monitor,
  Settings,
  Wifi,
  Cpu,
  Film,
  CheckCircle2,
  Globe,
  Copy,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// ── Helpers ──────────────────────────────────────────────────────────────────

const CANVAS_W = 640;
const CANVAS_H = 480;

function categoryIcon(cat: "core" | "media" | "settings" | "network" | "system") {
  const cls = "w-3.5 h-3.5";
  switch (cat) {
    case "core":    return <Monitor className={cls} />;
    case "media":   return <Film className={cls} />;
    case "settings":return <Settings className={cls} />;
    case "network": return <Wifi className={cls} />;
    case "system":  return <Cpu className={cls} />;
  }
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

// ── Main Component ────────────────────────────────────────────────────────────

// ID virtual para o modo de edição do scheme global
const GLOBAL_ID = "__global__";

export default function ThemeMakerStudio() {
  const store = useThemeStore();
  const {
    screens, activeScreenId, selectedLayerId, themeName,
    globalScheme,
    getActiveScreen, getEffectiveScheme, getSchemeOverrideKeys,
    setThemeName, setActiveScreenId,
    setGlobalScheme, applyGlobalToAll, copySchemeToScreen, resetScreenSchemeToGlobal,
    setScreenWallpaper, setScreenOverlay, setScreenSubAsset,
    setScreenStaticImage, setScreenGlyph,
    addLayer, updateLayer, removeLayer, setSelectedLayerId,
    updateScreenScheme,
  } = store;

  const isGlobalMode = activeScreenId === GLOBAL_ID;
  const screen = getActiveScreen();
  // sc = scheme efetivo (global + overrides por tela) — usado no canvas e no inspector
  const sc = isGlobalMode ? globalScheme : getEffectiveScheme(activeScreenId);
  const overrideKeys = isGlobalMode ? new Set<keyof ScreenScheme>() : getSchemeOverrideKeys(activeScreenId);
  const def = MUOS_SCREENS.find((d) => d.id === activeScreenId);

  // Setter unificado: em modo global edita globalScheme; em modo tela edita screen
  const handleSchemeChange = (updates: Partial<ScreenScheme>) => {
    if (isGlobalMode) {
      setGlobalScheme(updates);
    } else {
      updateScreenScheme(activeScreenId, updates);
    }
  };

  // State para o dropdown "Copy from"
  const [showCopyFrom, setShowCopyFrom] = useState(false);

  // Sub-asset tab (only for muxlaunch)
  const [activeSubAsset, setActiveSubAsset] = useState<string | null>(null);

  useEffect(() => {
    if (def?.hasSubAssets && def.subAssets?.length) {
      setActiveSubAsset(def.subAssets[0].name);
    } else {
      setActiveSubAsset(null);
    }
  }, [activeScreenId, def]);

  // Refs para inputs ocultos
  const wallInputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const layerInputRef = useRef<HTMLInputElement>(null);
  const subAssetInputRef = useRef<HTMLInputElement>(null);
  const staticImageInputRef = useRef<HTMLInputElement>(null);
  const glyphInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [activeGlyph, setActiveGlyph] = useState<string | null>(null);

  // Delete layer via teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (selectedLayerId) removeLayer(activeScreenId, selectedLayerId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedLayerId, removeLayer, activeScreenId]);

  // Handlers
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

  const handleStaticImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = await readFileAsDataURL(file);
    setScreenStaticImage(activeScreenId, src);
    e.target.value = "";
  }, [activeScreenId, setScreenStaticImage]);

  const handleGlyphUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeGlyph) return;
    const src = await readFileAsDataURL(file);
    setScreenGlyph(activeScreenId, activeGlyph, src);
    e.target.value = "";
  }, [activeScreenId, activeGlyph, setScreenGlyph]);

  const handleSubAssetUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSubAsset) return;
    const src = await readFileAsDataURL(file);
    setScreenSubAsset(activeScreenId, activeSubAsset, src);
    e.target.value = "";
  }, [activeScreenId, activeSubAsset, setScreenSubAsset]);

  const handleLayerUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const src = await readFileAsDataURL(file);
      const { w, h } = await getImageDimensions(src);
      addLayer(activeScreenId, { src, name: file.name, x: 0, y: 0, width: w, height: h });
    }
    e.target.value = "";
  }, [activeScreenId, addLayer]);

  // Wallpaper a exibir no canvas: se houver sub-asset ativo e ele tiver src, mostra ele
  const activeSubAssetSrc = activeSubAsset
    ? screen.subAssets.find((sa) => sa.name === activeSubAsset)?.src ?? null
    : null;
  const canvasBackground = activeSubAssetSrc ?? screen.wallpaper;

  // Stats para sidebar
  const screenHasContent = (id: string) => {
    const s = screens.find((sc) => sc.id === id);
    if (!s) return false;
    return !!(s.wallpaper || s.subAssets.some((sa) => sa.src) || s.layers.length);
  };

  // Conta telas com scheme sobrescrito em pelo menos 1 campo
  const screensWithOverrides = screens.filter((s) => {
    return (Object.keys(globalScheme) as (keyof ScreenScheme)[]).some(
      (k) => s.scheme[k] !== globalScheme[k]
    );
  }).length;

  return (
    <div className="flex flex-col h-screen bg-[#0e0e0e] text-white overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Hidden file inputs ─────────────────────────────────────────── */}
      <input ref={wallInputRef}     type="file" className="hidden" accept="image/*" onChange={handleWallUpload} />
      <input ref={overlayInputRef}  type="file" className="hidden" accept="image/png" onChange={handleOverlayUpload} />
      <input ref={subAssetInputRef} type="file" className="hidden" accept="image/*" onChange={handleSubAssetUpload} />
      <input ref={layerInputRef}    type="file" className="hidden" accept="image/*" multiple onChange={handleLayerUpload} />
      <input ref={staticImageInputRef} type="file" className="hidden" accept="image/png" onChange={handleStaticImageUpload} />
      <input ref={glyphInputRef}    type="file" className="hidden" accept="image/png" onChange={handleGlyphUpload} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-3 bg-[#131313] border-b border-white/5 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#eab308] flex items-center justify-center">
            <Monitor className="w-4 h-4 text-[#0e0e0e]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>muOS Theme Studio</h1>
            <p className="text-[10px] text-white/40">640×480 · {MUOS_SCREENS.length} screens</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Input
            className="w-52 !bg-[#1a1a1a] !border-white/10 text-white/80 placeholder:text-white/30 focus:!border-[#eab308]/50"
            placeholder="Theme name…"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
          />
      <input
        ref={importInputRef}
        type="file"
        className="hidden"
        accept=".muxthm,.zip"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const ok = await importThemeFromZip(file);
          if (ok && file.name) setThemeName(file.name.replace(/\.[^/.]+$/, ""));
          e.target.value = "";
        }}
      />
          <Button variant="outline" size="sm" onClick={() => importInputRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" />
            Import
          </Button>
          <Button 
            size="sm"
            onClick={() => exportTheme(themeName || "MyTheme")}
            className="!bg-transparent !border-none !text-[#3a2900] font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#fdc425,#e7b102)", color: "#3a2900" }}
          >
            <Download className="w-3.5 h-3.5" />
            Export .muxthm
          </Button>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Screen List ─────────────────────────────────────────── */}
        <aside className="w-56 bg-[#131313] border-r border-white/5 flex flex-col overflow-hidden shrink-0">
          <div className="px-3 py-2.5 border-b border-white/5">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Screens</p>
          </div>
          <div className="flex-1 overflow-y-auto py-1">

            {/* Global Scheme entry — sempre no topo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveScreenId(GLOBAL_ID)}
              className={`w-full justify-between mb-1 border-b border-white/5 rounded-none ${
                activeScreenId === GLOBAL_ID
                  ? "bg-[#3b82f6]/15 text-[#60a5fa]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3" />
                <span>Global Scheme</span>
              </div>
              {screensWithOverrides > 0 && (
                <span className="text-[9px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full">
                  {screensWithOverrides} override{screensWithOverrides > 1 ? "s" : ""}
                </span>
              )}
            </Button>

            {CATEGORY_ORDER.map((cat) => {
              const items = MUOS_SCREENS.filter((s) => s.category === cat);
              return (
                <div key={cat} className="mb-1">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-white/25 uppercase tracking-wider">
                    {categoryIcon(cat)}
                    {CATEGORY_LABELS[cat]}
                  </div>
                  {items.map((s) => {
                    const active = s.id === activeScreenId;
                    const hasContent = screenHasContent(s.id);
                    const hasSchemeOverride = (Object.keys(globalScheme) as (keyof ScreenScheme)[]).some(
                      (k) => screens.find(sc => sc.id === s.id)?.scheme[k] !== globalScheme[k]
                    );
                    return (
                      <Button
                        key={s.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveScreenId(s.id)}
                        className={`w-full justify-between ${
                          active
                            ? "bg-[#eab308]/15 text-[#eab308]"
                            : "text-white/55 hover:text-white/80 hover:bg-white/5"
                        }`}
                      >
                        <span className="truncate">{s.label}</span>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {hasSchemeOverride && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]/60" title="Has scheme overrides" />
                          )}
                          {hasContent && (
                            <CheckCircle2 className={`w-3 h-3 ${active ? "text-[#eab308]" : "text-green-500/70"}`} />
                          )}
                          {active && <ChevronRight className="w-3 h-3" />}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Center: Canvas ────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col bg-[#0e0e0e] overflow-hidden">

          {/* Canvas toolbar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#131313] shrink-0">
            <span className="text-xs text-white/40 font-mono">
              {isGlobalMode ? "Global Scheme" : (def?.label ?? activeScreenId)}
            </span>
            <span className="text-white/15 text-xs">·</span>
            <span className="text-xs text-white/25 font-mono">{CANVAS_W}×{CANVAS_H}</span>

            {/* Sub-asset tabs (muxlaunch) */}
            {def?.hasSubAssets && def.subAssets && (
              <div className="flex items-center gap-1 ml-3">
                {def.subAssets.map((sa) => {
                  const hasSrc = screen.subAssets.find((s) => s.name === sa.name)?.src;
                  return (
                    <Button
                      key={sa.name}
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSubAsset(sa.name)}
                      className={`text-[10px] font-medium ${
                        activeSubAsset === sa.name
                          ? "!bg-[#eab308] !text-[#3a2900] !border-[#eab308]"
                          : `${hasSrc ? "text-green-400/70 border-green-500/30" : "text-white/40 border-white/10"} hover:text-white/70`
                      }`}
                    >
                      {sa.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Canvas area */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div
              className="relative shadow-2xl"
              style={{
                width: CANVAS_W,
                height: CANVAS_H,
                backgroundColor: `rgba(${parseInt(sc.BACKGROUND.slice(0,2),16)},${parseInt(sc.BACKGROUND.slice(2,4),16)},${parseInt(sc.BACKGROUND.slice(4,6),16)},${(sc.BACKGROUND_ALPHA/255).toFixed(2)})`,
              }}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setSelectedLayerId(null);
              }}
            >
              {/* Wallpaper */}
              {canvasBackground ? (
                <img
                  src={canvasBackground}
                  alt="wallpaper"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                  <ImageIcon className="w-8 h-8 text-white/10" />
                  <p className="text-xs text-white/20">
                    {isGlobalMode
                      ? "Global Scheme — edite as cores base na coluna direita →"
                      : activeSubAsset
                        ? `Upload wallpaper for "${activeSubAsset}" using the inspector →`
                        : "Upload a wallpaper using the inspector →"}
                  </p>
                </div>
              )}

              {/* Overlay */}
              {screen.overlay && (
                <img
                  src={screen.overlay}
                  alt="overlay"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ zIndex: 10 }}
                  draggable={false}
                />
              )}

              {/* ── muOS Chrome — valores lidos do scheme da tela ───────────────────────────
                  Header height: sc.HEADER_HEIGHT, Footer: CANVAS_H - sc.FOOTER_HEIGHT
              ─────────────────────────────────────────────────────────── */}

              {/* HEADER */}
              <div
                className="absolute left-0 right-0 top-0 flex items-center justify-between pointer-events-none"
                style={{
                  height: sc.HEADER_HEIGHT,
                  zIndex: 50,
                  background: `rgba(${parseInt(sc.HEADER_BACKGROUND.slice(0,2),16)},${parseInt(sc.HEADER_BACKGROUND.slice(2,4),16)},${parseInt(sc.HEADER_BACKGROUND.slice(4,6),16)},${(sc.HEADER_BACKGROUND_ALPHA/255).toFixed(2)})`,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Left: glyph placeholder + screen title */}
                <div className={`flex items-center gap-2 px-3 ${
                  sc.HEADER_TEXT_ALIGN === 2 ? "flex-1 justify-center" :
                  sc.HEADER_TEXT_ALIGN === 3 ? "flex-1 justify-end" : ""
                }`}>
                  <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.2"/></svg>
                  </div>
                  <span
                    className="text-[13px] font-semibold tracking-wide"
                    style={{
                      fontFamily: "'Space Grotesk', monospace",
                      color: `#${sc.HEADER_TEXT}`,
                      opacity: sc.HEADER_TEXT_ALPHA / 255,
                    }}
                  >
                    {def?.label ?? activeScreenId}
                  </span>
                </div>
                {/* Right: status bar icons */}
                <div className="flex items-center gap-3 px-3">
                  {/* WiFi */}
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M7 9.5a1 1 0 100 2 1 1 0 000-2z" fill="white" fillOpacity="0.7"/><path d="M4.29 7.21A3.99 3.99 0 017 6c1.04 0 1.99.4 2.71 1.06" stroke="white" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round"/><path d="M1.76 4.76A7 7 0 017 3c2.03 0 3.87.82 5.24 2.15" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  {/* Battery */}
                  <div className="flex items-center gap-0.5">
                    <div className="relative w-7 h-3.5 rounded-sm" style={{ border: "1.2px solid rgba(255,255,255,0.5)" }}>
                      <div className="absolute left-0.5 top-0.5 bottom-0.5 rounded-sm bg-green-400" style={{ width: "65%" }} />
                    </div>
                    <div className="w-0.5 h-1.5 rounded-r-sm bg-white/40" />
                  </div>
                  {/* Clock */}
                  <span className="text-white/70 text-[11px] font-mono">12:34</span>
                </div>
              </div>

              {/* CONTENT AREA — abaixo do header, acima do footer */}
              <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{ top: sc.HEADER_HEIGHT, height: CANVAS_H - sc.HEADER_HEIGHT - sc.FOOTER_HEIGHT, zIndex: 30 }}
              >
                {/* Safe-zone boundary indicator */}
                <div className="absolute inset-0 border border-dashed border-white/5 m-1 rounded pointer-events-none" />

                {/* Static image overlay (image/static/{screenid}.png) */}
                {screen.staticImage && (
                  <img
                    src={screen.staticImage}
                    alt="static"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{ zIndex: 5 }}
                    draggable={false}
                  />
                )}

                {/* LIST layout placeholder — only when no image/wallpaper set */}
                {def?.layout === "list" && !canvasBackground && (() => {
                  if (def.hasSubAssets && def.subAssets?.length) {
                    return (
                      <div className="absolute inset-0 flex flex-col justify-center px-4 gap-1">
                        {def.subAssets.map((sa) => {
                          const isActive = activeSubAsset === sa.name;
                          const hasSrc = !!screen.subAssets.find(s => s.name === sa.name)?.src;
                          return (
                            <div
                              key={sa.name}
                              className="px-4 py-2 rounded flex items-center justify-between"
                              style={{
                                background: isActive
                                  ? `rgba(${parseInt(sc.LIST_FOCUS_BACKGROUND.slice(0,2),16)},${parseInt(sc.LIST_FOCUS_BACKGROUND.slice(2,4),16)},${parseInt(sc.LIST_FOCUS_BACKGROUND.slice(4,6),16)},${(sc.LIST_FOCUS_BACKGROUND_ALPHA/255).toFixed(2)})`
                                  : `rgba(255,255,255,${(sc.LIST_DEFAULT_BACKGROUND_ALPHA/255*0.04).toFixed(3)})`,
                                borderLeft: isActive ? `3px solid #${sc.LIST_FOCUS_BACKGROUND}` : "3px solid transparent",
                              }}
                            >
                              <span
                                className="text-xs font-semibold"
                                style={{
                                  fontFamily: "'Space Grotesk', monospace",
                                  color: isActive ? `#${sc.LIST_FOCUS_TEXT}` : `#${sc.LIST_DEFAULT_TEXT}`,
                                  opacity: isActive ? sc.LIST_FOCUS_TEXT_ALPHA / 255 : sc.LIST_DEFAULT_TEXT_ALPHA / 255,
                                }}
                              >{sa.label}</span>
                              {hasSrc
                                ? <span className="text-[9px] text-green-500/60">image set</span>
                                : <span className="text-[9px] text-white/20">no image</span>
                              }
                            </div>
                          );
                        })}
                        <p className="text-[9px] text-white/20 text-center mt-2">
                          Each item shows its own full-screen background image
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="absolute inset-0 flex flex-col justify-center px-4 gap-1">
                      {["Item 1", "Item 2 (selected)", "Item 3", "Item 4", "Item 5"].map((item, i) => (
                        <div
                          key={i}
                          className="px-4 py-2.5 rounded"
                          style={{
                            background: i === 1
                              ? `rgba(${parseInt(sc.LIST_FOCUS_BACKGROUND.slice(0,2),16)},${parseInt(sc.LIST_FOCUS_BACKGROUND.slice(2,4),16)},${parseInt(sc.LIST_FOCUS_BACKGROUND.slice(4,6),16)},${(sc.LIST_FOCUS_BACKGROUND_ALPHA/255).toFixed(2)})`
                              : "rgba(255,255,255,0.04)",
                            borderLeft: i === 1 ? `3px solid #${sc.LIST_FOCUS_BACKGROUND}` : "3px solid transparent",
                          }}
                        >
                          <span
                            className="text-sm"
                            style={{
                              fontFamily: "'Space Grotesk', monospace",
                              color: i === 1 ? `#${sc.LIST_FOCUS_TEXT}` : `#${sc.LIST_DEFAULT_TEXT}`,
                              opacity: i === 1 ? sc.LIST_FOCUS_TEXT_ALPHA/255 : sc.LIST_DEFAULT_TEXT_ALPHA/255,
                              fontWeight: i === 1 ? 600 : 400,
                            }}
                          >{item}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* SPLASH — tela estacionária sem lista */}
                {def?.layout === "splash" && !canvasBackground && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-20">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="2" y="2" width="36" height="36" rx="8" stroke="white" strokeWidth="2"/>
                      <path d="M13 20h14M20 13v14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="text-white text-[11px]">splash / static screen</span>
                  </div>
                )}
              </div>

              {/* FOOTER BAR — dinâmico baseado no scheme */}
              <div
                className="absolute left-0 right-0 flex items-center justify-between pointer-events-none"
                style={{
                  top: CANVAS_H - sc.FOOTER_HEIGHT,
                  height: sc.FOOTER_HEIGHT,
                  zIndex: 50,
                  background: `rgba(${parseInt(sc.FOOTER_BACKGROUND.slice(0,2),16)},${parseInt(sc.FOOTER_BACKGROUND.slice(2,4),16)},${parseInt(sc.FOOTER_BACKGROUND.slice(4,6),16)},${(sc.FOOTER_BACKGROUND_ALPHA/255).toFixed(2)})`,
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Left hints: B=Back */}
                <div className="flex items-center gap-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#dc2626", opacity: sc.FOOTER_TEXT_ALPHA/255 }}>B</div>
                    <span className="text-[10px]" style={{ color: `#${sc.HEADER_TEXT}`, opacity: sc.FOOTER_TEXT_ALPHA/255 }}>Back</span>
                  </div>
                </div>
                {/* Right hints: A=Select */}
                <div className="flex items-center gap-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]" style={{ color: `#${sc.HEADER_TEXT}`, opacity: sc.FOOTER_TEXT_ALPHA/255 }}>Select</span>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#16a34a", opacity: sc.FOOTER_TEXT_ALPHA/255 }}>A</div>
                  </div>
                </div>
              </div>

              {/* Layers (react-rnd) — rendered between overlay and chrome */}
              {screen.layers.map((layer) => (
                <Rnd
                  key={layer.id}
                  size={{ width: layer.width, height: layer.height }}
                  position={{ x: layer.x, y: layer.y }}
                  onDragStop={(_, d) => updateLayer(activeScreenId, layer.id, { x: d.x, y: d.y })}
                  onResizeStop={(_, __, ref, ___, pos) => {
                    updateLayer(activeScreenId, layer.id, {
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      ...pos,
                    });
                  }}
                  bounds="parent"
                  style={{ zIndex: layer.zIndex + 20 }}
                  className={
                    selectedLayerId === layer.id
                      ? "ring-2 ring-[#eab308] ring-offset-1 ring-offset-[#0e0e0e]"
                      : ""
                  }
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedLayerId(layer.id);
                  }}
                >
                  <img
                    src={layer.src}
                    alt={layer.name}
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </Rnd>
              ))}
            </div>
          </div>
        </main>

        {/* ── Right: Inspector ──────────────────────────────────────────── */}
        <aside className="w-64 bg-[#131313] border-l border-white/5 flex flex-col overflow-hidden shrink-0">
          <div className="px-3 py-2.5 border-b border-white/5 shrink-0">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Inspector</p>
            <p className="text-xs text-white/50 mt-0.5 truncate">{def?.label}</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Wallpaper section */}
            <section className="px-3 py-3 border-b border-white/5">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">
                {activeSubAsset ? `Wallpaper · "${activeSubAsset}"` : "Wallpaper"}
              </p>

              {/* Preview do wallpaper */}
              <div
                onClick={() => activeSubAsset ? subAssetInputRef.current?.click() : wallInputRef.current?.click()}
                className="relative aspect-video w-full rounded-md overflow-hidden bg-[#1a1a1a] border border-white/8 cursor-pointer hover:border-[#eab308]/40 transition-colors group"
                style={{ backgroundImage: canvasBackground ? `url(${canvasBackground})` : "none", backgroundSize: "cover", backgroundPosition: "center" }}
              >
                {!canvasBackground && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <ImageIcon className="w-5 h-5 text-white/20" />
                    <span className="text-[10px] text-white/30">Click to upload</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">Replace</span>
                </div>
              </div>

              {canvasBackground && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => activeSubAsset
                  ? setScreenSubAsset(activeScreenId, activeSubAsset, null)
                  : setScreenWallpaper(activeScreenId, null)
                }
                className="mt-1.5 w-full text-[10px] text-red-400/60 hover:text-red-400 justify-center"
              >
                Remove wallpaper
              </Button>
              )}
            </section>

            {/* Sub-assets list (muxlaunch) */}
            {def?.hasSubAssets && def.subAssets && (
              <section className="px-3 py-3 border-b border-white/5">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Sub-Assets</p>
                <div className="space-y-1">
                  {def.subAssets.map((sa) => {
                    const entry = screen.subAssets.find((s) => s.name === sa.name);
                    const hasSrc = !!entry?.src;
                    return (
                      <div
                        key={sa.name}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                          activeSubAsset === sa.name
                            ? "bg-[#eab308]/10 text-[#eab308]"
                            : "hover:bg-white/5 text-white/50 hover:text-white/80"
                        }`}
                        onClick={() => setActiveSubAsset(sa.name)}
                      >
                        <span className="text-xs">{sa.label}</span>
                        <div className="flex items-center gap-1">
                          {hasSrc && <CheckCircle2 className="w-3 h-3 text-green-500/70" />}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSubAsset(sa.name);
                              setTimeout(() => subAssetInputRef.current?.click(), 50);
                            }}
                            className="text-white/20 hover:text-white/60"
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                          {hasSrc && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setScreenSubAsset(activeScreenId, sa.name, null);
                            }}
                            className="text-red-400/40 hover:text-red-400/80"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Glyphs section (screens with sub-assets, e.g. muxlaunch) */}
            {def?.hasSubAssets && def.subAssets && screen.glyphs.length > 0 && (
              <section className="px-3 py-3 border-b border-white/5">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Glyphs (glyph/{def.id}/)</p>
                <div className="space-y-1">
                  {screen.glyphs.map((g) => (
                    <div
                      key={g.name}
                      className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-white/5 group"
                    >
                      <div className="flex items-center gap-2">
                        {g.src
                          ? <img src={g.src} alt={g.name} className="w-5 h-5 object-contain rounded" />
                          : <div className="w-5 h-5 rounded bg-white/8 border border-dashed border-white/15" />
                        }
                        <span className={`text-xs ${g.src ? "text-white/70" : "text-white/30"}`}>{g.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {g.src && <CheckCircle2 className="w-3 h-3 text-green-500/70" />}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => { setActiveGlyph(g.name); setTimeout(() => glyphInputRef.current?.click(), 50); }}
                          className="text-white/20 hover:text-white/60"
                          title={`Upload ${g.name}.png`}
                        >
                          <Upload className="w-3 h-3" />
                        </Button>
                        {g.src && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setScreenGlyph(activeScreenId, g.name, null)}
                          className="text-red-400/40 hover:text-red-400/80"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Static Image section (image/static/{screenid}.png) */}
            <section className="px-3 py-3 border-b border-white/5">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Static Image</p>
              <div
                onClick={() => staticImageInputRef.current?.click()}
                className="relative h-10 w-full rounded-md bg-[#1a1a1a] border border-dashed border-white/10 cursor-pointer hover:border-[#eab308]/30 transition-colors flex items-center justify-center gap-2 group"
              >
                {screen.staticImage ? (
                  <span className="text-[10px] text-green-400">static/{def?.id}.png loaded</span>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40" />
                    <span className="text-[10px] text-white/30 group-hover:text-white/50">image/static/{def?.id}.png</span>
                  </>
                )}
              </div>
              {screen.staticImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScreenStaticImage(activeScreenId, null)}
                className="mt-1 w-full text-[10px] text-red-400/60 hover:text-red-400 justify-center"
              >
                Remove static image
              </Button>
              )}
            </section>

            {/* Scheme section */}
            <section className="px-3 py-3 border-b border-white/5">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-3">Scheme</p>

              {/* ── reutilizável inline: color + alpha slider ── */}
              {/* Header */}
              <p className="text-[9px] font-semibold text-white/20 uppercase tracking-wider mb-2 mt-1">Header</p>
              <div className="space-y-3">

                {/* Height */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Height</label>
                  <div className="flex items-center gap-1.5">
                    <Slider
                      value={[sc.HEADER_HEIGHT]}
                      min={0}
                      max={120}
                      onValueChange={(val) => updateScreenScheme(activeScreenId, { HEADER_HEIGHT: Array.isArray(val) ? val[0] : val })}
                      className="w-20"
                    />
                    <span className="text-[10px] text-white/50 w-6 text-right">{sc.HEADER_HEIGHT}</span>
                  </div>
                </div>

                {/* Background color */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Bg color</label>
                  <Input
                    type="color"
                    value={`#${sc.HEADER_BACKGROUND}`}
                    onChange={(e) => updateScreenScheme(activeScreenId, { HEADER_BACKGROUND: e.target.value.slice(1).toUpperCase() })}
                    className="w-8 h-6 rounded cursor-pointer !border-white/10 !bg-transparent p-0"
                  />
                </div>

                {/* Background alpha */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Bg alpha</label>
                  <div className="flex items-center gap-1.5">
                    <Slider
                      value={[sc.HEADER_BACKGROUND_ALPHA]}
                      min={0}
                      max={255}
                      onValueChange={(val) => updateScreenScheme(activeScreenId, { HEADER_BACKGROUND_ALPHA: Array.isArray(val) ? val[0] : val })}
                      className="w-20"
                    />
                    <span className="text-[10px] text-white/50 w-6 text-right">{sc.HEADER_BACKGROUND_ALPHA}</span>
                  </div>
                </div>

                {/* Text color */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Text color</label>
                  <Input
                    type="color"
                    value={`#${sc.HEADER_TEXT}`}
                    onChange={(e) => updateScreenScheme(activeScreenId, { HEADER_TEXT: e.target.value.slice(1).toUpperCase() })}
                    className="w-8 h-6 rounded cursor-pointer !border-white/10 !bg-transparent p-0"
                  />
                </div>

                {/* Text alpha */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Text alpha</label>
                  <div className="flex items-center gap-1.5">
                    <Slider
                      value={[sc.HEADER_TEXT_ALPHA]}
                      min={0}
                      max={255}
                      onValueChange={(val) => updateScreenScheme(activeScreenId, { HEADER_TEXT_ALPHA: Array.isArray(val) ? val[0] : val })}
                      className="w-20"
                    />
                    <span className="text-[10px] text-white/50 w-6 text-right">{sc.HEADER_TEXT_ALPHA}</span>
                  </div>
                </div>

                {/* Text align */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Text align</label>
                    <div className="flex gap-1">
                      {([1, 2, 3] as const).map((v) => (
                        <Button
                          key={v}
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => updateScreenScheme(activeScreenId, { HEADER_TEXT_ALIGN: v })}
                          className={`${
                            sc.HEADER_TEXT_ALIGN === v ? "bg-[#eab308] text-[#3a2900]" : "bg-white/5 text-white/30 hover:text-white/60"
                          }`}
                        >
                          {v === 1 ? "L" : v === 2 ? "C" : "R"}
                        </Button>
                      ))}
                    </div>
                </div>
              </div>

              {/* Footer */}
              <p className="text-[9px] font-semibold text-white/20 uppercase tracking-wider mb-2 mt-4">Footer</p>
              <div className="space-y-3">

                {/* Height */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Height</label>
                  <div className="flex items-center gap-1.5">
                    <Slider
                      value={[sc.FOOTER_HEIGHT]}
                      min={0}
                      max={120}
                      onValueChange={(val) => updateScreenScheme(activeScreenId, { FOOTER_HEIGHT: Array.isArray(val) ? val[0] : val })}
                      className="w-20"
                    />
                    <span className="text-[10px] text-white/50 w-6 text-right">{sc.FOOTER_HEIGHT}</span>
                  </div>
                </div>

                {/* Background color */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Bg color</label>
                  <Input
                    type="color"
                    value={`#${sc.FOOTER_BACKGROUND}`}
                    onChange={(e) => updateScreenScheme(activeScreenId, { FOOTER_BACKGROUND: e.target.value.slice(1).toUpperCase() })}
                    className="w-8 h-6 rounded cursor-pointer !border-white/10 !bg-transparent p-0"
                  />
                </div>

                {/* Background alpha */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Bg alpha</label>
                  <div className="flex items-center gap-1.5">
                    <Slider
                      value={[sc.FOOTER_BACKGROUND_ALPHA]}
                      min={0}
                      max={255}
                      onValueChange={(val) => updateScreenScheme(activeScreenId, { FOOTER_BACKGROUND_ALPHA: Array.isArray(val) ? val[0] : val })}
                      className="w-20"
                    />
                    <span className="text-[10px] text-white/50 w-6 text-right">{sc.FOOTER_BACKGROUND_ALPHA}</span>
                  </div>
                </div>

                {/* Text alpha */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Text alpha</label>
                  <div className="flex items-center gap-1.5">
                    <Slider
                      value={[sc.FOOTER_TEXT_ALPHA]}
                      min={0}
                      max={255}
                      onValueChange={(val) => updateScreenScheme(activeScreenId, { FOOTER_TEXT_ALPHA: Array.isArray(val) ? val[0] : val })}
                      className="w-20"
                    />
                    <span className="text-[10px] text-white/50 w-6 text-right">{sc.FOOTER_TEXT_ALPHA}</span>
                  </div>
                </div>
              </div>

              {/* List */}
              <p className="text-[9px] font-semibold text-white/20 uppercase tracking-wider mb-2 mt-4">List</p>
              <div className="space-y-3">

                {/* Focus bg color */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Focus bg</label>
                  <Input
                    type="color"
                    value={`#${sc.LIST_FOCUS_BACKGROUND}`}
                    onChange={(e) => updateScreenScheme(activeScreenId, { LIST_FOCUS_BACKGROUND: e.target.value.slice(1).toUpperCase() })}
                    className="w-8 h-6 rounded cursor-pointer !border-white/10 !bg-transparent p-0"
                  />
                </div>

                {/* Focus bg alpha */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Focus bg α</label>
                  <div className="flex items-center gap-1.5">
                    <Slider
                      value={[sc.LIST_FOCUS_BACKGROUND_ALPHA]}
                      min={0}
                      max={255}
                      onValueChange={(val) => updateScreenScheme(activeScreenId, { LIST_FOCUS_BACKGROUND_ALPHA: Array.isArray(val) ? val[0] : val })}
                      className="w-20"
                    />
                    <span className="text-[10px] text-white/50 w-6 text-right">{sc.LIST_FOCUS_BACKGROUND_ALPHA}</span>
                  </div>
                </div>

                {/* Default text */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Default text</label>
                  <input
                    type="color"
                    value={`#${sc.LIST_DEFAULT_TEXT}`}
                    onChange={(e) => updateScreenScheme(activeScreenId, { LIST_DEFAULT_TEXT: e.target.value.slice(1).toUpperCase() })}
                    className="w-8 h-6 rounded cursor-pointer border border-white/10 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Default α</label>
                  <div className="flex items-center gap-1.5">
                    <Slider
                      value={[sc.LIST_DEFAULT_TEXT_ALPHA]}
                      min={0}
                      max={255}
                      onValueChange={(val) => updateScreenScheme(activeScreenId, { LIST_DEFAULT_TEXT_ALPHA: Array.isArray(val) ? val[0] : val })}
                      className="w-20"
                    />
                    <span className="text-[10px] text-white/50 w-6 text-right">{sc.LIST_DEFAULT_TEXT_ALPHA}</span>
                  </div>
                </div>

                {/* Focus text */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Focus text</label>
                  <input
                    type="color"
                    value={`#${sc.LIST_FOCUS_TEXT}`}
                    onChange={(e) => updateScreenScheme(activeScreenId, { LIST_FOCUS_TEXT: e.target.value.slice(1).toUpperCase() })}
                    className="w-8 h-6 rounded cursor-pointer border border-white/10 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/40 w-20">Focus α</label>
                  <div className="flex items-center gap-1.5">
                    <Slider
                      value={[sc.LIST_FOCUS_TEXT_ALPHA]}
                      min={0}
                      max={255}
                      onValueChange={(val) => updateScreenScheme(activeScreenId, { LIST_FOCUS_TEXT_ALPHA: Array.isArray(val) ? val[0] : val })}
                      className="w-20"
                    />
                    <span className="text-[10px] text-white/50 w-6 text-right">{sc.LIST_FOCUS_TEXT_ALPHA}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Overlay section */}
            <section className="px-3 py-3 border-b border-white/5">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Overlay (HUD)</p>
              <div
                onClick={() => overlayInputRef.current?.click()}
                className="relative h-10 w-full rounded-md bg-[#1a1a1a] border border-dashed border-white/10 cursor-pointer hover:border-[#eab308]/30 transition-colors flex items-center justify-center gap-2 group"
              >
                {screen.overlay ? (
                  <span className="text-[10px] text-green-400">overlay.png loaded</span>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40" />
                    <span className="text-[10px] text-white/30 group-hover:text-white/50">Upload overlay.png</span>
                  </>
                )}
              </div>
              {screen.overlay && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScreenOverlay(activeScreenId, null)}
                className="mt-1 w-full text-[10px] text-red-400/60 hover:text-red-400 justify-center"
              >
                Remove overlay
              </Button>
              )}
            </section>
            {/* Layers section */}
            <section className="px-3 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Extra Layers</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => layerInputRef.current?.click()}
                  className="text-[10px] text-white/30 hover:text-[#eab308]"
                >
                  <Layers className="w-3 h-3" /> Add
                </Button>
              </div>

              <div className="space-y-1">
                {screen.layers.map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                      selectedLayerId === layer.id
                        ? "bg-[#eab308]/10 text-[#eab308]"
                        : "hover:bg-white/5 text-white/50 hover:text-white/80"
                    }`}
                  >
                    <span className="text-[10px] truncate w-32" title={layer.name}>{layer.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono text-white/20">{layer.x},{layer.y}</span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => { e.stopPropagation(); removeLayer(activeScreenId, layer.id); }}
                          className="text-red-400/40 hover:text-red-400/80"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                  </div>
                ))}
                {screen.layers.length === 0 && (
                  <p className="text-[10px] text-white/20 text-center py-3">No layers. Click "Add" to upload images.</p>
                )}
              </div>
            </section>
          </div>
        </aside>

      </div>
    </div>
  );
}
