import crypto from "node:crypto";

export function createLineSignature(body: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(body).digest("base64");
}

export function parseLineMessage(raw: string): { type: "income" | "expense"; amount: number; category: string; description: string } | null {
  const input = raw.trim();

  // รายจ่าย 150 อาหาร ข้าวมันไก่
  // รายรับ 15000 เงินเดือน
  const expenseMatch = input.match(/^รายจ่าย\s+([\d,.]+)(?:\s+([^\s]+))?(?:\s+(.+))?$/i);
  const incomeMatch = input.match(/^รายรับ\s+([\d,.]+)(?:\s+([^\s]+))?(?:\s+(.+))?$/i);

  if (expenseMatch) {
    const amount = Number(expenseMatch[1].replace(/,/g, ""));
    const category = expenseMatch[2] || "อื่น ๆ";
    const description = expenseMatch[3] || category;
    return { type: "expense", amount, category, description };
  }

  if (incomeMatch) {
    const amount = Number(incomeMatch[1].replace(/,/g, ""));
    const category = incomeMatch[2] || "อื่น ๆ";
    const description = incomeMatch[3] || category;
    return { type: "income", amount, category, description };
  }

  return null;
}
