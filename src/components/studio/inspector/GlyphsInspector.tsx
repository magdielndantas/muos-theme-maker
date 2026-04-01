"use client";

import { useThemeStore } from "@/store/themeStore";
import { MUOS_SCREENS } from "@/data/muosScreens";
import { GLOBAL_GLYPHS } from "@/data/muosGlyphs";
import { useRef, useState, useCallback } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export function GlyphsInspector() {
  const { activeScreenId, getActiveScreen, resolution, resolutions, setScreenGlyph, setGlobalGlyph } = useThemeStore();
  const resolutionData = resolutions[resolution] || resolutions["640x480"];
  const { globalGlyphs } = resolutionData;
  const screen = getActiveScreen();
  const def = MUOS_SCREENS.find((d) => d.id === activeScreenId);

  const [activeGlyph, setActiveGlyph] = useState<string | null>(null);
  const [activeGlyphCategory, setActiveGlyphCategory] = useState<"screen" | "header" | "footer" | "bar">("screen");
  const glyphInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-4">
      <input ref={glyphInputRef} type="file" className="hidden" accept="image/png" onChange={handleGlyphUpload} />
      <Accordion className="space-y-2">
        <AccordionItem value="global" className="border-white/5 border rounded-lg bg-white/[0.02] overflow-hidden">
          <AccordionTrigger className="px-4 py-3 text-[10px] font-bold text-white/50 hover:no-underline hover:text-white uppercase tracking-widest">Global Assets</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-6">
            {(["header", "footer", "bar"] as const).map(cat => (
              <div key={cat} className="space-y-3">
                <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{cat}</div>
                <div className="grid grid-cols-3 gap-2">
                  {GLOBAL_GLYPHS[cat].map(g => {
                    const src = globalGlyphs[cat][g.name as keyof typeof globalGlyphs[typeof cat]];
                    return (
                      <div
                        key={g.name}
                        onClick={() => { setActiveGlyph(g.name); setActiveGlyphCategory(cat); glyphInputRef.current?.click(); }}
                        className={`aspect-square rounded-lg bg-black/40 border transition-all flex flex-col items-center justify-center cursor-pointer group p-1 ${activeGlyph === g.name && activeGlyphCategory === cat ? "border-[#eab308] ring-1 ring-[#eab308]/20" : "border-white/5 hover:border-white/20"}`}
                      >
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
                    <div
                      key={g.name}
                      onClick={() => { setActiveGlyph(g.name); setActiveGlyphCategory("screen"); glyphInputRef.current?.click(); }}
                      className={`aspect-square rounded-lg bg-black/40 border transition-all flex flex-col items-center justify-center cursor-pointer group p-1 ${activeGlyph === g.name && activeGlyphCategory === "screen" ? "border-[#eab308] ring-1 ring-[#eab308]/20" : "border-white/5 hover:border-white/20"}`}
                    >
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
    </div>
  );
}
