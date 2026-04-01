"use client";

import { useThemeStore, ScreenContext } from "@/store/themeStore";
import { MUOS_SCREENS, MuosScreenDef } from "@/data/muosScreens";
import { useRef, useState, useCallback } from "react";
import {
  Image as ImageIcon, Upload, CheckCircle2, Trash2, Plus, Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function AssetsInspector() {
  const {
    activeScreenId, getActiveScreen, resolution, resolutions,
    setScreenWallpaper, setScreenOverlay, setScreenSubAsset,
    setScreenStaticImage, addLayer, removeLayer, setSelectedLayerId,
    selectedLayerId, setDefaultWallpaper, setBootLogo, setPreviewImage,
    setFont, setSound,
  } = useThemeStore();

  const isGlobalMode = activeScreenId === "__global__";
  const resolutionData = resolutions[resolution] || resolutions["640x480"];
  const { defaultWallpaper, bootLogo, previewImage, fonts, sounds } = resolutionData;
  const screen = getActiveScreen();
  const def = MUOS_SCREENS.find((d) => d.id === activeScreenId);

  const [activeSubAsset, setActiveSubAsset] = useState<string | null>(
    def?.hasSubAssets && def.subAssets?.length ? def.subAssets[0].name : null
  );
  const [activeFontSlot, setActiveFontSlot] = useState<"default" | "header" | "footer" | "panel">("default");

  const wallInputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const subAssetInputRef = useRef<HTMLInputElement>(null);
  const staticImageInputRef = useRef<HTMLInputElement>(null);
  const layerInputRef = useRef<HTMLInputElement>(null);
  const defaultWallInputRef = useRef<HTMLInputElement>(null);
  const bootLogoInputRef = useRef<HTMLInputElement>(null);
  const previewInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const soundInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-6">
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
      <input ref={defaultWallInputRef} type="file" className="hidden" accept="image/*" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setDefaultWallpaper(await readFileAsDataURL(file));
        e.target.value = "";
      }} />
      <input ref={bootLogoInputRef} type="file" className="hidden" accept=".bmp,.png,image/bmp,image/png" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBootLogo(await readFileAsDataURL(file));
        e.target.value = "";
      }} />
      <input ref={previewInputRef} type="file" className="hidden" accept="image/*" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreviewImage(await readFileAsDataURL(file));
        e.target.value = "";
      }} />
      <input ref={fontInputRef} type="file" className="hidden" accept=".bin" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFont(activeFontSlot, await readFileAsDataURL(file));
        e.target.value = "";
      }} />
      <input ref={soundInputRef} type="file" className="hidden" accept=".wav,.mp3,.ogg,audio/wav,audio/mpeg,audio/ogg" multiple onChange={async (e) => {
        const files = e.target.files;
        if (!files) return;
        for (const file of Array.from(files)) {
          const src = await readFileAsDataURL(file);
          const name = file.name.replace(/\.[^/.]+$/, "");
          setSound(name, src);
        }
        e.target.value = "";
      }} />

      {/* Wallpaper */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            Wallpaper {activeSubAsset ? `(${activeSubAsset})` : ""}
          </p>
          {(activeSubAsset ? screen.subAssets.find(sa => sa.name === activeSubAsset)?.src : screen.wallpaper) && (
            <Button variant="ghost" size="icon" onClick={() => activeSubAsset ? setScreenSubAsset(activeScreenId, activeSubAsset, null) : setScreenWallpaper(activeScreenId, null)} className="h-6 w-6 text-red-400/50 hover:text-red-400">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
        <div
          onClick={() => activeSubAsset ? subAssetInputRef.current?.click() : wallInputRef.current?.click()}
          className="aspect-video bg-white/5 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.08] hover:border-[#eab308]/30 transition-all group overflow-hidden"
        >
          {(activeSubAsset ? screen.subAssets.find(sa => sa.name === activeSubAsset)?.src : screen.wallpaper) ? (
            <img src={(activeSubAsset ? screen.subAssets.find(sa => sa.name === activeSubAsset)?.src : screen.wallpaper) || ""} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-6 h-6 text-white/10 group-hover:text-white/30" />
              <span className="text-[10px] font-bold text-white/20 group-hover:text-white/40">Upload {activeSubAsset || "Wallpaper"}</span>
            </div>
          )}
        </div>
      </section>

      {/* Sub-Assets */}
      {def?.hasSubAssets && def.subAssets && (
        <section className="space-y-3">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Menu Items / Sub-Assets</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost" size="sm"
              onClick={() => setActiveSubAsset(null)}
              className={`h-9 justify-start px-3 text-[10px] uppercase font-bold tracking-wider ${!activeSubAsset ? "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              Base Wall
            </Button>
            {def.subAssets.map(sub => (
              <Button
                key={sub.name} variant="ghost" size="sm"
                onClick={() => setActiveSubAsset(sub.name)}
                className={`h-9 justify-between px-3 text-[10px] uppercase font-bold tracking-wider ${activeSubAsset === sub.name ? "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20" : "text-white/40 hover:text-white hover:bg-white/5"}`}
              >
                <span className="truncate">{sub.label}</span>
                {screen.subAssets.find(sa => sa.name === sub.name)?.src && <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* Static Image */}
      <section className="space-y-3">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Static Image Interface</p>
        <div onClick={() => staticImageInputRef.current?.click()} className="h-14 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.08] transition-all group px-4">
          {screen.staticImage ? (
            <div className="flex items-center gap-2 w-full">
              <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
              <span className="text-[10px] font-bold text-green-500/80 uppercase truncate">Interface Image Loaded</span>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setScreenStaticImage(activeScreenId, null); }} className="ml-auto h-6 w-6 text-red-400/50 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          ) : (<><Upload className="w-4 h-4 text-white/10 group-hover:text-white/30" /><span className="text-[10px] font-bold text-white/20 group-hover:text-white/40 uppercase">Select static interface layer</span></>)}
        </div>
      </section>

      {/* Layers */}
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

      {/* Global-only: Theme Files */}
      {isGlobalMode && (
        <section className="space-y-4 border-t border-white/5 pt-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Theme Files</p>

          {/* Default Wallpaper */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em]">Default Wallpaper</p>
              {defaultWallpaper && <Button variant="ghost" size="icon" onClick={() => setDefaultWallpaper(null)} className="h-5 w-5 text-red-400/50 hover:text-red-400"><Trash2 className="w-3 h-3" /></Button>}
            </div>
            <div onClick={() => defaultWallInputRef.current?.click()} className="h-10 bg-white/5 rounded-lg border border-dashed border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.08] transition-all group px-3">
              {defaultWallpaper ? (<><div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-green-500" /></div><span className="text-[9px] font-bold text-green-500/80 uppercase truncate flex-1">Wallpaper loaded</span></>) : (<><Upload className="w-3.5 h-3.5 text-white/10 group-hover:text-white/30" /><span className="text-[9px] font-bold text-white/20 group-hover:text-white/40 uppercase">Wallpaper aplicado a telas sem wallpaper próprio</span></>)}
            </div>
          </div>

          {/* Boot Logo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em]">Boot Logo</p>
              {bootLogo && <Button variant="ghost" size="icon" onClick={() => setBootLogo(null)} className="h-5 w-5 text-red-400/50 hover:text-red-400"><Trash2 className="w-3 h-3" /></Button>}
            </div>
            <div onClick={() => bootLogoInputRef.current?.click()} className="h-10 bg-white/5 rounded-lg border border-dashed border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.08] transition-all group px-3">
              {bootLogo ? (<><div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-green-500" /></div><span className="text-[9px] font-bold text-green-500/80 uppercase truncate flex-1">Boot logo loaded</span></>) : (<><Upload className="w-3.5 h-3.5 text-white/10 group-hover:text-white/30" /><span className="text-[9px] font-bold text-white/20 group-hover:text-white/40 uppercase">Exportado como bootlogo.bmp</span></>)}
            </div>
          </div>

          {/* Preview Image */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em]">Preview Image</p>
              {previewImage && <Button variant="ghost" size="icon" onClick={() => setPreviewImage(null)} className="h-5 w-5 text-red-400/50 hover:text-red-400"><Trash2 className="w-3 h-3" /></Button>}
            </div>
            <div onClick={() => previewInputRef.current?.click()} className="h-10 bg-white/5 rounded-lg border border-dashed border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.08] transition-all group px-3">
              {previewImage ? (<><div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-green-500" /></div><span className="text-[9px] font-bold text-green-500/80 uppercase truncate flex-1">Preview loaded</span></>) : (<><Upload className="w-3.5 h-3.5 text-white/10 group-hover:text-white/30" /><span className="text-[9px] font-bold text-white/20 group-hover:text-white/40 uppercase">Imagem de preview para distribuição</span></>)}
            </div>
          </div>

          {/* Fonts */}
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em]">Fonts (.bin)</p>
            <div className="grid grid-cols-2 gap-1.5">
              {(["default", "header", "footer", "panel"] as const).map(slot => (
                <Button key={slot} variant="ghost" size="sm" onClick={() => { setActiveFontSlot(slot); fontInputRef.current?.click(); }} className={`h-8 justify-between px-2 text-[9px] uppercase font-bold tracking-wider ${fonts[slot] ? "bg-green-500/10 text-green-500/80 border border-green-500/20" : "text-white/30 hover:text-white bg-white/[0.02] border border-white/5 hover:bg-white/5"}`}>
                  <span>{slot}</span>
                  {fonts[slot] ? <CheckCircle2 className="w-3 h-3" /> : <Upload className="w-3 h-3 opacity-40" />}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {(["default", "header", "footer", "panel"] as const).filter(s => fonts[s]).map(slot => (
                <button key={slot} onClick={() => setFont(slot, null)} className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/10 text-[8px] font-bold text-red-400/60 hover:text-red-400 uppercase">
                  <Trash2 className="w-2.5 h-2.5" />{slot}
                </button>
              ))}
            </div>
          </div>

          {/* Sounds */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em]">Sounds</p>
              <Button variant="ghost" size="icon" onClick={() => soundInputRef.current?.click()} className="h-5 w-5 bg-white/5 hover:bg-[#eab308]/10 hover:text-[#eab308]"><Plus className="w-3 h-3" /></Button>
            </div>
            <div className="space-y-1">
              {Object.entries(sounds).filter(([, src]) => src).map(([name]) => (
                <div key={name} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#eab308]/10 flex items-center justify-center"><Film className="w-2.5 h-2.5 text-[#eab308]/60" /></div>
                    <span className="text-[9px] font-bold text-white/40 uppercase truncate">{name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSound(name, null)} className="h-5 w-5 text-red-400/40 hover:text-red-400 hover:bg-red-400/10"><Trash2 className="w-2.5 h-2.5" /></Button>
                </div>
              ))}
              {Object.values(sounds).every(s => !s) && (
                <div onClick={() => soundInputRef.current?.click()} className="h-10 bg-white/5 rounded-lg border border-dashed border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.08] transition-all group px-3">
                  <Upload className="w-3.5 h-3.5 text-white/10 group-hover:text-white/30" />
                  <span className="text-[9px] font-bold text-white/20 group-hover:text-white/40 uppercase">Upload .wav / .mp3 / .ogg</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
