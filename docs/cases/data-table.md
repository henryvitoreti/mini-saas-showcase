# Case: AppDataTable

<span class="status-label status--implemented">Implementado</span>

O componente completo permanece privado. Este case apresenta apenas recortes
necessários para demonstrar sua configuração, comportamento e principais
decisões técnicas.

## 1. Contexto

Clientes, roles e tenants utilizam listagens com comportamentos recorrentes:

- busca server-side;
- filtros;
- paginação;
- ordenação;
- exportação;
- ações CRUD;
- responsividade.

## 2. Problema

Implementar individualmente toolbar, paginação, query params, filtros,
persistência e ações em cada Page aumentaria repetição e dificultaria manter a
mesma experiência entre módulos.

## 3. Decisão técnica

<code>AppDataTable</code> recebe uma configuração declarativa e a URL do
recurso.

O componente concentra a infraestrutura comum da listagem, enquanto cada Page
define:

- colunas;
- labels;
- URLs;
- filtros específicos;
- customizações de célula.

Filtros e células permanecem extensíveis através de slots.

## 4. Funcionamento

~~~mermaid
flowchart LR
  Page["Página concreta"] --> Props["columns + URLs + defaults"]
  Page --> Slots["filters / cell-*"]
  Props --> Table["AppDataTable"]
  Slots --> Table
  Table --> Params["search/page/limit/sort/filters"]
  Params --> API["apiHttpClient"]
  API --> Render["rows + pagination"]
  Table --> Export["XLS/PDF"]
  Table --> Actions["show/edit/delete"]
~~~

## 5. Trechos selecionados de código

### Props e configurações padrão

<p class="code-origin">Arquivo privado: <code>frontend/app/components/ui/AppDataTable.vue</code></p>

~~~ts
const DATA_TABLE_STORAGE_TTL = 60 * 60 * 1000;
const DATA_TABLE_FETCH_DEBOUNCE_DELAY = 400;
const DATA_TABLE_EXPORT_LIMIT = 1000;

// Trecho omitido para demonstração

const props = withDefaults(
  defineProps<AppDataTableProps>(),
  {
    title: 'Registros',
    entityLabel: 'registro',
    hasShow: true,
    hasEdit: true,
    hasDelete: true,
    hasRestore: false,
    hasCreate: true,
    hasSearch: true,
    hasRefresh: true,
    hasExport: true,
    hasFilters: true,
    searchPlaceholder: 'Pesquisar...',
    defaultFilters: () => ({}),
    defaultSortBy: 'id',
    defaultOrder: 'DESC',
    hasLimitSelector: true,
    defaultLimit: 20,
    limitOptions: () => [10, 20, 50, 100],
    withDetails: true,
    filterCountGroups: null,
    beforeEdit: null,
    beforeDelete: null,
  },
);
~~~

### Busca com debounce

<p class="code-origin">Arquivo privado: <code>frontend/app/components/ui/AppDataTable.vue</code></p>

~~~ts
const debouncedFetchRows = debounce((): void => {
  void fetchRows();
}, DATA_TABLE_FETCH_DEBOUNCE_DELAY);

watch(localSearch, (): void => {
  page.value = 1;
  exportMenuOpen.value = false;
  clearSelectedRow();
  debouncedFetchRows();
});
~~~

A busca aguarda 400 ms após a alteração. Uma nova consulta volta para a
primeira página e limpa a seleção atual.

### Paginação, ordenação e filtros

<p class="code-origin">Arquivo privado: <code>frontend/app/components/ui/AppDataTable.vue</code></p>

~~~ts
function buildParams(): Record<string, string|number|boolean> {
  const params: Record<string, TableFilterValue> = {
    search: localSearch.value || null,
    page: page.value,
    limit: limit.value,
    sort_by: sortBy.value,
    order: order.value,
  };

  if (props.withDetails !== false) {
    params.with_details = true;
  }

  Object.entries(appliedFilterValues).forEach(([name, value]): void => {
    if (!Array.isArray(value)) {
      params[name] = value;
    }
  });

  return normalizeQueryParams(params);
}
~~~

Filtros em edição e filtros já aplicados são mantidos separadamente.

Isso permite abrir o painel, modificar valores e cancelar sem alterar a
listagem atual.

<p class="code-origin">Arquivo privado: <code>frontend/app/components/ui/AppDataTable.vue</code></p>

~~~ts
function applyFilters(): void {
  cancelDebouncedFetchRows();
  exportMenuOpen.value = false;
  closeFilters();
  copyFilterValues(appliedFilterValues, filterValues);
  page.value = 1;
  persistSettings();
  clearSelectedRow();
  void fetchRows();
}
~~~

### Persistência temporária no localStorage

<p class="code-origin">Arquivo privado: <code>frontend/app/components/ui/AppDataTable.vue</code></p>

~~~ts
function persistSettings(): void {
  if (!import.meta.client) {
    return;
  }

  const settings: AppDataTableStorage = {
    expires_at: Date.now() + DATA_TABLE_STORAGE_TTL,
    filters: {...appliedFilterValues},
    limit: limit.value,
  };

  localStorage.setItem(tableStorageKey.value, JSON.stringify(settings));
}
~~~

A persistência é propositalmente seletiva.

Filtros aplicados e quantidade por página são mantidos por uma hora. Busca,
página atual e ordenação permanecem transitórias.

