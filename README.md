# muOS Theme Studio

Editor de temas browser-based para o sistema operacional [muOS](https://muos.dev), com fidelidade à especificação oficial de temas `.muxthm`.

> Temas de exemplo analisados: **Aurora** e **Fluent.Dark** (em `arquivos/examples/`)

---

## Referências Oficiais

| Página | URL |
|--------|-----|
| Temas (visão geral) | https://muos.dev/themes |
| Estrutura de pastas | https://muos.dev/themes/structure |
| Imagens | https://muos.dev/themes/images |
| Fontes | https://muos.dev/themes/fonts |
| Scheme files | https://muos.dev/themes/scheme |
| Alternativas | https://muos.dev/themes/alternative |
| Assets (grid images) | https://muos.dev/themes/assets |
| Finalização | https://muos.dev/themes/finish |

---

## Estrutura de Pastas do Tema

O arquivo `.muxthm` é um ZIP cujo **conteúdo** (não a pasta raiz) deve seguir esta hierarquia:

```
.
├── active.txt                        # Define qual alternativa está ativa
├── assets.muxzip                     # Grid images do Content Explorer (catálogo)
├── credits.txt                       # Créditos do criador do tema
├── alternate/
│   ├── {nome_alt}.ini                # Arquivo de scheme da alternativa (opcional)
│   └── {nome_alt}.muxalt             # Bundle completo da alternativa (images + scheme)
│   # NOTA: Aurora usa exclusivamente .muxalt, sem .ini avulso
├── font/
│   ├── default.bin                   # Fonte global
│   ├── header/default.bin            # Fonte do header
│   ├── footer/default.bin            # Fonte do footer
│   └── panel/default.bin             # Fonte dos itens de lista
├── glyph/                            # Glyphs por módulo (compartilhados entre resoluções)
│   ├── muxlaunch/                    # Glyphs dos itens do menu principal
│   │   ├── explore.png
│   │   ├── collection.png            # NOTA: Aurora também mantém favourite.png aqui
│   │   ├── history.png
│   │   ├── apps.png
│   │   ├── info.png
│   │   ├── config.png
│   │   ├── reboot.png
│   │   └── shutdown.png
│   ├── muxplore/                     # Glyphs do Content Explorer
│   ├── muxconfig/                    # Glyphs do Configuration
│   ├── muxapp/                       # ... (uma pasta por módulo com glyphs)
│   ├── header/                       # Glyph do header
│   ├── footer/                       # Glyph do footer
│   └── bar/                          # Glyph da barra
│   # Obs: cada pasta tem arquivos PNG nomeados pelo item de lista
├── scheme/
│   └── global.ini                    # Scheme global (base para todas as telas)
├── 640x480/                          # Assets específicos para resolução 640x480
│   ├── font/
│   │   └── default.bin
│   ├── glyph/
│   │   └── muxlaunch/
│   │       ├── explore.png
│   │       ├── collection.png
│   │       ├── history.png
│   │       ├── apps.png
│   │       ├── info.png
│   │       ├── config.png
│   │       ├── reboot.png
│   │       └── shutdown.png
│   ├── image/
│   │   ├── bootlogo.bmp              # Logo de boot
│   │   ├── overlay.png               # Overlay global
│   │   ├── reboot.png                # Imagem da tela de confirmação de reboot
│   │   ├── shutdown.png              # Imagem da tela de confirmação de shutdown
│   │   ├── static/
│   │   │   └── muxlaunch/            # Imagens estáticas sobrepostas nos itens do menu
│   │   │       ├── explore.png
│   │   │       ├── collection.png
│   │   │       ├── history.png
│   │   │       ├── apps.png
│   │   │       ├── info.png
│   │   │       ├── config.png
│   │   │       ├── reboot.png
│   │   │       └── shutdown.png
│   │   └── wall/
│   │       ├── default.png           # Wallpaper padrão (fallback para qualquer tela)
│   │       ├── muxlaunch/            # Wallpapers individuais por item do menu principal
│   │       │   ├── explore.png
│   │       │   ├── collection.png
│   │       │   ├── history.png
│   │       │   ├── apps.png
│   │       │   ├── info.png
│   │       │   ├── config.png
│   │       │   ├── reboot.png
│   │       │   └── shutdown.png
│   │       ├── muxcharge.png         # Wallpaper da tela de carregamento
│   │       └── muxtester.png         # Wallpaper do tela de teste
│   └── scheme/
│       ├── default.ini               # Scheme base para 640x480
│       └── muxtester.ini             # Scheme específico para a tela muxtester
├── 720x480/
├── 720x576/
├── 720x720/
├── 1280x720/
└── sound/                            # Arquivos de som WAV para navegação
```

### Regras de Resolução

- Cada resolução suportada deve ter seu próprio subdiretório (ex: `640x480`, `1280x720`).
- Recursos compartilhados entre resoluções ficam na raiz (ex: `font/`, `glyph/`, `scheme/global.ini`).
- O muOS detecta automaticamente a resolução do dispositivo e carrega os assets correspondentes.
- Resoluções observadas nos exemplos reais: `640x480`, `720x480`, `720x576`, `720x720`, `1024x768`, `1280x720`.
- O `preview.png` e `preview.gif` ficam dentro da pasta de resolução (ex: `640x480/preview.png`).

---

## Hierarquia de Scheme Files

Os arquivos `.ini` de scheme são carregados de forma aditiva, em cascata. Cada arquivo subsequente **sobrescreve** as configurações do anterior:

```
1. `/scheme/global.ini`              (Base global)
2. `/{Resolucao}/scheme/default.ini` (Base por resolução)
3. `/{Resolucao}/scheme/{modulo}.ini` (Específico por tela/módulo, ex: `muxapp.ini`)

---

## Estrutura de Pastas e Ativos

### 1. Resoluções e Imagens
Cada resolução (ex: `640x480`, `720x720`) possui sua própria pasta `image/`:
- `image/wall/`: Wallpapers por tela (ex: `muxlaunch.png`).
- `image/static/`: Imagens estáticas sobrepostas.

### 2. Glifos (Ícones)
- **Globais**: `/glyph/header/`, `/glyph/footer/`, `/glyph/bar/`.
- **Por Tela**: `/{Resolucao}/glyph/{screenId}/`.

### 3. Alternativas (.muxalt)
Alguns temas (como `Aurora`) usam a pasta `alternate/` para variações completas. O Studio foca na estrutura base, mas reconhece esses arquivos em importações profundas.
```

**Exemplo:** para customizar apenas a tela de exploração de conteúdo em 640x480, crie `640x480/scheme/muxplore.ini` com apenas as propriedades que diferem do `default.ini`.

---

## Scheme File — Seções e Propriedades

### Cores e Alpha

- **Hex Colors:** Códigos de 6 dígitos (ex: `FFFFFF`)
- **Alpha:** Range `0–255`. `0` = invisível, `255` = opaco

### Seções do Scheme

| Seção | Descrição |
|-------|-----------|
| `[font]` | Configurações de tipografia. `FONT_LIST_PAD_TOP` move texto para baixo; `FONT_LIST_PAD_BOTTOM` move para cima. Não usar ambos ao mesmo tempo. |
| `[grid]` | Ativa layout em grade para o menu principal ou Content Explorer. O Explorer só exibe grade em diretórios que contenham apenas pastas. Criar arquivo `.nogrid` na raiz de um diretório desativa a grade. |
| `[list]` | Backgrounds, gradientes (L-R = 0-255) e configurações dos itens de lista. |
| `[image_list]` | Propriedades de imagens exibidas nas listas. |
| `[charging]` | Configurações da tela de carregamento sem boot. |
| `[bar]` | Barra horizontal de volume/brilho. |
| `[roll]` | Tela de passcode/lock quando ativado nas configurações. |
| `[misc]` | Posicionamento e layering das imagens estáticas. |

### Esconder Glyphs via Scheme

Para ocultar completamente os glyphs dos itens de lista:

```ini
[list]
LIST_DEFAULT_GLYPH_ALPHA=0
LIST_FOCUS_GLYPH_ALPHA=0
```

---

## Comportamento dos Assets de Imagem

### `image/wall/` — Wallpapers

- `default.png` → Aplicado como background em qualquer tela que não tenha um wallpaper dedicado.
- `{modulo}.png` → Wallpaper dedicado para aquela tela específica (ex: `muxcharge.png`).
- `muxlaunch/{item}.png` → **Wallpaper individual por item do menu principal.** Quando o item está selecionado, sua imagem preenche o background da tela.

### `image/static/` — Imagens Estáticas

- Imagens sobrepostas sobre os outros elementos (acima do wallpaper, abaixo ou acima da lista dependendo do `[misc]`).
- `default.png` → Fallback global.
- `{modulo}.png` → Estática específica para uma tela.
- `muxlaunch/{item}.png` → Estática individual por item do menu principal.

### `glyph/` — Glyphs dos Itens de Lista

- Imagens PNG exibidas ao lado dos itens de lista.
- Se o tema não fornecer glyphs, o sistema usa os glyphs padrão do `MustardOS.muxthm` localizado em `/MUOS/theme`.
- Lista completa de glyphs disponível no [GitHub do muOS](https://github.com/MustardOS/internal/tree/main/share/theme/active/glyph).

---

## Módulos do muOS (Program Names)

Cada tela/programa do sistema tem um nome `mux...` usado para nomear assets e schemes específicos:

### Core / Menu Principal
| Módulo | Descrição |
|--------|-----------|
| `muxlaunch` | Menu principal |
| `muxstart` | Tela inicial ao ligar |
| `muxcharge` | Tela de carregamento |
| `muxtester` | Tela de teste de tema |

### Navegação de Conteúdo
| Módulo | Descrição |
|--------|-----------|
| `muxplore` | Explore Content |
| `muxoption` | Content Option |
| `muxsearch` | Busca |
| `muxassign` | Core assignment |
| `muxgov` | Governor |
| `muxcontrol` | Control Scheme |
| `muxcolfilter` | Colour Filter |
| `muxtag` | Glyph Tag |
| `muxcollect` | Collection |
| `muxhistory` | History |

### Aplicativos
| Módulo | Descrição |
|--------|-----------|
| `muxapp` | Applications |
| `muxarchive` | Archive Manager |
| `muxtask` | Task Toolkit |
| `muxappcon` | Application Options |

### Informação
| Módulo | Descrição |
|--------|-----------|
| `muxinfo` | Information |
| `muxactivity` | Activity Tracker |
| `muxshot` | Screenshots |
| `muxspace` | Storage Space |
| `muxsysinfo` | System Details |
| `muxdevice` | Device Settings |
| `muxnetinfo` | Network Details |

### Configuração
| Módulo | Descrição |
|--------|-----------|
| `muxconfig` | Configuration |
| `muxtweakgen` | General Settings |
| `muxrtc` | Date and Time |
| `muxtimezone` | Timezone |
| `muxhdmi` | HDMI Settings |
| `muxtweakadv` | Advanced Settings |
| `muxdanger` | Danger Settings |

### Conectividade
| Módulo | Descrição |
|--------|-----------|
| `muxconnect` | Connectivity |
| `muxnetwork` | Wi-Fi Network |
| `muxnetadv` | Network Settings |
| `muxwebserv` | Web Services |

### Customização
| Módulo | Descrição |
|--------|-----------|
| `muxcustom` | Customisation |
| `muxpicker` | Theme Picker |
| `muxvisual` | Interface Options |
| `muxcoladjust` | Colour Options |
| `muxoverlay` | Overlay Options |
| `muxlang` | Language |
| `muxpower` | Power Settings |
| `muxstorage` | Storage |
| `muxbackup` | Device Backup |
| `muxkiosk` | Kiosk Settings |

### Módulos adicionais descobertos nos exemplos reais
| Módulo | Descrição |
|--------|-----------|
| `muxactivity` | Activity Tracker |
| `muxactivity-content` | Individual Content |
| `muxactivity-overview` | Overview |
| `muxactivity-style` | Play Styles |
| `muxappcon` | Application Options |
| `muxbackup` | Device Backup |
| `muxcoladjust` | Colour Adjust |
| `muxcolfilter` | Colour Filter |
| `muxcontrol` | Control Scheme |
| `muxdevice` | Device Settings |
| `muxdownload` | Downloader |
| `muxkiosk` | Kiosk Settings |
| `muxlanguage` | Language |
| `muxnetadv` | Network Advanced |
| `muxnetinfo` | Network Info |
| `muxnetprofile` | Network Profile |
| `muxnetscan` | Network Scan |
| `muxnews` | News |
| `muxoverlay` | Overlay Options |
| `muxraopt` | RetroArch Options |
| `muxsort` | Sort Options |
| `muxtag` | Glyph Tag |
| `muxtheme` | Theme Picker |
| `muxthemedown` | Theme Downloader |
| `muxthemefilter` | Theme Filter |

---

## muxlaunch — Comportamento Especial

O `muxlaunch` é o menu principal do muOS. Seus itens na ordem correta:

| Ordem | Nome | Arquivo |
|-------|------|--------|
| 1 | Explore Content | `explore` |
| 2 | Collection | `collection` |
| 3 | History | `history` |
| 4 | Applications | `apps` |
| 5 | Information | `info` |
| 6 | Configuration | `config` |
| 7 | Reboot | `reboot` |
| 8 | Shutdown | `shutdown` |

> **Atenção:** O tema Aurora ainda mantém `favourite.png` na pasta `glyph/muxlaunch/` além de `collection.png`. Isso indica que o sistema aceita ambos por compatibilidade retroativa, mas o nome canônico é `collection`.

### Técnica do "Icon Menu" (confirmada pelo tema Aurora)

Para criar um menu baseado em imagens (sem texto visível, como ícones):

1. Criar imagens em `image/wall/muxlaunch/{item}.png` — cada uma preenche o fundo quando o item está focado.
2. No `scheme/muxlaunch.ini`, zerar a transparência de todos os elementos da lista:
   ```ini
   [list]
   LIST_DEFAULT_GLYPH_ALPHA=0
   LIST_DEFAULT_GLYPH_RECOLOUR_ALPHA=0
   LIST_DEFAULT_TEXT_ALPHA=0
   LIST_DISABLED_TEXT_ALPHA=0
   LIST_FOCUS_BACKGROUND_ALPHA=0
   LIST_FOCUS_GLYPH_ALPHA=0
   LIST_FOCUS_GLYPH_RECOLOUR_ALPHA=0
   LIST_FOCUS_TEXT_ALPHA=0
   
   [header]
   HEADER_TEXT_ALPHA=0
   ```
3. Definir `NAVIGATION_TYPE=4` em `[misc]` no `muxlaunch.ini` (valor usado pelo Aurora).
4. Definir `ROW_COUNT=0` em `[grid]` (desativa completamente o grid).

---

## assets.muxzip — Grid Images do Catálogo

Arquivo separado do tema principal. Contém artwork de sistemas/jogos exibidos no Content Explorer em modo grade:

- Pasta `catalogue/Application/grid/` — ícones de aplicativos
- Pasta `catalogue/Folder/grid/` — ícones de pastas
- Arquivo `default.png` em cada pasta serve como fallback quando não há artwork específico.

O modo grade no Content Explorer só é ativado em diretórios que contenham **apenas pastas**. Criar um arquivo `.nogrid` na raiz de um diretório desativa a grade para aquele diretório.

---

## Alternativas de Tema (`alternate/`)

Permitem múltiplas variações visuais dentro de um único tema:

- `{nome}.muxalt` → Bundle completo da alternativa (images + scheme empacotados) — **formato real observado no Aurora**
- `{nome}.ini` → Scheme avulso da variante (alternativa mais simples, sem assets)
- `rgb/{nome}/rgbconf.sh` → Configuração de iluminação RGB para a variante
- `active.txt` → Define qual alternativa é ativada por padrão ao instalar o tema

O Aurora possui 6 alternativas: `Blossom`, `Cloud`, `DMG`, `Dolphin`, `Midnight`, `Moon` — todas em formato `.muxalt`.

---

## Sons

Arquivos WAV colocados no diretório `sound/` são reproduzidos durante a navegação nos menus do muOS.

---

## Finalização e Distribuição

1. O arquivo final deve ter extensão **`.muxthm`**
2. O ZIP deve compactar o **conteúdo** da pasta do tema, **não** a pasta em si (a raiz do ZIP deve ser os arquivos/pastas do tema diretamente)
3. Arquivos raiz observados nos exemplos reais:
   - `credits.txt` — créditos do autor
   - `extra_credits.txt` — créditos adicionais (opcional, observado no Aurora)
   - `theme_name.txt` — nome do tema (observado no Aurora)
   - `version.txt` — versão do tema
   - `active.txt` — alternativa ativa por padrão
4. Incluir `preview.png` (e opcionalmente `preview.gif`) em `{resolucao}/preview.png`
5. O Fluent.Dark tem uma pasta `overlay/` na raiz — asset opcional de overlay global

---

## Stack Técnica do Editor

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js (App Router) |
| CSS | Tailwind CSS v4 |
| Estado | Zustand |
| Linguagem | TypeScript |
| Exportação | JSZip (geração do `.muxthm`) |

### Desenvolvimento Local

```bash
npm run dev
# Para acesso via rede local:
npm run dev -- -H 0.0.0.0
```

### Arquivos Chave do Projeto

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/data/muosScreens.ts` | Definição de todas as telas, layouts e sub-assets |
| `src/store/themeStore.ts` | Estado global (Zustand) com assets por tela |
| `src/app/page.tsx` | UI principal: canvas, inspector, sidebar de telas |
# muOS Theme Studio: Documentação Técnica de Temas

Este documento serve como a referência oficial para o desenvolvimento de temas compatíveis com o **muOS (MustardOS)**, consolidando as diretrizes das 8 páginas da documentação oficial.

---

## 📂 Estrutura de Diretórios e Arquivos

Um tema muOS (`.muxthm`) é um arquivo ZIP contendo as resoluções suportadas. **O ZIP deve conter as pastas diretamente na raiz, sem subdiretórios extras.**

```text
meu-tema.muxthm (ZIP)
├── 640x480/          # Resolução padrão
│   ├── font/         # Fontes customizadas (.bin ou .ttf)
│   ├── scheme/       # Configuração (.ini)
│   ├── static/       # Ícones de sistema
│   ├── wall/         # Papéis de parede
│   └── bootlogo.bmp  # Logo de inicialização (320x240)
├── 320x240/          # Outras resoluções suportadas
├── muxalt/           # Alternativas (.muxalt)
├── assets.muxzip     # Ativos do Content Explorer
└── active.txt        # Define o tema ativo por padrão
```

### 📏 Resoluções Suportadas
O muOS suporta as seguintes pastas de resolução:
- `320x240` (Anbernic RG35XX Original/Plus/H)
- `480x272` (TrimUI Smart Pro)
- `480x320` (Anbernic RG351P/M)
- `640x480` (A maioria dos dispositivos 4:3)
- `720x720` (Anbernic RG-Cube / Powkiddy RGB30)
- `854x480` (Anbernic RG505)
- `1280x720` (Anbernic RG552 / Retroid Pocket)

---

## 🎨 Imagens e Identidade Visual

### 🖼️ Especificações Técnicas
| Tipo | Arquivo | Resolução | Formato | Notas |
|------|---------|-----------|---------|-------|
| **Boot Logo** | `bootlogo.bmp` | 320x240 | BMP 24-bit | Localizado dentro da pasta de resolução |
| **Wallpaper** | `wall/` | Nativa | PNG/JPG | Recomendado PNG para qualidade |
| **Overlay** | `overlay.png` | Nativa | PNG32 | Suporta transparência total |
| **Ícones** | `static/` | Variável | PNG | Localizado na pasta `static/` |

---

## 📝 Configuração do Esquema (.ini)

Os arquivos `.ini` controlam cores, alinhamentos e comportamentos. O muOS usa um sistema de cascata: `muxlaunch.ini` (Menu) sobrescreve `default.ini`.

### 📋 Principais Seções e Chaves
O Studio suporta as seguintes seções oficiais:

1.  **`[background]`**: Papel de parede e opacidade.
2.  **`[font]`**: Definição de cores e famílias de fontes.
3.  **`[header]` / `[footer]`**: Altura, cores e alinhamento de texto/ícones.
4.  **`[list]` / `[image_list]`**: Estilo de lista vertical ou horizontal.
5.  **`[grid]`**: Transforma a lista em grade de ícones (Use `ROW_COUNT` e `COLUMN_COUNT` > 0).
6.  **`[status]`**: Elementos da barra de status (Bateria, Wi-Fi, BT).
7.  **`[battery]` / `[network]` / `[bluetooth]`**: Cores para estados Ativo/Baixo/Normal.
8.  **`[date]`**: Formatação e cores do relógio.
9.  **`[help]`**: Cores e alinhamento do rodapé de ajuda.
10. **`[navigation]`**: Textos e glifos dos botões (A, B, X, Y).
11. **`[charging]`**: Visual da bateria durante a carga.
12. **`[notification]`**: Alertas e mensagens flutuantes.
13. **`[bar]`**: Barras de progresso e volume.
14. **`[terminal]`**: Cores do log de boot.

> [!TIP]
> Use prefixos `0x` para cores em hexadecimal (ex: `0xFFFFFF`).

---

## 🔠 Fontes Customizadas

O muOS aceita dois formatos principais:
1.  **Fontes Pré-renderizadas (.bin)**: Mais leves, geradas pelo muOS Font Tool.
2.  **TrueType (.ttf)**: Mais dinâmicas, mas podem impactar levemente a performance.

As fontes podem ser divididas em subpastas:
- `header/`: Títulos no topo.
- `footer/`: Textos no rodapé.
- `list/`: Itens da lista principal.

---

## 🔄 Alternativas e Ativos

### 🎭 Sistema .muxalt
Arquivos `.muxalt` são ZIPs (v2) que contêm arquivos `.ini` e imagens alternativas. Permitem que um único tema tenha variações (ex: "Dark Mode", "Light Mode") sem duplicar todo o pacote.

### 📦 Ativos (.muxzip)
O arquivo `assets.muxzip` na raiz do tema fornece ícones específicos para pastas do Content Explorer e seções de catálogo (ex: ícones de consoles na grade).

---

## 🏁 Finalização e Empacotamento

1.  Certifique-se de que a estrutura de pastas está correta na raiz do ZIP.
2.  Adicione o arquivo `active.txt` informando qual resolução/pasta deve ser carregada por padrão (geralmente `640x480`).
3.  Comprima os arquivos usando o método "Deflate" normal.
4.  Renomeie a extensão de `.zip` para `.muxthm`.

---
*Referência baseada na documentação oficial: [muOS Dev Themes](https://muos.dev/themes)*
