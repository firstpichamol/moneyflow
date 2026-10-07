"use client";

import { useEffect, useState } from "react";

export default function LinkPage() {
  const [code, setCode] = useState("---");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(Math.random().toString(36).slice(2, 8).toUpperCase());
  }, []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="page-shell">
      <section className="panel compactPanel">
        <div className="headerRow">
          <div>
            <p className="eyebrow">Account connection</p>
            <h1>เชื่อมบัญชี LINE</h1>
          </div>
          <a href="/dashboard" className="ghostButton">
            กลับ
          </a>
        </div>

        <p className="mutedText">
          ส่งรหัสนี้ให้ LINE bot เพื่อยืนยันว่าคุณตั้งใจเชื่อมบัญชี MoneyFlow โครงการยังเป็น demo ใช้วิธีนี้ทดแทน
        </p>

        <div className="linkCard">
          <span>รหัสเชื่อม</span>
          <strong>{code}</strong>
        </div>

        <div className="formActions" style={{ justifyContent: "flex-start" }}>
          <button className="primaryButton" onClick={copyCode}>
            {copied ? "คัดลอกแล้ว" : "คัดลอกรหัส"}
          </button>
        </div>

        <div className="codeExample">
          <strong>คำสั่งตัวอย่าง:</strong>
          <pre>เชื่อม {code}</pre>
        </div>

        <div className="codeExample">
          <strong>คำสั่ง LINE Bot ที่รองรับ:</strong>
          <pre>{
รายจ่าย 150 อาหาร ข้าวมันไก่
รายรับ 15000 เงินเดือน
ยอดเงิน
ยอดวันนี้
รายการล่าสุด
            }</pre>
        </div>
      </section>
    </main>
  );
}
