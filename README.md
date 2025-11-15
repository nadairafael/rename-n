# rename-n

Plugin do Figma para validar e corrigir nomenclatura de layers seguindo padrões kebab-case.

## Regras de Nomenclatura

### Formato Base
- ✅ kebab-case (minúsculo + hífen)
- ❌ camelCase, snake_case, PascalCase

### Hierarquia de Containers
- `[nome]-v-stack` → vertical stack (auto-layout)
- `[nome]-h-stack` → horizontal stack (auto-layout)
- `[nome]-container` → agrupamento funcional
- `[posição/função]-wrapper` → envolve elementos

### Modificadores
Use `--` (double dash) para variações:
- `menu--item`
- `button--primary`
- `card--elevated`

### Prefixo de Projeto
Apenas no frame raiz da tela:
- `fm--web-app`
- `fm--mobile-app`

## Como Instalar

1. Abra o Figma
2. Vá em **Plugins** → **Development** → **Import plugin from manifest...**
3. Selecione o arquivo `manifest.json` deste projeto

## Como Usar

1. Abra o plugin: **Plugins** → **Development** → **Layer Naming Validator**

2. **Validação Automática em Tempo Real**:
   - Simplesmente selecione um ou mais layers no Figma
   - O plugin automaticamente mostra se a nomenclatura está correta
   - ✅ Layers válidas (já seguem as regras)
   - ❌ Layers inválidas (com sugestões de correção)

3. **🎯 Modo Inteligente - Validação em Lote** (NOVO!):
   - Marque a opção **Apply to current page**
   - Selecione um layer com nome duplicado (ex: "Button")
   - O plugin automaticamente encontra **TODOS** os layers na página com o mesmo nome
   - Mostra um badge: "🔍 Found X layers with the same name"
   - Corrija todos de uma vez com **Fix All**

4. **Validação da Página Inteira**:
   - Marque **Apply to current page**
   - Clique em **Validate** (sem selecionar nada)
   - Valida todos os layers da página

5. **Para Corrigir**:
   - Clique em **Apply Fix** em uma layer específica
   - Ou clique em **Fix All** para corrigir todas de uma vez

## Desenvolvimento

### Pré-requisitos
- Node.js instalado

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

### Watch Mode (desenvolvimento)
```bash
npm run watch
```

## Estrutura do Projeto

```
rename-n/
├── manifest.json     # Configuração do plugin
├── code.ts          # Lógica principal (sandbox do Figma)
├── code.js          # Compilado
├── ui.html          # Interface do usuário
├── ui.ts            # Lógica da UI
├── ui.js            # Compilado
├── package.json     # Dependências
└── tsconfig.json    # Config TypeScript
```

## Exemplos de Validação

### ✅ Nomes Válidos
```
content-v-stack
header-container
left-wrapper
menu--item
button--primary
fm--web-app
```

### ❌ Nomes Inválidos
```
contentStack       → content-stack
header_container   → header-container
LeftWrapper        → left-wrapper
menu__item         → menu--item
```

## 🚀 Casos de Uso do Modo Inteligente

### Exemplo: Renomear Múltiplos Buttons
1. Você tem 10 layers chamados "Button" espalhados pela página
2. Marque **Apply to current page**
3. Selecione qualquer um dos "Button"
4. O plugin mostra: "🔍 Found 10 layers with the same name"
5. Clique em **Fix All** para renomear todos para "button" (kebab-case)

### Exemplo: Padronizar Icons
1. Você tem vários "Icon" e "icon" misturados
2. Marque **Apply to current page**
3. Selecione um "Icon"
4. O plugin encontra todos e sugere "icon" (minúsculo)
5. Correção em lote com um clique!

