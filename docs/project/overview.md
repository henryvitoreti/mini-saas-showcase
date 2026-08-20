# Visão geral do projeto

<span class="status-label status--implemented">Implementado</span>

O Mini-SaaS é uma aplicação de gestão empresarial em desenvolvimento. A V1
comprovada concentra-se na fundação multi-tenant, na autenticação, no
permissionamento central e no primeiro módulo operacional: clientes.

O case público não afirma tração comercial, uso em produção ou módulos que
existem apenas na modelagem e na navegação planejada.

## Recorte atual

| Área | Estado | Evidência funcional                                           |
| --- | --- |---------------------------------------------------------------|
| Autenticação JWT | <span class="status-label status--implemented">Implementado</span> | Login, check, logout e atualização de permissões              |
| Tenants | <span class="status-label status--implemented">Implementado</span> | Listagem, criação, consulta e edição parcial                  |
| Banco por tenant | <span class="status-label status--implemented">Implementado</span> | Criação, migrations e inicialização de contexto               |
| Clientes | <span class="status-label status--implemented">Implementado</span> | Listagem, criação, edição, exclusão e opções                  |
| Roles e permissões | <span class="status-label status--implemented">Implementado</span> | CRUD de roles, pivot e proteção da API de clientes            |
| Dashboard | <span class="status-label status--planned">Planejado</span> | Indicadores ainda exibem N/A e não há gráficos construídos.   |
| Produtos, serviços e operação | <span class="status-label status--planned">Planejado</span> | Sem páginas, Services e migrations funcionais correspondentes |

## Proposta técnica

O projeto separa dados globais e dados operacionais:

~~~mermaid
flowchart LR
  Client["Navegador"] --> Edge["Traefik"]
  Edge --> Nuxt["Nuxt 4"]
  Edge --> API["Laravel 13"]
  API --> Central[("PostgreSQL central")]
  API --> TenantA[("Banco tenant A")]
  API --> TenantB[("Banco tenant B")]
  API --> Redis[("Redis")]
~~~

- O banco central mantém tenants, domínios, roles e permissões.
- Cada tenant possui seu próprio banco, onde ficam isolados os dados operacionais da empresa, como usuários, clientes e demais módulos do sistema.
- O domínio da requisição define qual contexto de tenant será inicializado.
- A API valida permissões; a interface usa o mesmo conjunto para compor o menu.

## O que este case demonstra

1. Modelagem de multi-tenancy com isolamento físico por banco.
2. Orquestração de provisionamento entre contexto central e tenant.
3. Arquitetura backend em camadas.
4. Repositories declarativos para consultas repetitivas.
5. Componentização de listagens e formulários no frontend.
6. Leitura crítica das limitações de uma V1 ainda em construção.

::: info Sobre este case
O conteúdo apresentado foi construído com base no código implementado, nas migrations e na documentação técnica do projeto. Funcionalidades ainda não implementadas são identificadas separadamente como planejamento ou roadmap.
:::

## Próximas leituras

- [Estado da V1](./implemented)
- [Arquitetura](../architecture/overview)
- [Cases técnicos](../cases/repository-pattern)
- [Demonstração](../demo/)
- [Roadmap](./roadmap)
