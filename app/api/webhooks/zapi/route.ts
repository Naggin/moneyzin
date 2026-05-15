import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import prisma from "@/app/lib/prisma";
import { CATEGORIES, type Category } from "@/app/lib/schemas";

const WEBHOOK_SECRET = process.env.ZAPI_WEBHOOK_SECRET;
const OWNER_WHATSAPP = process.env.OWNER_WHATSAPP;
const OWNER_USER_ID = process.env.OWNER_USER_ID;
const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;

const anthropic = new Anthropic();

const SYSTEM_PROMPT =
  `Você é um assistente de controle financeiro pessoal. ` +
  `Analise a mensagem do usuário e extraia informações de uma transação financeira.\n\n` +
  `Categorias disponíveis: ${CATEGORIES.join(", ")}\n\n` +
  `Regras:\n` +
  `- Se a mensagem mencionar recebimento (recebi, salário, renda, ganho, freelance, entrada), o tipo é INCOME\n` +
  `- Caso contrário, o tipo é EXPENSE\n` +
  `- Escolha a categoria mais adequada ao contexto da mensagem\n` +
  `- A descrição deve ser limpa, sem verbos como "gastei", "recebi", "paguei", "comprei"\n` +
  `- Se não houver valor monetário válido, use amount=0`;

const HELP_MESSAGE =
  `💡 *Como registrar uma transação:*\n\n` +
  `*Despesa:* valor + descrição\n` +
  `Ex: \`50 mercado\`\n` +
  `Ex: \`150 conta de luz\`\n\n` +
  `*Receita:* recebi + valor + descrição\n` +
  `Ex: \`recebi 3000 salário\`\n\n` +
  `*Com categoria explícita:*\n` +
  `Ex: \`80 farmácia saúde\`\n\n` +
  `*Categorias:* ${CATEGORIES.join(", ")}`;

interface ParsedTransaction {
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  category: Category;
}

async function parseMessageWithClaude(text: string): Promise<ParsedTransaction | null> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [
        {
          name: "register_transaction",
          description:
            "Registra uma transação financeira extraída da mensagem. " +
            "Use amount=0 se a mensagem não contiver uma transação válida.",
          input_schema: {
            type: "object" as const,
            properties: {
              amount: {
                type: "number",
                description: "Valor em reais. Use 0 se não houver transação válida.",
              },
              description: {
                type: "string",
                description: "Descrição limpa da transação, sem verbos de ação.",
              },
              type: {
                type: "string",
                enum: ["INCOME", "EXPENSE"],
                description: "INCOME para receitas, EXPENSE para despesas.",
              },
              category: {
                type: "string",
                enum: Array.from(CATEGORIES),
                description: "Categoria mais adequada.",
              },
            },
            required: ["amount", "description", "type", "category"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "register_transaction" },
      messages: [{ role: "user", content: text }],
    });

    const toolUse = response.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") return null;

    const input = toolUse.input as {
      amount: number;
      description: string;
      type: "INCOME" | "EXPENSE";
      category: Category;
    };

    if (!input.amount || input.amount <= 0) return null;

    return {
      amount: input.amount,
      description: input.description || "Lançamento via WhatsApp",
      type: input.type,
      category: input.category,
    };
  } catch (error) {
    console.error("Erro ao processar mensagem com Claude:", error);
    return null;
  }
}

async function sendMessage(phone: string, message: string) {
  if (!ZAPI_INSTANCE_ID || !ZAPI_TOKEN) return;
  await fetch(
    `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, message }),
    }
  );
}

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET || !OWNER_WHATSAPP || !OWNER_USER_ID) {
    console.error("Variáveis de ambiente do webhook Z-API não configuradas.");
    return NextResponse.json({ error: "Misconfigured" }, { status: 500 });
  }

  const token = req.nextUrl.searchParams.get("token");
  if (token !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.fromMe || body.isGroup) {
    return NextResponse.json({ ok: true });
  }

  const senderPhone = (body.phone ?? "").replace("@c.us", "").replace(/\D/g, "");
  const ownerPhone = OWNER_WHATSAPP.replace(/\D/g, "");
  if (senderPhone !== ownerPhone) {
    return NextResponse.json({ ok: true });
  }

  const messageText: string = body.text?.message ?? "";
  if (!messageText) return NextResponse.json({ ok: true });

  if (/^(ajuda|help|\?)$/i.test(messageText.trim())) {
    await sendMessage(senderPhone, HELP_MESSAGE);
    return NextResponse.json({ ok: true });
  }

  const parsed = await parseMessageWithClaude(messageText);

  if (!parsed) {
    await sendMessage(
      senderPhone,
      `❌ Não entendi. Digite *ajuda* para ver os formatos aceitos.`
    );
    return NextResponse.json({ ok: true });
  }

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo",
  });

  await prisma.transaction.create({
    data: {
      description: parsed.description,
      amount: parsed.amount,
      type: parsed.type,
      category: parsed.category,
      date: new Date(today + "T12:00:00.000Z"),
      userId: OWNER_USER_ID,
    },
  });

  const emoji = parsed.type === "INCOME" ? "✅" : "💸";
  const typeLabel = parsed.type === "INCOME" ? "Receita" : "Despesa";
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parsed.amount);

  await sendMessage(
    senderPhone,
    `${emoji} *${typeLabel}* registrada!\n\n` +
    `📝 ${parsed.description}\n` +
    `💰 ${formatted}\n` +
    `🏷️ ${parsed.category}`
  );

  return NextResponse.json({ ok: true });
}
