# Multi-tenancy

<span class="status-label status--implemented">Implementado</span>

O projeto utiliza isolamento físico com um banco PostgreSQL por tenant.

O banco central mantém informações globais e resolve qual tenant pertence à
requisição. Depois da inicialização do contexto, os dados operacionais passam a
ser acessados no banco isolado daquela empresa.

## Topologia de dados

~~~mermaid
flowchart LR
  subgraph Central["Banco central"]
    direction TB

    Domains["domains"] --> Tenants["tenants"]
    Tenants --> Roles["roles"]
    Roles --> Pivot["permission_role"]
    Pivot --> Permissions["permissions"]
  end

  subgraph Tenant["Banco tenant N"]
    direction TB

    Company["company"]
    Users["users"]
    Customers["customers"]
    Future["demais módulos operacionais"]
  end

  Company -. "role_id lógico" .-> Roles
~~~

## Banco central

O banco central mantém estruturas compartilhadas pela plataforma:

- `tenants`: identificação, status, role e metadados resumidos;
- `domains`: hosts associados aos tenants;
- `roles`: pacotes técnicos de acesso;
- `permissions`: catálogo de recursos;
- `permission_role`: configuração das permissões de cada role.

## Banco do tenant

Cada tenant recebe um banco independente para seus dados operacionais.

Atualmente, os módulos funcionais utilizam:

- `company`: dados da empresa e referência lógica à role central;
- `users`: usuários autenticáveis daquele tenant;
- `customers`: primeiro domínio operacional implementado.

Produtos, serviços, vendas, estoque e ordens de serviço também foram
modelados, mas só passarão a integrar o banco funcional quando seus respectivos
módulos forem implementados.

## Resolução por domínio

~~~mermaid
sequenceDiagram
  participant R as Request
  participant M as tenant.domain
  participant D as DomainTenantResolver
  participant C as Banco central
  participant T as Contexto tenant

  R->>M: Host completo
  M->>D: resolve(host)
  D->>C: consultar domains + tenants

  alt domínio ausente
    M-->>R: 404
  else tenant inativo
    M-->>R: 403
  else tenant ativo
    M->>T: tenancy().initialize(tenant)
    M->>R: continuar pipeline
  end
~~~

A resolução utiliza o host completo da requisição.

Depois da inicialização, os bootstrappers de tenancy aplicam o contexto do
tenant aos recursos configurados, incluindo banco de dados e cache.

## Vínculo entre domínio e autenticação

Resolver corretamente o banco não é suficiente para autenticar uma requisição.

Após a autenticação JWT, o middleware `tenant.token` compara o claim assinado
`tenant_id` com o tenant inicializado pelo domínio.

~~~text
tenant resolvido pelo host
          ↓
      tenant.id
          =
JWT → tenant_id
~~~

Essa validação impede que um token emitido em um tenant seja utilizado no
contexto de outro.

## Provisionamento

O provisionamento atual ocorre de forma síncrona.

~~~mermaid
sequenceDiagram
  participant API as TenantService
  participant C as Banco central
  participant P as Pipeline tenancy
  participant T as Novo banco tenant

  API->>C: validar role ativa
  API->>C: validar domínio disponível
  API->>C: criar tenant

  C->>P: evento TenantCreated
  P->>T: CreateDatabase
  P->>T: MigrateDatabase

  API->>C: criar domain
  API->>T: initialize(tenant)
  API->>T: transação company + usuário inicial
  API->>API: tenancy().end()
~~~

O evento de criação do tenant dispara o provisionamento do banco e suas
migrations antes da criação dos dados internos da empresa.

## Tratamento de falhas

Caso ocorra uma exceção após a criação central do tenant, o Service executa um
fluxo compensatório.

Quando necessário:

1. o registro central criado é removido;
2. o evento correspondente remove o banco provisionado;
3. a exceção continua sendo propagada para o fluxo HTTP.

Essa estratégia reduz a possibilidade de manter tenants parcialmente
provisionados.

Ela não representa uma transação distribuída entre os bancos, mas é adequada
ao fluxo atual da aplicação.

## Edição

A edição atual permite:

- atualizar os campos permitidos de `company`;
- validar uma role central ativa;
- sincronizar `role_id` entre `company` e `tenants`;
- atualizar o nome resumido armazenado em `tenants.data`.

Identificador do tenant, domínio, status e usuário inicial não fazem parte
desse mesmo fluxo de edição.

## Encerramento do contexto

Fluxos que inicializam manualmente um tenant utilizam `tenancy()->end()` em
blocos `finally`.

Isso garante que, mesmo após uma exceção, a aplicação retorne ao contexto
central.

## Trade-offs da estratégia

<div class="decision-card">
  <strong>Decisão técnica:</strong> o isolamento físico reduz o risco de uma
  consulta operacional misturar dados de empresas diferentes, ao custo de
  aumentar a responsabilidade de provisionamento, migrations, backup e
  observabilidade.
</div>

A estratégia atual implica que:

- novos tenants precisam ter seus bancos provisionados;
- novas migrations de tenant precisam ser aplicadas aos bancos existentes;
- operações entre banco central e banco tenant não compartilham uma única
  transação;
- backup e restore precisam considerar múltiplos bancos;
- provisionamentos mais pesados poderão futuramente ser movidos para filas.

Planos e assinaturas fazem parte do
[roadmap](../project/roadmap) e ainda não participam do fluxo de tenancy.