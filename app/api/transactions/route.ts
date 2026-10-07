import { NextRequest } from "next/server";
import { getMockTransactions, summarizeTransactions } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = summarizeTransactions(getMockTransactions());

  return Response.json({
    ok: true,
    summary,
    transactions: getMockTransactions(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, category, description, date } = body ?? {};

    if (!type || !amount || !category || !description) {
      return Response.json({ ok: false, message: "Missing required fields" }, { status: 400 });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      return Response.json({ ok: false, message: "Amount must be a number" }, { status: 400 });
    }

    const transaction = {
      id: `txn_${Date.now()}`,
      type: String(type).toLowerCase() === "income" ? "income" : "expense",
      amount: parsedAmount,
      category: String(category),
      description: String(description),
      date: String(date || new Date().toISOString().slice(0, 10)),
      createdAt: new Date().toISOString(),
    };

    return Response.json({ ok: true, transaction });
  } catch (error) {
    console.error("Transaction API error:", error);
    return Response.json({ ok: false, message: "Failed to create transaction" }, { status: 500 });
  }
}
