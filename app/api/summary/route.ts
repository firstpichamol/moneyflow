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
