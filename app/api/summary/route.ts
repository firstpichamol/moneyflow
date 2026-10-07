import { NextRequest } from "next/server";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { ok: false, message: "Supabase is not configured" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { ok: false, message: "Supabase client unavailable" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({ ok: false, message: error.message }, { status: 500 });
    }

    const items = data || [];
    const income = items
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expense = items
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const today = new Date().toISOString().slice(0, 10);
    const todayExpense = items
      .filter((item) => item.type === "expense" && item.created_at?.slice(0, 10) === today)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return Response.json({
      ok: true,
      transactions: items,
      summary: {
        totalBalance: income - expense,
        income,
        expense,
        todayExpense,
        monthExpense: expense,
      },
    });
  } catch (error) {
    console.error("Summary API error:", error);
    return Response.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
