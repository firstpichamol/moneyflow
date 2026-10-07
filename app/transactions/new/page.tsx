"use client";

import { useState } from "react";

const currency = (value: number) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(value);

const CATEGORIES_EXPENSE = [
  "อาหาร",
  "เดินทาง",
  "เคลื่องดื่ม",
  "สุขภาพ",
  "บันเทิง",
  "เสื้อผ้า",
  "โทรศัพท์",
  "ค่าเช่า",
  "ยูทิลิตี้",
  "อื่น ๆ",
];

const CATEGORIES_INCOME = [
  "เงินเดือน",
  "เพิ่มเติม",
  "ลงทุน",
  "ของขวัญ",
  "อื่น ๆ",
];

export default function NewTransactionPage() {
  const [form, setForm] = useState({
    type: "expense",
    category: "อาหาร",
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = form.type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.amount || !form.description) {
      setStatus({ type: "error", message: "กรุณากรอกจำนวนและคำอธิบาย" });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: form.type,
        category: form.category,
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
      };

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus({
          type: "success",
          message: `บันทึกแล้ว: ${currency(Number(result.transaction.amount))} (${result.transaction.category})`,
        });
        setForm({
          type: "expense",
          category: "อาหาร",
          amount: "",
          description: "",
          date: new Date().toISOString().slice(0, 10),
        });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        setStatus({ type: "error", message: result.message || "ไม่สามารถบันทึกได้" });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "เกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="panel compactPanel">
        <div className="headerRow">
          <div>
            <p className="eyebrow">Transactions</p>
            <h1>เพิ่มรายการ</h1>
          </div>
          <a href="/dashboard" className="ghostButton">
            ยกเลิก
          </a>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="formGrid">
            <div className="field">
              <label>ประเภท</label>
              <select
                value={form.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setForm({
                    ...form,
                    type: newType,
                    category: newType === "income" ? "เงินเดือน" : "อาหาร",
                  });
                }}
              >
                <option value="expense">รายจ่าย</option>
                <option value="income">รายรับ</option>
              </select>
            </div>

            <div className="field">
              <label>หมวดหมู่</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>จำนวนเงิน (บาท)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="150.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>วันที่</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="field full">
              <label>คำอธิบาย</label>
              <textarea
                placeholder="เช่น ข้าวมันไก่ ที่ตลาด"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="formActions">
            <button type="button" className="secondaryButton" onClick={() => window.history.back()} disabled={loading}>
              ยกเลิก
            </button>
            <button type="submit" className="primaryButton" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>

          {status ? (
            <div className={status.type === "success" ? "successMessage" : "errorMessage"}>
              {status.message}
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}
