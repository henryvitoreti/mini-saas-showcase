---
layout: home

hero:
  name: Mini-SaaS Multi-Tenant
  text: Arquitetura full stack, isolamento de dados e componentes reutilizáveis
  tagline: Case técnico de uma aplicação full stack desenvolvida com Laravel, Nuxt, PostgreSQL, Redis, Docker e Traefik.
  actions:
    - theme: brand
      text: Visão geral
      link: /project/overview
    - theme: alt
      text: Demonstração
      link: /demo/
    - theme: alt
      text: Arquitetura
      link: /architecture/overview
    - theme: alt
      text: Cases técnicos
      link: /cases/repository-pattern
    - theme: alt
      text: Roadmap
      link: /project/roadmap

showcaseFeatures:
  - icon: database
    title: Isolamento por banco
    details: Banco central para metadados globais e um PostgreSQL isolado para cada tenant.
    link: /architecture/tenancy
  - icon: server-cog
    title: Provisionamento de tenants
    details: Criação do banco, migrations, company e usuário inicial coordenados pelo backend.
    link: /cases/tenant-provisioning
  - icon: globe
    title: Resolução por domínio
    details: O host da requisição identifica o tenant antes da autenticação e do acesso aos dados.
    link: /cases/domain-resolution
  - icon: shield-check
    title: Permissões centralizadas
    details: Roles no banco central, composição visual no Nuxt e validação obrigatória na API.
    link: /architecture/permissions
  - icon: layers-3
    title: Repository Pattern
    details: CRUD, busca, filtros, ordenação e paginação compartilhados entre repositories.
    link: /cases/repository-pattern
  - icon: blocks
    title: Componentes reutilizáveis
    details: Tabela genérica, inputs, dialogs, toasts e composables de formulário.
    link: /architecture/frontend
---

## Estado atual da V1

<div class="status-grid">
  <div class="status-card">
    <span class="status-label status--implemented">Implementado</span>
    <h3>Núcleo operacional</h3>
    <p>Autenticação, tenants, provisionamento, clientes, roles, permissões, layout e infraestrutura local.</p>
  </div>
  <div class="status-card">
    <span class="status-label status--evolving">Em evolução</span>
    <h3>Robustez da V1</h3>
    <p>Testes, segurança de produção, observabilidade e refinamentos do permissionamento ainda exigem trabalho.</p>
  </div>
  <div class="status-card">
    <span class="status-label status--planned">Planejado</span>
    <h3>Próximos módulos</h3>
    <p>Produtos, categorias, serviços, vendas, estoque e ordens de serviço não são apresentados como entregues.</p>
  </div>
</div>

::: info Código privado, evidências públicas
Este site publica somente explicações e trechos curtos. A aplicação completa permanece privada.
:::
