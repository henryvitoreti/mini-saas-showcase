# Limitações atuais

<span class="status-label status--evolving">Em evolução</span>

Limitações fazem parte do estado real da V1 e são apresentadas aqui como
informação de engenharia, não como promessa implícita.

## Segurança e produção

<div class="limitation-card">
  <strong>Autenticação no navegador.</strong> Token, sessão e permissões são
  persistidos em localStorage. Isso simplifica a V1, mas amplia o impacto
  potencial de XSS e merece revisão antes de produção.
</div>

- O ambiente Docker usa HTTP, dashboard Traefik inseguro e credenciais locais.
- PostgreSQL e Redis são publicados no host no Compose de desenvolvimento.
- Existe uma rota diagnóstica de tenant que expõe metadados de conexão e deve
  ser removida ou protegida antes de uma demo pública.
- O JWT exige o claim assinado <code>tenant_id</code>; nas rotas autenticadas,
  ele é comparado ao tenant resolvido pelo host para impedir o uso cruzado de
  tokens entre tenants.
- Login e as demais requisições mutáveis passam por
  <code>mutable.request.lock</code>, que aceita uma requisição por tenant e
  solicitante a cada dois segundos. Esse bloqueio de concorrência não substitui
  uma política de rate limiting contra tentativa de senha nem rotação de
  secrets.

## Tenancy e consistência

- Provisionamento é síncrono; o próprio provider sinaliza que fila deve ser
  avaliada para produção.
- Criar tenant envolve banco central e banco tenant sem transação distribuída.
- Na edição, company é atualizada antes do registro central; uma falha entre as
  operações pode deixar <code>role_id</code> divergente.
- A edição de tenant não altera identificador, domínio, status ou usuário
  inicial.

## Permissões

- Todos os usuários de um tenant compartilham a role da company.
- Não existe <code>role_user</code> nem permissão individual.
- Só a permissão-base de clientes está no seeder atual.
- Alterações administrativas em roles não invalidam automaticamente todos os
  caches de tenants afetados; login/refresh e TTL de 30 minutos atualizam o
  estado.
- Rotas administrativas dependem do tenant base e JWT, não de permissão
  granular.
- A sidebar melhora a experiência, mas não é uma barreira de autorização.

## Frontend

- Dashboard ainda exibe valores N/A.
- Não há middleware frontend de permissão por rota.
- Não existem testes automatizados, lint ou typecheck configurados.
- <code>AppDataTable</code> declara restore, mas não o implementa.
- Exportação é limitada a 1.000 registros; XLS é HTML compatível com Excel e o
  PDF simplifica caracteres/larguras.
- Preferências da tabela guardam somente filtros e limite por uma hora.
- Serviços externos de endereço não exibem feedback de erro dedicado.
