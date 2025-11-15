// Tipos para validação
interface ValidationResult {
  isValid: boolean;
  currentName: string;
  suggestedName: string;
  errors: string[];
  nodeId: string;
}

interface ValidationMessage {
  type: 'validation-results';
  results: ValidationResult[];
}

interface ValidateMessage {
  type: 'validate';
  scope: 'selected' | 'page';
}

interface ApplyFixMessage {
  type: 'apply-fix';
  nodeId: string;
  newName: string;
}

interface FixAllMessage {
  type: 'fix-all';
  fixes: Array<{ nodeId: string; newName: string }>;
}

interface ResizeMessage {
  type: 'resize';
  width: number;
  height: number;
}

type CodePluginMessage = ValidateMessage | ApplyFixMessage | FixAllMessage | ResizeMessage;

// Função para validar se está em kebab-case (permite -- para modificadores)
function isKebabCase(name: string): boolean {
  // Permite letras minúsculas, números e hífens (incluindo --)
  // Não pode começar ou terminar com hífen
  return /^[a-z0-9]+([--]+[a-z0-9]+)*$/.test(name);
}

// Função para converter para kebab-case
function toKebabCase(name: string): string {
  let result = name;
  
  // 1. Substitui __ ou mais underscores por um marcador temporário
  result = result.replace(/_{2,}/g, '§DOUBLE§');
  
  // 2. Substitui underscores simples por hífen
  result = result.replace(/_/g, '-');
  
  // 3. Converte camelCase e PascalCase para kebab-case
  // Adiciona hífen antes de letras maiúsculas precedidas por minúsculas
  result = result.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  
  // Adiciona hífen antes de letras maiúsculas seguidas por minúsculas (para casos como "XMLParser")
  result = result.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2');
  
  // 4. Substitui espaços por hífen
  result = result.replace(/\s+/g, '-');
  
  // 5. Converte tudo para minúsculas
  result = result.toLowerCase();
  
  // 6. Restaura o marcador temporário para --
  result = result.replace(/§double§/g, '--');
  
  // 7. Remove hífens múltiplos (exceto --) - normaliza --- ou mais para -
  result = result.replace(/-{3,}/g, '-');
  
  // 8. Remove hífens do início e fim
  result = result.replace(/^-+|-+$/g, '');
  
  return result;
}

// Tipos de hierarquia
type HierarchyType = 'stack' | 'container' | 'wrapper' | 'element' | 'modifier';

// Função para verificar se tem sufixo de hierarquia
function hasHierarchySuffix(name: string): boolean {
  const validSuffixes = [
    '-v-stack',
    '-h-stack',
    '-container',
    '-wrapper'
  ];
  
  return validSuffixes.some(suffix => name.endsWith(suffix));
}

// Função para determinar o tipo de hierarquia
function getHierarchyType(name: string): HierarchyType {
  if (name.endsWith('-v-stack') || name.endsWith('-h-stack')) {
    return 'stack';
  }
  if (name.endsWith('-container')) {
    return 'container';
  }
  if (name.endsWith('-wrapper')) {
    return 'wrapper';
  }
  if (name.includes('--')) {
    return 'modifier';
  }
  return 'element';
}

// Função para extrair contexto do pai (remove sufixos de hierarquia)
function extractParentContext(parentName: string): string {
  const suffixesToRemove = [
    '-v-stack',
    '-h-stack',
    '-container',
    '-wrapper'
  ];
  
  let context = parentName;
  for (const suffix of suffixesToRemove) {
    if (context.endsWith(suffix)) {
      context = context.slice(0, -suffix.length);
      break;
    }
  }
  
  return context;
}

// Função para encontrar o wrapper mais próximo na hierarquia
function findNearestWrapper(node: SceneNode): string | null {
  let current = node.parent;
  
  while (current && 'name' in current && current.type !== 'PAGE') {
    const parentType = getHierarchyType(current.name);
    if (parentType === 'wrapper') {
      return extractParentContext(current.name);
    }
    current = current.parent;
  }
  
  return null;
}

// Função para validar hierarquia (sufixos válidos)
function hasValidHierarchy(name: string): boolean {
  const validSuffixes = [
    '-v-stack',
    '-h-stack',
    '-container',
    '-wrapper'
  ];
  
  // Verifica se termina com algum sufixo válido OU se não tem sufixo de hierarquia
  const hasHierarchySuffixInName = validSuffixes.some(suffix => name.includes('-stack') || name.includes('-container') || name.includes('-wrapper'));
  
  if (!hasHierarchySuffixInName) {
    return true; // Não tem sufixo de hierarquia, é válido (mas pode precisar de contexto)
  }
  
  return validSuffixes.some(suffix => name.endsWith(suffix));
}

// Função para validar prefixo de projeto (apenas em frames raiz)
function validateProjectPrefix(node: SceneNode): { isValid: boolean; error?: string } {
  const name = node.name;
  const hasDoubleModifier = /--/.test(name);
  
  // Se tem --, deve ser um frame raiz ou modificador
  if (hasDoubleModifier) {
    // Verifica se é um frame de nível superior (frame raiz)
    if (node.type === 'FRAME' && node.parent?.type === 'PAGE') {
      // É válido ter -- em frames raiz (prefixo de projeto)
      return { isValid: true };
    }
    
    // Se não é frame raiz, -- é usado para modificadores, que é válido
    return { isValid: true };
  }
  
  return { isValid: true };
}

