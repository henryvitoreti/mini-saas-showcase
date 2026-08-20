import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

const publicBase = process.env.VITEPRESS_BASE || '/';

export default withMermaid(defineConfig({
  lang: 'pt-BR',
  title: 'Mini-SaaS Multi-Tenant',
  description: 'Case técnico de uma aplicação full stack desenvolvida com Laravel, Nuxt, PostgreSQL, Redis, Docker e Traefik.',
  base: publicBase,
  cleanUrls: true,
  lastUpdated: false,
  head: [
    ['meta', { name: 'theme-color', content: '#508fff' }],
    ['meta', { name: 'author', content: 'Autor do Mini-SaaS' }],
  ],
  mermaid: {
    theme: 'neutral',
    securityLevel: 'strict',
    flowchart: {
      curve: 'basis',
      htmlLabels: true,
    },
  },
  mermaidPlugin: {
    class: 'mermaid-diagram',
  },
  themeConfig: {
    siteTitle: 'Mini-SaaS',
    logo: {
      light: '/images/showcase-mark-light.svg',
      dark: '/images/showcase-mark-dark.svg',
      alt: 'Marca abstrata do Mini-SaaS',
    },
    nav: [
      { text: 'Projeto', link: '/project/overview' },
      { text: 'Arquitetura', link: '/architecture/overview' },
      { text: 'Cases técnicos', link: '/cases/repository-pattern' },
      { text: 'Demonstração', link: '/demo/' },
      { text: 'Roadmap', link: '/project/roadmap' },
      { text: 'Sobre', link: '/author' },
    ],
    sidebar: [
      {
        text: 'Projeto',
        collapsed: false,
        items: [
          { text: 'Visão geral', link: '/project/overview' },
          { text: 'Estado da V1', link: '/project/implemented' },
          { text: 'Stack', link: '/project/stack' },
          { text: 'Limitações', link: '/project/limitations' },
          { text: 'Roadmap', link: '/project/roadmap' },
        ],
      },
      {
        text: 'Arquitetura',
        collapsed: true,
        items: [
          { text: 'Visão geral', link: '/architecture/overview' },
          { text: 'Backend', link: '/architecture/backend' },
          { text: 'Frontend', link: '/architecture/frontend' },
          { text: 'Multi-tenancy', link: '/architecture/tenancy' },
          { text: 'Permissionamento', link: '/architecture/permissions' },
          { text: 'Banco de dados', link: '/architecture/database' },
        ],
      },
      {
        text: 'Cases técnicos',
        collapsed: true,
        items: [
          { text: 'Repository Pattern', link: '/cases/repository-pattern' },
          { text: 'Busca genérica', link: '/cases/generic-search' },
          { text: 'Provisionamento de tenant', link: '/cases/tenant-provisioning' },
          { text: 'Resolução por domínio', link: '/cases/domain-resolution' },
          { text: 'Resolução de permissão', link: '/cases/permission-resolution' },
          { text: 'AppDataTable', link: '/cases/data-table' },
          { text: 'Composables de formulário', link: '/cases/form-composables' },
          { text: 'Persistência da interface', link: '/cases/interface-persistence' },
        ],
      },
      {
        text: 'Demonstração',
        collapsed: true,
        items: [
          { text: 'Visão geral', link: '/demo/' },
          { text: 'Screenshots', link: '/demo/screenshots' },
          { text: 'Vídeos', link: '/demo/videos' },
        ],
      },
      {
        text: 'Sobre',
        collapsed: false,
        link: '/author'
      },
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Buscar',
            buttonAriaLabel: 'Buscar',
          },
          modal: {
            noResultsText: 'Nenhum resultado encontrado',
            resetButtonTitle: 'Limpar busca',
            footer: {
              selectText: 'selecionar',
              navigateText: 'navegar',
              closeText: 'fechar',
            },
          },
        },
      },
    },
    outline: {
      level: [2, 3],
      label: 'Nesta página',
    },
    docFooter: {
      prev: 'Página anterior',
      next: 'Próxima página',
    },
    returnToTopLabel: 'Voltar ao topo',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Tema',
    lightModeSwitchTitle: 'Usar tema claro',
    darkModeSwitchTitle: 'Usar tema escuro',
    footer: {
      message: 'Case técnico público. O código completo da aplicação permanece privado.',
      copyright: 'Conteúdo preparado para avaliação profissional.',
    },
  },
}));
