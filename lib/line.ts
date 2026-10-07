import crypto from "node:crypto";

export function createLineSignature(body: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(body).digest("base64");
}

export function parseMoneyText(raw: string) {
  const input = raw.trim();
  const typeMatch = input.match(/(รายรับ|รายจ่าย)/i);
  const amountMatch = input.match(/(\d+(?:,\d+)?(?:\.\d+)?)/);
  const categoryMatch = input.match(/(?:รายรับ|รายจ่าย)\s+\d+(?:,\d+)?(?:\.\d+)?\s+([\u0E00-\u0E7F\w\s]+)/i);

  if (!typeMatch || !amountMatch) {
    return null;
  }

  const type = typeMatch[1].toLowerCase() === "รายรับ" ? "income" : "expense";
  const amount = Number(amountMatch[1].replace(/,/g, ""));
  const category = (categoryMatch?.[1] || "ทั่วไป").trim();
  const description = category || "รายการใหม่";

  return {
    type,
    amount,
    category,
    description,
    date: new Date().toISOString().slice(0, 10),
  };
}
