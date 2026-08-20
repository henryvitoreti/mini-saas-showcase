# Case: resolução de permissão

<span class="status-label status--implemented">Implementado</span>

## 1. Contexto

Roles e permissions pertencem ao banco central, enquanto
<code>company.role_id</code> fica no banco isolado de cada tenant.

A aplicação precisa combinar esses dois contextos para decidir quais recursos
a empresa pode utilizar.

## 2. Problema

O frontend precisa conhecer os recursos disponíveis para construir sua
interface, mas não pode ser responsável pela autorização.

Ao mesmo tempo, o backend precisa descobrir qual permissão representa a rota
solicitada mesmo depois que a aplicação já foi inicializada no banco do tenant.

## 3. Decisão técnica

O modelo utiliza:

- <code>company.role_id</code> como referência lógica à role central;
- <code>permissions.base_api_url</code> para representar a base protegida;
- <code>permission_role.is_active</code> para definir acesso;
- <code>show_locked_routes</code> exclusivamente para composição visual.

O middleware gera candidatos da URL atual e consulta o catálogo central antes
de permitir a execução do Controller.

## 4. Funcionamento

~~~mermaid
flowchart LR
  Request --> Company["company.role_id"]
  Company -. cross-DB .-> Role["roles"]
  Role --> Pivot["permission_role"]
  Pivot --> Permission["permissions.base_api_url"]
  Permission --> Decision{"is_active?"}
  Decision -->|sim| Controller
  Decision -->|não| Forbidden["403"]
~~~

## 5. Trechos selecionados de código

<p class="code-origin">Arquivo privado: <code>backend/app/Http/Middleware/EnsureCompanyPermission.php</code></p>

~~~php
public function handle(Request $request, Closure $next): Response
{
    $defaultErrorResponse = [
        'message' => 'Você não tem permissão para acessar este recurso.',
        'error_code' => 'domain_permission_denied'
    ];

    $roleId = CompanyPermissionHelper::getCurrentRoleId();

    if ($roleId === null) {
        return response()->json($defaultErrorResponse, Response::HTTP_FORBIDDEN);
    }

    $matches = $this->getBaseApiUrlCandidates($request);
    $hasPermission = $this->rolePermission->hasActivePermissionForApiUrls($roleId, $matches);

    if (!$hasPermission) {
        return response()->json($defaultErrorResponse, Response::HTTP_FORBIDDEN);
    }

    return $next($request);
}
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Repositories/RoleRepository.php</code></p>

~~~php
public function hasActivePermissionForApiUrls(int $id, array $baseApiUrls): bool
{
    if ($baseApiUrls === []) {
        return false;
    }

    $role = $this->find($id);

    return $role?->permissions()
        ->whereIn('permissions.base_api_url', $baseApiUrls)
        ->wherePivot('is_active', true)
        ->exists() ?? false;
}
~~~

<p class="code-origin">Arquivo privado: <code>frontend/app/config/sidebarItems.ts</code></p>

~~~ts
if (permission?.is_active) {
  return { allowed: true, show: true };
}

return {
  allowed: false,
  show: permission?.show_locked_routes ?? false,
};
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Helpers/CompanyPermissionHelper.php</code></p>

~~~php
public static function getCurrentPermissions(): array
{
    return Cache::remember(
        self::cacheKey(),
        now()->addMinutes(self::CACHE_TTL_MINUTES),
        fn (): array => self::resolveCurrentPermissions()
    );
}
~~~

## 6. Como o código é utilizado

Rotas de gerenciamento utilizam <code>company.permission</code> para validar se
a empresa possui acesso ao respectivo módulo.

No login e na atualização de permissões, a API retorna o conjunto associado à
role atual. O frontend utiliza essa informação para reconstruir a sidebar.

Um 403 específico de permissão pode provocar atualização desse estado e
redirecionamento da interface.

A decisão final de acesso não depende do conteúdo armazenado no navegador: o
middleware consulta diretamente o banco central.

## 7. Endpoints de opções

Endpoints de <code>options</code> seguem uma regra diferente das rotas de
gerenciamento.

Eles continuam exigindo autenticação e contexto válido de tenant, mas não
dependem da permissão de administração do módulo correspondente.

<div class="decision-card">
  <strong>Decisão:</strong> impedir o gerenciamento de um recurso não significa
  necessariamente impedir que esse recurso seja utilizado como dado
  referencial por outro fluxo autorizado.
</div>

Por exemplo, um módulo pode precisar apresentar produtos em um select mesmo
quando a empresa não possui acesso ao CRUD completo de produtos.

Esses endpoints devem retornar apenas os dados mínimos necessários para
referência e não expõem operações de criação, edição ou exclusão.

## 8. Resultado

- Pacotes de acesso permanecem centralizados.
- O backend mantém a decisão final de autorização.
- A interface utiliza o mesmo catálogo para exibir, bloquear ou ocultar
  funcionalidades.
- A mesma infraestrutura pode ser ampliada conforme novos módulos forem
  implementados.
- Dados referenciais podem permanecer disponíveis sem conceder acesso ao
  gerenciamento do respectivo módulo.

## 9. Pontos em evolução

- Alterações administrativas ainda não invalidam imediatamente todos os caches
  de interface afetados.
- O comportamento de uma role já atribuída que posteriormente seja desativada
  precisa seguir uma política consistente.
- A administração central ainda pode receber autorização mais granular.
- A infraestrutura ainda precisa de cobertura automatizada dos cenários de
  autorização.

## 10. Evolução futura

Permissões individuais por usuário podem ser avaliadas futuramente caso o
produto passe a exigir diferentes níveis de acesso dentro da mesma empresa.

Essa evolução deve complementar, e não substituir, o pacote contratado pelo
tenant: um usuário nunca deve obter uma capacidade que a própria empresa não
possui.