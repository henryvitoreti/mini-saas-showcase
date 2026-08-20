# Banco de dados

A aplicação utiliza dois contextos de persistência:

- banco central;
- banco isolado por tenant.

As migrations representam o schema efetivamente implementado. A modelagem
documentada também inclui estruturas planejadas que ainda não possuem
implementação funcional.

## Legenda

- <span class="status-label status--implemented">Implementado</span> possui migration funcional;
- <span class="status-label status--planned">Planejado</span> existe apenas na modelagem;
- linha sólida: relacionamento físico;
- linha tracejada: relacionamento lógico entre contextos.

## Banco central

O banco central mantém as estruturas compartilhadas pela plataforma.

| Tabela | Estado | Responsabilidade |
| --- | --- | --- |
| permissions | <span class="status-label status--implemented">Implementado</span> | Catálogo global de capacidades |
| roles | <span class="status-label status--implemented">Implementado</span> | Pacotes técnicos de acesso |
| permission_role | <span class="status-label status--implemented">Implementado</span> | Configuração de permissões por role |
| tenants | <span class="status-label status--implemented">Implementado</span> | Cadastro central dos tenants |
| domains | <span class="status-label status--implemented">Implementado</span> | Associação entre host e tenant |

### Relacionamentos

~~~mermaid
flowchart LR
  D["domains"] -->|"FK tenant_id"| T["tenants"]
  T -->|"FK role_id"| R["roles"]
  R -->|"FK role_id"| PR["permission_role"]
  PR -->|"FK permission_id"| P["permissions"]
~~~

Os relacionamentos entre essas tabelas podem ser garantidos fisicamente porque
todas pertencem à mesma conexão central.

## Banco do tenant

Cada tenant possui seu próprio banco PostgreSQL.

Atualmente, as estruturas funcionais principais são:

| Tabela | Estado | Responsabilidade |
| --- | --- | --- |
| company | <span class="status-label status--implemented">Implementado</span> | Dados da empresa e referência à role central |
| users | <span class="status-label status--implemented">Implementado</span> | Usuários autenticáveis do tenant |
| customers | <span class="status-label status--implemented">Implementado</span> | Clientes e seus dados cadastrais |

~~~mermaid
flowchart LR
  C["company.role_id"] -. "referência lógica cross-DB" .-> R["central.roles"]
  U["users"] --> DB["Contexto do tenant"]
  CU["customers"] --> DB
  C --> DB
~~~

`company.role_id` não utiliza foreign key física para `roles.id` porque as
tabelas pertencem a bancos diferentes.

Essa integridade é mantida pela aplicação.

## Relacionamentos atuais

| Relação | Tipo |
| --- | --- |
| `domains.tenant_id → tenants.id` | Foreign key física |
| `tenants.role_id → roles.id` | Foreign key física |
| `permission_role.role_id → roles.id` | Foreign key física |
| `permission_role.permission_id → permissions.id` | Foreign key física |
| `company.role_id → roles.id` | Referência lógica entre bancos |

## Estruturas funcionais atuais

### Banco central

~~~text
tenants
domains
roles
permissions
permission_role
~~~

### Banco de cada tenant

~~~text
company
users
customers
~~~

Essa lista representa somente as estruturas funcionais da etapa atual e será
expandida conforme novos módulos forem implementados.

## Modelagem planejada

Os módulos abaixo possuem modelagem documentada, mas ainda não possuem
implementação funcional equivalente.

<div class="status-grid">
  <div class="status-card">
    <span class="status-label status--planned">Planejado</span>
    <h3>Catálogo</h3>
    <p>product_categories, products e services.</p>
  </div>

  <div class="status-card">
    <span class="status-label status--planned">Planejado</span>
    <h3>Vendas</h3>
    <p>sale_orders e sale_order_items.</p>
  </div>

  <div class="status-card">
    <span class="status-label status--planned">Planejado</span>
    <h3>Ordens de serviço</h3>
    <p>work_orders, work_order_product_items e work_order_service_items.</p>
  </div>

  <div class="status-card">
    <span class="status-label status--planned">Planejado</span>
    <h3>Estoque</h3>
    <p>stock_transactions.</p>
  </div>
</div>

Planos e assinaturas também fazem parte do planejamento futuro e, quando
implementados, pertencem ao contexto do banco central.