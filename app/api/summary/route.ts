export const dynamic = "force-dynamic";

import { getMockTransactions, summarizeTransactions } from "@/lib/mock-data";

export async function GET() {
  const transactions = getMockTransactions();
  return Response.json({
    ok: true,
    transactions,
    summary: summarizeTransactions(transactions),
  });
}
