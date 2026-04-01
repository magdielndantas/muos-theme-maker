"use client";

import { ScreenScheme, ScreenContext } from "@/store/themeStore";
import { MUOS_SCREENS } from "@/data/muosScreens";
import { Gamepad2, Cpu } from "lucide-react";

interface MockContentRendererProps {
  sc: ScreenScheme;
  screen: ScreenContext;
  activeScreenId: string;
  activeSubAsset: string | null;
  setActiveSubAsset: (val: string | null) => void;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;
}

export function MockContentRenderer({ sc, screen, activeScreenId, activeSubAsset, setActiveSubAsset }: MockContentRendererProps) {
  const getGlyphSrc = (name: string) => screen.glyphs.find((g) => g.name === name)?.src;
  const screenDef = MUOS_SCREENS.find((s) => s.id === activeScreenId);
  if (!screenDef) return null;

  // muxlaunch — Main Menu items
  if (screenDef.id === "muxlaunch") {
    const launchItems = [
      { id: "explore", label: "Explore Content" },
      { id: "collection", label: "Collection" },
      { id: "history", label: "History" },
      { id: "apps", label: "Applications" },
      { id: "info", label: "Information" },
      { id: "config", label: "Configuration" },
      { id: "reboot", label: "Reboot" },
      { id: "shutdown", label: "Shutdown" },
    ];

    if (Number(sc.GRID_ACTIVE) === 1) {
      return (
        <div 
          className="grid h-full w-full content-start"
          style={{
            gridTemplateColumns: `repeat(${sc.GRID_COLUMN_COUNT || 3}, minmax(0, 1fr))`,
            columnGap: sc.GRID_COLUMN_PADDING,
            rowGap: sc.GRID_ROW_PADDING,
            paddingLeft: sc.CONTENT_PADDING_LEFT || 40,
            paddingTop: sc.CONTENT_PADDING_TOP || 80,
            paddingRight: sc.CONTENT_PADDING_LEFT || 40,
          }}
        >
          {launchItems.slice(0, (sc.GRID_COLUMN_COUNT || 3) * 2).map((item) => {
            const isActive = activeSubAsset === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveSubAsset(item.id)}
                className="flex flex-col items-center gap-3 cursor-pointer transition-all duration-200"
                style={{
                  borderRadius: sc.CELL_RADIUS,
                  width: sc.GRID_COLUMN_WIDTH || "auto",
                  height: sc.GRID_ROW_HEIGHT || "auto",
                  backgroundColor: hexToRgba(
                    isActive ? sc.CELL_FOCUS_BACKGROUND : sc.CELL_DEFAULT_BACKGROUND,
                    isActive ? sc.CELL_FOCUS_BACKGROUND_ALPHA : sc.CELL_DEFAULT_BACKGROUND_ALPHA
                  ),
                  border: `${sc.CELL_BORDER_WIDTH}px solid ${hexToRgba(
                    isActive ? sc.CELL_FOCUS_IMAGE_RECOLOUR : sc.CELL_DEFAULT_IMAGE_RECOLOUR,
                    isActive ? sc.CELL_FOCUS_BORDER_ALPHA : sc.CELL_DEFAULT_BORDER_ALPHA
                  )}`,
                  padding: sc.CELL_IMAGE_PADDING_TOP,
                }}
              >
                <div className="w-16 h-16 flex items-center justify-center p-2">
                  {getGlyphSrc(item.id) ? (
                    <img
                      src={getGlyphSrc(item.id)!}
                      className="w-full h-full object-contain"
                      style={{ 
                        opacity: (isActive ? sc.CELL_FOCUS_IMAGE_ALPHA : sc.CELL_DEFAULT_IMAGE_ALPHA) / 255,
                        filter: isActive && sc.CELL_FOCUS_IMAGE_RECOLOUR_ALPHA > 0 ? `drop-shadow(0 0 2px #${sc.CELL_FOCUS_IMAGE_RECOLOUR})` : "none"
                      }}
                    />
                  ) : (
                    <Gamepad2 className="w-8 h-8 text-white/10" />
                  )}
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest text-center truncate w-full px-2"
                  style={{
                    color: `#${isActive ? sc.CELL_FOCUS_TEXT : sc.CELL_DEFAULT_TEXT}`,
                    opacity: (isActive ? sc.CELL_FOCUS_TEXT_ALPHA : sc.CELL_DEFAULT_TEXT_ALPHA) / 255,
                  }}
                >
                  {item.label}
                </span>
                
                {/* Current Item Label (Global override if active) */}
                {isActive && sc.CURRENT_ITEM_LABEL_TEXT_ALPHA > 0 && (
                  <div 
                    className="absolute bottom-[-24px] whitespace-nowrap px-2 py-1 pointer-events-none"
                    style={{
                      backgroundColor: hexToRgba("000000", sc.CURRENT_ITEM_LABEL_BACKGROUND_ALPHA),
                      borderRadius: sc.CURRENT_ITEM_LABEL_RADIUS,
                      color: isActive ? "#FFFFFF" : "#AAAAAA",
                      opacity: sc.CURRENT_ITEM_LABEL_TEXT_ALPHA / 255,
                      transform: `translateY(${sc.CURRENT_ITEM_LABEL_OFFSET_Y}px)`
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // List layout (default)
    if (sc.LIST_DEFAULT_TEXT_ALPHA <= 0 && sc.LIST_FOCUS_TEXT_ALPHA <= 0) return null;
    return (
      <div 
        className="flex flex-col h-full w-full overflow-hidden"
        style={{
          paddingLeft: sc.CONTENT_PADDING_LEFT || 32,
          paddingTop: sc.CONTENT_PADDING_TOP || 80,
          gap: sc.NAV_SPACING || 4
        }}
      >
        {launchItems.map((item) => {
          const isActive = activeSubAsset === item.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveSubAsset(item.id)}
              className="flex items-center gap-4 px-3 py-2 cursor-pointer transition-colors"
              style={{
                borderRadius: sc.LIST_DEFAULT_RADIUS,
                backgroundColor: isActive
                  ? hexToRgba(sc.LIST_FOCUS_BACKGROUND, sc.LIST_FOCUS_BACKGROUND_ALPHA)
                  : hexToRgba(sc.LIST_DEFAULT_BACKGROUND, sc.LIST_DEFAULT_BACKGROUND_ALPHA),
                borderLeft: (sc.LIST_DEFAULT_BORDER_SIDE & 4) || (isActive && sc.LIST_FOCUS_BORDER_SIDE & 4)
                    ? `${isActive ? sc.LIST_FOCUS_BORDER_WIDTH : sc.LIST_DEFAULT_BORDER_WIDTH}px solid #${isActive ? sc.LIST_FOCUS_GLYPH_RECOLOUR : sc.LIST_DEFAULT_GLYPH_RECOLOUR}`
                    : "none",
              }}
            >
              <div
                className="w-5 h-5 flex items-center justify-center shrink-0"
                style={{
                  paddingLeft: sc.LIST_DEFAULT_GLYPH_PAD_LEFT,
                  opacity: (isActive ? sc.LIST_FOCUS_GLYPH_ALPHA : sc.LIST_DEFAULT_GLYPH_ALPHA) / 255,
                }}
              >
                {getGlyphSrc(item.id) ? (
                  <img src={getGlyphSrc(item.id)!} className="w-full h-full object-contain" />
                ) : (
                  <Gamepad2 className="w-4 h-4 text-white/20" />
                )}
              </div>
              <span
                className="text-xs font-bold"
                style={{
                  color: isActive ? `#${sc.LIST_FOCUS_TEXT}` : `#${sc.LIST_DEFAULT_TEXT}`,
                  opacity: (isActive ? sc.LIST_FOCUS_TEXT_ALPHA : sc.LIST_DEFAULT_TEXT_ALPHA) / 255,
                  paddingTop: sc.FONT_LIST_PAD_TOP,
                  paddingBottom: sc.FONT_LIST_PAD_BOTTOM,
                  paddingLeft: sc.FONT_LIST_PAD_LEFT,
                  paddingRight: sc.FONT_LIST_PAD_RIGHT,
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // Keyboard layout
  if (screenDef.layout === "keyboard") {
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    return (
      <div
        className="p-8 pt-20 flex flex-col gap-2"
        style={{
          backgroundColor: hexToRgba(sc.OSK_BACKGROUND, sc.OSK_BACKGROUND_ALPHA),
          borderRadius: sc.OSK_RADIUS,
          border: `${sc.OSK_BORDER_ALPHA > 0 ? 1 : 0}px solid rgba(255,255,255,0.1)`,
        }}
      >
        <div
          className="p-3 rounded mb-4 h-10 flex items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span
            className="text-xs italic"
            style={{
              color: `#${sc.OSK_TEXT}`,
              opacity: (sc.OSK_TEXT_ALPHA / 255) * 0.5,
            }}
          >
            Search...
          </span>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.split("").map((char) => (
              <div
                key={char}
                className="w-8 h-10 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: hexToRgba(sc.OSK_ITEM_BACKGROUND, sc.OSK_ITEM_BACKGROUND_ALPHA),
                  borderRadius: sc.OSK_ITEM_RADIUS,
                  color: `#${sc.OSK_TEXT}`,
                  opacity: sc.OSK_TEXT_ALPHA / 255,
                  border:
                    sc.OSK_ITEM_BORDER_ALPHA > 0
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none",
                }}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-1 mt-1">
          <div
            className="w-12 h-10 flex items-center justify-center text-[10px] font-bold"
            style={{
              backgroundColor: hexToRgba(sc.OSK_ITEM_BACKGROUND_FOCUS, sc.OSK_ITEM_BACKGROUND_FOCUS_ALPHA),
              borderRadius: sc.OSK_ITEM_RADIUS,
              color: `#${sc.OSK_TEXT_FOCUS}`,
              opacity: sc.OSK_TEXT_FOCUS_ALPHA / 255,
            }}
          >
            SHIFT
          </div>
          <div
            className="w-32 h-10 flex items-center justify-center text-[10px] font-bold"
            style={{
              backgroundColor: hexToRgba(sc.OSK_ITEM_BACKGROUND, sc.OSK_ITEM_BACKGROUND_ALPHA),
              borderRadius: sc.OSK_ITEM_RADIUS,
              color: `#${sc.OSK_TEXT}`,
              opacity: sc.OSK_TEXT_ALPHA / 255,
            }}
          >
            SPACE
          </div>
          <div
            className="w-12 h-10 flex items-center justify-center text-[10px] font-bold"
            style={{
              backgroundColor: hexToRgba(sc.OSK_ITEM_BACKGROUND, Math.min(sc.OSK_ITEM_BACKGROUND_ALPHA * 1.2, 255)),
              borderRadius: sc.OSK_ITEM_RADIUS,
              color: `#${sc.OSK_TEXT}`,
              opacity: sc.OSK_TEXT_ALPHA / 255,
            }}
          >
            DEL
          </div>
        </div>
      </div>
    );
  }

  // Info layout
  if (screenDef.layout === "info") {
    return (
      <div className="p-8 pt-24 space-y-4">
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
            <Cpu className="w-6 h-6" style={{ color: `#${sc.LIST_FOCUS_TEXT}` }} />
          </div>
          <div>
            <h4
              className="text-[10px] uppercase tracking-tighter"
              style={{
                color: `#${sc.LIST_DEFAULT_TEXT}`,
                opacity: (sc.LIST_DEFAULT_TEXT_ALPHA / 255) * 0.5,
              }}
            >
              System Hardware
            </h4>
            <p
              className="text-xs font-bold"
              style={{
                color: `#${sc.LIST_DEFAULT_TEXT}`,
                opacity: sc.LIST_DEFAULT_TEXT_ALPHA / 255,
              }}
            >
              ARM Cortex-A53 @ 1.5GHz
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4
              className="text-[10px] uppercase tracking-tighter"
              style={{
                color: `#${sc.LIST_DEFAULT_TEXT}`,
                opacity: (sc.LIST_DEFAULT_TEXT_ALPHA / 255) * 0.5,
              }}
            >
              OS Version
            </h4>
            <p
              className="text-xs font-bold"
              style={{
                color: `#${sc.LIST_DEFAULT_TEXT}`,
                opacity: sc.LIST_DEFAULT_TEXT_ALPHA / 255,
              }}
            >
              v24.10.1
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4
              className="text-[10px] uppercase tracking-tighter"
              style={{
                color: `#${sc.LIST_DEFAULT_TEXT}`,
                opacity: (sc.LIST_DEFAULT_TEXT_ALPHA / 255) * 0.5,
              }}
            >
              Storage
            </h4>
            <p
              className="text-xs font-bold"
              style={{
                color: `#${sc.LIST_DEFAULT_TEXT}`,
                opacity: sc.LIST_DEFAULT_TEXT_ALPHA / 255,
              }}
            >
              14.2GB / 64GB
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Colour Adjustment sliders
  if (screenDef.id === "muxcoladjust") {
    const sliders = [
      { label: "Saturation", val: 80 },
      { label: "Luminance", val: 50 },
      { label: "Contrast", val: 65 },
      { label: "Hue", val: 0 },
    ];
    return (
      <div className="p-8 pt-24 space-y-6">
        {sliders.map((s, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <span
                className="text-[10px] font-bold uppercase"
                style={{
                  color: `#${sc.LIST_DEFAULT_TEXT}`,
                  opacity: sc.LIST_DEFAULT_TEXT_ALPHA / 255,
                }}
              >
                {s.label}
              </span>
              <span className="text-xs font-bold" style={{ color: `#${sc.LIST_FOCUS_TEXT}` }}>
                {s.val}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{
                backgroundColor: hexToRgba(sc.BAR_PROGRESS_BACKGROUND, sc.BAR_PROGRESS_BACKGROUND_ALPHA),
              }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${s.val}%`,
                  backgroundColor: `#${sc.BAR_PROGRESS_ACTIVE_BACKGROUND}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default List Layout
  if (sc.LIST_DEFAULT_TEXT_ALPHA <= 0) return null;

  const getMockItems = () => {
    if (screenDef.id === "muxplore")
      return [
        { label: "Super Mario World", id: "rom" },
        { label: "Nintendo 64", id: "folder" },
        { label: "Castlevania", id: "rom" },
        { label: "Sega Genesis", id: "folder" },
      ];
    if (screenDef.id === "muxconnect")
      return [
        { label: "SSH Service", id: "ssh", status: "ON" },
        { label: "Samba Share", id: "samba", status: "OFF" },
        { label: "SFTP Server", id: "sftp", status: "ON" },
        { label: "Web Terminal", id: "web", status: "OFF" },
      ];
    if (screenDef.category === "network")
      return [
        { label: "Wi-Fi Settings", id: "wifi" },
        { label: "Available Networks", id: "scan" },
        { label: "Network Profiles", id: "profile" },
        { label: "Static IP Config", id: "netadv" },
      ];
    return [
      { label: "General Settings", id: "config" },
      { label: "Display Options", id: "visual" },
      { label: "Controller Input", id: "control" },
      { label: "Advanced Tweaks", id: "tweak" },
    ];
  };

  const mockItems = getMockItems();

  return (
    <div className="space-y-1 p-8 pt-20">
      {mockItems.map((item: { label: string; id: string; status?: string }, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3"
          style={{
            borderRadius: sc.LIST_DEFAULT_RADIUS,
            backgroundColor:
              i === 0
                ? hexToRgba(sc.LIST_FOCUS_BACKGROUND, sc.LIST_FOCUS_BACKGROUND_ALPHA)
                : hexToRgba(sc.LIST_DEFAULT_BACKGROUND, sc.LIST_DEFAULT_BACKGROUND_ALPHA),
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-6 h-6 flex items-center justify-center"
              style={{
                opacity:
                  (i === 0 ? sc.LIST_FOCUS_GLYPH_ALPHA : sc.LIST_DEFAULT_GLYPH_ALPHA) / 255,
              }}
            >
              {getGlyphSrc(item.id) ? (
                <img src={getGlyphSrc(item.id)!} className="w-full h-full object-contain" />
              ) : (
                <Gamepad2 className="w-4 h-4 text-white/20" />
              )}
            </div>
            <span
              className="text-xs font-bold"
              style={{
                color: i === 0 ? `#${sc.LIST_FOCUS_TEXT}` : `#${sc.LIST_DEFAULT_TEXT}`,
                opacity:
                  i === 0 ? sc.LIST_FOCUS_TEXT_ALPHA / 255 : sc.LIST_DEFAULT_TEXT_ALPHA / 255,
              }}
            >
              {item.label}
            </span>
          </div>
          {item.status && (
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                item.status === "ON"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {item.status}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
