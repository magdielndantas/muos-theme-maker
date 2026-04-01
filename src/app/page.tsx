"use client";

import { useThemeStore, ScreenScheme } from "@/store/themeStore";
import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastNotification, ToastType } from "@/components/studio/ToastNotification";
import { AppHeader } from "@/components/studio/AppHeader";
import { ScreenSidebar } from "@/components/studio/ScreenSidebar";
import { ThemeCanvas } from "@/components/studio/ThemeCanvas";
import { SchemeInspector } from "@/components/studio/inspector/SchemeInspector";
import { AssetsInspector } from "@/components/studio/inspector/AssetsInspector";
import { GlyphsInspector } from "@/components/studio/inspector/GlyphsInspector";

const GLOBAL_ID = "__global__";

export default function ThemeMakerStudio() {
  const { activeScreenId, setGlobalScheme, updateScreenScheme } = useThemeStore();

  const isGlobalMode = activeScreenId === GLOBAL_ID;

  // Toast notification
  const [toast, setToast] = useState<ToastType>(null);
  const showToast = useCallback((message: string, kind: "success" | "error") => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSchemeChange = (updates: Partial<ScreenScheme>) => {
    if (isGlobalMode) {
      setGlobalScheme(updates);
    } else {
      updateScreenScheme(activeScreenId, updates);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0e0e0e] text-white overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AppHeader showToast={showToast} />
      <ToastNotification toast={toast} />

      {/* Body */}
      <div className="grid grid-cols-12 flex-1 overflow-hidden">
        <ScreenSidebar />
        <ThemeCanvas />

        {/* Inspector */}
        <aside className="col-span-3 bg-[#0a0a0a] border-l border-white/5 flex flex-col overflow-hidden">
          <Tabs defaultValue="scheme" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3 bg-[#0d0d0d] border-b border-white/5 h-11 shrink-0 p-0 rounded-none">
              <TabsTrigger value="scheme" className="text-[10px] uppercase font-bold tracking-widest rounded-none h-full text-white/60 data-[state=active]:bg-white/5 data-[state=active]:text-[#eab308] border-b-2 border-transparent data-[state=active]:border-[#eab308] hover:text-white/80 transition-colors">Scheme</TabsTrigger>
              <TabsTrigger value="assets" className="text-[10px] uppercase font-bold tracking-widest rounded-none h-full text-white/60 data-[state=active]:bg-white/5 data-[state=active]:text-[#eab308] border-b-2 border-transparent data-[state=active]:border-[#eab308] hover:text-white/80 transition-colors">Assets</TabsTrigger>
              <TabsTrigger value="glyphs" className="text-[10px] uppercase font-bold tracking-widest rounded-none h-full text-white/60 data-[state=active]:bg-white/5 data-[state=active]:text-[#eab308] border-b-2 border-transparent data-[state=active]:border-[#eab308] hover:text-white/80 transition-colors">Glyphs</TabsTrigger>
            </TabsList>

            <TabsContent value="scheme" className="flex-1 overflow-y-auto m-0 outline-none p-4 custom-scrollbar">
              <SchemeInspector isGlobalMode={isGlobalMode} handleSchemeChange={handleSchemeChange} />
            </TabsContent>

            <TabsContent value="assets" className="flex-1 overflow-y-auto m-0 outline-none p-4 custom-scrollbar">
              <AssetsInspector />
            </TabsContent>

            <TabsContent value="glyphs" className="flex-1 overflow-y-auto m-0 outline-none p-4 custom-scrollbar">
              <GlyphsInspector />
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
