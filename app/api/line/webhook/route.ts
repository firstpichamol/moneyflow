export const dynamic = "force-dynamic";

import { parseLineMessage } from "@/lib/line";
import { appendMockTransaction, getMockTransactions, summarizeTransactions } from "@/lib/mock-data";

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
      const { createLineSignature } = await import("@/lib/line");
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
      if (event.type !== "message" || event.message?.type !== "text") continue;

      const text = (event.message?.text || "").trim();
      if (!text) continue;

      let replyText = "";

      // Handle specific commands
      if (text === "ยอดเงิน") {
        const { totalBalance } = summarizeTransactions(getMockTransactions());
        replyText = `ยอดเงินปัจจุบัน: ฿${totalBalance.toLocaleString("th-TH")}`;
      } else if (text === "ยอดวันนี้") {
        const { todayExpense } = summarizeTransactions(getMockTransactions());
        replyText = `รายจ่ายวันนี้: ฿${todayExpense.toLocaleString("th-TH")}`;
      } else if (text === "รายการล่าสุด") {
        const transactions = getMockTransactions().slice(0, 3);
        replyText = "รายการล่าสุด:\n" + transactions.map((t) => `${t.date} ${t.type === "income" ? "+" : "-"}฿${t.amount} (${t.category})`).join("\n");
      } else if (text.startsWith("เชื่อม")) {
        const code = text.slice(3).trim();
        replyText = `ได้รับรหัส: ${code}\nจำเป็นต้องยืนยันในเว็บ https://moneyflow.app/link`;
      } else {
        // Try to parse as transaction
        const parsed = parseLineMessage(text);
        if (parsed) {
          const transaction = appendMockTransaction({
            type: parsed.type,
            amount: parsed.amount,
            category: parsed.category,
            description: parsed.description,
            date: new Date().toISOString().slice(0, 10),
          });
          const { totalBalance } = summarizeTransactions(getMockTransactions());
          replyText = `บันทึกแล้ว: ${parsed.type === "income" ? "+" : "-"}฿${transaction.amount} (${transaction.category})\nยอดเงินปัจจุบัน: ฿${totalBalance.toLocaleString("th-TH")}`;
        } else {
          replyText = `ไม่เข้าใจคำสั่ง ลองใช้:\nรายจ่าย 150 อาหาร ข้าวมันไก่\nรายรับ 15000 เงินเดือน\nยอดเงิน\nยอดวันนี้`;
        }
      }

      // Send reply via LINE API if token is set
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

      replies.push(replyText);
    }

    return Response.json({ ok: true, replies });
  } catch (error) {
    console.error("LINE webhook error:", error);
    return Response.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
