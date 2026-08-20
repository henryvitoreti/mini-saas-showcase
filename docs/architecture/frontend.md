# Arquitetura do frontend

<span class="status-label status--implemented">Implementado</span>

O frontend utiliza Nuxt 4, Vue 3, TypeScript, Bootstrap 5 e SCSS.

A organização busca separar composição de páginas, comportamento reutilizável,
comunicação HTTP e contratos TypeScript.

## Organização

~~~text
app/
├── pages/          rotas e composição de tela
├── layouts/        estrutura principal da aplicação
├── components/     domínio, formulários, layout e UI
├── composables/    estado e comportamento reutilizável
├── services/       comunicação com endpoints por domínio
├── types/          contratos TypeScript
├── utils/          máscaras, formatadores e exportação
└── assets/scss/    tema, layout e breakpoints
~~~

## Fluxo de tela

~~~mermaid
flowchart LR
  Page --> Component
  Component --> Composable
  Composable --> Service
  Service --> Client["apiHttpClient"]

  Client --> API["Laravel API"]
  Client --> Handler["Handlers HTTP"]
  Handler --> UI["Toast / redirect / erros de campo"]
~~~

## Comunicação com a API

`services/api/http-client.ts` concentra comportamentos comuns das requisições.

Entre suas responsabilidades estão:

- resolver a URL da API conforme o subdomínio atual;
- adicionar o Bearer Token;
- coordenar o loading global das mutações;
- transformar respostas 422 em erros de validação;
- tratar bloqueios de permissão;
- normalizar falhas conhecidas da API;
- centralizar o comportamento HTTP compartilhado entre os Services.

Services específicos representam os recursos da aplicação e evitam espalhar
URLs e regras de comunicação pelas Pages.

## Estado compartilhado

O estado compartilhado utiliza `useState` através de composables.

| Estado | Persistência |
| --- | --- |
| Token JWT | localStorage |
| Sessão e permissões | localStorage + useState |
| Tema | localStorage + useState |
| Sidebar minimizada | localStorage + useState |
| Filtros e limite das listagens | localStorage com expiração de 1 hora |

A persistência da sidebar e dos filtros permite que o usuário mantenha seu
contexto visual durante a navegação.

## Páginas implementadas

- login;
- dashboard visual;
- clientes: listagem, criação e edição;
- tenants: listagem, criação e edição;
- roles: listagem, criação e edição.

Produtos, categorias, serviços, vendas, ordens de serviço, estoque, relatórios
e configurações podem aparecer na estrutura de navegação planejada, mas ainda
não possuem fluxo funcional equivalente.

## Componentes reutilizáveis

A interface possui componentes base para:

- texto;
- textarea;
- select;
- select remoto;
- data;
- switch;
- checkbox;
- diálogos;
- toasts;
- tooltips;
- loading;
- containers de formulário.

O layout principal possui header e sidebar responsiva, com suporte aos estados
expandido e minimizado.

## AppDataTable

`AppDataTable` concentra o comportamento reutilizável das listagens.

Entre os recursos atuais estão:

- busca com debounce;
- ordenação;
- paginação;
- seleção de quantidade por página;
- filtros personalizados por slot;
- persistência temporária de filtros;
- contagem de filtros ativos;
- seleção de registros;
- ações de visualização, edição e exclusão;
- confirmação de exclusão;
- exportação;
- slots para customização das células;
- adaptação para diferentes resoluções.

Por ser um componente genérico de listagem, ele recebe a URL da API e realiza
a consulta internamente.

## Formulários

Composables de formulário concentram comportamentos que seriam repetidos entre
as telas.

Entre suas responsabilidades estão:

- armazenar os atributos;
- preencher dados vindos da API;
- montar o payload;
- limpar erros;
- associar erros 422 aos campos correspondentes;
- compartilhar comportamentos entre criação e edição.

Os componentes de formulário permanecem responsáveis principalmente pela
composição visual.

## Responsividade

O frontend possui breakpoints específicos para diferentes partes da interface.

Entre os principais comportamentos estão:

- sidebar e drawer em resoluções menores;
- compactação do layout;
- adaptação das tabelas;
- reorganização dos grids de formulário;
- redução da quantidade de informações exibidas em telas pequenas.

## Autorização no frontend

A interface utiliza as permissões retornadas pela API para:

- mostrar recursos disponíveis;
- exibir recursos bloqueados;
- ocultar módulos indisponíveis.

O backend continua sendo a fonte de verdade da autorização.

Um middleware frontend específico por permissão ainda pode ser adicionado para
evitar navegação direta para páginas indisponíveis e melhorar a experiência do
usuário.

## Pontos em evolução

- O dashboard ainda não consome indicadores reais.
- A listagem de tenants ainda possui ajustes de filtros planejados.
- Falhas de serviços externos de endereço ainda podem receber feedback mais
  específico.
- A configuração de lint, typecheck e testes automatizados ainda pode ser
  ampliada.