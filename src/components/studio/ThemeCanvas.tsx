"use client";

import { useThemeStore, ScreenScheme } from "@/store/themeStore";
import { MUOS_SCREENS } from "@/data/muosScreens";
import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Layout } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { HeaderBar } from "./canvas/HeaderBar";
import { FooterBar } from "./canvas/FooterBar";
import { GradientOverlay } from "./canvas/GradientOverlay";
import { MockContentRenderer } from "./canvas/MockContentRenderer";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;
}

const GLOBAL_ID = "__global__";

export function ThemeCanvas() {
  const {
    activeScreenId, selectedLayerId, resolution, resolutions,
    getActiveScreen, getEffectiveScheme,
    updateLayer, setSelectedLayerId,
  } = useThemeStore();

  const resolutionData = resolutions[resolution] || resolutions["640x480"];
  const { globalScheme, globalGlyphs } = resolutionData;
  const [canvasW, canvasH] = resolution.split("x").map(Number);

  const isGlobalMode = activeScreenId === GLOBAL_ID;
  const screen = getActiveScreen();
  const sc = isGlobalMode ? globalScheme : getEffectiveScheme(activeScreenId);
  const def = MUOS_SCREENS.find((d) => d.id === activeScreenId);

  const [activeSubAsset, setActiveSubAsset] = useState<string | null>("explore");
  const [canvasZoom, setCanvasZoom] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (selectedLayerId) {
        const { removeLayer } = useThemeStore.getState();
        removeLayer(activeScreenId, selectedLayerId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedLayerId, activeScreenId]);

  const activeSubAssetSrc = activeSubAsset
    ? screen.subAssets.find((sa) => sa.name === activeSubAsset)?.src ?? null
    : null;
  const canvasBackground = activeSubAssetSrc ?? screen.wallpaper ?? resolutionData.defaultWallpaper;

  return (
    <main className="col-span-7 bg-[#050505] relative flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "24px 24px" }} />

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

      <div className="flex-1 overflow-auto relative p-24 flex items-center justify-center custom-scrollbar" style={{ isolation: "isolate" }}>
        <div
          className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out overflow-hidden"
          style={{
            width: canvasW,
            height: canvasH,
            transform: `scale(${canvasZoom})`,
            transformOrigin: "center center",
            backgroundColor: hexToRgba(sc.BACKGROUND, sc.BACKGROUND_ALPHA),
            imageRendering: "pixelated",
            isolation: "isolate",
            position: "relative",
          }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedLayerId(null); }}
        >
          {/* 1. Background (via style above) */}
          {/* 2. Gradient Overlay */}
          <GradientOverlay sc={sc} />

          {/* 3 & 4. Wallpapers */}
          {canvasBackground && <img src={canvasBackground} alt="wallpaper" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[10]" draggable={false} />}
          
          {/* Content Visualization (Mock) */}
          <div
            className="absolute z-[20]"
            style={{
              top: (sc.HEADER_BACKGROUND_ALPHA > 0 ? sc.HEADER_HEIGHT : 0) + sc.CONTENT_PADDING_TOP,
              bottom: sc.FOOTER_BACKGROUND_ALPHA > 0 ? sc.FOOTER_HEIGHT : 0,
              left: sc.CONTENT_WIDTH > 0
                ? (sc.CONTENT_ALIGNMENT === 1 ? 0 : sc.CONTENT_ALIGNMENT === 3 ? canvasW - sc.CONTENT_WIDTH : (canvasW - sc.CONTENT_WIDTH) / 2)
                : sc.CONTENT_PADDING_LEFT,
              width: sc.CONTENT_WIDTH > 0 ? sc.CONTENT_WIDTH : undefined,
              right: sc.CONTENT_WIDTH > 0 ? undefined : 0,
            }}
          >
            <MockContentRenderer
              sc={sc}
              screen={screen}
              activeScreenId={activeScreenId}
              activeSubAsset={activeSubAsset}
              setActiveSubAsset={setActiveSubAsset}
            />
          </div>

          {/* 5. Static Image (Per-List Item Overlay normally, but can be underlying based on scheme... we'll use z-[30] so it overlays the content list background but sits under global overlay) */}
          {screen.staticImage && <img src={screen.staticImage} alt="static" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[30]" draggable={false} />}

          {/* 6. Global/Screen Overlay (Top-most before UI headers and custom draggable layers) */}
          {(screen.overlay || resolutionData.globalOverlay) && <img src={screen.overlay || resolutionData.globalOverlay || ""} alt="overlay" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[40]" draggable={false} />}

          <HeaderBar
            sc={sc}
            title={def?.label || (isGlobalMode ? "Global Scheme" : "")}
            globalGlyphs={globalGlyphs}
          />

          {/* Layers */}
          {screen.layers.sort((a, b) => a.zIndex - b.zIndex).map((l) => (
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

          <FooterBar sc={sc} globalGlyphs={globalGlyphs} />
        </div>
      </div>
    </main>
  );
}
