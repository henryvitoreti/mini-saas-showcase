# Estado atual da V1

Esta página usa três estados: aquilo que o código comprova, aquilo que funciona
mas ainda exige robustez e aquilo que permanece como intenção.

## Backend

| Capacidade | Estado | Observação                                                  |
| --- | --- |-------------------------------------------------------------|
| Login JWT por tenant | <span class="status-label status--implemented">Implementado</span> | Credenciais são verificadas no banco do tenant atual        |
| Check e logout | <span class="status-label status--implemented">Implementado</span> | Rotas protegidas por <code>jwt.auth</code>                  |
| Resolução pelo host | <span class="status-label status--implemented">Implementado</span> | Domínio central resolve e inicializa o tenant ativo         |
| Provisionamento | <span class="status-label status--implemented">Implementado</span> | Cria banco e executa migrations de tenant de forma síncrona |
| Company e usuário inicial | <span class="status-label status--implemented">Implementado</span> | Criados após a inicialização do novo banco                  |
| Cadastro de tenant | <span class="status-label status--implemented">Implementado</span> | Create, list, show e update parcial; delete não é exposto   |
| Clientes | <span class="status-label status--implemented">Implementado</span> | CRUD, busca, filtros, paginação e endpoint de opções        |
| Roles | <span class="status-label status--implemented">Implementado</span> | CRUD, proteção de role interna e vínculo com permissões     |
| Proteção por permissão | <span class="status-label status--implemented">Implementado</span> | Aplicada ao grupo operacional de clientes                   |
| Catálogo de permissões | <span class="status-label status--evolving">Em evolução</span> | O seeder atual contém apenas a permissão-base de clientes   |
| Testes automatizados | <span class="status-label status--planned">Planejado</span> | Não há testes implementados                                 |

## Frontend

| Capacidade | Estado | Observação |
| --- | --- | --- |
| Login e sessão | <span class="status-label status--implemented">Implementado</span> | Token, sessão e permissões ficam no armazenamento local |
| Layout principal | <span class="status-label status--implemented">Implementado</span> | Header, sidebar, overlay mobile e área de conteúdo |
| Tema e sidebar persistidos | <span class="status-label status--implemented">Implementado</span> | Preferências restauradas no carregamento |
| Responsividade | <span class="status-label status--implemented">Implementado</span> | Breakpoints para layout, formulários e tabela |
| Clientes | <span class="status-label status--implemented">Implementado</span> | Listagem, criação e edição |
| Tenants | <span class="status-label status--implemented">Implementado</span> | Listagem, criação e edição |
| Roles e permissões | <span class="status-label status--implemented">Implementado</span> | Listagem, criação, edição e composição de permissões |
| AppDataTable | <span class="status-label status--implemented">Implementado</span> | Busca, filtros, paginação, exportação, ações e slots |
| Componentes de formulário | <span class="status-label status--implemented">Implementado</span> | Inputs, selects, data, switch, checkbox e container |
| Listagem de domínios | <span class="status-label status--evolving">Em evolução</span> | Busca implementada; filtros adicionais e exclusão lógica ainda estão planejados. |
| Dashboard | <span class="status-label status--planned">Planejado</span> | Cards existem, mas métricas estão em N/A |
| Testes, lint e typecheck | <span class="status-label status--planned">Planejado</span> | Scripts e suítes não estão configurados |

## Infraestrutura

| Capacidade | Estado | Observação |
| --- | --- | --- |
| Docker Compose | <span class="status-label status--implemented">Implementado</span> | Traefik, backend, frontend, PostgreSQL e Redis |
| Hosts por subdomínio | <span class="status-label status--implemented">Implementado</span> | Regras locais no Traefik para frontend e API |
| Desenvolvimento com hot reload | <span class="status-label status--implemented">Implementado</span> | Frontend usa polling no container |
| TLS, secrets e hardening | <span class="status-label status--evolving">Em evolução</span> | Compose atual é explicitamente local |
| CI/CD da aplicação privada | <span class="status-label status--planned">Planejado</span> | Não há pipeline comprovado no projeto analisado |

## Módulos planejados

<div class="status-grid">
  <div class="status-card"><span class="status-label status--planned">Planejado</span><h3>Catálogo</h3><p>Produtos, categorias e serviços.</p></div>
  <div class="status-card"><span class="status-label status--planned">Planejado</span><h3>Operação</h3><p>Vendas e ordens de serviço.</p></div>
  <div class="status-card"><span class="status-label status--planned">Planejado</span><h3>Estoque</h3><p>Movimentações e disponibilidade.</p></div>
  <div class="status-card"><span class="status-label status--planned">Planejado</span><h3>Comercial SaaS</h3><p>Planos e assinaturas integrados às roles.</p></div>
</div>

::: warning Leitura correta do menu
A definição da sidebar já contém caminhos desses módulos, mas não há Pages,
Services, Controllers e migrations funcionais correspondentes. A presença no
menu é planejamento, não implementação.
:::
