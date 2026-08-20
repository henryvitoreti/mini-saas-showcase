# Case: Repository Pattern

<span class="status-label status--implemented">Implementado</span>

## 1. Contexto

Clientes, tenants, roles e permissões compartilham necessidades recorrentes de
persistência, busca, filtros, ordenação e paginação.

O projeto utiliza Eloquent como ORM, mas concentra operações repetitivas em uma
camada própria de repositories para evitar que cada domínio reconstrua a mesma
infraestrutura de consulta.

## 2. Problema

Sem uma abstração compartilhada, repositories de diferentes módulos precisariam
reimplementar comportamentos como:

- instanciação e validação do Model;
- find, create, update e delete;
- busca textual;
- filtros simples e por data;
- ordenação e paginação.

Além da repetição, isso aumentaria a possibilidade de cada listagem evoluir com
um contrato de consulta diferente.

## 3. Decisão técnica

A estrutura foi dividida em três níveis:

1. <code>Repository</code> concentra o ciclo do Model e operações básicas;
2. <code>BaseRepository</code> adiciona busca, filtros, paginação e ordenação;
3. repositories concretos declaram os campos e comportamentos específicos do
   domínio.

<div class="decision-card">
  <strong>Decisão:</strong> Eloquent continua responsável pelo ORM e pelos
  relacionamentos. Os repositories padronizam acesso e consulta aos dados,
  enquanto Services orquestram os casos de uso.
</div>

## 4. Funcionamento

~~~mermaid
flowchart LR
  Controller --> Service
  Service --> CustomerRepository
  CustomerRepository --> BaseRepository
  BaseRepository --> Repository
  Repository --> CustomerModel["Customer Model"]
  CustomerModel --> DB[("Banco tenant")]
~~~

O repository concreto informa qual Model utiliza e declara os campos disponíveis
para busca e filtragem.

A partir disso, o Service utiliza operações reutilizáveis como
<code>paginateSearch()</code>, <code>findOrFail()</code> e
<code>create()</code> sem reconstruir a query de cada entidade.

## 5. Trechos selecionados de código

<p class="code-origin">Arquivo privado: <code>backend/app/Repositories/Repository.php</code></p>

~~~php
public function __construct()
{
    $this->makeModel();
}

abstract public function model(): string;

protected function makeModel(): void
{
    $modelClass = $this->model();

    $model = app($modelClass);

    if (!$model instanceof Model) {
        throw new RuntimeException("A classe {$modelClass} deve ser uma instância de Illuminate\Database\Eloquent\Model.");
    }

    $this->model = $model;
}

public function query(): Builder
{
    return $this->model->newQuery();
}
~~~

O contrato exige que o repository concreto retorne uma classe Eloquent válida.

<p class="code-origin">Arquivo privado: <code>backend/app/Repositories/Repository.php</code></p>

~~~php
public function create(array $data): Model|null
{
    return $this->query()->create($data);
}

// Trecho omitido para demonstração

public function update(int|string $id, array $data): Model|null
{
    $entity = $this->find($id);

    if ($entity === null) {
        return null;
    }

    $entity->update($data);

    return $entity->refresh();
}

// Trecho omitido para demonstração

public function delete(int|string $id): bool
{
    $entity = $this->find($id);

    if ($entity === null) {
        return false;
    }

    return (bool)$entity->delete();
}
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Repositories/BaseRepository.php</code></p>

~~~php
public function search(Request $request): Builder
{
    $query = $this->model->newQuery();

    $this->applySearchFilter($query, $request);
    $this->applyFieldFilters($query, $request);
    $this->applyDateFilters($query, $request);

    return $query;
}

public function paginateSearch(Request $request, array $columns = ['*']): LengthAwarePaginator
{
    $query = $this->search($request);

    $this->applyRequestOrdering($query, $request);

    $limit = max((int) $request->input('limit', 15), 1);
    $page = max((int) $request->input('page', 1), 1);

    return $query->paginate(perPage: $limit, columns: $columns, page: $page);
}
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Repositories/CustomerRepository.php</code></p>

~~~php
protected array $searchFields = [
    'name' => 'ilike',
    'email' => 'like',
    'phone' => 'like',
    'secondary_phone' => 'like',
];

protected array $filterFields = [
    'id',
    'name' => 'ilike',
    'document' => 'like',
    'email',
    'type',
    'phone' => 'like',
    'secondary_phone' => 'like',
    'zip_code',
    'street' => 'like',
    'number',
    'district' => 'like',
    'city' => 'like',
    'state',
    'is_active',
];

protected array $dateFilterFields = [
    'birth_date',
    'created_at',
    'updated_at',
];

protected string $defaultDateFilterField = 'created_at';
~~~

## 6. Como o código é utilizado

<p class="code-origin">Arquivo privado: <code>backend/app/Services/CustomerService.php</code></p>

~~~php
public function index(Request $request): LengthAwarePaginator
{
    return $this->customerRepository->paginateSearch($request);
}

public function search(Request $request): Collection
{
    return $this->customerRepository->getSearch($request);
}
~~~

O mesmo mecanismo é utilizado por repositories de tenants, roles e permissions.
Cada repository concreto define somente os campos e consultas necessários para
seu domínio.

Consultas sem paginação também podem ser utilizadas deliberadamente em
endpoints auxiliares, como opções para selects.

## 7. Resultado

- Operações básicas centralizadas.
- Repositories concretos menores e declarativos.
- Convenção compartilhada para busca, filtros, paginação e ordenação.
- Menos repetição entre módulos.
- Services permanecem focados no fluxo do caso de uso.
- Novas entidades conseguem reutilizar a infraestrutura existente.

## 8. Trade-offs atuais

- A flexibilidade da camada exige controle sobre quais parâmetros podem chegar
  às queries.
- O comportamento de busca depende do operador configurado em cada repository.
- O suporte a campos de relacionamento existe, mas ainda não é utilizado pelos
  repositories funcionais atuais.
- A infraestrutura ainda não possui cobertura automatizada dedicada.

## 9. Evoluções previstas

- Restringir explicitamente os campos permitidos para ordenação.
- Definir teto máximo para paginação por request.
- Ampliar testes de busca, filtros, datas e relacionamentos.
- Avaliar estratégias específicas de paginação quando o volume de dados exigir.