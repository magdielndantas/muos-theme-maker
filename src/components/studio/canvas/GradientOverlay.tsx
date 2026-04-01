"use client";

import { ScreenScheme } from "@/store/themeStore";

interface GradientOverlayProps {
  sc: ScreenScheme;
}

export function GradientOverlay({ sc }: GradientOverlayProps) {
  if (sc.BACKGROUND_GRADIENT_DIRECTION <= 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[2]"
      style={{
        background:
          sc.BACKGROUND_GRADIENT_DIRECTION === 1
            ? `linear-gradient(180deg, transparent ${(sc.BACKGROUND_GRADIENT_START / 255) * 100}%, #${sc.BACKGROUND_GRADIENT_COLOR} ${(sc.BACKGROUND_GRADIENT_STOP / 255) * 100}%)`
            : `linear-gradient(90deg, transparent ${(sc.BACKGROUND_GRADIENT_START / 255) * 100}%, #${sc.BACKGROUND_GRADIENT_COLOR} ${(sc.BACKGROUND_GRADIENT_STOP / 255) * 100}%)`,
      }}
    />
  );
}
