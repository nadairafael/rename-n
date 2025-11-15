# 🎯 Modo Inteligente - Smart Batch Validation

## O Que é?

O Modo Inteligente permite que você encontre e corrija **TODOS** os layers com o mesmo nome na página atual, selecionando apenas um deles.

## Como Funciona?

### Modo Normal (Padrão)
- **Checkbox desmarcado**
- Seleciona um layer → Valida apenas aquele layer
- Ideal para validações pontuais

### Modo Inteligente (Batch)
- **Checkbox marcado: "Apply to current page"**
- Seleciona um layer → Busca TODOS os layers com o mesmo nome
- Mostra badge: "🔍 Found X layers with the same name"
- Ideal para correções em massa

## Casos de Uso Reais

### 1. Padronizar Componentes Duplicados
**Problema:** Você tem 15 "Button" espalhados pela página com nomes inconsistentes.

**Solução:**
1. Marque "Apply to current page"
2. Selecione qualquer "Button"
3. Plugin encontra todos os 15
4. "Fix All" → Todos viram "button"

**Tempo economizado:** De 15 cliques para 1!

### 2. Corrigir Imports com Nomes Errados
**Problema:** Importou um componente "Icon" que deveria ser "icon", usado 20 vezes.

**Solução:**
1. Marque "Apply to current page"
2. Selecione um "Icon"
3. Plugin mostra todos os 20
4. "Fix All" → Correção instantânea

### 3. Refatoração de Nomenclatura
**Problema:** Mudou o padrão de "myButton" para "my-button" em 30 lugares.

**Solução:**
1. Marque "Apply to current page"
2. Selecione um "myButton"
3. Plugin encontra todos
4. Verifica a sugestão: "my-button"
5. "Fix All" → Padronizado!

## Fluxo de Trabalho

```
┌─────────────────────────────────────────┐
│  Seleciona 1 layer com nome duplicado   │
│  Checkbox: "Apply to current page" ✓    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Plugin busca em TODA a página          │
│  Encontra todos com mesmo nome          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Badge: "🔍 Found 10 layers"            │
│  Mostra validação de todos              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  "Fix All" → Renomeia todos de uma vez  │
│  Notificação: "10 layers renamed!"      │
└─────────────────────────────────────────┘
```

## Recursos Inteligentes

### 1. Busca em Tempo Real
- Muda a seleção → Busca atualiza automaticamente
- Marca/desmarca checkbox → Alterna entre modos instantaneamente

### 2. Múltiplos Nomes
- Selecione "Button" + "Icon" → Encontra todos de ambos
- Agrupa resultados de forma clara

### 3. Feedback Visual
- Badge azul quando encontra múltiplos
- Contador de layers encontrados
- Cards individuais para cada ocorrência

### 4. Correção Segura
- Mostra preview de TODOS antes de aplicar
- Aplica correção em todos simultaneamente
- Re-valida automaticamente após correção

## Comparação: Antes vs Depois

### Antes (Sem Modo Inteligente)
```
1. Seleciona "Button" #1 → Valida → Fix
2. Seleciona "Button" #2 → Valida → Fix
3. Seleciona "Button" #3 → Valida → Fix
...
15. Seleciona "Button" #15 → Valida → Fix

⏱️ Tempo: ~5 minutos
🖱️ Cliques: ~45
😓 Experiência: Repetitiva e tediosa
```

### Depois (Com Modo Inteligente)
```
1. Marca checkbox
2. Seleciona qualquer "Button"
3. Clica "Fix All"

⏱️ Tempo: ~10 segundos
🖱️ Cliques: 3
😍 Experiência: Eficiente e satisfatória
```

## Tips & Tricks

### Tip 1: Use para Auditoria
Selecione um componente suspeito com o checkbox marcado para ver quantas ocorrências existem na página.

### Tip 2: Validação por Partes
1. Selecione um tipo (ex: "Button")
2. Corrija todos
3. Selecione outro tipo (ex: "Icon")
4. Corrija todos

### Tip 3: Combine com Validação da Página
1. Use "Validate" sem seleção para ver overview geral
2. Depois, use modo inteligente para corrigir cada tipo

## Atalhos Mentais

| Ação | Resultado |
|------|-----------|
| Checkbox OFF + Selecionar | Valida apenas o selecionado |
| Checkbox ON + Selecionar | Busca todos com mesmo nome |
| Checkbox ON + Validate | Valida TODA a página |
| Fix All (batch) | Corrige todos os encontrados |

## Performance

- **Busca rápida:** Varre toda a página em milissegundos
- **Sem lag:** Atualização em tempo real
- **Escalável:** Funciona bem com centenas de layers

## Limitações Conhecidas

1. Busca apenas na página atual (não em outras páginas)
2. Busca por nome exato (não usa regex ou fuzzy match)
3. Não agrupa por tipo de layer (Frame, Text, etc)

## Roadmap Futuro

- [ ] Buscar em múltiplas páginas
- [ ] Filtros por tipo de layer
- [ ] Histórico de correções
- [ ] Desfazer em lote
- [ ] Busca com wildcards

---

**Versão:** 2.0  
**Feature:** Smart Batch Validation  
**Status:** ✅ Implementado e Testado

