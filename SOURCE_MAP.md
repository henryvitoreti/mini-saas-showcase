# Mapa de fontes

Este arquivo conecta cada página VitePress aos arquivos privados consultados.
Os caminhos são relativos ao monorepo privado; nenhum caminho local absoluto é
publicado.

## Critério

- **Implementado:** existe fluxo funcional comprovado em código/migration.
- **Em evolução:** existe base funcional, mas há lacunas relevantes.
- **Planejado:** aparece apenas como intenção, roteiro ou modelagem sem fluxo
  funcional equivalente.
- Intervalos de linha servem para auditoria da versão analisada e devem ser
  atualizados quando a fonte privada mudar.

## Home e projeto

| Página pública | Arquivos privados consultados | Trechos utilizados | Estado | Confirmação manual |
| --- | --- | --- | --- | --- |
| <code>docs/index.md</code> | <code>README.md</code>; <code>backend/README.md</code>; <code>frontend/README.md</code>; <code>docker-compose.yml</code>; routes/migrations | Nenhum snippet; síntese | Misto | Nome público e marca |
| <code>docs/project/overview.md</code> | READMEs; <code>docs/architecture.md</code>; routes, Services e migrations | Nenhum snippet | Misto | Posicionamento e público |
| <code>docs/project/implemented.md</code> | <code>backend/routes/api.php</code>; Controllers/Services; <code>frontend/app/pages/*</code>; migrations; Compose | Nenhum snippet | Misto | Revalidar a cada release |
| <code>docs/project/stack.md</code> | <code>backend/composer.json</code>; <code>backend/composer.lock</code>; <code>frontend/package-lock.json</code>; <code>docker-compose.yml</code>; Dockerfile | Nenhum snippet | Implementado/configurado | Atualizar versões |
| <code>docs/project/limitations.md</code> | Middlewares, Services, repositories, migrations, frontend, testes, Compose e docs auditados | Nenhum snippet | Em evolução | Prioridade e redação de riscos |
| <code>docs/project/roadmap.md</code> | <code>docs/database-modeling.md</code>; <code>docs/permissions.md</code>; gaps confirmados no código | Nenhum snippet | Planejado | Ordem de produto |

## Arquitetura

| Página pública | Arquivos privados consultados | Trechos utilizados | Estado | Confirmação manual |
| --- | --- | --- | --- | --- |
| <code>docs/architecture/overview.md</code> | <code>docs/architecture.md</code>; READMEs; routes; Services; frontend client; Compose | Diagramas sintetizados, sem snippet | Implementado + limites | Teste do vínculo JWT/tenant |
| <code>docs/architecture/backend.md</code> | <code>backend/README.md</code>; <code>backend/routes/api.php</code>; Controllers, Requests, Resources, Services, repositories e trait | Nenhum snippet | Implementado + evolução | Execução dos testes |
| <code>docs/architecture/frontend.md</code> | <code>frontend/README.md</code>; package; nuxt config; pages, components, composables, services e SCSS | Nenhum snippet | Implementado + evolução | Acessibilidade/mobile |
| <code>docs/architecture/tenancy.md</code> | <code>docs/tenancy.md</code>; <code>TenantService.php</code>; middleware; provider; tenancy config; migrations | Diagramas sintetizados | Implementado + evolução | Teste de isolamento/falhas |
| <code>docs/architecture/permissions.md</code> | <code>docs/permissions.md</code>; middleware/helper/repositories/RoleService; sidebar/auth frontend; migrations/seeders | Diagramas sintetizados | Implementado + evolução | Invalidação e escopo admin |
| <code>docs/architecture/database.md</code> | <code>docs/database-erd.md</code>; <code>docs/database-modeling.md</code>; todas as migrations e Models | Diagramas/tabelas sintetizados | Misto | Constraints futuras |

## Cases técnicos

| Página pública | Arquivos privados consultados | Trechos utilizados | Estado | Confirmação manual |
| --- | --- | --- | --- | --- |
| <code>docs/cases/repository-pattern.md</code> | <code>Repository.php</code>; <code>BaseRepository.php</code>; <code>CustomerRepository.php</code>; <code>CustomerService.php</code> | Repository 14–37, 77–113; Base 41–61; Customer 11–42; Service 16–24 | Implementado | Conferir verbatim/linhas |
| <code>docs/cases/generic-search.md</code> | <code>BaseRepository.php</code>; <code>CustomerRepository.php</code> | Base 83–93, 104–220 | Implementado + limites | Testar operators/datas |
| <code>docs/cases/tenant-provisioning.md</code> | <code>TenancyServiceProvider.php</code>; <code>TenantService.php</code>; <code>User.php</code> | Provider 28–39; Service 48–67, 123–143; User 35–41 | Implementado + evolução | Falhas/idempotência |
| <code>docs/cases/domain-resolution.md</code> | <code>InitializeTenantByDomain.php</code>; <code>Domain.php</code>; frontend HTTP client; Traefik | Middleware 21–39; Domain 18–27 | Implementado + evolução | Teste JWT/host e TLS |
| <code>docs/cases/permission-resolution.md</code> | <code>EnsureCompanyPermission.php</code>; <code>PermissionRepository.php</code>; helper; sidebar; handlers | Middleware 19–32; Repository 69–81; sidebar 153–160; helper 24–30 | Implementado + evolução | Role nula/cache/options |
| <code>docs/cases/data-table.md</code> | <code>AppDataTable.vue</code>; table types; export util; clientes page; pagination SCSS | DataTable 59–102, 193–210, 278–290, 355–375, 593–602, 683–705, 1048–1083; clientes 137–188; SCSS 439–497 | Implementado + evolução | Comparar snippets e vídeo |
| <code>docs/cases/form-composables.md</code> | Base, Customer, Tenant e Role form composables; customer fields; inputs; HTTP client | Base 47–90; Customer 86–109, 247–259; fields 101–119 | Implementado + evolução | Erros aninhados/required |
| <code>docs/cases/interface-persistence.md</code> | <code>app.vue</code>; AppHeader; AppSidebar; AppDataTable; theme SCSS | app 15–26; Header 12–18; Sidebar 86–94; DataTable 278–290 | Implementado + limites | Política de storage |

## Demonstração

| Página pública | Arquivos privados consultados | Trechos utilizados | Estado | Confirmação manual |
| --- | --- | --- | --- | --- |
| <code>docs/demo/index.md</code> | Pages e fluxos implementados de login, clientes, tenants e roles | Nenhum | Mídia planejada | Produzir e sanitizar |
| <code>docs/demo/screenshots.md</code> | Pages, components, migrations e requisitos do usuário | Nenhum | Planejado | Capturar 14 imagens |
| <code>docs/demo/videos.md</code> | Fluxos de tenancy, customers, permissions, DataTable e Compose | Nenhum | Planejado | Gravar 8 vídeos |

## Fontes deliberadamente não extraídas

- env reais e exemplos completos;
- logs;
- seeders/factories com credenciais ou dados plausíveis;
- dumps e backups;
- configurações privadas completas;
- arquivos inteiros de autenticação;
- componente AppDataTable completo;
- histórico Git do monorepo.
