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

type UIPluginMessage = ValidateMessage | ApplyFixMessage | FixAllMessage;

// Estado global
let currentScope: 'selected' | 'page' = 'selected';
let validationResults: ValidationResult[] = [];

// Elementos do DOM
const toggleButtons = document.querySelectorAll('.toggle-btn') as NodeListOf<HTMLButtonElement>;
const validateButton = document.querySelector('.validate-btn') as HTMLButtonElement;
const resultsContainer = document.querySelector('.results') as HTMLDivElement;

// Toggle entre "Selected Layers" e "Current Page"
toggleButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active de todos
    toggleButtons.forEach(btn => btn.classList.remove('active'));
    // Adiciona active no clicado
    button.classList.add('active');
    // Atualiza scope
    currentScope = button.dataset.scope as 'selected' | 'page';
  });
});

// Botão de validar
validateButton.addEventListener('click', () => {
  console.log('Botão validate clicado, scope:', currentScope);
  
  // Envia mensagem para o plugin
  parent.postMessage({
    pluginMessage: {
      type: 'validate',
      scope: currentScope
    } as ValidateMessage
  }, '*');
  
  console.log('Mensagem enviada para o plugin');
});

// Função para criar card de layer válida
function createValidCard(result: ValidationResult): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card';
  
  card.innerHTML = `
    <div class="card-header valid">
      <span class="icon">✅</span>
      <span>Valid</span>
    </div>
    <div class="card-body">
      <div class="valid-layer-name">${escapeHtml(result.currentName)}</div>
    </div>
  `;
  
  return card;
}

// Função para criar card de layer inválida
function createInvalidCard(result: ValidationResult): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card';
  
  const errorsHtml = result.errors.map(error => `<li>${escapeHtml(error)}</li>`).join('');
  
  card.innerHTML = `
    <div class="card-header invalid">
      <span class="icon">❌</span>
      <span>Invalid</span>
    </div>
    <div class="card-body">
      <div class="layer-name">
        <div class="current-name">
          Current: <strong>${escapeHtml(result.currentName)}</strong>
        </div>
        <div class="suggested-name">
          Suggested: <strong>${escapeHtml(result.suggestedName)}</strong>
        </div>
      </div>
      <div class="errors">
        <div class="errors-title">Errors:</div>
        <ul>${errorsHtml}</ul>
      </div>
      <button class="apply-btn" data-node-id="${result.nodeId}" data-new-name="${escapeHtml(result.suggestedName)}">
        Apply Fix
      </button>
    </div>
  `;
  
  // Adiciona listener ao botão
  const applyBtn = card.querySelector('.apply-btn') as HTMLButtonElement;
  applyBtn.addEventListener('click', () => {
    parent.postMessage({
      pluginMessage: {
        type: 'apply-fix',
        nodeId: result.nodeId,
        newName: result.suggestedName
      } as ApplyFixMessage
    }, '*');
    
    // Re-valida após aplicar
    setTimeout(() => {
      parent.postMessage({
        pluginMessage: {
          type: 'validate',
          scope: currentScope
        } as ValidateMessage
      }, '*');
    }, 100);
  });
  
  return card;
}

// Função para criar botão "Fix All"
function createFixAllButton(invalidResults: ValidationResult[]): HTMLElement {
  const button = document.createElement('button');
  button.className = 'fix-all-btn';
  button.textContent = 'Fix All';
  
  button.addEventListener('click', () => {
    const fixes = invalidResults.map(result => ({
      nodeId: result.nodeId,
      newName: result.suggestedName
    }));
    
    parent.postMessage({
      pluginMessage: {
        type: 'fix-all',
        fixes
      } as FixAllMessage
    }, '*');
    
    // Re-valida após aplicar
    setTimeout(() => {
      parent.postMessage({
        pluginMessage: {
          type: 'validate',
          scope: currentScope
        } as ValidateMessage
      }, '*');
    }, 100);
  });
  
  return button;
}

// Função para renderizar resultados
function renderResults(results: ValidationResult[]) {
  validationResults = results;
  resultsContainer.innerHTML = '';
  
  if (results.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = currentScope === 'selected' 
      ? 'Select layers to validate' 
      : 'No layers found on current page';
    resultsContainer.appendChild(emptyState);
    return;
  }
  
  const invalidResults = results.filter(r => !r.isValid);
  const validResults = results.filter(r => r.isValid);
  
  // Renderiza inválidos primeiro
  invalidResults.forEach(result => {
    resultsContainer.appendChild(createInvalidCard(result));
  });
  
  // Renderiza válidos depois
  validResults.forEach(result => {
    resultsContainer.appendChild(createValidCard(result));
  });
  
  // Adiciona botão "Fix All" se houver múltiplas layers inválidas
  if (invalidResults.length > 1) {
    resultsContainer.appendChild(createFixAllButton(invalidResults));
  }
}

// Função auxiliar para escapar HTML
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Listener para mensagens do plugin
window.onmessage = (event) => {
  console.log('Mensagem recebida da UI:', event.data);
  const msg = event.data.pluginMessage;
  
  if (msg && msg.type === 'validation-results') {
    console.log('Renderizando resultados:', msg.results);
    renderResults(msg.results);
  }
};

