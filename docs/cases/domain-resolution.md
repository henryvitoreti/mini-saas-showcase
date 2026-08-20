# Case: resolução por domínio

<span class="status-label status--implemented">Implementado</span>

## 1. Contexto

Cada tenant é acessado através de um host próprio.

A API precisa descobrir qual empresa originou a requisição e inicializar seu
contexto antes de autenticar o usuário ou consultar qualquer dado operacional.

## 2. Problema

Se o tenant fosse resolvido depois da autenticação ou do acesso aos Models, a
aplicação poderia consultar a conexão errada.

O pipeline também precisa diferenciar claramente:

- domínio desconhecido;
- tenant existente, mas inativo;
- tenant válido e disponível.

## 3. Decisão técnica

Um middleware específico utiliza <code>DomainTenantResolver</code> com o host
completo da requisição.

Depois da resolução, o status central do tenant é validado e
<code>tenancy()->initialize()</code> estabelece o contexto operacional.

No frontend, a mesma convenção de subdomínio é utilizada para construir o host
da API.

## 4. Funcionamento

~~~mermaid
sequenceDiagram
  participant N as Nuxt
  participant T as Traefik
  participant M as tenant.domain
  participant C as Banco central
  participant X as Contexto tenant

  N->>T: tenant.app / tenant.api
  T->>M: request Laravel
  M->>C: procurar host em domains
  alt não encontrado
    M-->>N: 404
  else inativo
    M-->>N: 403
  else ativo
    M->>X: initialize
    M->>N: seguir para login/JWT
  end
~~~

## 5. Trechos selecionados de código

<p class="code-origin">Arquivo privado: <code>backend/app/Http/Middleware/InitializeTenantByDomain.php</code></p>

~~~php
public function handle(Request $request, Closure $next): Response
{
    try {
        $tenant = $this->tenantResolver->resolve($request->getHost());
    } catch (TenantCouldNotBeIdentifiedException) {
        return response()->json([
            'message' => 'Tenant não encontrado para este domínio.',
        ], Response::HTTP_NOT_FOUND);
    }

    if ($tenant instanceof Model && $tenant->getAttribute('active') === false) {
        return response()->json([
            'message' => 'Tenant inativo.',
        ], Response::HTTP_FORBIDDEN);
    }

    tenancy()->initialize($tenant);

    return $next($request);
}
~~~

<p class="code-origin">Arquivo privado: <code>backend/app/Models/Domain.php</code></p>

~~~php
public static function buildApiDomain(string $tenantId): string
{
    $host = parse_url((string) config('app.url'), PHP_URL_HOST);

    if (!is_string($host) || $host === '') {
        throw new RuntimeException('APP_URL não está configurada corretamente.');
    }

    return strtolower($tenantId.'.'.$host);
}
~~~

## 6. Como o código é utilizado

O grupo principal de <code>routes/api.php</code> utiliza
<code>tenant.domain</code>.

Isso garante que login e rotas autenticadas sejam executados somente depois da
definição do tenant correspondente à requisição.

Depois da autenticação, outro middleware compara o claim
<code>tenant_id</code> do JWT com o tenant já inicializado pelo domínio,
impedindo o uso de um token no contexto de outra empresa.

No Nuxt, <code>getApiBaseUrl()</code> utiliza o subdomínio atual da interface
para construir o host correspondente da API.

## 7. Resultado

- O host funciona como porta de entrada para o contexto do tenant.
- Domínios desconhecidos retornam 404.
- Tenants inativos retornam 403.
- A autenticação acontece já conectada ao banco correspondente.
- O JWT é posteriormente vinculado ao mesmo tenant resolvido.
- Frontend, Traefik e backend utilizam a mesma convenção de domínio.

## 8. Ambiente atual

Durante o desenvolvimento, os hosts são resolvidos localmente através de
<code>sslip.io</code> e encaminhados pelo Traefik.

Essa configuração existe para tornar o ambiente local reproduzível sem exigir
DNS externo.

A estratégia de resolução não depende especificamente do sslip.io; em produção,
os mesmos conceitos podem ser aplicados sobre domínios reais.

## 9. Evoluções previstas

Possíveis evoluções relacionadas ao gerenciamento de domínios incluem:

- suporte a domínios personalizados;
- verificação de propriedade do domínio;
- automação de certificados TLS;
- alteração controlada do domínio de um tenant;
- auditoria de mudanças;
- testes automatizados dos cenários de resolução e isolamento.