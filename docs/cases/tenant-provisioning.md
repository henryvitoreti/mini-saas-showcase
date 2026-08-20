# Case: provisionamento de tenant

<span class="status-label status--implemented">Implementado</span>

## 1. Contexto

Em uma arquitetura com banco separado por tenant, criar apenas o registro
central da empresa não é suficiente.

Antes do primeiro acesso, o novo tenant precisa receber seu próprio banco,
schema e dados mínimos de inicialização.

## 2. Problema

O provisionamento atravessa dois contextos independentes:

- banco central: tenant, domínio e role;
- banco do tenant: migrations, company e usuário inicial.

Como cada contexto possui sua própria conexão, uma falha intermediária precisa
ser tratada para evitar recursos parcialmente provisionados.

## 3. Decisão técnica

O evento <code>TenantCreated</code> dispara o pipeline de provisionamento do
pacote de tenancy.

Depois da criação do banco e execução das migrations, o Service inicializa o
novo tenant e grava company e usuário inicial em uma transação local.

O processo é síncrono na V1 e possui um fluxo compensatório quando ocorre uma
falha após a criação central.

## 4. Funcionamento

~~~mermaid
flowchart TD
  Start["Payload validado"] --> Role["Validar role central ativa"]
  Role --> Domain["Validar domínio disponível"]
  Domain --> Tenant["Criar tenant central"]
  Tenant --> Event["TenantCreated"]
  Event --> DB["CreateDatabase"]
  DB --> Migrate["MigrateDatabase"]
  Migrate --> SaveDomain["Criar domain"]
  SaveDomain --> Init["Inicializar tenant"]
  Init --> Seed["Transação: company + usuário"]
  Seed --> End["Encerrar contexto"]
  Tenant -. falha .-> Compensate["Excluir tenant/banco como compensação"]
~~~

## 5. Trechos selecionados de código

<p class="code-origin">Arquivo privado: <code>backend/app/Providers/TenancyServiceProvider.php</code></p>

~~~php
Events\TenantCreated::class => [
    JobPipeline::make([
        Jobs\CreateDatabase::class,
        Jobs\MigrateDatabase::class,
        // Jobs\SeedDatabase::class,

        // Trecho omitido para demonstração
    ])->send(function (Events\TenantCreated $event) {
        return $event->tenant;
    })->shouldBeQueued(false),
],
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Services/TenantService.php</code></p>

~~~php
public function store(array $data): Tenant
{
    $tenant = null;

    try {
        $roleId = (int)$data['company']['role_id'];
        $this->ensureActiveRole($roleId);

        $tenant = $this->createTenant($data, $roleId);
        $this->createTenantInitialData($tenant, $data, $roleId);

        return $this->tenantRepository->findWithDomains($tenant->id);
    } catch (Throwable $throwable) {
        $tenant?->delete();
        throw $throwable;
    } finally {
        if (tenancy()->initialized) {
            tenancy()->end();
        }
    }
}
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Services/TenantService.php</code></p>

~~~php
private function createTenantInitialData(Tenant $tenant, array $data, int $roleId): void
{
    if (tenancy()->initialized) {
        tenancy()->end();
    }

    tenancy()->initialize($tenant);

    DB::transaction(function () use ($data, $roleId): void {
        $companyData = $data['company'];
        $companyData['role_id'] = $roleId;

        $this->companyRepository->saveCurrentCompany($companyData);

        $this->userRepository->create([
            'name' => $data['user']['name'],
            'email' => $data['user']['email'],
            'password' => $data['user']['password'],
            'is_active' => true,
        ]);
    });
}
~~~

O Model de usuário utiliza cast <code>hashed</code> para password; o valor não
é armazenado em texto puro pelo Eloquent.

## 6. Como o código é utilizado

<code>TenantController::store</code> delega o fluxo ao Service dentro do
contexto administrativo.

A criação do registro central dispara o pipeline que provisiona o banco. Em
seguida, o Service inicializa esse novo contexto para criar os dados internos.

O seed automático permanece desabilitado porque company e usuário inicial são
criados diretamente pelo fluxo de provisionamento.

O contexto de tenancy é encerrado em <code>finally</code>, inclusive quando
alguma etapa lança uma exceção.

## 7. Tratamento de falhas

Quando uma falha acontece após a criação central, o Service tenta remover o
tenant criado.

O evento de exclusão correspondente também remove o banco provisionado.

Essa estratégia funciona como compensação entre recursos que não compartilham
uma única transação.

<div class="decision-card">
  <strong>Trade-off:</strong> não existe atomicidade distribuída entre banco
  central e banco tenant. A V1 utiliza transações locais e compensação para
  reduzir estados parcialmente provisionados.
</div>

## 8. Resultado

- Cada tenant recebe banco e schema próprios.
- Company recebe a role selecionada no cadastro central.
- O primeiro usuário é criado diretamente no novo banco.
- Dados iniciais de company e usuário compartilham uma transação local.
- O contexto retorna ao banco central ao final.
- Falhas executam compensação sobre o tenant já criado.

## 9. Evoluções previstas

Com crescimento de volume ou complexidade do provisionamento, o fluxo poderá
evoluir para:

- execução assíncrona;
- estado explícito de provisionamento;
- retries controlados;
- operações idempotentes;
- observabilidade das etapas;
- health check antes de liberar o acesso;
- testes automatizados de falha em cada fronteira.

Essas evoluções não são necessárias para o fluxo síncrono atual, mas preparam a
arquitetura para provisionamentos mais longos e maior volume de tenants.