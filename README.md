# Task Manager - Aplicação Full-Stack

Uma aplicação moderna e completa para gestão de tarefas, construída com **Node.js**, **Vue.js** e uma arquitetura distribuída, pronta para a nuvem.

---

## 🚀 Visão Geral

Este projeto é uma aplicação de gestão de tarefas (CRUD) que permite aos utilizadores criar contas, gerir as suas tarefas e colaborar em tempo real. A arquitetura foi desenhada para ser escalável, resiliente e observável, utilizando tecnologias modernas e práticas de desenvolvimento de software de ponta.

---

## ✨ Funcionalidades Principais

- **Autenticação via OAuth 2.0:** Login seguro com contas do GitHub.
- **CRUD de Tarefas Completo:** Crie, leia, atualize e apague tarefas.
- **Colaboração em Tempo Real:** Alterações refletidas instantaneamente via WebSockets.
- **Performance Otimizada:** Cache com Redis para acesso rápido a dados.
- **Observabilidade:** Instrumentação com OpenTelemetry e Jaeger.
- **Interface Moderna:** Frontend com Vue.js 3, Pinia e Vuetify.
- **Ambiente Containerizado:** Docker e Docker Compose para desenvolvimento consistente.

---

## 🛠️ Arquitetura e Tecnologias

A aplicação segue uma arquitetura baseada em serviços, com separação clara entre frontend e backend:

| Camada         | Tecnologia                         | Propósito                                                    |
|----------------|------------------------------------|--------------------------------------------------------------|
| Frontend       | Vue.js 3, Pinia, Vuetify           | Interface reativa, gestão de estado e componentes UI         |
| Backend        | Node.js, Fastify                   | API RESTful de alta performance                              |
| Base de Dados  | PostgreSQL                         | Persistência de dados relacionais (utilizadores, tarefas)    |
| Cache          | Redis                              | Armazenamento em memória para dados acessados com frequência|
| Autenticação   | OAuth 2.0, JWT                     | Login seguro e gestão de sessões                             |
| Tempo Real     | WebSockets                         | Comunicação bidirecional para atualizações instantâneas      |
| Observabilidade| OpenTelemetry, Jaeger              | Tracing distribuído e monitoramento                          |
| Containerização| Docker                             | Ambiente de desenvolvimento e produção consistente           |

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

- Docker e Docker Compose
- Git

### 1. Clonar o Repositório

```bash
git clone https://github.com/SEU_UTILIZADOR/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

### 2. Configurar Variáveis de Ambiente

Antes de iniciar, configure as suas chaves da OAuth App do GitHub:

- Crie uma OAuth App em: **Settings > Developer settings > OAuth Apps**
- Use:
  - **Homepage URL:** `http://localhost:8080`
  - **Callback URL:** `http://localhost:3333/auth/github/callback`

Abra o arquivo: `backend/src/modules/auth/routes.ts`  
E substitua as variáveis:

> TODO trocar por variáveis de ambiente
```ts
const GITHUB_CLIENT_ID = 'SUA_CLIENT_ID_AQUI';
const GITHUB_CLIENT_SECRET = 'SEU_CLIENT_SECRET_AQUI';
```

### 3. Iniciar a Aplicação

```bash
docker compose up -d --build
```

### 4. Sincronizar a Base de Dados

```bash
docker compose exec backend npx prisma db push
```

### 5. Aceder à Aplicação

- **Frontend:** http://localhost:8080  
- **Backend (API):** http://localhost:3333  
- **Jaeger (Tracing):** http://localhost:16686  
- **RabbitMQ (Painel):** http://localhost:15672  

---

## 📂 Estrutura do Projeto

```
├── backend/        # API Node.js (Fastify)
├── frontend/       # Aplicação Vue.js
└── docker-compose.yml
```

---

## 🔮 Próximos Passos

- ✅ Implementar testes unitários e de integração com Jest
- ✅ Criar pipeline de CI/CD com GitHub Actions
- ✅ Configurar mensageria com RabbitMQ para tarefas assíncronas
- ✅ Implementar deploy da aplicação

---

> Para dúvidas ou contribuições, fique à vontade para abrir uma [issue](https://github.com/EduardoFerr/watch-tasks/issues) ou pull request!
