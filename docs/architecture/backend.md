# Arquitetura do backend

<span class="status-label status--implemented">Implementado</span>

O backend é uma API Laravel 13 organizada em camadas. O padrão utilizado nos
fluxos atuais é:

~~~mermaid
flowchart LR
  Route["Route + Middleware"] --> Request["FormRequest"]
  Request --> Controller
  Controller --> Service
  Service --> Repository
  Repository --> Model
  Model --> DB[("PostgreSQL")]

  Controller --> Resource["API Resource"]
  Resource --> Response["ApiResponseTrait"]
~~~

## Responsabilidades

| Camada | Responsabilidade |
| --- | --- |
| Routes / Middleware | Resolver tenant, autenticar, autorizar e proteger o pipeline HTTP |
| FormRequest | Normalizar dados e executar regras de validação |
| Controller | Delegar o caso de uso e produzir a resposta HTTP |
| Service | Orquestrar regras de negócio e transações |
| Repository | Persistência, busca, filtros, ordenação e paginação |
| Model | Entidade Eloquent, casts, fillable e relacionamentos |
| Resource | Transformar dados para o contrato público da API |
| ApiResponseTrait | Padronizar respostas de sucesso e erro |

## Pipeline das requisições

As rotas operacionais passam inicialmente pelo contexto do tenant.

~~~mermaid
flowchart LR
  Request --> Domain["tenant.domain"]
  Domain --> Mutable["mutable.request.lock"]
  Mutable --> JWT["jwt.auth"]
  JWT --> Token["tenant.token"]
  Token --> Permission["company.permission"]
  Permission --> Controller
~~~

Nem todas as rotas utilizam todas as etapas do pipeline.

### Resolução do tenant

`tenant.domain` identifica o tenant pelo host da requisição e inicializa seu
contexto antes da autenticação do usuário.

### Proteção contra mutações concorrentes

`mutable.request.lock` atua sobre requisições:

- POST;
- PUT;
- PATCH;
- DELETE.

O middleware utiliza tenant e solicitante para formar a chave de rate limit,
reduzindo requisições mutáveis repetidas em um intervalo muito curto.

### Autenticação e vínculo do token

Após a autenticação JWT, `tenant.token` compara o claim assinado `tenant_id`
com o tenant previamente resolvido pelo domínio.

Um token emitido para um tenant não deve ser aceito no contexto de outro.

### Permissionamento

Rotas operacionais protegidas utilizam `company.permission`.

A autorização final acontece no backend; a visibilidade de itens no frontend
não substitui essa validação.

## APIs implementadas

| Domínio | Operações atuais |
| --- | --- |
| Autenticação | Login, check, logout e atualização de permissões |
| Tenants | Listagem, busca, criação, visualização e atualização parcial |
| Roles | Listagem, busca, opções, CRUD e vínculos de permissões |
| Permissions | Consulta para composição de roles |
| Customers | Listagem, busca, opções, CRUD e soft delete |

## Respostas da API

Controllers utilizam `ApiBaseController` e `ApiResponseTrait` para manter
respostas consistentes.

O formato atual trabalha com:

- `message`;
- `data`;
- `errors`, quando aplicável.

Resources são responsáveis por transformar entidades e coleções para o formato
exposto pela API.

## Transações

- Criação e atualização de customers ocorrem na conexão do tenant atual.
- Alterações de role e seus vínculos de permissões utilizam transação no banco
  central.
- `company` e usuário inicial são criados juntos em transação dentro do novo
  banco do tenant.
- Operações que envolvem simultaneamente banco central e banco de tenant não
  possuem uma única transação distribuída.

## Repository base

O backend possui uma camada própria de repositories para centralizar operações
repetitivas de acesso a dados.

`Repository` concentra operações básicas como:

- query;
- find;
- create;
- update;
- delete;
- firstOrCreate;
- updateOrCreate;
- forceDelete.

`BaseRepository` adiciona mecanismos reutilizáveis de:

- busca;
- filtros;
- filtros por data;
- ordenação;
- paginação;
- consulta por campo.

Repositories concretos declaram quais campos participam de cada comportamento,
evitando repetir a construção das mesmas queries em cada módulo.

## Pontos em evolução

- A cobertura de testes automatizados ainda não implementada.
- O campo recebido em `sort_by` ainda deve ser restringido a uma lista de
  colunas permitidas.
- O parâmetro `limit` ainda deve receber um teto máximo no repository base.
- O provisionamento de tenant ocorre de forma síncrona durante a requisição.
- A autorização administrativa ainda pode evoluir para capacidades mais
  granulares.