### Paginação e ordenação

<p class="code-origin">Arquivo privado: <code>frontend/app/components/ui/AppDataTable.vue</code></p>

~~~ts
function changePage(nextPage: number): void {
  if (nextPage < 1 || nextPage > pagination.value.last_page || nextPage === pagination.value.current_page) {
    return;
  }

  cancelDebouncedFetchRows();
  exportMenuOpen.value = false;
  page.value = nextPage;
  clearSelectedRow();
  void fetchRows();
}

function changeSort(column: TableColumn): void {
  if (column.sortable === false) {
    return;
  }

  order.value = sortBy.value === column.field && order.value === 'DESC' ? 'ASC' : 'DESC';
  sortBy.value = column.field;
  page.value = 1;
  exportMenuOpen.value = false;
  clearSelectedRow();
  debouncedFetchRows();
}
~~~

### Exportação

O menu oferece XLS e PDF.

A exportação repete a consulta utilizando os filtros ativos, solicita até 1.000
registros e gera o arquivo no navegador.

O XLS utiliza uma representação compatível com Excel e o PDF possui geração
simplificada adequada ao volume atual.

Fontes privadas:

- <code>frontend/app/components/ui/AppDataTable.vue</code>;
- <code>frontend/app/utils/table-export.ts</code>.

### Visualizar, editar, excluir e confirmação

A seleção de uma linha disponibiliza ações contextuais.

Visualização e edição utilizam as URLs configuradas pelo módulo. Exclusão abre
um diálogo de confirmação antes da chamada à API.

Hooks como <code>beforeEdit</code> e <code>beforeDelete</code> permitem que o
domínio impeça determinada ação sem duplicar o comportamento da tabela.

<p class="code-origin">Arquivo privado: <code>frontend/app/components/ui/AppDataTable.vue</code></p>

~~~vue
<AppDialog
    v-if="rowToDelete"
    :title="'Excluir ' + activeEntityLabel"
    :is-cancel-disabled="isDeleting"
    @close="closeDeleteModal"
>
  <p>
    Tem certeza que deseja excluir este {{ activeEntityLabel }}?
  </p>

  <!-- Trecho omitido para demonstração -->

  <template #footer-actions>
    <button class="btn btn-danger" type="button" :disabled="isDeleting" @click="confirmDelete">
      <i class="fa-solid fa-trash me-2"></i>
      Excluir
    </button>
  </template>
</AppDialog>
~~~

### Responsividade

As colunas possuem prioridade de exibição.

Em telas menores, informações secundárias podem ser ocultadas sem exigir uma
segunda implementação da listagem.

<p class="code-origin">Arquivo privado: <code>frontend/app/assets/scss/_pagination.scss</code></p>

~~~scss
@media (max-width: 768px) {
  .app-data-table-header {
    flex-direction: column;
  }

  .app-data-table-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  // Trecho omitido para demonstração

  .app-table-mobile-hidden {
    display: none;
  }
}
~~~

### Slots

O componente expõe dois mecanismos principais de extensão:

- <code>filters</code> para filtros específicos do domínio;
- <code>cell-{column.name}</code> para apresentação customizada de células.

Sem customização, a tabela utiliza formatter, badge ou representação textual.

## 6. Como o código é utilizado

<p class="code-origin">Arquivo privado: <code>frontend/app/pages/clientes/index.vue</code></p>

~~~vue
<AppDataTable
    title="Clientes"
    subtitle="Gerencie a base de clientes da empresa."
    :columns="columns"
    :has-show="false"
    base-url="/clientes"
    base-api-url="/customers"
    entity-label="cliente"
    entity-plural-label="clientes"
    storage-key="customers.list.settings"
    search-placeholder="Buscar por nome, documento, e-mail ou telefone..."
    :default-filters="filters"
    :filter-count-groups="filterCountGroups"
>
  <!-- Trecho omitido para demonstração -->
</AppDataTable>
~~~

A página de clientes fornece filtros específicos do domínio, enquanto a
infraestrutura de consulta, paginação, persistência e ações permanece no
componente genérico.

O mesmo componente também é utilizado pelas listagens de tenants e roles.

## 7. Resultado

- Experiência consistente entre listagens reais.
- Menos infraestrutura repetida nas Pages.
- Filtros permanecem específicos de cada domínio.
- Paginação, busca, exportação e exclusão são reutilizadas.
- Responsividade é tratada de maneira centralizada.
- Novas listagens exigem principalmente configuração.

## 8. Pontos em evolução

- <code>hasRestore</code> ainda existe no contrato, mas não possui fluxo
  funcional correspondente.
- Requisições já iniciadas não são canceladas quando uma consulta mais recente
  é disparada.
- Excluir o último registro de uma página não ajusta automaticamente a
  paginação para a página anterior.
- O componente concentra diversas responsabilidades e ainda não possui testes
  automatizados dedicados.

## 9. Evoluções previstas

- Remover ou implementar completamente o contrato de restore.
- Tratar respostas obsoletas ou cancelar requisições anteriores.
- Ajustar automaticamente a página após exclusões.
- Extrair responsabilidades internas para composables caso a complexidade
  continue crescendo.
- Utilizar exportação server-side quando o volume ultrapassar o limite adequado
  ao navegador.
- Adicionar testes de interação, acessibilidade e responsividade.