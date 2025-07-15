Task Manager - Aplicação Full-Stack
Uma aplicação moderna e completa para gestão de tarefas, construída com Node.js, Vue.js e uma arquitetura distribuída, pronta para a nuvem.

🚀 Visão Geral
Este projeto é uma aplicação de gestão de tarefas (CRUD) que permite aos utilizadores criar contas, gerir as suas tarefas e colaborar em tempo real. A arquitetura foi desenhada para ser escalável, resiliente e observável, utilizando tecnologias modernas e práticas de desenvolvimento de software de ponta.

✨ Funcionalidades Principais
Autenticação via OAuth 2.0: Login seguro com contas do GitHub.

CRUD de Tarefas Completo: Crie, leia, atualize e apague tarefas.

Colaboração em Tempo Real: As alterações são refletidas instantaneamente para todos os utilizadores graças aos WebSockets.

Performance Otimizada: Utilização de cache com Redis para acelerar o acesso a dados.

Observabilidade: Instrumentação com OpenTelemetry para tracing distribuído com Jaeger.

Interface Reativa e Moderna: Frontend construído com Vue.js 3, Pinia e Vuetify.

Desenvolvimento Containerizado: Ambiente de desenvolvimento padronizado com Docker e Docker Compose.

🛠️ Arquitetura e Tecnologias
A aplicação segue uma arquitetura baseada em serviços, com uma separação clara entre o frontend e o backend.

Camada

Tecnologia

Propósito

Frontend

Vue.js 3, Pinia, Vuetify

Interface reativa, gestão de estado e componentes UI.

Backend

Node.js, Fastify

API RESTful de alta performance.

Base de Dados

PostgreSQL

Persistência de dados relacionais (utilizadores, tarefas).

Cache

Redis

Armazenamento em memória para dados acedidos com frequência.

Autenticação

OAuth 2.0, JWT

Fluxo de login seguro e gestão de sessões.

Tempo Real

WebSockets

Comunicação bidirecional para atualizações instantâneas.

Observabilidade

OpenTelemetry, Jaeger

Tracing distribuído e monitorização.

Containerização

Docker

Ambiente de desenvolvimento e produção consistente.

⚙️ Como Executar Localmente
Siga estes passos para configurar e executar a aplicação no seu ambiente de desenvolvimento.

Pré-requisitos
Docker e Docker Compose

Git

1. Clonar o Repositório
git clone https://github.com/SEU_UTILIZADOR/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO

2. Configurar Variáveis de Ambiente
Antes de iniciar, precisa de configurar as suas chaves da OAuth App do GitHub.

Crie uma OAuth App no seu perfil do GitHub em Settings > Developer settings > OAuth Apps.

Use http://localhost:8080 como a "Homepage URL" e http://localhost:3333/auth/github/callback como a "Authorization callback URL".

Abra o ficheiro backend/src/modules/auth/routes.ts.

Substitua os valores de exemplo pelas suas chaves:

const GITHUB_CLIENT_ID = 'SUA_CLIENT_ID_AQUI'; #TODO implementar variável de ambiente
const GITHUB_CLIENT_SECRET = 'SEU_CLIENT_SECRET_AQUI'; #TODO implementar variável de ambiente

3. Iniciar a Aplicação
Use o Docker Compose para construir as imagens e iniciar todos os serviços em segundo plano.

docker compose up -d --build

4. Sincronizar a Base de Dados
Com os containers em execução, execute o seguinte comando para que o Prisma crie as tabelas na base de dados PostgreSQL:

docker compose exec backend npx prisma db push

5. Aceder à Aplicação
Frontend: http://localhost:8080

Backend (API): http://localhost:3333

Jaeger (Tracing): http://localhost:16686

RabbitMQ (Painel de Gestão): [http://localhost:15672](http://localhost:15