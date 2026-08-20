# Case: persistência da interface

<span class="status-label status--implemented">Implementado</span>

## 1. Contexto

Algumas preferências da interface fazem sentido além da navegação atual.

Tema, estado da sidebar e filtros aplicados são exemplos de escolhas que o
usuário tende a esperar que sejam preservadas após atualizar ou trocar de
página.

## 2. Problema

Sem persistência, um reload poderia:

- retornar ao tema padrão;
- reabrir uma sidebar que o usuário havia minimizado;
- descartar filtros recém-configurados.

Por outro lado, persistir todo o estado da aplicação poderia restaurar
informações transitórias ou obsoletas.

## 3. Decisão técnica

A aplicação utiliza persistência seletiva:

- tema e sidebar permanecem no <code>localStorage</code>;
- seus estados reativos utilizam <code>useState</code>;
- filtros aplicados e limite das tabelas possuem TTL de uma hora;
- página, busca e ordenação permanecem transitórias;
- leitura e escrita do storage acontecem apenas no cliente.

<div class="decision-card">
  <strong>Decisão:</strong> persistir somente estados que representam uma
  preferência ou contexto útil para o usuário, evitando transformar o
  localStorage em uma cópia completa do estado da interface.
</div>

## 4. Funcionamento

~~~mermaid
flowchart LR
  Load["onMounted"] --> Storage["localStorage"]
  Storage --> Theme["theme-is-dark"]
  Storage --> Sidebar["sidebar-collapsed"]
  Theme --> DOM["data-theme"]
  Sidebar --> Layout["layout/flyout"]
  Filters["AppDataTable"] --> Timed["settings + expires_at"]
  Timed --> Storage
~~~

## 5. Trechos selecionados de código

### Restauração inicial

<p class="code-origin">Arquivo privado: <code>frontend/app/app.vue</code></p>

~~~ts
onMounted((): void => {
  const storedTheme = localStorage.getItem('theme');
  const storedSidebarCollapsed = localStorage.getItem('sidebar-collapsed');

  isDarkTheme.value = storedTheme === 'dark';
  sidebarCollapsed.value = storedSidebarCollapsed === 'true';

  applyTheme();

  setTimeout((): void => {
    appReady.value = true;
  }, 500);
});
~~~

Na inicialização do cliente, preferências anteriores são recuperadas antes da
liberação da interface principal.

### Alternância do tema

<p class="code-origin">Arquivo privado: <code>frontend/app/components/layouts/AppHeader.vue</code></p>

~~~ts
function toggleTheme(): void {
  isDarkTheme.value = !isDarkTheme.value;

  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');

  applyTheme();
}
~~~

### Sidebar minimizada

<p class="code-origin">Arquivo privado: <code>frontend/app/components/layouts/AppSidebar.vue</code></p>

~~~ts
function toggleSidebarCollapsed(): void {
  sidebarCollapsed.value = !sidebarCollapsed.value;

  localStorage.setItem('sidebar-collapsed', sidebarCollapsed.value ? 'true' : 'false');

  if (!sidebarUsesCollapsedLayout.value) {
    activeFlyoutMenu.value = null;
  }
}
~~~

### Configuração temporária da tabela

<p class="code-origin">Arquivo privado: <code>frontend/app/components/ui/AppDataTable.vue</code></p>

~~~ts
const settings: AppDataTableStorage = {
  expires_at: Date.now() + DATA_TABLE_STORAGE_TTL,
  filters: {...appliedFilterValues},
  limit: limit.value,
};

localStorage.setItem(tableStorageKey.value, JSON.stringify(settings));
~~~

A tabela adiciona expiração porque filtros representam contexto temporário, não
uma preferência permanente da aplicação.

## 6. Como o código é utilizado

<code>app.vue</code> restaura as preferências principais da interface.

O Header persiste a escolha de tema e a Sidebar registra seu estado expandido
ou minimizado.

Cada AppDataTable recebe uma chave própria, como
<code>customers.list.settings</code>, impedindo que filtros de diferentes
entidades compartilhem o mesmo estado.

## 7. Resultado

- Tema permanece após reload.
- Sidebar mantém o modo escolhido pelo usuário.
- Filtros recentes podem ser recuperados.
- Cada listagem possui armazenamento independente.
- Estados temporários não são persistidos indiscriminadamente.
- A responsabilidade de persistência permanece próxima ao componente que
  controla aquele estado.

## 8. Trade-offs atuais

Tema e sidebar são tratados como preferências duradouras e, por isso, não
possuem TTL.

Filtros de listagem possuem expiração porque seu valor tende a ser relevante
apenas durante um período de trabalho recente.

Busca, página atual e ordenação não são persistidas deliberadamente, evitando
que uma listagem seja restaurada posteriormente em uma posição excessivamente
específica.

O carregamento inicial utiliza atualmente uma espera fixa antes de marcar a
aplicação como pronta. Esse comportamento pode ser revisto para verificar se o
mesmo resultado visual pode ser obtido sem um tempo artificial.

## 9. Evoluções possíveis

- Adicionar versionamento das chaves somente quando mudanças incompatíveis de
  schema surgirem.
- Sincronizar preferências entre abas caso essa necessidade apareça no uso
  real.
- Considerar a preferência do sistema operacional como padrão para novos
  usuários.