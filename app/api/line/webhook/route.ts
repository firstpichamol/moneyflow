export const dynamic = "force-dynamic";

export async function GET() {
  const payload = {
    ok: true,
    message: "LINE webhook ready",
    now: new Date().toISOString(),
  };

  return Response.json(payload);
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const secret = process.env.LINE_CHANNEL_SECRET;
    const signature = request.headers.get("x-line-signature");

    if (secret && signature) {
      const crypto = await import("node:crypto");
      const expected = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("base64");

      if (expected !== signature) {
        return Response.json({ ok: false, message: "Invalid signature" }, { status: 401 });
      }
    }

    const json = JSON.parse(body || "{}") as {
      events?: Array<{ type?: string; message?: { type?: string; text?: string }; source?: { userId?: string } }>;
    };

    if (!json.events || json.events.length === 0) {
      return Response.json({ ok: true, message: "No events received" });
    }

    const replies = json.events.map((event) => {
      const text = event.message?.text || "";

      if (!text) {
        return { type: "text", text: "กรุณาพิมพ์ข้อความ เช่น รายจ่าย 150 อาหาร ข้าวมันไก่" };
      }

      if (text.startsWith("เชื่อม")) {
        const code = Math.random().toString(36).slice(2, 8).toUpperCase();
        return { type: "text", text: `รหัสเชื่อมบัญชีของคุณคือ: ${code}\nใช้คำสั่งเชื่อม ${code} เพื่อยืนยันความสัมพันธ์กับ Bot` };
      }

      return {
        type: "text",
        text: `รับข้อความแล้ว: ${text}\n\nตัวอย่างคำสั่ง:\n- รายจ่าย 150 อาหาร ข้าวมันไก่\n- รายรับ 15000 เงินเดือน\n- ยอดเงิน\n- รายการล่าสุด`,
      };
    });

    return Response.json({ ok: true, replies });
  } catch (error) {
    console.error("LINE webhook error:", error);
    return Response.json({ ok: false, message: "Bad request" }, { status: 400 });
  }
}
