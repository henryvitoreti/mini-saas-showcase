# Screenshots

Esta galeria apresenta os principais fluxos e estados visuais da aplicação
utilizando exclusivamente dados fictícios preparados para a demonstração.

As imagens podem ser ampliadas para visualizar detalhes da interface.

## Fluxos da aplicação

<div class="media-grid">
  <MediaCard media-type="image" :src="'/screenshots/login.png'" title="Login" filename="login.png" alt="Tela de login do Mini-SaaS em tema claro, com campos vazios." />
  <MediaCard media-type="image" :src="'/screenshots/customers-list.png'" title="Listagem de clientes" filename="customers-list.png" alt="Listagem de clientes com busca, filtros, tabela e paginação usando dados fictícios." />
  <MediaCard media-type="image" :src="'/screenshots/customer-filter.png'" title="Filtros de clientes" filename="customer-filter.png" alt="Painel de filtros aberto sobre a listagem de clientes." />
  <MediaCard media-type="image" :src="'/screenshots/customer-form.png'" title="Formulário de cliente" filename="customer-form.png" alt="Formulário de cliente com dados fictícios e campos de endereço." />
</div>

As capturas de clientes demonstram o fluxo operacional mais completo disponível
na V1, incluindo listagem, busca, filtros, formulário e adaptação da interface.

## Administração

<div class="media-grid">
  <MediaCard media-type="image" :src="'/screenshots/tenants-list.png'" title="Listagem de tenants" filename="tenants-list.png" alt="Listagem administrativa de tenants utilizando dados fictícios." />
  <MediaCard media-type="image" :src="'/screenshots/tenant-form.png'" title="Formulário de tenant" filename="tenant-form.png" alt="Formulário de criação de tenant com empresa, role e usuário inicial fictícios." />
  <MediaCard media-type="image" :src="'/screenshots/role-configuration.png'" title="Configuração de role" filename="role-configuration.png" alt="Listagem de roles e seus estados de acesso." />
  <MediaCard media-type="image" :src="'/screenshots/permissions.png'" title="Permissões" filename="permissions.png" alt="Formulário de role com configuração das permissões disponíveis para o pacote de acesso." />
</div>

Essas telas representam o contexto administrativo utilizado para provisionar
tenants e definir os pacotes de acesso disponíveis na plataforma.
Hoj
## Interface e responsividade

<div class="media-grid">
  <MediaCard media-type="image" :src="'/screenshots/sidebar-expanded.png'" title="Sidebar expandida" filename="sidebar-expanded.png" alt="Tela desktop da listagem de clientes com a sidebar expandida e o conteúdo completo visível." />
  <MediaCard media-type="image" :src="'/screenshots/sidebar-collapsed.png'" title="Sidebar minimizada" filename="sidebar-collapsed.png" alt="Tela desktop da listagem de clientes com a sidebar minimizada e o flyout aberto." />
  <MediaCard media-type="image" :src="'/screenshots/sidebar-mobile.png'" title="Navegação mobile" filename="sidebar-mobile.png" alt="Tela mobile da aplicação com o drawer lateral de navegação aberto." />
  <MediaCard media-type="image" :src="'/screenshots/mobile-layout.png'" title="Listagem mobile" filename="mobile-layout.png" alt="Listagem de clientes em viewport mobile, com controles compactos e tabela responsiva." />
</div>

A navegação mantém seu estado entre sessões e adapta o comportamento conforme a
largura disponível.

No desktop, a sidebar pode permanecer expandida ou minimizada. Em dispositivos
menores, ela passa a funcionar como drawer, enquanto listagens e controles são
reorganizados para preservar as ações principais.

## Isolamento de dados

<div class="media-grid">
  <MediaCard media-type="image" :src="'/screenshots/central-database.png'" title="Banco central" filename="central-database.png" alt="Diagrama do banco central mostrando permissions, roles, permission_role, tenants e domains." />
  <MediaCard media-type="image" :src="'/screenshots/tenant-database.png'" title="Banco do tenant" filename="tenant-database.png" alt="Diagrama de um banco de tenant mostrando company, users e customers." />
</div>

O banco central mantém as estruturas globais utilizadas para resolução dos
tenants e permissionamento.

Cada tenant recebe um banco independente para armazenar seus dados operacionais.
Na implementação atual, esse contexto possui `company`, `users` e `customers`
como estruturas funcionais.

A referência de `company.role_id` para a role central é lógica, pois os
registros pertencem a bancos diferentes.

## Sobre as capturas

* Todas as informações exibidas foram preparadas exclusivamente para a demonstração.
* Nenhuma credencial, token, secret ou configuração privada é apresentada.
* As capturas representam funcionalidades efetivamente disponíveis na V1.
* Imagens desktop e mobile são utilizadas para demonstrar os diferentes estados responsivos da interface.
