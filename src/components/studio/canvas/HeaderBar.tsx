"use client";

import { ScreenScheme } from "@/store/themeStore";
import { Wifi } from "lucide-react";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;
}

interface HeaderBarProps {
  sc: ScreenScheme;
  title: string;
  globalGlyphs: {
    header: Record<string, string | null>;
  };
}

export function HeaderBar({ sc, title, globalGlyphs }: HeaderBarProps) {


  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-center overflow-hidden z-[50]"
      style={{
        height: sc.HEADER_HEIGHT,
        backgroundColor: hexToRgba(sc.HEADER_BACKGROUND, sc.HEADER_BACKGROUND_ALPHA),
      }}
    >
      {/* Title */}
      <div
        className={`${
          sc.HEADER_TEXT_ALIGN === 2
            ? "absolute inset-0 flex justify-center"
            : sc.HEADER_TEXT_ALIGN === 3
              ? "ml-auto"
              : "shrink-0"
        } flex items-center gap-1.5 overflow-hidden`}
        style={{
          paddingLeft: sc.HEADER_PADDING_LEFT,
          paddingRight: sc.HEADER_PADDING_RIGHT,
          paddingTop: sc.FONT_HEADER_PAD_TOP,
          paddingBottom: sc.FONT_HEADER_PAD_BOTTOM,
          color: `#${sc.HEADER_TEXT}`,
          opacity: sc.HEADER_TEXT_ALPHA / 255,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <span className="text-[11px] font-bold tracking-tight uppercase leading-none truncate">
          {title}
        </span>
      </div>

      {/* Clock */}
      <div
        className={`${
          Number(sc.DATETIME_ALIGN) === 2
            ? "absolute inset-0 flex justify-center"
            : Number(sc.DATETIME_ALIGN) === 3
              ? "ml-auto"
              : ""
        } flex items-center overflow-hidden`}
        style={{
          paddingLeft: Number(sc.DATETIME_PADDING_LEFT),
          paddingRight: Number(sc.DATETIME_PADDING_RIGHT),
          paddingTop: sc.FONT_HEADER_PAD_TOP,
          paddingBottom: sc.FONT_HEADER_PAD_BOTTOM,
          color: `#${sc.DATETIME_TEXT}`,
          opacity: sc.DATETIME_ALPHA / 255,
        }}
      >
        <span className="text-[11px] font-mono font-bold tracking-widest leading-none">
          12:34
        </span>
      </div>

      {/* Status (Wifi/Battery) */}
      <div
        className={`${
          sc.STATUS_ALIGN === 0
            ? "mr-auto"
            : sc.STATUS_ALIGN === 2
              ? "mx-auto"
              : "ml-auto"
        } flex items-center gap-3 shrink-0`}
        style={{
          paddingRight: sc.STATUS_PADDING_RIGHT,
          paddingLeft: sc.STATUS_PADDING_LEFT,
          paddingTop: sc.FONT_HEADER_ICON_PAD_TOP,
          paddingBottom: sc.FONT_HEADER_ICON_PAD_BOTTOM,
        }}
      >
        {globalGlyphs.header["network_normal"] ? (
          <img
            src={globalGlyphs.header["network_normal"]!}
            className="h-4 object-contain"
            alt="wifi"
            style={{ opacity: sc.NETWORK_NORMAL_ALPHA / 255 }}
          />
        ) : (
          <Wifi
            className="w-3.5 h-3.5"
            style={{ color: `#${sc.NETWORK_NORMAL}`, opacity: sc.NETWORK_NORMAL_ALPHA / 255 }}
          />
        )}

        {globalGlyphs.header["capacity_100"] ? (
          <img
            src={globalGlyphs.header["capacity_100"]!}
            className="h-4 object-contain"
            alt="battery"
            style={{ opacity: sc.BATTERY_NORMAL_ALPHA / 255 }}
          />
        ) : (
          <div
            className="w-6 h-3 rounded-[1px] border relative"
            style={{
              borderColor: `#${sc.BATTERY_NORMAL}`,
              opacity: sc.BATTERY_NORMAL_ALPHA / 255,
            }}
          >
            <div
              className="absolute left-[1px] top-[1px] bottom-[1px]"
              style={{ width: "65%", backgroundColor: `#${sc.BATTERY_NORMAL}` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
