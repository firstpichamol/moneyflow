"use client";

import { useEffect, useState } from "react";

const currency = (value: number) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(value);

type Summary = {
  totalBalance: number;
  income: number;
  expense: number;
  todayExpense: number;
  monthExpense: number;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch("/api/summary", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        setSummary(data.summary);
        setTransactions(data.transactions ?? []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="page-shell">Loading...</div>;
  }

  if (!summary) {
    return <div className="page-shell">Unable to load summary</div>;
  }

  return (
    <main className="page-shell">
      <section className="panel">
        <div className="headerRow">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Dashboard</h1>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <a href="/transactions/new" className="primaryButton">
              + เพิ่มรายการ
            </a>
            <a href="/" className="ghostButton">
              กลับหน้าแรก
            </a>
          </div>
        </div>

        <div className="summaryGrid">
          <div className="statCard cardPrimary">
            <span>ยอดเงินปัจจุบัน</span>
            <strong>{currency(summary.totalBalance)}</strong>
          </div>
          <div className="statCard">
            <span>รายรับ</span>
            <strong>{currency(summary.income)}</strong>
          </div>
          <div className="statCard">
            <span>รายจ่าย</span>
            <strong>{currency(summary.expense)}</strong>
          </div>
          <div className="statCard">
            <span>รายจ่ายวันนี้</span>
            <strong>{currency(summary.todayExpense)}</strong>
          </div>
        </div>

        <div className="sectionTitle">
          รายการล่าสุด ({transactions.length})
        </div>
        {transactions.length === 0 ? (
          <div className="mutedText">
            ยังไม่มีรายการ <a href="/transactions/new">เพิ่มรายการแรก</a>
          </div>
        ) : (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>ประเภท</th>
                  <th>หมวดหมู่</th>
                  <th>คำอธิบาย</th>
                  <th>จำนวน</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.type === "income" ? "รายรับ" : "รายจ่าย"}</td>
                    <td>{item.category}</td>
                    <td>{item.description}</td>
                    <td className={item.type === "income" ? "amount up" : "amount down"}>
                      {item.type === "income" ? "+" : "-"}
                      {currency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
