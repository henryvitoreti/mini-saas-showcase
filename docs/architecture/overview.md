# Visão geral da arquitetura

<span class="status-label status--implemented">Implementado</span>

O projeto utiliza uma arquitetura em camadas dentro de um monorepo, mantendo
backend e frontend como aplicações independentes.

A estrutura atual prioriza separação de responsabilidades, isolamento entre
tenants e reutilização de componentes. Evoluções relacionadas a cloud, CI/CD e
escala fazem parte do roadmap de infraestrutura.

## Componentes

~~~mermaid
flowchart LR
  User["Usuário"] --> Proxy["Traefik"]

  Proxy --> Web["Nuxt 4\nVue + TypeScript"]
  Proxy --> API["Laravel 13\nAPI"]

  API -->|"resolver domínio e dados globais"| Central[("PostgreSQL central")]
  API -->|"inicializar contexto"| Tenant[("Banco do tenant")]
  API --> Cache[("Redis")]
~~~

| Componente | Responsabilidade |
| --- | --- |
| Traefik | Encaminhar hosts de frontend e API no ambiente local |
| Nuxt | Pages, layout, formulários, listagens, sessão e composição visual |
| Laravel | HTTP, validação, autenticação, regras de aplicação e autorização |
| Banco central | Tenants, domínios, roles, permissões e configurações globais |
| Banco do tenant | Dados operacionais isolados de cada empresa |
| Redis | Cache com escopo de tenant |

Atualmente, os bancos dos tenants possuem estruturas funcionais para
`company`, `users` e `customers`. Novos módulos operacionais serão adicionados
a esses bancos conforme forem implementados.

## Fluxo de uma requisição operacional

~~~mermaid
sequenceDiagram
  participant B as Navegador
  participant A as Laravel API
  participant C as Banco central
  participant T as Banco tenant

  B->>A: Request no host do tenant
  A->>C: Resolver domínio
  C-->>A: Tenant e status

  A->>A: Inicializar contexto do tenant
  A->>T: Identificar usuário pelo JWT
  A->>A: Validar tenant_id do token
  A->>T: Ler company.role_id
  A->>C: Validar permissão ativa
  A->>T: Executar caso de uso

  T-->>A: Resultado
  A-->>B: Resource + resposta JSON
~~~

## Camadas do backend

~~~text
Middleware → Controller → Service → Repository → Model
                                      ↓
                                  PostgreSQL
~~~

- FormRequests normalizam e validam a entrada.
- Controllers recebem a requisição e delegam o fluxo.
- Services coordenam regras de negócio e transações.
- Repositories concentram persistência e consultas reutilizáveis.
- Models representam entidades, casts e relacionamentos.
- Resources transformam dados para o contrato público da API.

## Camadas do frontend

~~~text
Page → Component/Composable → Service → apiHttpClient → Laravel API
~~~

- Pages compõem rotas e telas.
- Components concentram comportamento visual reutilizável.
- Composables centralizam estado e fluxos reutilizáveis.
- Services representam operações da API por domínio.
- `apiHttpClient` concentra comunicação HTTP e tratamento comum de respostas.
- `AppDataTable` é uma exceção consciente: por ser um componente genérico de
  listagem, recebe a URL do recurso e realiza sua própria consulta à API.

## Fronteiras de segurança

1. O domínio identifica qual tenant deve ser inicializado.
2. O JWT autentica o usuário daquele contexto.
3. O claim `tenant_id` do token é comparado com o tenant resolvido pelo domínio.
4. O backend valida a permissão necessária para a rota.
5. O frontend utiliza o mesmo conjunto de permissões para compor a navegação,
   sem substituir a autorização realizada pela API.