// Função principal de validação
function validateLayerName(node: SceneNode): ValidationResult {
  const currentName = node.name;
  const errors: string[] = [];
  let suggestedName = currentName;

  // 1. Converter para kebab-case
  suggestedName = toKebabCase(currentName);

  // 2. Identificar problemas específicos de formato
  const hasUpperCase = /[A-Z]/.test(currentName);
  const hasUnderscore = /_/.test(currentName);
  const hasSpace = /\s/.test(currentName);
  const hasDoubleUnderscore = /__/.test(currentName);

  if (hasUpperCase) {
    errors.push('Contains uppercase letters');
  }
  if (hasDoubleUnderscore) {
    errors.push('Incorrect use of modifiers (use -- instead of __)');
  } else if (hasUnderscore) {
    errors.push('Contains underscores (_)');
  }
  if (hasSpace) {
    errors.push('Contains spaces');
  }

  // 3. Validar hierarquia de sufixos
  if (!hasValidHierarchy(suggestedName)) {
    errors.push('Invalid hierarchy suffix (use -v-stack, -h-stack, -container or -wrapper)');
  }

  // 4. Validar estrutura hierárquica (Stack → Container → Wrapper → Element)
  const currentType = getHierarchyType(suggestedName);
  
  // Se é um elemento simples ou modificador, validar contexto
  if (currentType === 'element' && node.parent && 'name' in node.parent && node.parent.type !== 'PAGE') {
    const parentType = getHierarchyType(node.parent.name);
    
    // Elementos só podem estar dentro de Wrapper
    if (parentType === 'stack') {
      errors.push('Elements must be inside Container or Wrapper, not directly in Stack');
      
      // Sugestão: adicionar sufixo apropriado
      suggestedName = `${suggestedName}-wrapper`;
    } else if (parentType === 'container') {
      errors.push('Elements must be inside Wrapper, not directly in Container');
      
      // Sugestão: adicionar sufixo apropriado
      suggestedName = `${suggestedName}-wrapper`;
    } else if (parentType === 'wrapper') {
      // Correto! Elemento dentro de wrapper, adicionar contexto
      const wrapperContext = extractParentContext(node.parent.name);
      
      if (!suggestedName.endsWith(`-${wrapperContext}`)) {
        suggestedName = `${suggestedName}-${wrapperContext}`;
        errors.push('Missing parent wrapper context');
      }
    } else if (parentType === 'element') {
      // Pai é elemento, buscar wrapper mais próximo
      const nearestWrapper = findNearestWrapper(node);
      
      if (nearestWrapper) {
        if (!suggestedName.endsWith(`-${nearestWrapper}`)) {
          suggestedName = `${suggestedName}-${nearestWrapper}`;
          errors.push('Missing wrapper context');
        }
      } else {
        errors.push('Element must be inside a hierarchy with Wrapper');
      }
    }
  }
  
  // Modificadores não precisam de contexto
  if (currentType === 'modifier') {
    // Modificadores são sempre válidos (já validados no formato)
  }

  // 5. Verificar se realmente mudou
  const isValid = currentName === suggestedName && errors.length === 0;

  return {
    isValid,
    currentName,
    suggestedName,
    errors,
    nodeId: node.id
  };
}

// Função para coletar todas as layers
function getAllLayers(node: BaseNode): SceneNode[] {
  const layers: SceneNode[] = [];
  
  if ('children' in node) {
    for (const child of node.children) {
      // Adiciona o child apenas se for um SceneNode válido
      if ('name' in child) {
        layers.push(child as SceneNode);
        layers.push(...getAllLayers(child));
      }
    }
  }
  
  return layers;
}

// Função para validar escopo
function validateScope(scope: 'selected' | 'page'): ValidationResult[] {
  let nodesToValidate: SceneNode[] = [];

  if (scope === 'selected') {
    nodesToValidate = figma.currentPage.selection as SceneNode[];
  } else if (scope === 'page') {
    nodesToValidate = getAllLayers(figma.currentPage);
  }

  return nodesToValidate.map(node => validateLayerName(node));
}

// Função para aplicar correção
function applyFix(nodeId: string, newName: string): boolean {
  const node = figma.getNodeById(nodeId);
  if (node && 'name' in node) {
    node.name = newName;
    return true;
  }
  return false;
}

// Handler de mensagens
figma.ui.onmessage = (msg: CodePluginMessage) => {
  console.log('Mensagem recebida:', msg);
  
  if (msg.type === 'validate') {
    console.log('Validando scope:', msg.scope);
    const results = validateScope(msg.scope);
    console.log('Resultados:', results);
    
    figma.ui.postMessage({
      type: 'validation-results',
      results
    } as ValidationMessage);
  } else if (msg.type === 'apply-fix') {
    const success = applyFix(msg.nodeId, msg.newName);
    if (success) {
      figma.notify('Layer renamed successfully!');
    }
  } else if (msg.type === 'fix-all') {
    let successCount = 0;
    for (const fix of msg.fixes) {
      if (applyFix(fix.nodeId, fix.newName)) {
        successCount++;
      }
    }
    figma.notify(`${successCount} layers renamed successfully!`);
  } else if (msg.type === 'resize') {
    figma.ui.resize(msg.width, msg.height);
  }
};

// Listener para mudanças de seleção
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection as SceneNode[];
  
  if (selection.length > 0) {
    const results = selection.map(node => validateLayerName(node));
    figma.ui.postMessage({
      type: 'validation-results',
      results
    } as ValidationMessage);
  } else {
    // Limpa os resultados quando não há seleção
    figma.ui.postMessage({
      type: 'validation-results',
      results: []
    } as ValidationMessage);
  }
});

// Mostrar UI
figma.showUI(__html__, { width: 240, height: 100 });

// Valida a seleção inicial quando o plugin é aberto
const initialSelection = figma.currentPage.selection as SceneNode[];
if (initialSelection.length > 0) {
  const results = initialSelection.map(node => validateLayerName(node));
  figma.ui.postMessage({
    type: 'validation-results',
    results
  } as ValidationMessage);
}

