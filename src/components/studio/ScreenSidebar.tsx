"use client";

import { useThemeStore } from "@/store/themeStore";
import { MUOS_SCREENS, CATEGORY_ORDER, CATEGORY_LABELS } from "@/data/muosScreens";
import { ChevronRight, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const GLOBAL_ID = "__global__";

export function ScreenSidebar() {
  const { activeScreenId, setActiveScreenId, resolution, resolutions } = useThemeStore();

  const resolutionData = resolutions[resolution] || resolutions["640x480"];
  const { screens } = resolutionData;

  const screenHasContent = (id: string) => {
    const s = screens.find((sc) => sc.id === id);
    if (!s) return false;
    return !!(s.wallpaper || s.subAssets.some((sa) => sa.src) || s.layers.length);
  };

  return (
    <aside className="col-span-2 bg-[#0a0a0a] border-r border-white/5 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto py-3 space-y-4 custom-scrollbar">
        <div className="px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveScreenId(GLOBAL_ID)}
            className={`w-full justify-start gap-3 h-10 px-3 rounded-lg border border-transparent transition-all ${
              activeScreenId === GLOBAL_ID
                ? "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-semibold">Global Scheme</span>
          </Button>
        </div>

        {CATEGORY_ORDER.map((cat) => (
          <div key={cat} className="space-y-1">
            <div className="px-5 py-2 flex items-center gap-2">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                {CATEGORY_LABELS[cat]}
              </div>
            </div>
            <div className="px-2 space-y-0.5">
              {MUOS_SCREENS.filter((s) => s.category === cat).map((s) => {
                const active = s.id === activeScreenId;
                const hasContent = screenHasContent(s.id);
                return (
                  <Button
                    key={s.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveScreenId(s.id)}
                    className={`w-full justify-between h-9 px-3 rounded-md group transition-all ${
                      active
                        ? "bg-[#eab308]/10 text-[#eab308]"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-[11px] truncate font-medium">{s.label}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasContent && (
                        <CheckCircle2
                          className={`w-3 h-3 ${
                            active
                              ? "text-[#eab308]"
                              : "text-green-500/40 group-hover:text-green-500/60"
                          }`}
                        />
                      )}
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
  );
}
