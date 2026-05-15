# Moneyzin 💸

Controle financeiro pessoal com dashboard interativo, metas de orçamento e lançamento de transações via WhatsApp com IA.

**[→ Ver demo ao vivo](https://moneyzin.vercel.app)**

---

## Screenshots

### Landing page
![Landing page com hero, preview do dashboard e grid de funcionalidades](https://i.imgur.com/placeholder-landing.png)

> **Nota:** adicione screenshots reais tirando prints do app em produção e substituindo os links acima. Sugestão: use [Lightshot](https://app.prntscr.com) ou a própria ferramenta de captura do sistema operacional, suba no [Imgur](https://imgur.com) e cole a URL aqui.

### Dashboard
![Dashboard com cards de saldo, gráficos e metas mensais](https://i.imgur.com/placeholder-dashboard.png)

### Transações
![Listagem de transações com filtros por mês e categoria](https://i.imgur.com/placeholder-transactions.png)

### Metas de orçamento
![Barras de progresso por categoria mostrando o quanto foi gasto](https://i.imgur.com/placeholder-metas.png)

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Dashboard** | Cards de saldo/receitas/despesas + gráficos interativos (pizza, barras, evolução mensal). Widgets arrastáveis com drag & drop. |
| **Transações** | CRUD completo com filtro por mês, categoria e busca por texto. |
| **Metas** | Defina limites mensais por categoria e acompanhe via barras de progresso com alertas visuais. |
| **Exportação** | Gera relatório em PDF ou planilha Excel do mês selecionado com um clique. |
| **WhatsApp + IA** | Envie `"50 mercado"` ou `"recebi 3000 salário"` pelo WhatsApp e a transação é registrada automaticamente via Claude AI (Haiku). |
| **Dark mode** | Alternância de tema claro/escuro persistida. |

---

## Tech stack

- **[Next.js 16](https://nextjs.org)** — App Router, Server Components, Server Actions
- **[Prisma](https://prisma.io)** + **[Supabase](https://supabase.com)** — ORM + PostgreSQL
- **[Clerk](https://clerk.com)** — Autenticação (OAuth + magic link)
- **[Tailwind CSS v4](https://tailwindcss.com)** — Estilização
- **[Recharts](https://recharts.org)** — Gráficos
- **[@dnd-kit](https://dndkit.com)** — Drag & drop do dashboard
- **[Claude AI](https://anthropic.com)** (`claude-haiku-4-5`) — NLP para WhatsApp
- **[Z-API](https://z-api.io)** — Webhook WhatsApp
- **[Vitest](https://vitest.dev)** — Testes unitários
- **[Vercel](https://vercel.com)** — Deploy

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL (ou conta Supabase gratuita)
- Conta Clerk
- Conta Anthropic (opcional — só para integração WhatsApp)

### 1. Clone e instale

```bash
git clone https://github.com/seu-usuario/moneyzin.git
cd moneyzin
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com seus valores (veja [Variáveis de ambiente](#variáveis-de-ambiente)).

### 3. Configure o banco de dados

```bash
npx prisma migrate dev
```

### 4. Rode o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Banco de dados (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Clerk — autenticação
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Anthropic — NLP para WhatsApp (opcional)
ANTHROPIC_API_KEY="sk-ant-..."

# Z-API — integração WhatsApp (opcional)
ZAPI_INSTANCE_ID="..."
ZAPI_TOKEN="..."
ZAPI_WEBHOOK_SECRET="..."
OWNER_WHATSAPP="5511999999999"
OWNER_USER_ID="..."   # ID do seu usuário no banco
```

---

## Integração WhatsApp

O webhook em `/api/webhooks/zapi` recebe mensagens de WhatsApp, envia o texto para o Claude AI (modelo Haiku) e registra a transação automaticamente.

**Formatos aceitos:**

```
50 mercado               → despesa R$50, categoria Alimentação
150 conta de luz         → despesa R$150, categoria Moradia
recebi 3000 salário      → receita R$3000, categoria Salário
80 farmácia              → despesa R$80, categoria Outros
```

Para configurar: aponte o webhook do Z-API para `https://seu-dominio.com/api/webhooks/zapi?token=SEU_SECRET`.

---

## Testes

```bash
npm test
```

Testes unitários da validação do schema Zod (19 casos).

---

## Deploy

O projeto está pronto para deploy na Vercel. Basta conectar o repositório e adicionar as variáveis de ambiente no painel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/moneyzin)

---

## Licença

MIT
