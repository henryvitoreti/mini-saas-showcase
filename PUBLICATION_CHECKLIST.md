# Checklist de publicação

Não publicar enquanto houver item crítico de segurança, licença ou escopo sem
resolução.

## Escopo e identidade

- [ ] Nome público confirmado.
- [ ] Posicionamento confirmado.
- [ ] Público-alvo confirmado.
- [ ] Autor, cargo e links preenchidos.
- [ ] Marca e assets aprovados para uso público.
- [ ] Implementado, Em evolução e Planejado revisados.

## Conteúdo

- [x] Todas as páginas conferidas com <code>SOURCE_MAP.md</code>.
- [x] Todos os snippets comparados com o código privado.
- [x] Comentários de omissão presentes.
- [x] Nenhum arquivo privado completo publicado.
- [ ] Ortografia e consistência revisadas.
- [x] Limitações e riscos descritos com precisão.
- [x] Módulos planejados não aparecem como funcionais.

## Segurança e privacidade

- [x] Env, logs, dumps e backups ausentes.
- [ ] Scanner de secrets no diretório final aprovado.
- [ ] Scanner de secrets no histórico público aprovado.
- [x] Nenhuma credencial/fixture privada copiada.
- [x] Nenhum caminho local absoluto.
- [ ] Rota diagnóstica removida/protegida antes de demo online.
- [ ] Vínculo JWT/tenant testado.
- [ ] Segunda revisão de segurança concluída.

## Site

- [x] Dependências instaladas com lockfile.
- [ ] Alertas do <code>npm audit</code> revisados/aceitos ou resolvidos.
- [x] Build local sem erro.
- [x] Preview local verificado.
- [x] Links e assets locais verificados.
- [x] Mermaid renderizado.
- [x] Tema claro e escuro inspecionados.
- [x] Desktop e mobile inspecionados.
- [x] Base do nome final testada.
- [ ] Busca local testada.
- [ ] Acessibilidade básica revisada.

## Mídia

- [ ] 14 screenshots de <code>MEDIA_CHECKLIST.md</code> produzidos.
- [ ] 8 vídeos de <code>MEDIA_CHECKLIST.md</code> produzidos.
- [ ] Fixtures exclusivas usadas.
- [ ] Tokens, dados pessoais, logs e DevTools ausentes.
- [ ] Metadados removidos.
- [ ] Imagens compactadas.
- [ ] Vídeos compactados e legendados.
- [ ] Alt text/transcrições adicionados.

## Licença e repositório

- [ ] Licença final escolhida.
- [ ] Titular/ano revisados.
- [ ] Repositório público vazio criado.
- [ ] Somente o conteúdo interno de showcase copiado.
- [ ] Novo histórico Git iniciado.
- [ ] README e comandos testados em checkout limpo.
- [ ] Workflow revisado.
- [ ] GitHub Pages configurado com Actions.
- [ ] URL pública testada em navegação direta.
- [ ] Repositório fixado no perfil.

## Lançamento no LinkedIn

- [ ] Rascunho 1 adaptado à voz do autor.
- [ ] Imagem de capa aprovada.
- [ ] Vídeo principal aprovado.
- [ ] Link e preview social testados.
- [ ] Publicação principal revisada.
- [ ] Seção Projetos atualizada.
- [ ] Destaques atualizados.
- [ ] Currículo atualizado.
- [ ] Quatro publicações técnicas seguintes preparadas.

## Pós-lançamento

- [ ] Comentários e feedback acompanhados.
- [ ] Problemas públicos triados.
- [ ] Links monitorados.
- [ ] Roadmap atualizado com evidência.
- [ ] Releases do showcase planejadas.
- [ ] Sanitização repetida em cada atualização.
