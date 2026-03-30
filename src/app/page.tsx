"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Download, Upload, MonitorSmartphone, Image as ImageIcon, LayoutTemplate, Palette } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useState, useRef } from "react";
import { exportTheme } from "@/utils/exportTheme";
import { importThemeFromZip } from "@/utils/importTheme";

export default function ThemeMakerStudio() {
  const { colors, list, setColors, setList } = useThemeStore();
  const [themeName, setThemeName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportTheme(themeName || "CustomTheme");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const success = await importThemeFromZip(file);
      if (success && file.name) {
        setThemeName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <MonitorSmartphone className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">muOS Theme Studio</h1>
            <p className="text-xs text-neutral-400">Design custom themes for your handheld</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Input 
            className="w-64 bg-neutral-900 border-neutral-800" 
            placeholder="Theme Name (e.g. Neon Nights)" 
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
          />

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".zip,.muxthm" 
            className="hidden" 
          />
          <Button 
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Import (.muxthm)
          </Button>

          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-neutral-950 font-semibold gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export (.muxthm)
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Properties */}
        <aside className="w-80 border-r border-neutral-800 bg-neutral-900/30 flex flex-col">
          <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-2">
            <Palette className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-semibold">Properties</h2>
          </div>
          
          <Tabs defaultValue="colors" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-neutral-800 bg-transparent p-0">
              <TabsTrigger value="colors" className="rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-neutral-800/50 px-4 py-3">Colors</TabsTrigger>
              <TabsTrigger value="layout" className="rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-neutral-800/50 px-4 py-3">Layout</TabsTrigger>
              <TabsTrigger value="fonts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-neutral-800/50 px-4 py-3">Typography</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1">
              <TabsContent value="colors" className="p-4 space-y-6 m-0 border-0">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Global Colors</h3>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">Background Color</Label>
                      <div className="flex gap-2">
                        <Input type="color" className="w-12 h-10 p-1 bg-neutral-900 border-neutral-700 rounded cursor-pointer" value={colors.background} onChange={(e) => setColors({ background: e.target.value })} />
                        <Input type="text" className="flex-1 font-mono text-sm bg-neutral-900 border-neutral-700" value={colors.background} onChange={(e) => setColors({ background: e.target.value })} />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">Primary Accent</Label>
                      <div className="flex gap-2">
                        <Input type="color" className="w-12 h-10 p-1 bg-neutral-900 border-neutral-700 rounded cursor-pointer" value={colors.primaryAccent} onChange={(e) => setColors({ primaryAccent: e.target.value })} />
                        <Input type="text" className="flex-1 font-mono text-sm bg-neutral-900 border-neutral-700" value={colors.primaryAccent} onChange={(e) => setColors({ primaryAccent: e.target.value })} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex justify-between">
                        <Label className="text-sm">Background Alpha</Label>
                        <span className="text-xs text-neutral-400">{colors.backgroundAlpha}</span>
                      </div>
                      <Slider value={[colors.backgroundAlpha]} onValueChange={(val) => setColors({ backgroundAlpha: Array.isArray(val) ? val[0] : (val as any) })} max={255} step={1} className="py-2" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-neutral-800" />
                
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">List View</h3>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">Text Color Active</Label>
                      <div className="flex gap-2">
                        <Input type="color" className="w-12 h-10 p-1 bg-neutral-900 border-neutral-700 rounded cursor-pointer" value={list.textColorActive} onChange={(e) => setList({ textColorActive: e.target.value })} />
                        <Input type="text" className="flex-1 font-mono text-sm bg-neutral-900 border-neutral-700" value={list.textColorActive} onChange={(e) => setList({ textColorActive: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">Text Color Inactive</Label>
                      <div className="flex gap-2">
                        <Input type="color" className="w-12 h-10 p-1 bg-neutral-900 border-neutral-700 rounded cursor-pointer" value={list.textColorInactive} onChange={(e) => setList({ textColorInactive: e.target.value })} />
                        <Input type="text" className="flex-1 font-mono text-sm bg-neutral-900 border-neutral-700" value={list.textColorInactive} onChange={(e) => setList({ textColorInactive: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Other tabs content left as placeholder for brevity */}
            </ScrollArea>
          </Tabs>
        </aside>

        {/* Center Canvas: Visual Preview */}
        <main className="flex-1 flex flex-col bg-neutral-950 p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex gap-2">
             <Button variant="outline" size="sm" className="bg-neutral-900 border-neutral-800 text-xs">
              Resolution: 640x480
             </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            {/* Simulation of Handheld Screen */}
            <div 
              className="relative shadow-2xl rounded-sm border border-neutral-800 overflow-hidden ring-4 ring-neutral-900"
              style={{ width: "640px", height: "480px", backgroundColor: colors.background }}
            >
              <div className="absolute inset-0 bg-black" style={{ opacity: 1 - (colors.backgroundAlpha / 255) }} />
              {/* muOS Mock UI Header */}
              <div className="absolute top-0 w-full h-12 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 border-b border-white/10 shrink-0 z-10">
                 <span className="text-white font-bold tracking-widest text-sm">muOS</span>
                 <span className="text-white/70 text-sm">12:34</span>
              </div>
              
              {/* muOS Mock UI Body */}
              <div className="absolute inset-x-0 top-12 bottom-0 flex flex-col p-4 gap-2 z-10">
                {["Applications", "Configuration", "Explore", "Information", "RetroArch"].map((item, idx) => (
                   <div 
                     key={idx} 
                     className={`px-4 py-3 rounded-md flex items-center gap-4 transition-colors`}
                     style={{
                       backgroundColor: idx === 1 ? `${colors.primaryAccent}33` : 'transparent',
                       color: idx === 1 ? colors.primaryAccent : list.textColorInactive,
                       border: idx === 1 ? `1px solid ${colors.primaryAccent}80` : '1px solid transparent',
                     }}
                   >
                     <LayoutTemplate className="w-5 h-5" style={{ color: idx === 1 ? colors.primaryAccent : list.textColorInactive }} />
                     <span className={`text-xl ${idx === 1 ? "font-bold" : "font-medium"}`}>{item}</span>
                   </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="h-12 flex items-center justify-center text-xs text-neutral-500">
            Live preview of scale 1:1. UI elements are simulated approximations.
          </div>
        </main>

        {/* Right Sidebar: Assets */}
        <aside className="w-72 border-l border-neutral-800 bg-neutral-900/30 flex flex-col">
           <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-semibold">Assets</h2>
          </div>
          <ScrollArea className="flex-1 p-4">
             <div className="space-y-6">
                
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Background (Wall)</h3>
                  <div className="aspect-video bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-neutral-500 transition-colors">
                     <ImageIcon className="w-6 h-6 text-neutral-500" />
                     <span className="text-xs text-neutral-400">Click to upload default.png</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Typography (Fonts)</h3>
                  <div className="h-16 bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neutral-500 transition-colors">
                     <span className="text-xs text-neutral-400">Upload primary.ttf</span>
                  </div>
                </div>

             </div>
          </ScrollArea>
        </aside>

      </div>
    </div>
  );
}
