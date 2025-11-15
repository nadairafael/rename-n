pare# Casos de Teste para o Plugin

## Como Testar

1. Abra o Figma
2. Crie um novo arquivo ou use um existente
3. Crie layers com os nomes abaixo
4. Execute o plugin e valide os resultados

## Casos de Teste

### ✅ Casos Válidos (devem passar)

#### Formato base kebab-case
- `header`
- `main-content`
- `footer-section`
- `user-profile-card`

#### Hierarquia - Stacks
- `content-v-stack`
- `menu-h-stack`
- `sidebar-v-stack`
- `actions-h-stack`

#### Hierarquia - Containers
- `header-container`
- `form-container`
- `modal-container`

#### Hierarquia - Wrappers
- `left-wrapper`
- `content-wrapper`
- `overlay-wrapper`

#### Modificadores
- `button--primary`
- `button--secondary`
- `card--elevated`
- `input--error`
- `menu--item`
- `list--horizontal`

#### Prefixo de Projeto (apenas em frames raiz)
- `fm--web-app`
- `fm--mobile-app`
- `fm--admin-panel`

#### Nomes simples
- `header`
- `footer`
- `sidebar`
- `content`

#### Com números
- `item-1`
- `section-2`
- `card-01`

### ❌ Casos Inválidos (devem falhar e sugerir correção)

#### Maiúsculas (camelCase, PascalCase)
- `headerContainer` → `header-container`
- `MainContent` → `main-content`
- `UserProfile` → `user-profile`
- `contentVStack` → `content-v-stack`

#### Underscores (snake_case)
- `header_container` → `header-container`
- `main_content` → `main-content`
- `user_profile` → `user-profile`

#### Espaços
- `header container` → `header-container`
- `main content` → `main-content`

#### Modificadores incorretos (__ ao invés de --)
- `button__primary` → `button--primary`
- `card___elevated` → `card--elevated`
- `menu__item` → `menu--item`

#### Misto de problemas
- `Header_Container` → `header-container`
- `mainContent__Item` → `main-content--item`
- `User Profile Card` → `user-profile-card`

## Cenários de Teste

### Cenário 1: Validar Seleção
1. Selecione 3-5 layers com nomes válidos e inválidos
2. Mantenha toggle em "Selected Layers"
3. Clique em "Validate"
4. Verifique se apenas as layers selecionadas aparecem nos resultados

### Cenário 2: Validar Página Inteira
1. Crie várias layers na página
2. Não selecione nenhuma
3. Mude toggle para "Current Page"
4. Clique em "Validate"
5. Verifique se todas as layers da página aparecem nos resultados

### Cenário 3: Aplicar Correção Individual
1. Crie uma layer com nome inválido: `headerContainer`
2. Selecione e valide
3. Verifique se mostra sugestão: `header-container`
4. Clique em "Apply Fix"
5. Verifique se o nome da layer foi alterado no Figma

### Cenário 4: Aplicar Todas as Correções
1. Crie 5+ layers com nomes inválidos
2. Selecione todas e valide
3. Verifique se aparece botão "Fix All"
4. Clique em "Fix All"
5. Verifique se todas as layers foram renomeadas

### Cenário 5: Layers Aninhadas
1. Crie estrutura:
   ```
   Frame
   ├─ Container_Group
   │  ├─ headerText
   │  └─ content__item
   └─ footer-container
   ```
2. Valide "Current Page"
3. Verifique se todas as layers aninhadas foram validadas

### Cenário 6: Frames Raiz com Prefixo
1. Crie um Frame na raiz da página (nível superior)
2. Nomeie como: `fm--web-app`
3. Valide
4. Verifique se é considerado válido (prefixo de projeto permitido)

## Resultados Esperados

### Interface
- ✅ Cards verdes para nomes válidos
- ❌ Cards vermelhos para nomes inválidos
- Sugestões de correção claras e precisas
- Lista de erros detalhada para cada layer inválida
- Botão "Fix All" aparece quando há 2+ layers inválidas

### Validação
- Detecta corretamente todos os padrões inválidos
- Gera sugestões corretas seguindo as regras
- Não modifica nomes que já estão corretos

### Correção
- "Apply Fix" renomeia a layer corretamente
- "Fix All" renomeia todas as layers de uma vez
- Plugin re-valida automaticamente após correção

