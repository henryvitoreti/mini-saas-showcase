# Mini-SaaS Multi-Tenant — showcase

Site estático de portfólio criado com VitePress. Ele documenta decisões e
recortes técnicos da V1 sem publicar o código completo da aplicação privada.

## Requisitos

- Node.js 20 ou superior;
- npm 10 ou superior.

## Execução

~~~bash
npm ci
npm run dev
npm run build
npm run preview
npm run check:links
~~~

O build é gerado em <code>docs/.vitepress/dist</code>.

## GitHub Pages e base

O arquivo <code>docs/.vitepress/config.ts</code> lê
<code>VITEPRESS_BASE</code> e usa <code>/</code> como padrão local.

Para simular um repositório de projeto:

~~~bash
VITEPRESS_BASE=/nome-do-repositorio/ npm run build
~~~

O workflow em <code>.github/workflows/deploy.yml</code> calcula
automaticamente <code>/nome-do-repositorio/</code>. Se o site for publicado em
domínio próprio ou em um repositório <code>usuario.github.io</code>, ajuste o
workflow para usar <code>/</code>.

## Conteúdo e segurança

- O conteúdo é baseado apenas nos arquivos listados em
  <code>SOURCE_MAP.md</code>.
- Screenshots e vídeos ainda são placeholders; consulte
  <code>MEDIA_CHECKLIST.md</code>.
- Nenhum <code>.env</code>, segredo, dump ou credencial deve entrar neste
  projeto.
- Execute a revisão descrita em <code>SANITIZATION_REPORT.md</code> antes da
  publicação.

## Licença

<code>LICENSE</code> é deliberadamente conservadora enquanto a licença pública
e o nome do titular não forem confirmados.
