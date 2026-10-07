import crypto from "node:crypto";

export function createLineSignature(body: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(body).digest("base64");
}

export function parseLineMessage(raw: string) {
  const input = raw.trim();

  // รายจ่าย 150 อาหาร ข้าวมันไก่
  // รายรับ 15000 เงินเดือน
  const match = input.match(/^(\S+)\s+([0-9,]+)(?:\s+([^\s]+))?(?:\s+(.+))?$/i);

  if (!match) {
    return null;
  }

  const [, typeText, amountText, categoryText, descText] = match;

  const type =
    typeText.toLowerCase() === "รายรับ" || typeText.toLowerCase() === "income"
      ? "income"
      : "expense";

  const amount = Number(amountText.replace(/,/g, ""));

  return {
    type,
    amount,
    category: categoryText || "ทั่วไป",
    description: descText || categoryText || "รายการใหม่",
  };
}
