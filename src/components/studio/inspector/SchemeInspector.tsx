"use client";

import { useThemeStore, ScreenScheme } from "@/store/themeStore";
import { SCHEME_GROUPS } from "@/data/schemeGroups";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SchemeInspectorProps {
  isGlobalMode: boolean;
  handleSchemeChange: (updates: Partial<ScreenScheme>) => void;
}

export function SchemeInspector({ isGlobalMode, handleSchemeChange }: SchemeInspectorProps) {
  const { activeScreenId, getActiveScreen, getEffectiveScheme, resolution, resolutions } = useThemeStore();
  const resolutionData = resolutions[resolution] || resolutions["640x480"];
  const { globalScheme } = resolutionData;
  const screen = getActiveScreen();
  const sc = isGlobalMode ? globalScheme : getEffectiveScheme(activeScreenId);

  return (
    <Accordion className="space-y-2">
      {SCHEME_GROUPS.map((group) => (
        <AccordionItem value={group.id} key={group.id} className="border-white/5 border rounded-lg bg-white/[0.02] overflow-hidden">
          <AccordionTrigger className="px-4 py-3 text-[10px] font-bold text-white/50 hover:no-underline hover:text-white uppercase tracking-widest transition-colors">
            {group.title}
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-4">
            {group.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <div className="flex justify-between items-center group/item">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{field.label}</Label>
                    {!isGlobalMode && screen.scheme[field.key] !== undefined && screen.scheme[field.key] !== globalScheme[field.key] && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-[#eab308]" title="Overridden" />
                        <button
                          onClick={() => handleSchemeChange({ [field.key]: undefined })}
                          className="hidden group-hover/item:block text-[8px] text-white/20 hover:text-white/60 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-white/40">{sc[field.key]}</span>
                </div>
                {field.type === "color" ? (
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={`#${sc[field.key] as string}`}
                      onChange={(e) => handleSchemeChange({ [field.key]: e.target.value.slice(1).toUpperCase() })}
                      className="w-full h-8 p-0 border-none bg-transparent cursor-pointer"
                    />
                    <Input
                      value={sc[field.key] as string}
                      onChange={(e) => handleSchemeChange({ [field.key]: e.target.value.toUpperCase() })}
                      className="w-20 h-8 !bg-black/40 !border-white/10 font-mono text-[10px] text-center"
                      maxLength={6}
                    />
                  </div>
                ) : (
                  <Slider
                    value={[Number(sc[field.key])]}
                    min={field.min ?? 0}
                    max={field.max ?? (field.type === "alpha" ? 255 : 100)}
                    onValueChange={(v) => {
                      const first = Array.isArray(v) ? v[0] : v;
                      handleSchemeChange({ [field.key]: first });
                    }}
                  />
                )}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
