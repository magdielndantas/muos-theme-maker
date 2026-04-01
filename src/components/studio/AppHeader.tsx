"use client";

import { useThemeStore } from "@/store/themeStore";
import { exportTheme } from "@/utils/exportTheme";
import { importThemeFromZip } from "@/utils/importTheme";
import { Download, Upload, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useCallback, useEffect } from "react";
import type { ToastType } from "./ToastNotification";

interface AppHeaderProps {
  showToast: (message: string, kind: "success" | "error") => void;
}

const RESOLUTIONS = [
  "320x240", "480x272", "480x320", "640x480",
  "720x480", "720x576", "720x720", "854x480",
  "1024x768", "1280x720",
];

export function AppHeader({ showToast }: AppHeaderProps) {
  const { themeName, setThemeName, resolution, setResolution, cloneResolution } = useThemeStore();
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = await importThemeFromZip(file);
    if (ok && file.name) {
      setThemeName(file.name.replace(/\.[^/.]+$/, ""));
      const state = useThemeStore.getState();
      const res = state.resolutions[state.resolution];
      const hasDefWall = !!res.defaultWallpaper;
      const mlWall = !!res.screens.find(s => s.id === "muxlaunch")?.wallpaper;
      const glyphCount = res.screens.reduce((acc, s) => acc + s.glyphs.filter(g => g.src).length, 0);
      showToast(`Tema importado! DefWall:${hasDefWall} MLWall:${mlWall} Glyphs:${glyphCount}`, "success");
    } else if (!ok) {
      showToast("Erro ao importar tema.", "error");
    }
    e.target.value = "";
  }, [setThemeName, showToast]);

  const handleExport = useCallback(async () => {
    try {
      await exportTheme(themeName || "MyTheme");
      showToast("Tema exportado com sucesso!", "success");
    } catch {
      showToast("Erro ao exportar tema.", "error");
    }
  }, [themeName, showToast]);

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-[#131313] border-b border-white/5 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#eab308] flex items-center justify-center shadow-lg shadow-[#eab308]/10">
          <Monitor className="w-4 h-4 text-[#0e0e0e]" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            muOS Theme Studio
          </h1>
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

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2.5 h-8">
          <Monitor className="w-3.5 h-3.5 text-white/20" />
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="bg-transparent text-[11px] font-medium text-white/50 outline-none cursor-pointer hover:text-white transition-colors"
          >
            {RESOLUTIONS.map((res) => (
              <option key={res} value={res} className="bg-[#0f0f0f] text-white/80">
                {res}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (resolution !== "640x480") {
                cloneResolution("640x480", resolution);
              }
            }}
            className="h-6 px-1.5 text-[9px] font-bold text-[#eab308]/40 hover:text-[#eab308] hover:bg-[#eab308]/5"
            title="Clone contents from 640x480 to current"
          >
            CLONE BASE
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => importInputRef.current?.click()}
            className="text-white/40 hover:text-white hover:bg-white/5 text-[11px] h-8 px-3"
          >
            <Upload className="w-3.5 h-3.5 mr-2" />
            Import
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            className="font-bold text-[11px] h-8 px-4 rounded-md shadow-lg shadow-[#eab308]/5"
            style={{ background: "linear-gradient(135deg,#fdc425,#e7b102)", color: "#3a2900" }}
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            Package .muxthm
          </Button>
        </div>
        <input
          ref={importInputRef}
          type="file"
          className="hidden"
          accept=".muxthm,.zip"
          onChange={handleImport}
        />
      </div>
    </header>
  );
}
