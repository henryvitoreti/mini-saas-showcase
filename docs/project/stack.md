# Stack técnica

As versões abaixo foram obtidas nos manifests, lockfiles e imagens Docker.

## Aplicação

| Camada | Tecnologia | Versão comprovada | Papel |
| --- | --- | --- | --- |
| Backend | Laravel | 13.4.0 | API, autenticação, regras e tenancy |
| Runtime backend | PHP | 8.3 | Execução da aplicação e extensões PostgreSQL/Redis |
| Multi-tenancy | stancl/tenancy | 3.10.0 | Banco por tenant e ciclo de contexto |
| JWT | tymon/jwt-auth | 2.3.0 | Autenticação Bearer |
| Frontend | Nuxt | 4.4.2 | Aplicação Vue e roteamento por arquivos |
| UI | Vue | 3.5.32 | Composition API e componentes |
| Linguagem | TypeScript | Configurado | Tipos de API, entidades e UI |
| Estilos | Bootstrap | 5.3.8 | Grid, utilitários e base visual |
| Estilos | SCSS | Configurado | Tema, tokens e responsividade |

## Dados e infraestrutura local

| Tecnologia | Versão/imagem | Uso atual |
| --- | --- | --- |
| PostgreSQL | 16 | Banco central e bancos de tenant |
| Redis | 7 | Cache; extensão Redis habilitada no PHP |
| Docker Compose | v2 esperado | Orquestração do ambiente local |
| Traefik | 3.3 | Entrada HTTP e roteamento por host |
| Node.js | 22 no Compose | Runtime de desenvolvimento do Nuxt |

## Topologia do ambiente

~~~mermaid
flowchart TB
  Browser["Navegador"]
  Traefik["Traefik :8081\nDashboard :8080"]
  Front["Nuxt dev server :3000"]
  Back["Laravel dev server :8000"]
  PG[("PostgreSQL :5432")]
  Redis[("Redis :6379")]

  Browser --> Traefik
  Traefik -->|frontend host| Front
  Traefik -->|api host| Back
  Back --> PG
  Back --> Redis
~~~

::: warning Ambiente de desenvolvimento
O Docker Compose padroniza o ambiente local, monta o código,
instala as dependências na inicialização e conecta frontend,
API, PostgreSQL, Redis e Traefik. Nesta etapa,
a configuração prioriza desenvolvimento e reprodutibilidade,
utilizando HTTP local, portas expostas e o dashboard do Traefik habilitado.
Recursos de produção, como TLS, gerenciamento de secrets e hardening dos containers,
fazem parte da evolução da infraestrutura.
