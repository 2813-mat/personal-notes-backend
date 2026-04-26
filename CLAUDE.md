# Personal Notes Backend

## O que é este projeto

Backend de um bloco de notas pessoal compartilhado entre duas pessoas (casal). Qualquer usuário autenticado pode ver, criar, editar e deletar qualquer nota — não existe ownership individual, as notas são do casal.

## Stack

- **Framework:** NestJS v11 (TypeScript)
- **Banco de dados:** MongoDB 7 via Mongoose
- **Autenticação:** JWT (passport-jwt)
- **Email:** @nestjs-modules/mailer + MailDev (dev) / SMTP real (prod)
- **Documentação:** Swagger em `/docs`
- **Infra:** Docker + docker-compose, self-hosted local

## Estrutura

```
src/
├── auth/           # JWT: register, login, guard, strategy
├── notes/          # CRUD de notas (protegido por JWT)
├── users/          # Schema e service de usuários
├── mail/           # Notificação por email ao criar nota
└── common/
    └── filters/    # AllExceptionsFilter — formato de erro padronizado
```

## Rodar em desenvolvimento

```bash
# Sobe MongoDB + MailDev + NestJS com hot-reload
docker compose up

# Ou local sem Docker (precisa de Mongo rodando na porta 27017)
npm run start:dev
```

## Rodar em produção

```bash
# Usa apenas docker-compose.yml (ignora o override)
docker compose -f docker-compose.yml up --build
```

O `.env` deve conter `JWT_SECRET` e `NOTIFICATION_EMAIL` (obrigatórios).

## Infra local

O serviço `nest-app` está conectado à rede externa `infra` para ser acessível pelo proxy reverso da infra local (mesmo padrão do `wedding-planner-backend`).

## Variáveis de ambiente

Veja `.env.example`. As mais importantes:

| Variável           | Descrição                          |
|--------------------|------------------------------------|
| JWT_SECRET         | Segredo do JWT (obrigatório)       |
| NOTIFICATION_EMAIL | Email que recebe alerta de nova nota |
| MONGO_URI          | URI do MongoDB                     |
| CORS_ORIGIN        | Origem permitida para o frontend   |

## Referências

- Contrato da API: `api.md`
- Swagger: `http://localhost:3000/docs`
