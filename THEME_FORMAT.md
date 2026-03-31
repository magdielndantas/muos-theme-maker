# muOS (MustardOS) Theme Format — Reference

> Sources: [MustardOS/frontend](https://github.com/MustardOS/frontend) (theme.c/theme.h), [MustardOS/mustardos.github.io](https://github.com/MustardOS/mustardos.github.io) (themes/), [MustardOS/internal](https://github.com/MustardOS/internal/tree/main/share/theme) (built-in themes), [MustardOS/tool](https://github.com/MustardOS/tool) (theme_icons/glyph.csv)

## Real Theme Examples

Os temas internos do MustardOS (`/share/theme/`) demonstram a estrutura real:

```
MustardOS/                    # Tema built-in
├── 640x480/                  # Resolução específica
│   └── image/
│       └── bootlogo.png      # Boot splash (PNG, não BMP!)
├── 1280x720/
├── 720x480/
├── 720x576/
├── 720x720/
├── 1024x768/
├── scheme/
│   └── global.ini            # Global scheme (aplica a todas resoluções)
├── glyph/
│   ├── header/
│   ├── footer/
│   ├── bar/
│   └── muxlaunch/
├── font/
│   ├── default.bin
│   ├── header/default.bin
│   └── footer/default.bin
├── overlay/
├── active.txt                 # "MustardOS"
├── collect.html
├── credits.txt
├── name.txt
└── version.txt               # "2508.0"
```

### Hierarquia de Scheme Real

Do `MustardOS/scheme/global.ini` (extraído):

```ini
[background]
BACKGROUND = 003087
BACKGROUND_ALPHA = 255
BACKGROUND_GRADIENT_COLOR = 001844
BACKGROUND_GRADIENT_START = 0
BACKGROUND_GRADIENT_STOP = 255
BACKGROUND_GRADIENT_DIRECTION = 1
BACKGROUND_GRADIENT_DITHER = 1
BACKGROUND_GRADIENT_BLUR = 0

[header]
HEADER_HEIGHT = 44
HEADER_BACKGROUND = 003087
HEADER_BACKGROUND_ALPHA = 0          # 0 = header invisível!
HEADER_TEXT = E8E8E8
HEADER_TEXT_ALPHA = 255
HEADER_TEXT_ALIGN = 2                # 2 = center
PADDING_LEFT = 12
PADDING_RIGHT = 12

[footer]
FOOTER_HEIGHT = 44
FOOTER_BACKGROUND = 003087
FOOTER_BACKGROUND_ALPHA = 0           # 0 = footer invisível!
FOOTER_TEXT = E8E8E8
FOOTER_TEXT_ALPHA = 255

[grid]
COLUMN_COUNT = 0                      # 0 = modo lista, não grid
ROW_COUNT = 2                         # >0 ativa grid mode
CELL_RADIUS = 16
CELL_DEFAULT_BACKGROUND = 686868
CELL_DEFAULT_IMAGE_RECOLOUR = E8E8E8
CELL_DEFAULT_IMAGE_RECOLOUR_ALPHA = 255

[list]
LIST_DEFAULT_BACKGROUND = 003087
LIST_DEFAULT_BACKGROUND_ALPHA = 0     # 0 = sem bg nos itens
LIST_DEFAULT_TEXT = E8E8E8
LIST_DEFAULT_TEXT_ALPHA = 255
LIST_FOCUS_BACKGROUND = E8E8E8
LIST_FOCUS_BACKGROUND_ALPHA = 255
LIST_FOCUS_TEXT = 003087
LIST_FOCUS_TEXT_ALPHA = 255
```

### Per-Screen Override

Em `MustardOS/640x480/scheme/muxlaunch.ini`:
```ini
[grid]
COLUMN_COUNT = 4
ROW_COUNT = 2
```

Este arquivo **sobrescreve** o global.ini apenas para a tela `muxlaunch` na resolução 640x480, ativando modo grid (4×2).

## Directory Structure

```
ThemeName/
├── active.txt                      # Active variant name
├── credits.txt                     # Attribution
├── version.txt                     # Version (e.g., "2508.0")
├── theme_name.txt                  # Theme display name
├── assets.muxzip                   # Optional: extra assets (grid icons, etc.)
├── scheme/
│   └── global.ini                  # Global scheme (all resolutions)
├── alternate/                      # Variant themes
│   ├── Moon.muxalt
│   └── rgb/Moon/rgbconf.sh
├── font/
│   ├── default.bin                 # Default font (LVGL .bin)
│   ├── header/default.bin
│   ├── footer/default.bin
│   └── panel/default.bin
├── glyph/
│   ├── header/                     # Battery, Wi-Fi, BT icons
│   │   ├── capacity_0.png ... capacity_100.png
│   │   ├── capacity_charging_0.png ... capacity_charging_100.png
│   │   ├── network_normal.png, network_active.png
│   │   └── bluetooth.png
│   ├── footer/                     # Button glyphs
│   │   ├── a.png, b.png, x.png, y.png, menu.png, c.png, z.png
│   ├── bar/                        # Brightness/volume icons
│   │   ├── brightness.png
│   │   └── volume_0.png ... volume_3.png
│   ├── muxlaunch/                  # Main menu glyphs
│   │   ├── explore.png, collection.png, history.png
│   │   ├── apps.png, info.png, config.png
│   │   ├── reboot.png, shutdown.png, favourite.png
│   ├── muxplore/                   # File explorer glyphs
│   │   ├── folder.png, rom.png, history.png, collection.png
│   └── {screenId}/                 # Per-screen glyphs
├── sound/                          # WAV audio files
│   ├── back.wav, confirm.wav, error.wav
│   ├── navigate.wav, reboot.wav, shutdown.wav
│   ├── startup.wav, muos.wav, keypress.wav
│   ├── option.wav, info_open.wav, info_close.wav
│   └── boot.wav
├── 640x480/                        # Resolution-specific assets
│   ├── scheme/
│   │   ├── default.ini             # Resolution defaults
│   │   └── muxlaunch.ini           # Per-screen at this resolution
│   ├── image/
│   │   ├── wall/
│   │   │   ├── default.png         # Fallback wallpaper
│   │   │   ├── muxlaunch.png       # Per-screen wallpaper
│   │   │   └── muxlaunch/          # Sub-assets (list item backgrounds)
│   │   │       ├── explore.png ... shutdown.png
│   │   ├── static/
│   │   │   └── muxlaunch/          # Static overlay per list item
│   │   │       ├── explore.png ... shutdown.png
│   │   ├── overlay.png             # Global overlay
│   │   ├── bootlogo.bmp            # 24-bit BMP boot splash
│   │   ├── reboot.png
│   │   └── shutdown.png
│   ├── glyph/                      # Resolution-specific glyphs (overrides root)
│   ├── font/                       # Resolution-specific fonts
│   └── preview.png                 # Preview image (~45% screen res)
├── 720x480/
├── 720x576/
├── 720x720/
├── 1280x720/
├── catalogue/                      # Grid icon assets
│   ├── Application/grid/
│   │   ├── app.png, archive.png, ...
│   │   └── 640x480/               # Resolution-specific grid icons
│   └── Folder/grid/
│       ├── default.png, default_focused.png
│       └── {System Name}.png
├── overlay/                        # Overlay image sets
│   ├── battery/, bright/, volume/
└── image/                          # Root-level images
    ├── none_box.png, none_preview.png
```

## Scheme File Hierarchy (load order)

MustardOS loads scheme files in this order, each overriding the previous:

1. Hardcoded defaults in `init_theme_config()` (theme.c)
2. `/scheme/global.ini` — root-level, applies to ALL resolutions
3. `/{resolution}/scheme/default.ini` — resolution-specific defaults
4. `/{resolution}/scheme/{module}.ini` — screen-specific at that resolution

Source (theme.c `load_scheme()`):
```c
// Tries {resolution}/scheme/{file}.ini first, falls back to scheme/{file}.ini
snprintf(path, size, "%s/%sscheme/%s.ini", theme_base, mux_dim, file_name);
if (!file_exist(path))
    snprintf(path, size, "%s/scheme/%s.ini", theme_base, file_name);
```

## INI Scheme Format

INI files use `[section]` headers. Values are hex colors (no `#`) or integers.
Alpha ranges: 0 = invisible, 255 = opaque.

### `[background]`

| Key                                | Type  | Description                                      |
|------------------------------------|-------|--------------------------------------------------|
| `BACKGROUND`                       | color | Canvas base color                                |
| `BACKGROUND_ALPHA`                 | int   | Opacity (0–255)                                  |
| `BACKGROUND_GRADIENT_COLOR`        | color | 2nd gradient color                               |
| `BACKGROUND_GRADIENT_START`        | int   | Gradient start position (0–255)                  |
| `BACKGROUND_GRADIENT_STOP`         | int   | Gradient end position (0–255)                    |
| `BACKGROUND_GRADIENT_DIRECTION`    | int   | 0=None, 1=Vertical, 2=Horizontal                |
| `BACKGROUND_GRADIENT_DITHER`       | int   | 0=Disabled, 1=Enabled (smooth banding)           |
| `BACKGROUND_GRADIENT_BLUR`         | int   | 0=Disabled, 1+=blur level                        |

### `[header]`

| Key                    | Type  | Description                                              |
|------------------------|-------|----------------------------------------------------------|
| `HEADER_HEIGHT`        | int   | Bar height in px                                         |
| `HEADER_BACKGROUND`    | color | Bar background color                                     |
| `HEADER_BACKGROUND_ALPHA` | int | Bar background opacity (0–255)                          |
| `HEADER_TEXT`          | color | Title text color                                         |
| `HEADER_TEXT_ALPHA`    | int   | Title text opacity (0–255)                               |
| `HEADER_TEXT_ALIGN`    | int   | 0=Auto, 1=Left, 2=Center, 3=Right                      |
| `PADDING_LEFT`         | int   | Left padding for title                                   |
| `PADDING_RIGHT`        | int   | Right padding for title                                  |

### `[date]`

| Key              | Type  | Description                                              |
|------------------|-------|----------------------------------------------------------|
| `DATETIME_TEXT`  | color | Time text color                                          |
| `DATETIME_ALPHA` | int   | Time text opacity (0–255)                                |
| `DATETIME_ALIGN` | int   | 0=Auto, 1=Left, 2=Center, 3=Right                      |
| `PADDING_LEFT`   | int   | Clock left padding                                       |
| `PADDING_RIGHT`  | int   | Clock right padding                                      |

### `[status]`

| Key             | Type  | Description                                              |
|-----------------|-------|----------------------------------------------------------|
| `ALIGN`         | int   | 0=Left, 1=Right, 2=Center, 3=SpaceEvenly, 4=SpaceAround, 5=SpaceBetween |
| `PADDING_LEFT`  | int   | Left padding                                             |
| `PADDING_RIGHT` | int   | Right padding                                            |

### `[footer]`

| Key                      | Type  | Description                  |
|--------------------------|-------|------------------------------|
| `FOOTER_HEIGHT`          | int   | Bar height in px             |
| `FOOTER_BACKGROUND`      | color | Bar background color         |
| `FOOTER_BACKGROUND_ALPHA`| int   | Background opacity (0–255)   |
| `FOOTER_TEXT`            | color | Text color                   |
| `FOOTER_TEXT_ALPHA`      | int   | Text opacity (0–255)         |

### `[list]`

| Key                                    | Type  | Description                                                    |
|----------------------------------------|-------|----------------------------------------------------------------|
| `LIST_DEFAULT_RADIUS`                  | int   | Corner radius (0=square)                                       |
| `LIST_DEFAULT_BACKGROUND`              | color | Unselected bg color                                            |
| `LIST_DEFAULT_BACKGROUND_ALPHA`        | int   | Unselected bg opacity                                          |
| `LIST_DEFAULT_GRADIENT_START`          | int   | Gradient start (0–255)                                         |
| `LIST_DEFAULT_GRADIENT_STOP`           | int   | Gradient end (0–255)                                           |
| `LIST_DEFAULT_GRADIENT_DIRECTION`      | int   | 0=None, 1=Vertical, 2=Horizontal                              |
| `LIST_DEFAULT_BORDER_WIDTH`            | int   | Border width in px                                             |
| `LIST_DEFAULT_BORDER_SIDE`             | int   | 0=None, 1=Bottom, 2=Top, 4=Left, 8=Right (add for multiple)  |
| `LIST_DEFAULT_INDICATOR`               | color | Indicator/border color                                         |
| `LIST_DEFAULT_INDICATOR_ALPHA`         | int   | Indicator opacity                                              |
| `LIST_DEFAULT_TEXT`                    | color | Unselected text color                                          |
| `LIST_DEFAULT_TEXT_ALPHA`              | int   | Unselected text opacity                                        |
| `LIST_DEFAULT_GLYPH_PAD_LEFT`          | int   | Padding left to glyph center                                   |
| `LIST_DEFAULT_GLYPH_ALPHA`             | int   | Glyph opacity                                                  |
| `LIST_DEFAULT_GLYPH_RECOLOUR`          | color | Glyph tint color                                               |
| `LIST_DEFAULT_GLYPH_RECOLOUR_ALPHA`    | int   | Glyph tint opacity                                             |
| `LIST_DEFAULT_LABEL_LONG_MODE`         | int   | 0=Wrap, 1=Ellipsis+scroll when selected                       |
| `LIST_DISABLED_TEXT`                   | color | Disabled text color                                            |
| `LIST_DISABLED_TEXT_ALPHA`             | int   | Disabled text opacity                                          |
| `LIST_FOCUS_BACKGROUND`                | color | Selected bg color                                              |
| `LIST_FOCUS_BACKGROUND_ALPHA`          | int   | Selected bg opacity                                            |
| `LIST_FOCUS_GRADIENT_START`            | int   | Selected gradient start                                        |
| `LIST_FOCUS_GRADIENT_STOP`             | int   | Selected gradient end                                          |
| `LIST_FOCUS_GRADIENT_DIRECTION`        | int   | Selected gradient direction                                    |
| `LIST_FOCUS_BORDER_WIDTH`              | int   | Selected border width                                          |
| `LIST_FOCUS_BORDER_SIDE`               | int   | Selected border sides (same bitmask as default)                |
| `LIST_FOCUS_INDICATOR`                 | color | Selected indicator color                                       |
| `LIST_FOCUS_INDICATOR_ALPHA`           | int   | Selected indicator opacity                                     |
| `LIST_FOCUS_TEXT`                      | color | Selected text color                                            |
| `LIST_FOCUS_TEXT_ALPHA`                | int   | Selected text opacity                                          |
| `LIST_FOCUS_GLYPH_ALPHA`               | int   | Selected glyph opacity                                         |
| `LIST_FOCUS_GLYPH_RECOLOUR`            | color | Selected glyph tint color                                      |
| `LIST_FOCUS_GLYPH_RECOLOUR_ALPHA`      | int   | Selected glyph tint opacity                                    |

### `[grid]`

| Key                                        | Type  | Description                                                    |
|--------------------------------------------|-------|----------------------------------------------------------------|
| `NAVIGATION_TYPE`                          | int   | 2=Standard L/R/U/D, 4=Wrap on active row                      |
| `BACKGROUND`                               | color | Grid main background                                           |
| `BACKGROUND_ALPHA`                         | int   | Grid bg opacity                                                |
| `ALIGNMENT`                                | int   | Grid alignment                                                 |
| `LOCATION_X`                               | int   | Horizontal offset in px                                        |
| `LOCATION_Y`                               | int   | Vertical offset in px                                          |
| `COLUMN_COUNT`                             | int   | Number of columns                                              |
| `ROW_COUNT`                                | int   | Rows visible (activates grid mode when > 0)                    |
| `ROW_HEIGHT`                               | int   | Row height in px                                               |
| `COLUMN_WIDTH`                             | int   | Column width in px                                             |
| `COLUMN_PADDING`                           | int   | Padding between columns                                        |
| `ROW_PADDING`                              | int   | Padding between rows                                           |
| `CELL_WIDTH`                               | int   | Cell width in px                                               |
| `CELL_HEIGHT`                              | int   | Cell height in px                                              |
| `CELL_RADIUS`                              | int   | Cell corner radius                                             |
| `CELL_BORDER_WIDTH`                        | int   | Cell border width                                              |
| `CELL_IMAGE_PADDING_TOP`                   | int   | Padding top to cell image                                      |
| `CELL_TEXT_PADDING_SIDE`                   | int   | Side padding for cell text                                     |
| `CELL_TEXT_PADDING_BOTTOM`                 | int   | Bottom padding for cell text                                   |
| `CELL_TEXT_LINE_SPACING`                   | int   | Spacing between text lines                                     |
| `CELL_DEFAULT_BACKGROUND`                  | color | Unselected cell bg                                             |
| `CELL_DEFAULT_BACKGROUND_ALPHA`            | int   | Unselected cell bg opacity                                     |
| `CELL_DEFAULT_BACKGROUND_GRADIENT_COLOR`   | color | Unselected cell gradient color                                 |
| `CELL_DEFAULT_BACKGROUND_GRADIENT_START`   | int   | Unselected cell gradient start                                 |
| `CELL_DEFAULT_BACKGROUND_GRADIENT_STOP`    | int   | Unselected cell gradient end                                   |
| `CELL_DEFAULT_BACKGROUND_GRADIENT_DIRECTION`| int  | Unselected cell gradient direction                             |
| `CELL_DEFAULT_BORDER`                      | color | Unselected cell border color                                   |
| `CELL_DEFAULT_BORDER_ALPHA`                | int   | Unselected cell border opacity                                 |
| `CELL_DEFAULT_IMAGE_ALPHA`                 | int   | Unselected cell image opacity                                  |
| `CELL_DEFAULT_IMAGE_RECOLOUR`              | color | Unselected cell image tint                                     |
| `CELL_DEFAULT_IMAGE_RECOLOUR_ALPHA`        | int   | Unselected cell image tint opacity                             |
| `CELL_DEFAULT_TEXT`                        | color | Unselected cell text color                                     |
| `CELL_DEFAULT_TEXT_ALPHA`                  | int   | Unselected cell text opacity                                   |
| `CELL_FOCUS_BACKGROUND`                    | color | Selected cell bg                                               |
| `CELL_FOCUS_BACKGROUND_ALPHA`              | int   | Selected cell bg opacity                                       |
| `CELL_FOCUS_BACKGROUND_GRADIENT_COLOR`     | color | Selected cell gradient color                                   |
| `CELL_FOCUS_BACKGROUND_GRADIENT_START`     | int   | Selected cell gradient start                                   |
| `CELL_FOCUS_BACKGROUND_GRADIENT_STOP`      | int   | Selected cell gradient end                                     |
| `CELL_FOCUS_BACKGROUND_GRADIENT_DIRECTION` | int   | Selected cell gradient direction                               |
| `CELL_FOCUS_BORDER`                        | color | Selected cell border color                                     |
| `CELL_FOCUS_BORDER_ALPHA`                  | int   | Selected cell border opacity                                   |
| `CELL_FOCUS_IMAGE_ALPHA`                   | int   | Selected cell image opacity                                    |
| `CELL_FOCUS_IMAGE_RECOLOUR`                | color | Selected cell image tint                                       |
| `CELL_FOCUS_IMAGE_RECOLOUR_ALPHA`          | int   | Selected cell image tint opacity                               |
| `CELL_FOCUS_TEXT`                          | color | Selected cell text color                                       |
| `CELL_FOCUS_TEXT_ALPHA`                    | int   | Selected cell text opacity                                     |
| `CURRENT_ITEM_LABEL_ALIGNMENT`             | int   | 1=TL, 2=TM, 3=TR, 4=BL, 5=BM, 6=BR, 7=LM, 8=RM, 9=Center   |
| `CURRENT_ITEM_LABEL_WIDTH`                 | int   | Label width (0=sized to content)                               |
| `CURRENT_ITEM_LABEL_HEIGHT`                | int   | Label height (0=sized to content)                              |
| `CURRENT_ITEM_LABEL_OFFSET_X`              | int   | Horizontal offset from alignment                               |
| `CURRENT_ITEM_LABEL_OFFSET_Y`              | int   | Vertical offset from alignment                                 |
| `CURRENT_ITEM_LABEL_RADIUS`                | int   | Label corner radius                                            |
| `CURRENT_ITEM_LABEL_BACKGROUND`            | color | Label bg color                                                 |
| `CURRENT_ITEM_LABEL_BACKGROUND_ALPHA`      | int   | Label bg opacity                                               |
| `CURRENT_ITEM_LABEL_TEXT`                  | color | Label text color                                               |
| `CURRENT_ITEM_LABEL_TEXT_ALPHA`            | int   | Label text opacity                                             |
| `CURRENT_ITEM_LABEL_TEXT_ALIGNMENT`        | int   | 1=Left, 2=Center, 3=Right                                     |
| `CURRENT_ITEM_LABEL_TEXT_LINE_SPACING`     | int   | Text line spacing                                              |
| `CURRENT_ITEM_LABEL_TEXT_PADDING_*`        | int   | TOP/BOTTOM/LEFT/RIGHT padding                                  |

### `[navigation]`

| Key                              | Type  | Description                    |
|----------------------------------|-------|--------------------------------|
| `ALIGNMENT`                      | int   | 0=Left, 1=Center, 2=Right      |
| `SPACING`                        | int   | Space between nav buttons       |
| `NAV_{A,B,C,X,Y,Z,MENU}_GLYPH`  | color | Button glyph tint              |
| `NAV_{...}_GLYPH_ALPHA`         | int   | Button glyph opacity           |
| `NAV_{...}_GLYPH_RECOLOUR_ALPHA`| int   | Glyph recolour opacity        |
| `NAV_{...}_TEXT`                 | color | Button text color              |
| `NAV_{...}_TEXT_ALPHA`          | int   | Button text opacity            |
| *(same pattern for LR, UD)*     |       |                                |

### `[font]`

| Key                              | Type  | Description                              |
|----------------------------------|-------|------------------------------------------|
| `FONT_HEADER_PAD_TOP`            | int   | Pixels from top of header to text        |
| `FONT_HEADER_PAD_BOTTOM`         | int   | Pixels from bottom of header to text     |
| `FONT_HEADER_ICON_PAD_TOP`       | int   | Pixels from top of header to icons       |
| `FONT_HEADER_ICON_PAD_BOTTOM`    | int   | Pixels from bottom of header to icons    |
| `FONT_FOOTER_PAD_TOP`            | int   | Pixels from top of footer to text        |
| `FONT_FOOTER_PAD_BOTTOM`         | int   | Pixels from bottom of footer to text     |
| `FONT_FOOTER_ICON_PAD_TOP`       | int   | Pixels from top of footer to icons       |
| `FONT_FOOTER_ICON_PAD_BOTTOM`    | int   | Pixels from bottom of footer to icons    |
| `FONT_LIST_PAD_TOP`              | int   | Pixels from top of item to text          |
| `FONT_LIST_PAD_BOTTOM`           | int   | Pixels from bottom of item to text       |
| `FONT_LIST_PAD_LEFT`             | int   | Pixels from left of item to text         |
| `FONT_LIST_PAD_RIGHT`            | int   | Pixels from right of item to text        |
| `FONT_LIST_ICON_PAD_TOP`         | int   | Pixels from top of item to glyph         |
| `FONT_LIST_ICON_PAD_BOTTOM`      | int   | Pixels from bottom of item to glyph      |
| `FONT_MESSAGE_PAD_TOP/BOTTOM`    | int   | Message area text padding               |
| `FONT_MESSAGE_ICON_PAD_TOP/BOTTOM`| int  | Message area icon padding               |

### `[battery]`, `[network]`, `[bluetooth]`

| Key                    | Type  | Description              |
|------------------------|-------|--------------------------|
| `BATTERY_NORMAL`       | color | Normal color             |
| `BATTERY_NORMAL_ALPHA` | int   | Normal opacity           |
| `BATTERY_ACTIVE`       | color | Charging color           |
| `BATTERY_ACTIVE_ALPHA` | int   | Charging opacity         |
| `BATTERY_LOW`          | color | Low battery color        |
| `BATTERY_LOW_ALPHA`    | int   | Low battery opacity      |
| *(NETWORK_*, BLUETOOTH_* follow same pattern)* | | |

### `[bar]`

| Key                                  | Type  | Description                    |
|--------------------------------------|-------|--------------------------------|
| `BAR_WIDTH` / `PANEL_WIDTH`          | int   | Bar panel width                |
| `BAR_HEIGHT` / `PANEL_HEIGHT`        | int   | Bar panel height               |
| `BAR_BACKGROUND` / `PANEL_BACKGROUND`| color | Panel background color         |
| `BAR_BACKGROUND_ALPHA`               | int   | Panel bg opacity               |
| `BAR_BORDER` / `PANEL_BORDER`        | color | Panel border color             |
| `BAR_BORDER_ALPHA`                   | int   | Panel border opacity           |
| `BAR_RADIUS` / `PANEL_BORDER_RADIUS` | int   | Panel corner radius            |
| `BAR_PROGRESS_WIDTH`                 | int   | Progress bar width             |
| `BAR_PROGRESS_HEIGHT`                | int   | Progress bar height            |
| `BAR_PROGRESS_BACKGROUND`            | color | Progress track color           |
| `BAR_PROGRESS_ACTIVE_BACKGROUND`     | color | Progress fill color            |
| `BAR_PROGRESS_RADIUS`                | int   | Progress corner radius         |
| `BAR_ICON`                           | color | Icon tint color                |
| `BAR_ICON_ALPHA`                     | int   | Icon opacity                   |
| `BAR_Y_POS`                          | int   | Y position from center         |

### `[keyboard]` (OSK)

| Key                                    | Type  | Description              |
|----------------------------------------|-------|--------------------------|
| `OSK_BACKGROUND`                       | color | Keyboard bg color        |
| `OSK_BACKGROUND_ALPHA`                 | int   | Keyboard bg opacity      |
| `OSK_BORDER`                           | color | Keyboard border color    |
| `OSK_BORDER_ALPHA`                     | int   | Keyboard border opacity  |
| `OSK_RADIUS`                           | int   | Keyboard corner radius   |
| `OSK_TEXT`                             | color | Key text color           |
| `OSK_TEXT_ALPHA`                       | int   | Key text opacity         |
| `OSK_TEXT_FOCUS`                       | color | Focused key text color   |
| `OSK_TEXT_FOCUS_ALPHA`                 | int   | Focused key text opacity |
| `OSK_ITEM_BACKGROUND`                  | color | Key bg color             |
| `OSK_ITEM_BACKGROUND_ALPHA`            | int   | Key bg opacity           |
| `OSK_ITEM_BACKGROUND_FOCUS`            | color | Focused key bg color     |
| `OSK_ITEM_BACKGROUND_FOCUS_ALPHA`      | int   | Focused key bg opacity   |
| `OSK_ITEM_BORDER`                      | color | Key border color         |
| `OSK_ITEM_BORDER_ALPHA`                | int   | Key border opacity       |
| `OSK_ITEM_BORDER_FOCUS`                | color | Focused key border color |
| `OSK_ITEM_BORDER_FOCUS_ALPHA`          | int   | Focused key border opacity|
| `OSK_ITEM_RADIUS`                      | int   | Key corner radius        |

### `[charging]`

| Key                              | Type  | Description                        |
|----------------------------------|-------|------------------------------------|
| `CHARGER_BACKGROUND`             | color | Charging banner bg color           |
| `CHARGER_BACKGROUND_ALPHA`       | int   | Charging banner bg opacity         |
| `CHARGER_TEXT`                   | color | Charging banner text color         |
| `CHARGER_TEXT_ALPHA`             | int   | Charging banner text opacity       |
| `CHARGER_Y_POS`                  | int   | Banner Y offset from center        |

### `[counter]` (item count badge)

| Key                              | Type  | Description                        |
|----------------------------------|-------|------------------------------------|
| `ALIGNMENT`                      | int   | Badge alignment                    |
| `PADDING_AROUND`                 | int   | Padding around badge               |
| `PADDING_SIDE`                   | int   | Side padding                       |
| `PADDING_TOP`                    | int   | Top padding                        |
| `BACKGROUND`                     | color | Badge bg color                     |
| `BACKGROUND_ALPHA`               | int   | Badge bg opacity                   |
| `TEXT`                           | color | Badge text color                   |
| `TEXT_ALPHA`                     | int   | Badge text opacity                 |
| `TEXT_FADE_TIME`                 | int   | Fade time in ms                    |
| `TEXT_SEPARATOR`                 | str   | Separator (e.g., " / ")           |
| `RADIUS`                         | int   | Corner radius                      |

### `[image_list]` and `[image_preview]`

| Key                              | Type  | Description                        |
|----------------------------------|-------|------------------------------------|
| `IMAGE_LIST_ALPHA`               | int   | List image opacity                 |
| `IMAGE_LIST_RADIUS`              | int   | List image corner radius           |
| `IMAGE_LIST_RECOLOUR`            | color | List image tint color              |
| `IMAGE_LIST_RECOLOUR_ALPHA`      | int   | List image tint opacity            |
| `IMAGE_LIST_PAD_TOP/BOTTOM/LEFT/RIGHT` | int | List image padding           |
| `IMAGE_PREVIEW_ALPHA`            | int   | Preview image opacity              |
| `IMAGE_PREVIEW_RADIUS`           | int   | Preview image corner radius        |
| `IMAGE_PREVIEW_RECOLOUR`         | color | Preview image tint color           |
| `IMAGE_PREVIEW_RECOLOUR_ALPHA`   | int   | Preview image tint opacity         |

### `[misc]`

| Key                              | Type  | Description                        |
|----------------------------------|-------|------------------------------------|
| `STATIC_ALIGNMENT`               | int   | Static image alignment             |
| `ANIMATED_BACKGROUND`            | int   | 0=Static, 1=Animated               |
| `IMAGE_OVERLAY`                  | int   | 0=Disabled, 1=Enabled              |
| `NAVIGATION_TYPE`                | int   | 0=Vertical, 1=Horizontal           |
| `CONTENT_SIZE_TO_CONTENT`        | int   | Size content to fit                |
| `CONTENT_PADDING_LEFT`           | int   | Content left padding               |
| `CONTENT_PADDING_TOP`            | int   | Content top padding                |
| `CONTENT_HEIGHT`                 | int   | Content area height                |
| `CONTENT_WIDTH`                  | int   | Content area width                 |
| `CONTENT_ITEM_COUNT`             | int   | Number of visible items            |

### `[notification]` (message popup)

| Key                              | Type  | Description              |
|----------------------------------|-------|--------------------------|
| `MSG_BACKGROUND`                 | color | Popup bg color           |
| `MSG_BACKGROUND_ALPHA`           | int   | Popup bg opacity         |
| `MSG_BORDER`                     | color | Popup border color       |
| `MSG_BORDER_ALPHA`               | int   | Popup border opacity     |
| `MSG_RADIUS`                     | int   | Popup corner radius      |
| `MSG_TEXT`                       | color | Popup text color         |
| `MSG_TEXT_ALPHA`                 | int   | Popup text opacity       |

### `[roll]` (scroll picker)

| Key                              | Type  | Description                        |
|----------------------------------|-------|------------------------------------|
| `ROLL_TEXT`                       | color | Unselected item text color         |
| `ROLL_TEXT_ALPHA`                 | int   | Unselected item text opacity       |
| `ROLL_BACKGROUND`                 | color | Unselected item bg color           |
| `ROLL_BACKGROUND_ALPHA`           | int   | Unselected item bg opacity         |
| `ROLL_RADIUS`                     | int   | Unselected item corner radius      |
| `ROLL_SELECT_TEXT`                | color | Selected item text color           |
| `ROLL_SELECT_TEXT_ALPHA`          | int   | Selected item text opacity         |
| `ROLL_SELECT_BACKGROUND`          | color | Selected item bg color             |
| `ROLL_SELECT_BACKGROUND_ALPHA`    | int   | Selected item bg opacity           |
| `ROLL_SELECT_RADIUS`              | int   | Selected item corner radius        |
| `ROLL_BORDER_COLOUR`              | color | Border color                       |
| `ROLL_BORDER_ALPHA`               | int   | Border opacity                     |
| `ROLL_BORDER_RADIUS`              | int   | Border corner radius               |

### `[verbose]` (boot text)

| Key                              | Type  | Description                        |
|----------------------------------|-------|------------------------------------|
| `VERBOSE_BOOT_BACKGROUND`        | color | Boot text bg color                 |
| `VERBOSE_BOOT_BACKGROUND_ALPHA`  | int   | Boot text bg opacity               |
| `VERBOSE_BOOT_TEXT`              | color | Boot text color                    |
| `VERBOSE_BOOT_TEXT_ALPHA`        | int   | Boot text opacity                  |
| `VERBOSE_BOOT_Y_POS`             | int   | Boot text Y position               |

### `[meta]`

| Key              | Type | Description              |
|------------------|------|--------------------------|
| `META_CUT`       | int  | Meta cut value           |

## Canvas Rendering Order

The canvas renders layers bottom-to-top in this order:

```
z-index   Layer
────────  ────────────────────────────────────────
  1       Background color (SYSTEM.BACKGROUND)
  2       Background gradient
  3       Default wallpaper (image/wall/default.png)
  4       Screen wallpaper (image/wall/{screenId}.png)
  5       Static image (image/static/{screenId}.png)   z-[8]
  10      Screen overlay (overlay.png)                  z-10
  15      Mock content (list/grid/keyboard)             z-[15]
  20+     Draggable layers (user-added)                 z-20+
  50      Header bar                                    z-[50]
  50      Footer bar                                    z-[50]
```

### Header Layout

The header uses a 3-column flex layout:

```
┌─────────────────────────────────────────────────────────┐
│ [Title]           [12:34]              [Wi-Fi] [Battery] │
│  ← padding_left   ← flex-1 center      → shrink-0       │
└─────────────────────────────────────────────────────────┘
```

- **Title** — `shrink-0`, left-aligned with `HEADER_PADDING_LEFT`
- **Clock** — `flex-1`, centered (respects `DATETIME_ALIGN`)
- **Status** — `shrink-0`, right-aligned with `STATUS_PADDING_RIGHT`

Alignment values: 0=Auto, 1=Left, 2=Center, 3=Right

### Footer Layout

```
┌─────────────────────────────────────────────────────────┐
│ [B] Back                        Select [A]              │
│  ← left                          right →                │
└─────────────────────────────────────────────────────────┘
```

Navigation `ALIGNMENT`: 0=Left, 1=Center, 2=Right

## Mock Content Rendering

| Layout       | Screen IDs           | Rendered As                                |
|--------------|----------------------|--------------------------------------------|
| `list`       | muxlaunch (default)  | Vertical list with focus highlight         |
| `grid`       | muxlaunch (GRID_ACTIVE=1) | 3×2 icon grid with glyph thumbnails |
| `keyboard`   | muxsearch            | QWERTY keyboard with search bar            |
| `info`       | muxinfo, muxsysinfo  | Static info cards (CPU, OS, Storage)       |
| `splash`     | muxstart, muxcharge  | Empty (wallpaper only)                     |

### List Layout Colors

- Focused item: `LIST_FOCUS_TEXT` with alpha `LIST_FOCUS_TEXT_ALPHA / 255`
- Focused background: `LIST_FOCUS_BACKGROUND` with alpha `LIST_FOCUS_BACKGROUND_ALPHA / 255`
- Default item: `LIST_DEFAULT_TEXT` with alpha `LIST_DEFAULT_TEXT_ALPHA / 255`

## Glyph Mapping (glyph.csv)

Glyphs are SVG icon names mapped to screen/module:

```csv
MUX_MODULE,MUX_GLYPH,PNG_ICONS
muxlaunch,apps,dashboard-square-plus
muxlaunch,collection,star-fat
muxlaunch,config,gear-1
muxlaunch,explore,play
muxlaunch,history,history-page
muxlaunch,info,info-circle
muxlaunch,reboot,rotate-1-clockwise
muxlaunch,shutdown,power-button
muxplore,folder,folder-1
muxplore,rom,browser-1
bar,volume_0,volume-off
bar,bright_0,sun-haze-low
...
```

Full list: [MustardOS/tool/theme_icons/glyph.csv](https://github.com/MustardOS/tool/blob/main/theme_icons/glyph.csv)

## Sound Files

| Sound File     | Trigger                              |
|----------------|--------------------------------------|
| `back.wav`     | Pressing the back button             |
| `confirm.wav`  | Selecting an active item             |
| `error.wav`    | Error                                |
| `navigate.wav` | Pressing UDLR buttons                |
| `reboot.wav`   | Rebooting the device                 |
| `shutdown.wav` | Shutting down the device             |
| `startup.wav`  | Starting up the device               |
| `muos.wav`     | Secret sound                         |
| `keypress.wav` | OSK key press                        |
| `option.wav`   | Change option value                  |
| `info_open.wav`| Opening info window                  |
| `info_close.wav`| Closing info window                 |
| `boot.wav`     | Boot sound                           |

## Image Formats

- **`.bmp`** — Boot logo only (24-bit True Colour bitmap)
- **`.png`** — Wallpapers, static images, overlays, glyphs

## Grid Image System

Grid images are stored in `assets.muxzip` (separate ZIP) at theme root.

Search order for grid icons:
1. `/catalogue/{Category}/grid/{Resolution}/{Filename}.png`
2. `/catalogue/{Category}/grid/{Resolution}/default.png`
3. `/catalogue/{Category}/grid/{Filename}.png`
4. `/catalogue/{Category}/grid/default.png`

Focused overlay images (`{Filename}_focused.png` or `default_focused.png`) are drawn on top.

## Program Names (Screen IDs)

| Program Name   | Function                           | List Items                                         |
|----------------|------------------------------------|----------------------------------------------------|
| `muxlaunch`    | Main Menu                          | explore, collection, history, apps, info, config, reboot, shutdown |
| `muxplore`     | Content Explorer                   | —                                                  |
| `muxapp`       | Applications List                  | —                                                  |
| `muxconfig`    | Configuration Menu                 | —                                                  |
| `muxcollect`   | Collections                        | —                                                  |
| `muxhistory`   | History                            | —                                                  |
| `muxinfo`      | Information Menu                   | —                                                  |
| `muxsysinfo`   | System Details                     | —                                                  |
| `muxsearch`    | Search Content                     | —                                                  |
| `muxvisual`    | Interface Options                  | —                                                  |
| `muxtweakgen`  | General Settings                   | —                                                  |
| `muxtweakadv`  | Advanced Settings                  | —                                                  |
| `muxconnect`   | Connectivity                       | —                                                  |
| `muxnetwork`   | Wi-Fi Network                      | —                                                  |
| `muxpower`     | Power Settings                     | —                                                  |
| `muxcustom`    | Customisation                      | —                                                  |
| `muxhdmi`      | HDMI Output                        | —                                                  |
| `muxbackup`    | Device Backup                      | —                                                  |
| `muxkiosk`     | Kiosk Settings                     | —                                                  |
| `muxcharge`    | Charging Screen                    | —                                                  |
| `muxstart`     | Start Screen                       | —                                                  |
| `muxtester`    | Input Tester                       | —                                                  |
| *(and more)*   |                                    |                                                    |

## C Source: theme_config struct

The actual C struct from [theme.h](https://github.com/MustardOS/frontend/blob/main/common/theme.h) defines the exact property hierarchy:

```c
struct theme_config {
    struct { BACKGROUND, BACKGROUND_ALPHA, BACKGROUND_GRADIENT_* } SYSTEM;
    struct { ANIMATION_DELAY, ANIMATION_REPEAT } ANIMATION;
    struct { HEADER.HEIGHT, .BACKGROUND, .BACKGROUND_ALPHA, .TEXT, .TEXT_ALPHA, .TEXT_ALIGN, .PADDING_LEFT, .PADDING_RIGHT };
    struct { FOOTER.HEIGHT, .BACKGROUND, .BACKGROUND_ALPHA, .TEXT, .TEXT_ALPHA };
    struct { DATETIME.TEXT, .ALPHA, .ALIGN, .PADDING_LEFT, .PADDING_RIGHT };
    struct { STATUS.ALIGN, .PADDING_LEFT, .PADDING_RIGHT, .BATTERY.*, .NETWORK.*, .BLUETOOTH.* };
    struct { LIST_DEFAULT.*, LIST_FOCUS.*, LIST_DISABLED.* };
    struct { GRID.ENABLED, .ROW_COUNT, .COLUMN_COUNT, .LOCATION_X/Y, .CELL.*, .CELL_DEFAULT.*, .CELL_FOCUS.* };
    struct { NAV.ALIGNMENT, .SPACING, .A/B/C/X/Y/Z/MENU.* };
    struct { BAR.PANEL_*, .PROGRESS_*, .ICON, .Y_POS };
    struct { ROLL.* };
    struct { COUNTER.* };
    struct { OSK.*, .ITEM.* };
    struct { MESSAGE.* };
    struct { CHARGER.* };
    struct { VERBOSE_BOOT.* };
    struct { FONT.* };
    struct { MISC.STATIC_ALIGNMENT, .ANIMATED_BACKGROUND, .IMAGE_OVERLAY, .NAVIGATION_TYPE, .CONTENT.* };
};
```

## Import Flow

1. User uploads `.muxthm` (ZIP)
2. `importThemeFromZip()` extracts via JSZip
3. Root-level `scheme/global.ini` → applied to ALL resolutions
4. Per-file: `.ini` → parsed via `parseIni()`, images → base64
5. Resolution detected from path pattern (`\d+x\d+`)
6. Each resolution gets its own `ResolutionData`
7. Best resolution (preferring 640×480) set as active

## Export Flow

1. `exportTheme()` iterates all resolutions
2. For each resolution: INI files, wallpapers, statics, glyphs, fonts, sounds
3. Root-level `scheme/global.ini` from active resolution
4. Metadata: `active.txt`, `credits.txt`, `theme.json`
5. Downloads as `{themeName}.muxthm`
