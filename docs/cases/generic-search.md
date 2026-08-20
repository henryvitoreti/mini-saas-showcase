# Case: busca genérica

<span class="status-label status--implemented">Implementado</span>

## 1. Contexto

Listagens e endpoints auxiliares utilizam um contrato recorrente de consulta
entre frontend e backend.

Entre os parâmetros suportados estão:

- <code>search</code>;
- filtros por campo;
- intervalo de datas;
- <code>sort_by</code>;
- <code>order</code>;
- <code>page</code>;
- <code>limit</code>.

## 2. Problema

Implementar manualmente essa combinação em cada repository aumentaria repetição
e tornaria mais difícil manter o mesmo comportamento entre diferentes módulos.

## 3. Decisão técnica

<code>BaseRepository</code> interpreta configurações declarativas definidas
pelo repository concreto.

A convenção atual permite:

- chave numérica para comparação por igualdade;
- <code>campo => operador</code> para definir outra comparação;
- <code>relation.field</code> para filtros através de relacionamento;
- definição explícita de campos disponíveis para intervalo de datas;
- aplicação compartilhada de paginação e ordenação.

## 4. Funcionamento

~~~mermaid
flowchart LR
  Request --> Search["applySearchFilter"]
  Search --> Fields["applyFieldFilters"]
  Fields --> Dates["applyDateFilters"]
  Dates --> Sort["applyRequestOrdering"]
  Sort --> Page["paginate/get"]
~~~

A construção acontece progressivamente sobre o mesmo
<code>Builder</code>, permitindo combinar busca textual, filtros específicos e
intervalos de data antes da paginação.

## 5. Trechos selecionados de código

<p class="code-origin">Arquivo privado: <code>backend/app/Repositories/BaseRepository.php</code></p>

~~~php
protected function applySearchFilter(Builder $query, Request $request): Builder
{
    if (!$this->requestHasFilledField($request, 'search') || $this->searchFields === []) {
        return $query;
    }

    $search = $this->requestFieldValue($request, 'search');

    return $query->where(function (Builder $searchQuery) use ($search): void {
        foreach ($this->searchFields as $field => $operator) {
            [$field, $operator] = $this->normalizeConfiguredField($field, $operator);

            $this->applyFieldCondition($searchQuery, $field, $search, $operator, 'or');
        }
    });
}
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Repositories/BaseRepository.php</code></p>

~~~php
protected function applyDateFilters(Builder $query, Request $request): Builder
{
    if ($this->dateFilterFields === []) {
        return $query;
    }

    $dateField = $this->requestHasFilledField($request, 'date_field')
        ? (string) $this->requestFieldValue($request, 'date_field')
        : $this->defaultDateFilterField;

    if (!in_array($dateField, $this->dateFilterFields, true)) {
        return $query;
    }

    if ($this->requestHasFilledField($request, 'start_date')) {
        $this->applyFieldCondition($query, $dateField, $this->requestFieldValue($request, 'start_date'), '>=');
    }

    if ($this->requestHasFilledField($request, 'end_date')) {
        $this->applyFieldCondition($query, $dateField, $this->requestFieldValue($request, 'end_date'), '<=');
    }

    return $query;
}
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Repositories/BaseRepository.php</code></p>

~~~php
protected function applyFieldCondition(
    Builder $query,
    string $field,
    mixed $value,
    string $operator = '=',
    string $boolean = 'and'
): Builder {
    $value = $this->prepareFilterValue($operator, $value);

    if (!Str::contains($field, '.')) {
        return $boolean === 'or'
            ? $query->orWhere($field, $operator, $value)
            : $query->where($field, $operator, $value);
    }

    [$relation, $relationField] = explode('.', $field, 2);

    $callback = function (Builder $relationQuery) use ($relationField, $operator, $value): void {
        $relationQuery->where($relationField, $operator, $value);
    };

    return $boolean === 'or'
        ? $query->orWhereHas($relation, $callback)
        : $query->whereHas($relation, $callback);
}
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Repositories/BaseRepository.php</code></p>

~~~php
protected function applyRequestOrdering(Builder $query, Request $request): Builder
{
    $sortBy = (string) $request->input('sort_by', $this->getPrimaryKey());
    $order = strtoupper((string) $request->input('order', 'DESC'));

    if (!in_array($order, ['ASC', 'DESC'], true)) {
        $order = 'DESC';
    }

    return $query->orderBy($sortBy, $order);
}
~~~

## 6. Como o código é utilizado

<code>CustomerRepository</code> declara os campos disponíveis para busca,
filtros e intervalos de data.

O AppDataTable utiliza o mesmo contrato em query params e o Service apenas
solicita a listagem ao repository.

A infraestrutura também aceita filtros de um relacionamento no formato
<code>relation.field</code>, embora essa capacidade ainda não seja necessária
nos repositories funcionais atuais.

## 7. Resultado

- Contrato consistente entre frontend e backend.
- Novos filtros podem ser adicionados principalmente por configuração.
- Busca textual pode atuar sobre múltiplos campos.
- Intervalos de data utilizam a mesma infraestrutura.
- Busca agrupada utiliza OR enquanto filtros adicionais continuam utilizando
  AND.
- Paginação e ordenação seguem o mesmo comportamento entre módulos.

## 8. Pontos em evolução

- O parâmetro <code>limit</code> possui valor mínimo, mas ainda precisa de um
  teto.
- Relações aninhadas além de um nível não fazem parte do comportamento atual.
- Filtros de fim de período em campos timestamp precisam considerar o dia
  completo.
- A infraestrutura ainda não possui testes automatizados dedicados.

## 9. Evoluções previstas

- Allowlist declarativa de ordenação.
- Limite máximo de registros por request.
- Normalização de início e fim de período conforme o tipo do campo.
- Cobertura de testes para operadores, datas e relacionamentos.
- Limites específicos para listagem e operações de exportação.