# Sistema de Gestão Laboratorial

Projeto Full Stack para portfólio, desenvolvido com Node.js, TypeScript, Express, React e PostgreSQL.

> Projeto educacional com dados fictícios. Não utilize dados médicos reais.

## Funcionalidades planejadas
- API REST para cadastro e consulta de pacientes
- Interface web React + TypeScript
- Persistência PostgreSQL via Prisma
- Validação de dados e tratamento de erros
- Testes automatizados e autenticação como próximas etapas

## Requisitos
- Node.js 20+
- npm
- PostgreSQL 15+

## Estrutura
```text
sistema-gestao-laboratorial/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    └── package.json
```

## Como executar

### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
A API ficará em `http://localhost:3333`. Endpoint de saúde: `GET /health`.

### 2. Frontend
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
Abra a URL indicada pelo Vite no terminal.

## Endpoints iniciais
- `GET /health` — verifica a API
- `GET /api/patients` — lista pacientes
- `POST /api/patients` — cadastra paciente
- `GET /api/patients/:id` — consulta paciente
- `PUT /api/patients/:id` — atualiza paciente
- `DELETE /api/patients/:id` — remove paciente

## Exemplo de cadastro
```json
{
  "name": "Paciente Exemplo",
  "email": "paciente@example.com",
  "birthDate": "1995-06-15"
}
```

## Próximas melhorias
- Autenticação JWT e perfis de acesso
- Módulo de exames e resultados
- Dashboard com indicadores
- Testes unitários e de integração
- Docker Compose para API e banco
- Deploy e screenshots

## Autor
Wesley Rodrigues — [GitHub](https://github.com/yxnxgwr)
