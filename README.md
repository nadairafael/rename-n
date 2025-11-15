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
2. **Validação Automática**: Simplesmente selecione um ou mais layers no Figma
   - O plugin automaticamente mostra se a nomenclatura está correta
   - ✅ Layers válidas (já seguem as regras)
   - ❌ Layers inválidas (com sugestões de correção)
3. **Validação Manual**: Para validar a página inteira
   - Marque a opção **Apply to current page**
   - Clique em **Validate**
4. Para corrigir:
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

