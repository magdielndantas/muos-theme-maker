# muOS Theme Studio — Plano de Melhorias

## Problemas Identificados

### 🔴 Críticos
1. **Abas do Inspector invisíveis** — As tabs "SCHEME", "ASSETS", "GLYPHS" têm contraste quase zero quando inativas. Precisam de cor de texto visível no estado padrão.
2. **Header do canvas corrompido** — O ícone `<Monitor>` do Lucide sobrepõe o texto do título. O resultado visual é `M▭▭▭ MENU` em vez de um header limpo.

### 🟡 Melhorias de UX
3. **Sidebar sem scroll** — A sidebar excede o viewport em telas menores e não tem scrollbar visível.
4. **Mock content genérico** — O Main Menu sempre mostra "General Settings / Display Options..." em vez dos itens reais do `muxlaunch` (Explore, Collection, History, Apps, etc.).
5. **Canvas vazio** — Sem wallpaper, o canvas mostra fundo preto sem nenhuma sugestão visual de como ficaria o tema.
6. **Falta feedback de progresso** — Ao importar/exportar, não há toast/notificação de sucesso ou erro.

### 🟢 Polimento Visual
7. **Inspector accordion sem ícones** — Os groups do scheme poderiam ter ícones pequenos para melhor escaneabilidade.
8. **Seletor de resolução** — As opções estão hardcoded; faltam `1280x720`, `854x480`, `480x320`, `320x240`.

## Plano de Execução

### Fase 1 — Bugs críticos (page.tsx)
- [ ] Corrigir header do canvas: remover ícone Monitor sobreposto ao título
- [ ] Corrigir abas do Inspector: ajustar contraste das tabs inativas

### Fase 2 — UX
- [ ] Corrigir mock content do Main Menu para mostrar itens reais do muxlaunch
- [ ] Adicionar toast de sucesso/erro ao importar e exportar
- [ ] Adicionar resoluções faltantes ao seletor

### Fase 3 — Polimento
- [ ] Melhorar visual geral do canvas com grid de fundo mais refinado
- [ ] Sidebar: garantir scroll visível

## Arquivos Afetados
- `src/app/page.tsx` — todos os bugs visuais e de UX
- `src/app/globals.css` — ajustes de scrollbar e estilos globais
