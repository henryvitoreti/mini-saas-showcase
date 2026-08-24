# Vídeos

Os vídeos abaixo aprofundam os principais fluxos apresentados na visão geral da
aplicação.

Cada demonstração está relacionada aos respectivos cases técnicos e utiliza
exclusivamente dados fictícios.

## Visão geral

<div class="media-grid">
    <div style="grid-column: 1 / -1; width: 100%;">
        <MediaCard
            media-type="video"
            src="/videos/application-overview.webm"
            title="Visão geral da aplicação"
            alt="Vídeo com uma visão geral dos principais módulos e da interface da aplicação."
        />
    </div>
</div>

Uma apresentação rápida da V1, passando por login, navegação, clientes,
tenants, roles, permissões e comportamento geral da interface.

O objetivo é permitir que o projeto seja compreendido visualmente antes do
aprofundamento nos fluxos específicos.

## Demonstrações técnicas

<div class="media-grid">
    <MediaCard
        media-type="video"
        src="/videos/tenant-provisioning.webm"
        title="Multi-tenancy e provisionamento"
        alt="Vídeo mostrando a criação de um tenant, provisionamento do banco e primeiro acesso pelo domínio."
    />

<MediaCard
    media-type="video"
    src="/videos/customers-flow.webm"
    title="Clientes e AppDataTable"
    alt="Vídeo demonstrando busca, filtros, paginação, formulário, validação, exportação e ações de clientes."
/>

<MediaCard
    media-type="video"
    src="/videos/permissions-flow.webm"
    title="Permissionamento"
    alt="Vídeo demonstrando configuração de role e os estados disponível, bloqueado e oculto de uma permissão."
/>

<MediaCard
    media-type="video"
    src="/videos/responsive-layout.webm"
    title="Responsividade"
    alt="Vídeo demonstrando a adaptação da navegação, listagem e formulários entre desktop e mobile."
/>

</div>

## Multi-tenancy e provisionamento

Demonstra o fluxo completo de criação e primeiro acesso de um tenant:

* cadastro da empresa;
* definição da role;
* criação do usuário inicial;
* provisionamento do banco;
* execução das migrations;
* criação do domínio;
* acesso pelo novo host;
* primeiro login no contexto provisionado.

O vídeo complementa os cases de
[Multi-tenancy](../architecture/tenancy),
[Provisionamento de tenant](../cases/tenant-provisioning) e
[Resolução por domínio](../cases/domain-resolution).

## Clientes e AppDataTable

Apresenta o principal fluxo operacional implementado na V1 e conecta frontend e
backend em uma única demonstração.

Entre os comportamentos apresentados estão:

* busca com debounce;
* filtros;
* ordenação;
* paginação;
* alteração da quantidade por página;
* exportação;
* criação de cliente;
* validação retornada pela API;
* associação dos erros aos campos;
* edição;
* exclusão com confirmação.

O vídeo complementa os cases de
[AppDataTable](../cases/data-table),
[Busca genérica](../cases/generic-search) e
[Composables de formulário](../cases/form-composables).

## Permissionamento

Demonstra como a role associada à empresa determina a disponibilidade dos
recursos.

Para tornar os diferentes estados observáveis, a demonstração utiliza uma
permissão de `products` criada especificamente para exemplificar o mecanismo de
permissionamento.

Essa permissão não representa um módulo funcional de produtos na V1.

São demonstrados três estados:

* permissão ativa e recurso disponível;
* permissão inativa com recurso visível e bloqueado;
* permissão inativa com recurso oculto da navegação.

Também é apresentada a alteração da configuração da role e seu reflexo na
interface.

A composição visual não substitui a autorização realizada pela API.

O funcionamento técnico está detalhado em
[Permissionamento](../architecture/permissions) e
[Resolução de permissão](../cases/permission-resolution).

## Responsividade

Apresenta como a mesma interface se adapta às diferentes larguras de tela:

* sidebar expandida;
* sidebar minimizada;
* navegação através de flyout;
* drawer em dispositivos móveis;
* adaptação da AppDataTable;
* reorganização dos formulários.

A demonstração mostra a transição entre os estados da interface, complementando
as capturas estáticas disponíveis na página de
[Screenshots](./screenshots).

## Sobre os vídeos

Todas as informações exibidas foram preparadas exclusivamente para a
demonstração.

Os vídeos apresentam funcionalidades efetivamente implementadas ou, quando
indicado explicitamente, recursos demonstrativos utilizados para explicar uma
infraestrutura já funcional.
