# Permissionamento

<span class="status-label status--implemented">Implementado</span>

O permissionamento atual é definido no nível da empresa.

Roles funcionam como pacotes técnicos centralizados de acesso, e os usuários de
um tenant utilizam o conjunto de permissões associado à role da empresa.

## Modelo central

### permissions

`permissions` representa o catálogo global de capacidades da plataforma.

Entre os campos utilizados estão:

- nome;
- slug;
- base de URL do frontend;
- base de URL da API;
- grupo;
- `is_base`.

Uma permissão marcada como base é mantida ativa nas roles.

### roles

`roles` representa conjuntos de acesso que podem ser atribuídos aos tenants.

Entre suas propriedades estão:

- `is_active`;
- `can_modify`.

Roles inativas não podem ser atribuídas a novos tenants.

Roles protegidas podem impedir operações administrativas de alteração ou
exclusão.

### permission_role

A tabela pivot define como cada permissão participa de uma role.

| Campo | Significado |
| --- | --- |
| `role_id` | Role central |
| `permission_id` | Permissão central |
| `is_active` | Autoriza o recurso |
| `show_locked_routes` | Permite exibição bloqueada no frontend |

`show_locked_routes` modifica somente a apresentação da interface.

Uma permissão inativa nunca é transformada em acesso válido apenas porque está
visível na sidebar.

## Relacionamentos

~~~mermaid
flowchart LR
  subgraph Central["Banco central"]
    T["tenants.role_id"]
    R["roles"]
    PR["permission_role"]
    P["permissions"]
  end

  subgraph Tenant["Banco tenant"]
    C["company.role_id"]
    U["users"]
  end

  T -->|"FK"| R
  R -->|"FK"| PR
  PR -->|"FK"| P

  C -. "referência lógica cross-DB" .-> R
  U -. "utiliza pacote da empresa" .-> C
~~~

`tenants.role_id`, `roles`, `permissions` e `permission_role` estão no mesmo
banco central e utilizam relacionamentos físicos.

`company.role_id` permanece uma referência lógica porque `company` está no
banco do tenant enquanto `roles` está no banco central.

## Espelhamento da role

O mesmo identificador de role é mantido em:

~~~text
Banco central
tenants.role_id
      │
      │ mesma role
      ▼
Banco tenant
company.role_id
~~~

Esse espelhamento permite que a aplicação, já conectada ao banco do tenant,
identifique qual pacote central deve ser consultado.

## Validação no backend

O fluxo operacional segue:

1. o domínio resolve e inicializa o tenant;
2. o JWT identifica o usuário;
3. `tenant.token` confirma que o token pertence ao tenant atual;
4. `CompanyPermissionHelper` lê `company.role_id`;
5. o middleware determina a base da rota solicitada;
6. `PermissionRepository` consulta a configuração central;
7. a requisição continua somente quando a permissão correspondente estiver
   ativa.

A autorização real acontece na API.

## Composição da interface

O frontend utiliza a mesma lista de permissões para decidir como representar
os módulos.

| Estado | Interface |
| --- | --- |
| Ativa | Item disponível |
| Inativa + show locked | Item visível e bloqueado |
| Inativa + sem show locked | Item oculto |

`createSidebarItems()` aplica essas regras e `AppSidebar` reage às alterações no
estado de permissões.

## Cache

~~~mermaid
flowchart LR
  Login["Login / refresh"] --> Resolve["Resolver permissões"]
  Resolve --> Cache["Cache do tenant\n30 minutos"]
  Cache --> API["Resposta da API"]
  API --> Storage["localStorage + useState"]
  Storage --> Sidebar["Sidebar"]
~~~

O login e `/auth/permissions` atualizam a lista armazenada.

O cache reduz consultas repetitivas necessárias apenas para composição da
interface.

Alterações administrativas nas configurações de roles e permissões ainda não
invalidam imediatamente todos os caches de tenants afetados. Nessas situações,
a atualização ocorre em um novo login, refresh de permissões ou após expiração
do TTL.

## Escopo atual

O sistema implementa a infraestrutura necessária para trabalhar com diferentes
combinações de permissões.

Atualmente, clientes é o primeiro módulo operacional funcional utilizado nesse
modelo.

À medida que novos módulos forem implementados, suas permissões passam a
integrar o catálogo central.

## Decisões atuais

- O pacote de acesso pertence à empresa, não individualmente a cada usuário.
- Não existe `role_user`.
- Não existem permissões individuais por usuário.
- A sidebar representa visualmente o acesso, mas não substitui a autorização
  do backend.
- Administração central ainda pode evoluir para permissões administrativas mais
  granulares.

## Pontos em evolução

- A invalidação administrativa dos caches ainda não é imediata.
- O comportamento esperado ao desativar uma role já atribuída deve permanecer
  consistente com a política de acesso definida para a plataforma.

## Integração futura com planos

<span class="status-label status--planned">Planejado</span>

No futuro, um plano comercial poderá apontar para uma role central.

~~~text
subscription
    ↓
   plan
    ↓
   role
    ↓
permission_role
    ↓
permissions
~~~

Planos e assinaturas ainda não possuem fluxo funcional na V1 e não participam
da autorização atual.