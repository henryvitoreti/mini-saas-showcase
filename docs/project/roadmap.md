# Roadmap

O roadmap organiza próximos passos técnicos sem datas, métricas ou compromissos
comerciais inventados.

## 1. Consolidar a V1

<span class="status-label status--evolving">Em evolução</span>

- [ ] Criar testes de integração para login, tenancy, provisionamento e CRUD.
- [ ] Adicionar testes unitários para repositories e composables.
- [ ] Corrigir a listagem de domínios e diretiva indeterminate de roles.
- [ ] Adicionar lint, typecheck e testes ao frontend.
- [ ] Tratar concorrência e respostas fora de ordem no AppDataTable.
- [ ] Definir estratégia segura de sessão no navegador.

## 2. Reforçar isolamento e autorização

<span class="status-label status--planned">Planejado</span>

- [ ] Proteger ou remover a rota diagnóstica de tenancy.
- [ ] Automatizar invalidação de cache após mudanças de role/permissão.
- [ ] Definir compensação/idempotência do provisionamento.
- [ ] Avaliar provisionamento assíncrono para produção.

## 3. Preparar operação de produção

<span class="status-label status--planned">Planejado</span>

- [ ] TLS e gerenciamento externo de secrets.
- [ ] Rede e exposição mínima de PostgreSQL, Redis e dashboard.
- [ ] Observabilidade, logs sanitizados, métricas e alertas.
- [ ] Backup e restauração de banco central e bancos tenant.
- [ ] Pipeline CI/CD da aplicação privada.

## 4. Expandir o produto

<span class="status-label status--planned">Planejado</span>

Ordem sugerida pela dependência do domínio, sujeita a validação:

1. categorias de produtos;
2. produtos;
3. serviços;
4. estoque;
5. vendas e itens;
6. ordens de serviço e itens;
7. relatórios.

## 5. Camada comercial SaaS

<span class="status-label status--planned">Planejado</span>

Planos e assinaturas poderão selecionar uma role central. Hoje a role funciona
somente como pacote técnico de permissões; não há cobrança ou assinatura
implementada.

~~~mermaid
flowchart LR
  Subscription["Assinatura\nplanejada"] -.-> Plan["Plano\nplanejado"]
  Plan -.-> Role["Role central\nimplementada"]
  Role --> Pivot["permission_role\nimplementada"]
  Pivot --> Permission["permissions\nimplementada"]
~~~

::: info Critério de atualização
Um item só migra para Implementado quando houver fluxo funcional verificável,
evidência no código e atualização do mapa de fontes.
:::
