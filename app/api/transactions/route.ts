import { NextRequest } from "next/server";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
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
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return Response.json({ ok: false, message: error.message }, { status: 500 });
    }

    return Response.json({
      ok: true,
      transactions: data || [],
    });
  } catch (error) {
    console.error("Transactions GET error:", error);
    return Response.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { type, amount, category, description, date } = body ?? {};

    if (!type || !amount || !category || !description) {
      return Response.json({ ok: false, message: "Missing required fields" }, { status: 400 });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return Response.json({ ok: false, message: "Amount must be a positive number" }, { status: 400 });
    }

    const userId = "demo-user";

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        type: String(type).toLowerCase() === "income" ? "income" : "expense",
        amount: parsedAmount,
        category: String(category),
        description: String(description),
        occurred_at: new Date(date || Date.now()).toISOString(),
      })
      .select()
      .single();

    if (error) {
      return Response.json({ ok: false, message: error.message }, { status: 500 });
    }

    return Response.json({
      ok: true,
      transaction: data,
    });
  } catch (error) {
    console.error("Transaction POST error:", error);
    return Response.json({ ok: false, message: "Failed to create transaction" }, { status: 500 });
  }
}
