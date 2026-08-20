# Relatório de sanitização

Data da auditoria inicial: 2026-08-04.

Este relatório registra categorias e decisões. Valores encontrados nunca são
reproduzidos aqui.

## Escopo verificado

| Categoria | Verificação | Tratamento no showcase |
| --- | --- | --- |
| env | Env reais do backend e frontend existem, ignorados pelo Git | Não copiados |
| Chaves/secrets/tokens | Busca por termos e revisão de configs/autenticação | Nenhum valor copiado |
| Senhas/credenciais | Compose, env, seeders e factories revisados | Valores e fixtures não copiados |
| Dados pessoais | Seeders e contratos de customer/company/user revisados | Nenhum registro copiado; mídia pendente |
| Logs | Log local ignorado identificado | Não lido nem copiado |
| Dumps/backups | Extensões comuns procuradas fora de dependências | Nenhum artefato da aplicação selecionado |
| Caminhos locais | Trechos e conteúdo público revisados | Apenas caminhos relativos |
| Código | Snippets limitados e marcados por origem | Arquivos completos evitados |
| Infraestrutura | Compose/Traefik revisados | Somente descrição; credenciais não reproduzidas |
| Mídia | Diretórios conferidos | Somente .gitkeep; nenhuma captura real |
| Histórico | Inspeção inicial por nomes no monorepo relatada | Scanner semântico do novo repo ainda pendente |
| Licença | README e manifest têm sinais divergentes | Licença pública final ainda pendente |
| Dependências do site | <code>npm audit</code> executado após a instalação | Quatro alertas transitivos; aceitação/upgrade pendente |

## Informações removidas ou substituídas

- Valores de env, segredo JWT, chave da aplicação e credenciais.
- Credencial determinística de usuário de demonstração.
- Nomes, documentos, e-mails, telefones, endereços, datas e observações dos
  seeders.
- Nomes de banco, logs e respostas de diagnóstico.
- Caminhos absolutos da máquina local.
- Qualquer token ou sessão de navegador.
- Marca/identidade pessoal não confirmada; substituída por placeholder.
- Links de GitHub, LinkedIn e URL pública; substituídos por instruções ou
  <code>&lt;LINK_DO_CASE&gt;</code>.
- Mídia real; substituída por cards e nomes esperados.

## Trechos selecionados

Os snippets foram extraídos somente de:

- repositories e Service de clientes;
- provider/Service/middleware de tenancy;
- middleware/repository/helper de permissões;
- sidebar;
- AppDataTable, página de clientes e SCSS de tabela;
- composables e uso de inputs;
- persistência de tema/sidebar.

Cada trecho:

- informa o caminho privado relativo;
- usa comentário explícito quando há omissão;
- evita fixtures, secrets e configuração completa;
- é pequeno em relação ao arquivo original.

## Riscos técnicos encontrados

Estes pontos não são secrets, mas exigem ação antes de uma demo acessível:

1. rota diagnóstica de tenancy sem autenticação suficiente;
2. validação explícita entre tenant do host e claim JWT não localizada;
3. dashboard Traefik inseguro e serviços de dados expostos no ambiente local;
4. sessão no localStorage;
5. allowlist de ordenação e teto de paginação ausentes;
6. administração central baseada em tenant base + JWT;
7. invalidação administrativa de cache incompleta.

O relatório não afirma exploração confirmada. Os itens precisam de teste e
hardening no sistema privado.

## Dependências do gerador estático

O lockfile usa VitePress 1.6.4 e Vite 5.4.21. O <code>npm audit</code> atual
reportou três alertas moderados e um alto no grafo de ferramentas de
desenvolvimento, sem correção disponível na linha estável selecionada. Os
advisories atingem o servidor de desenvolvimento/preview e dependências
transitivas; o artefato publicado é HTML/CSS/JavaScript estático.

Até uma atualização compatível:

- não expor dev ou preview a redes não confiáveis;
- manter bind local durante revisão;
- usar o workflow apenas para <code>npm ci</code> e build;
- reexecutar audit e avaliar VitePress 2 quando plugin/estabilidade forem
  compatíveis;
- registrar a decisão antes do lançamento.

## Resultado da varredura local final

- [x] Nenhum arquivo com nome típico de env, chave privada, dump, backup ou log
  foi incluído nos 59 arquivos autorais do showcase.
- [x] Nenhum caminho local absoluto foi localizado no conteúdo publicável.
- [x] A busca literal por padrões de chave privada, token AWS, token GitHub e
  JWT não encontrou valor sensível.
- [x] Nenhum endereço de e-mail autoral ou dado real de fixture foi localizado.
- [x] Os diretórios de screenshots e vídeos não contêm mídia real.
- [x] <code>npm audit --omit=dev</code> não reportou vulnerabilidade nas
  dependências de produção.
- [ ] Um scanner dedicado, como Gitleaks, TruffleHog ou detect-secrets, ainda
  precisa ser executado antes da publicação.

As verificações marcadas foram feitas sobre o diretório final local. Elas não
substituem a revisão do histórico do futuro repositório público.

## Pontos ainda sujeitos a revisão manual

- [ ] Executar scanner dedicado de secrets no conteúdo final.
- [ ] Aceitar formalmente ou resolver os alertas do audit de dependências.
- [ ] Executar scanner de secrets no histórico do novo repositório público.
- [ ] Comparar cada snippet com a revisão privada que será publicada.
- [ ] Definir licença e titular do showcase.
- [ ] Confirmar nome público, marca e direitos dos assets.
- [ ] Preencher dados do autor.
- [ ] Criar fixtures exclusivas para mídia.
- [ ] Revisar cada screenshot pixel a pixel.
- [ ] Revisar cada frame/áudio dos vídeos.
- [ ] Remover metadados de mídia.
- [ ] Testar o risco de token entre tenants.
- [ ] Remover/proteger a rota diagnóstica antes de qualquer demo online.
- [ ] Solicitar segunda revisão independente.

## Regra de atualização

Toda nova extração de código ou mídia exige atualização simultânea deste
relatório e de <code>SOURCE_MAP.md</code>.
