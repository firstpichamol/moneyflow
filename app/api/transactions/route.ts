export const dynamic = "force-dynamic";

import { getMockTransactions, summarizeTransactions } from "@/lib/mock-data";

export async function GET() {
  const transactions = getMockTransactions();
  const summary = summarizeTransactions(transactions);

  return Response.json({
    ok: true,
    transactions,
    summary,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, category, description, date } = body ?? {};

    if (!type || !amount || !category || !description) {
      return Response.json({ ok: false, message: "Missing required fields" }, { status: 400 });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return Response.json({ ok: false, message: "Amount must be a positive number" }, { status: 400 });
    }

    const { appendMockTransaction, getMockTransactions: getUpdatedTransactions } = await import("@/lib/mock-data");
    const transaction = appendMockTransaction({
      type: String(type).toLowerCase() === "income" ? "income" : "expense",
      amount: parsedAmount,
      category: String(category).slice(0, 50),
      description: String(description).slice(0, 200),
      date: String(date || new Date().toISOString().slice(0, 10)),
    });

    return Response.json({
      ok: true,
      transaction,
      summary: summarizeTransactions(getUpdatedTransactions()),
    });
  } catch (error) {
    console.error("Transaction API error:", error);
    return Response.json({ ok: false, message: "Failed to create transaction" }, { status: 500 });
  }
}
