import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { CATEGORIES, type Category } from "@/app/lib/schemas";

const WEBHOOK_SECRET = process.env.ZAPI_WEBHOOK_SECRET;
const OWNER_WHATSAPP = process.env.OWNER_WHATSAPP;
const OWNER_USER_ID = process.env.OWNER_USER_ID;
const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;

// Keywords para detectar RECEITA
const INCOME_KEYWORDS = [
  "recebi", "recebei", "salário", "salario", "renda",
  "ganhei", "ganho", "entrada", "pix recebido", "freelance",
];

// Keywords por categoria para auto-detecção
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Alimentação: ["mercado", "supermercado", "restaurante", "lanche", "comida",
    "almoço", "jantar", "café", "padaria", "ifood", "delivery", "pizza"],
  Transporte: ["uber", "taxi", "táxi", "ônibus", "metrô", "combustível",
    "gasolina", "estacionamento", "99", "cabify"],
  Moradia: ["aluguel", "condomínio", "luz", "água", "internet", "gás", "iptu"],
  Salário: ["salário", "salario", "pagamento"],
  Lazer: ["cinema", "netflix", "spotify", "show", "teatro", "viagem",
    "hotel", "bar", "game", "jogo"],
  Outros: [],
};

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

function parseMessage(text: string): ParsedTransaction | null {
  const lower = text.toLowerCase().trim();

  // Extrai o valor monetário (ex: "50", "50.00", "50,00", "R$ 50")
  const amountMatch = lower.match(/r?\$?\s*(\d+(?:[.,]\d{1,2})?)/);
  if (!amountMatch) return null;

  const amount = parseFloat(amountMatch[1].replace(",", "."));
  if (isNaN(amount) || amount <= 0) return null;

  const type: "INCOME" | "EXPENSE" =
    INCOME_KEYWORDS.some((kw) => lower.includes(kw)) ? "INCOME" : "EXPENSE";

  // Remove valor e verbos comuns para obter a descrição
  let description = text
    .replace(/r?\$?\s*\d+(?:[.,]\d{1,2})?/i, "")
    .replace(/\b(recebi|recebei|gastei|paguei|comprei)\b/gi, "")
    .trim();

  // Detecta categoria: primeiro verifica menção explícita, depois por keywords
  let category: Category = "Outros";

  for (const cat of CATEGORIES) {
    if (lower.includes(cat.toLowerCase())) {
      category = cat;
      description = description
        .replace(new RegExp(cat, "gi"), "")
        .trim();
      break;
    }
  }

  if (category === "Outros") {
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
      if (keywords.some((kw) => lower.includes(kw))) {
        category = cat;
        break;
      }
    }
  }

  if (!description) description = "Lançamento via WhatsApp";

  return { amount, description, type, category };
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

  // Valida o token secreto na URL (?token=...)
  const token = req.nextUrl.searchParams.get("token");
  if (token !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Ignora mensagens enviadas pelo próprio bot ou de grupos
  if (body.fromMe || body.isGroup) {
    return NextResponse.json({ ok: true });
  }

  // Só processa mensagens do dono do app
  const senderPhone = (body.phone ?? "").replace("@c.us", "").replace(/\D/g, "");
  const ownerPhone = OWNER_WHATSAPP.replace(/\D/g, "");
  if (senderPhone !== ownerPhone) {
    return NextResponse.json({ ok: true });
  }

  const messageText: string = body.text?.message ?? "";
  if (!messageText) return NextResponse.json({ ok: true });

  // Comando de ajuda
  if (/^(ajuda|help|\?)$/i.test(messageText.trim())) {
    await sendMessage(senderPhone, HELP_MESSAGE);
    return NextResponse.json({ ok: true });
  }

  const parsed = parseMessage(messageText);

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
