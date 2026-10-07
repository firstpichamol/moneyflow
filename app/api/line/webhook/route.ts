export const dynamic = "force-dynamic";

import { createLineSignature, parseLineMessage } from "@/lib/line";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  return Response.json({
    ok: true,
    message: "LINE webhook ready",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const secret = process.env.LINE_CHANNEL_SECRET;
    const signature = request.headers.get("x-line-signature");

    // Verify LINE signature if secret is set
    if (secret && signature) {
      const expected = createLineSignature(body, secret);
      if (expected !== signature) {
        return Response.json({ ok: false, message: "Invalid signature" }, { status: 401 });
      }
    }

    const json = JSON.parse(body || "{}") as {
      events?: Array<{
        type?: string;
        message?: { type?: string; text?: string };
        replyToken?: string;
        source?: { userId?: string };
      }>;
    };

    if (!json.events || json.events.length === 0) {
      return Response.json({ ok: true, message: "No events" });
    }

    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const replies: string[] = [];

    for (const event of json.events) {
      if (event.type !== "message" || event.message?.type !== "text") {
        continue;
      }

      const text = (event.message?.text || "").trim();
      if (!text) continue;

      let replyText = "";

      // Handle commands
      if (text === "ยอดเงิน") {
        if (!isSupabaseConfigured()) {
          replyText = "❌ Supabase ยังไม่ได้ตั้งค่า ลองใหม่หลังตั้งค่า environment";
        } else {
          const supabase = getSupabaseClient();
          if (supabase) {
            const { data = [] } = await supabase.from("transactions").select("*");
            const income = data.filter((i) => i.type === "income").reduce((s, i) => s + Number(i.amount), 0);
            const expense = data.filter((i) => i.type === "expense").reduce((s, i) => s + Number(i.amount), 0);
            const balance = income - expense;
            replyText = `💰 ยอดเงินปัจจุบัน: ฿${balance.toLocaleString("th-TH")}`;
          } else {
            replyText = "❌ ไม่สามารถเชื่อมต่อ Supabase ได้";
          }
        }
      } else if (text === "ยอดวันนี้") {
        const today = new Date().toISOString().slice(0, 10);
        if (!isSupabaseConfigured()) {
          replyText = "❌ Supabase ยังไม่ได้ตั้งค่า";
        } else {
          const supabase = getSupabaseClient();
          if (supabase) {
            const { data = [] } = await supabase.from("transactions").select("*");
            const todayExpense = data
              .filter((i) => i.type === "expense" && i.created_at?.slice(0, 10) === today)
              .reduce((s, i) => s + Number(i.amount), 0);
            replyText = `📊 รายจ่ายวันนี้: ฿${todayExpense.toLocaleString("th-TH")}`;
          }
        }
      } else if (text === "รายการล่าสุด") {
        if (!isSupabaseConfigured()) {
          replyText = "❌ Supabase ยังไม่ได้ตั้งค่า";
        } else {
          const supabase = getSupabaseClient();
          if (supabase) {
            const { data = [] } = await supabase.from("transactions").select("*").limit(5);
            if (data.length === 0) {
              replyText = "ยังไม่มีรายการใด ๆ";
            } else {
              replyText = "📝 รายการล่าสุด:\n" + data.map((t) => `${t.created_at?.slice(0, 10)} ${t.type === "income" ? "➕" : "➖"} ฿${t.amount} - ${t.category}`).join("\n");
            }
          }
        }
      } else {
        // Try to parse as transaction
        const parsed = parseLineMessage(text);
        if (parsed) {
          if (isSupabaseConfigured()) {
            const supabase = getSupabaseClient();
            if (supabase) {
              const { error } = await supabase.from("transactions").insert({
                user_id: "demo-user",
                type: parsed.type,
                amount: parsed.amount,
                category: parsed.category,
                description: parsed.description,
                occurred_at: new Date().toISOString(),
              });

              if (error) {
                replyText = `❌ บันทึกไม่สำเร็จ: ${error.message}`;
              } else {
                replyText = `✅ บันทึกแล้ว: ${parsed.type === "income" ? "➕" : "➖"}฿${parsed.amount.toLocaleString("th-TH")} (${parsed.category})`;
              }
            }
          } else {
            replyText = `❌ ยังไม่ได้ตั้งค่า Supabase`;
          }
        } else {
          replyText = `📌 ไม่เข้าใจคำสั่ง\n\nลองใช้:\nรายจ่าย 150 อาหาร ข้าวมันไก่\nรายรับ 15000 เงินเดือน\nยอดเงิน\nยอดวันนี้\nรายการล่าสุด`;
        }
      }

      replies.push(replyText);

      // Send reply via LINE API
      if (accessToken && event.replyToken && replyText) {
        try {
          await fetch("https://api.line.biz/v3/bot/message/reply", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              replyToken: event.replyToken,
              messages: [{ type: "text", text: replyText }],
            }),
          });
        } catch (err) {
          console.error("Failed to reply via LINE API:", err);
        }
      }
    }

    return Response.json({ ok: true, replies });
  } catch (error) {
    console.error("LINE webhook error:", error);
    return Response.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
