# muOS Theme Studio

Um ambiente de desenvolvimento completo e baseado no navegador (Web) para a criação, edição master e gerenciamento de temas do sistema operacional de emulação portátil **MustardOS (muOS)**.

## 🚀 O Problema que Resolvemos
Criar ou editar um tema original do muOS (pacotes `.muxthm`) exigia que a comunidade descompactasse arquivos zip, lidasse com pastas complexas para cada resolução de tela (`640x480`, `720x480`, etc.) e escrevesse linhas estáticas de código dentro de centenas de parâmetros no `scheme/global.ini` sem ter a mínima ideia visual de como ficaria a tela principal do console.

O **muOS Theme Studio** elimina isso. Nós possuímos um Canvas interativo em tempo real para as edições e um motor engenhoso de "Arquivamento e Retenção" em JSZip que blinda a criação do usuário.

## ⚙️ Stack Tecnológica
* **Frontend Core:** Next.js (App Router), React, TypeScript.
* **Estilização Visual:** Tailwind CSS v4, Componentes Shadcn/ui, Ícones Lucide-React.
* **Gerenciamento de Estado:** Zustand.
* **Engenharia de Arquivos Internos (Browser):** JSZip (Manipulação de RAM) e File-Saver.

---

## 🏗️ Módulos e Funcionalidades Construídas

### 1. Canvas de Simulação (Pre-Preview Visual)
Uma mockagem visual que espelha os componentes fundamentais do console (Header, Lista Central do RetroArch/Explore, Barra Inferior). Qualquer alteração de propriedade nos inputs altera dinamicamente essa tela graças a variáveis CSS injetadas em tempo real pelas propriedades reativas do Zustand Store.

### 2. Motor de Engenharia Reversa (Importação JSZip)
* **Não-Destrutivo:** Em ferramentas rasas de geradores, a exportação deletaria ativos customizados que o desenvolvedor inicial do tema incluiu como Fontes (`.ttf`), Efeitos Sonoros (`sound/`) e cursores personalizados. 
* O nosso Script (`utils/importTheme.ts`) aciona o objeto de Upload do usuário, usa a `JSZip` File API, "lê" todos os arquivos para a memória cache sem corrompê-los e passa a varrer a pasta virtual `scheme/`.
* Nós abrimos o `global.ini` ou `default.ini`, executamos limpezas em hexadecimal (`parseHex()`), e atualizamos os campos do Side-Panel com a arquitetura base para o que foi upado, entregando as palhetas nas mãos do usuário!

### 3. Mutação Profunda do INI (Expressão Regular - Regex)
Quando injetamos as novas variáveis de Cores, Background Alpha ou Texto Ativo, **não redescrevemos o arquivo do zero**. O utilitário `utils/exportTheme.ts` rastreia silenciosamente palavras exatas no layout `.ini` legado original (`BACKGROUND`, `LIST_FOCUS_TEXT`, `BAR_PROGRESS_ACTIVE_BACKGROUND`) e atualiza com seus novos preenchimentos, impedindo a perda de propriedades específicas (como a dimensão das grades)!

### 4. Gerenciador Multi-res de Assets e Wallpapers
A "Mágica de Dev". Ao arrastar ou selecionar um Wallpaper base em JPG/PNG no painel "Assets":
* *Leitura Frontend:* Ele vira provisoriamente um `.base64` DataURI no Store para tingir a simulação o Canva.
* *Empacotamento Backend (Browser):* No clique final de `Export`, o app reconverte a imagem em arquivo cru para Byte Block, e duplica-a automaticamente em **TRES DIRETÓRIOS OBRIGATÓRIOS DO MUOS** mascarados pelo `.zip`:
  1. `640x480/image/wall/default.png`
  2. `720x480/image/wall/default.png`
  3. `720x720/image/wall/default.png`
* Assim, garantimos 100% de compatibilidade tanto com o Trimui Smart Pro quanto a família RG35XX simultaneamente através de 1 só clique!

---

## 💻 Como Rodar o Projeto

É obrigatório possuir a runtime do `Node.js` instalada.

1. Navegue até o diretório do projeto: `cd /Projetos/muos-theme-maker/`
2. Instale as dependências (se necessário): `npm install`
3. Rode o Servidor de Desenvolvimento: `npm run dev`
4. Abra o Sandbox através do `http://localhost:3000` (ou preste atenção na porta indicada no terminal, como `:3002` se houverem outros softwares ligados).
5. O Next.js construirá virtualmente o mapa com as rotas do Turbopack, basta upar um tema real lá da galeria (https://theme.muos.dev/) no botão "Import (.muxthm)"!
