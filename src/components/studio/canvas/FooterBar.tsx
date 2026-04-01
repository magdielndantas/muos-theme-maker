"use client";

import { ScreenScheme } from "@/store/themeStore";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;
}

interface FooterBarProps {
  sc: ScreenScheme;
  globalGlyphs: {
    footer: Record<string, string | null>;
  };
}

export function FooterBar({ sc, globalGlyphs }: FooterBarProps) {
  if (sc.FOOTER_BACKGROUND_ALPHA <= 0) return null;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-[50]"
      style={{
        height: sc.FOOTER_HEIGHT,
        backgroundColor: hexToRgba(sc.FOOTER_BACKGROUND, sc.FOOTER_BACKGROUND_ALPHA),
      }}
    >
      <div
        className={`flex items-center h-full px-4 ${
          sc.NAVIGATION_ALIGNMENT === 1
            ? "justify-center gap-10"
            : sc.NAVIGATION_ALIGNMENT === 2
              ? "justify-end gap-6"
              : "justify-start gap-6"
        }`}
        style={{
          color: `#${sc.FOOTER_TEXT}`,
          opacity: sc.FOOTER_TEXT_ALPHA / 255,
          paddingTop: sc.FONT_FOOTER_PAD_TOP,
          paddingBottom: sc.FONT_FOOTER_PAD_BOTTOM,
        }}
      >
        <div className="flex items-center" style={{ gap: sc.NAV_SPACING || 5 }}>
          {globalGlyphs.footer["cancel"] ? (
            <img 
              src={globalGlyphs.footer["cancel"]!} 
              className="h-4 object-contain" 
              alt="back" 
              style={{ opacity: sc.NAV_B_GLYPH_ALPHA / 255 }}
            />
          ) : (
            <span
              className="text-[9px] font-bold bg-[#dc2626] text-white w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white/10"
              style={{ 
                color: `#${sc.NAV_B_TEXT}`,
                opacity: sc.NAV_B_GLYPH_ALPHA / 255 
              }}
            >
              B
            </span>
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ 
              color: `#${sc.NAV_B_TEXT}`,
              opacity: sc.NAV_B_TEXT_ALPHA / 255 
            }}
          >
            Back
          </span>
        </div>
        <div className="flex items-center" style={{ gap: sc.NAV_SPACING || 5 }}>
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ 
              color: `#${sc.NAV_A_TEXT}`,
              opacity: sc.NAV_A_TEXT_ALPHA / 255 
            }}
          >
            Select
          </span>
          {globalGlyphs.footer["confirm"] ? (
            <img
              src={globalGlyphs.footer["confirm"]!}
              className="h-4 object-contain"
              alt="select"
              style={{ opacity: sc.NAV_A_GLYPH_ALPHA / 255 }}
            />
          ) : (
            <span
              className="text-[9px] font-bold bg-[#16a34a] text-white w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white/10"
              style={{ 
                color: `#${sc.NAV_A_TEXT}`,
                opacity: sc.NAV_A_GLYPH_ALPHA / 255 
              }}
            >
              A
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
