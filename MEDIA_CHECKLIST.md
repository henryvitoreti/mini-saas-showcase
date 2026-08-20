# Checklist de mídia

Todos os itens estão pendentes. Produzir somente com fixtures criadas
especificamente para publicação.

## Screenshots

| Pronto | Mídia | O que mostrar | Duração | Resolução | Arquivo esperado | Página |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Login | Formulário, marca pública e tema; campos vazios | N/A — estática | 1920 × 1080 | <code>login.png</code> | <code>demo/screenshots</code>, lançamento |
| [ ] | Listagem de clientes | Busca, contador de filtros, colunas e paginação com fixtures | N/A — estática | 1920 × 1080 | <code>customers-list.png</code> | <code>demo/screenshots</code>, AppDataTable |
| [ ] | Filtros de clientes | Painel de filtros expandido na listagem de clientes | N/A — estática | 1920 × 1080 | <code>customer-filter.png</code> | <code>demo/screenshots</code>, AppDataTable |
| [ ] | Formulário de cliente | Tipo, contato, endereço e validação sem dado real | N/A — estática | 1920 × 1080 | <code>customer-form.png</code> | <code>demo/screenshots</code>, formulários |
| [ ] | Listagem de tenants | Tenants fictícios, status e ações disponíveis | N/A — estática | 1920 × 1080 | <code>tenants-list.png</code> | <code>demo/screenshots</code>, overview |
| [ ] | Formulário de tenant | Company, role e usuário inicial fictícios; senha não visível | N/A — estática | 1920 × 1080 | <code>tenant-form.png</code> | <code>demo/screenshots</code>, provisionamento |
| [ ] | Configuração de role | Nome, status, grupos e controles de permissão | N/A — estática | 1920 × 1080 | <code>role-configuration.png</code> | <code>demo/screenshots</code>, permissionamento |
| [ ] | Permissões | Estados ativo, bloqueado e base, sem sugerir módulo funcional inexistente | N/A — estática | 1920 × 1080 | <code>permissions.png</code> | <code>demo/screenshots</code>, permissionamento |
| [ ] | Sidebar expandida | Tela desktop inteira da listagem de clientes, com sidebar aberta | N/A — estática | 1920 × 1080 | <code>sidebar-expanded.png</code> | <code>demo/screenshots</code>, frontend |
| [ ] | Sidebar minimizada | Mesma tela desktop, sidebar recolhida e flyout visível | N/A — estática | 1920 × 1080 | <code>sidebar-collapsed.png</code> | <code>demo/screenshots</code>, persistência |
| [ ] | Sidebar mobile | Listagem de clientes em viewport mobile, com drawer aberto | N/A — estática | 390 × 844 | <code>sidebar-mobile.png</code> | <code>demo/screenshots</code>, frontend |
| [ ] | Visual mobile | Listagem de clientes com drawer fechado e tabela responsiva no viewport estreito | N/A — estática | 390 × 844 | <code>mobile-layout.png</code> | <code>demo/screenshots</code>, frontend |
| [ ] | Banco central | Diagrama/schema de permissions, roles, permission_role, tenants e domains; sem dados/conexão | N/A — estática | 1920 × 1080 | <code>central-database.png</code> | <code>demo/screenshots</code>, banco |
| [ ] | Banco de tenant | Diagrama/schema de company, users e customers; sem dados/conexão | N/A — estática | 1920 × 1080 | <code>tenant-database.png</code> | <code>demo/screenshots</code>, banco |

## Vídeos

| Pronto | Mídia | O que mostrar | Duração sugerida | Resolução | Arquivo esperado | Página |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Visão geral da aplicação | Login, layout, clientes, tenants e roles; indicar limites | 2–3 min | 1920 × 1080 | <code>application-overview.webm</code> | <code>demo/videos</code>, home |
| [ ] | Criação e provisionamento | Formulário fictício, submit, criação do banco/migrations e sucesso | 2–4 min | 1920 × 1080 | <code>tenant-provisioning.webm</code> | <code>demo/videos</code>, provisionamento |
| [ ] | Acesso pelo domínio | Abrir o host criado e chegar ao login daquele tenant | 45–75 s | 1920 × 1080 | <code>domain-access.webm</code> | <code>demo/videos</code>, domínio |
| [ ] | CRUD de clientes | Buscar, criar, editar, validar e excluir fixture | 2–3 min | 1920 × 1080 | <code>customers-crud.webm</code> | <code>demo/videos</code>, V1 |
| [ ] | Permissionamento | Configurar role e explicar interface versus API | 90–150 s | 1920 × 1080 | <code>permissions-flow.webm</code> | <code>demo/videos</code>, permissões |
| [ ] | AppDataTable | Debounce, filtros, sort, page, limit, export e modal | 90–150 s | 1920 × 1080 | <code>app-data-table.webm</code> | <code>demo/videos</code>, DataTable |
| [ ] | Responsividade | Desktop para mobile, sidebar/drawer, tabela e formulário | 60–90 s | 1920 × 1080 | <code>responsive-layout.webm</code> | <code>demo/videos</code>, frontend |
| [ ] | Execução com Docker | Build/up, containers saudáveis e hosts; ocultar env/logs | 90–150 s | 1920 × 1080 | <code>docker-environment.webm</code> | <code>demo/videos</code>, stack |

## Checklist por arquivo

- [ ] Dados, documentos, e-mails, telefones e endereços são fictícios.
- [ ] Token, localStorage, cookies, requests e headers não aparecem.
- [ ] Senhas e autofill não aparecem.
- [ ] Terminal não mostra env, secrets, logs ou nomes privados.
- [ ] URL não expõe domínio real ainda não aprovado.
- [ ] Metadados do arquivo foram revisados/limpos.
- [ ] Compressão mantém texto legível.
- [ ] Alt text, legenda ou transcrição foram preparados.
- [ ] O material não apresenta planejamento como implementação.
- [ ] Revisão manual por uma segunda pessoa foi concluída.
