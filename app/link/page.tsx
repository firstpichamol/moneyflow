"use client";

import { useMemo, useState } from "react";

export default function LinkPage() {
  const code = useMemo(() => Math.random().toString(36).slice(2, 8).toUpperCase(), []);
  const [copied, setCopied] = useState(false);

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
        <p className="eyebrow">Account connection</p>
        <h1>เชื่อมบัญชีกับ LINE</h1>
        <p className="mutedText">
          ส่งรหัสนี้ให้ LINE bot เพื่อยืนยันว่าคุณต้องการเชื่อมบัญชี MoneyFlow
        </p>

        <div className="linkCard">
          <span>รหัสเชื่อม</span>
          <strong>{code}</strong>
        </div>

        <button className="primaryButton" onClick={copyCode}>
          {copied ? "คัดลอกแล้ว" : "คัดลอกรหัส"}
        </button>

        <div className="codeExample">
          <strong>คำสั่งตัวอย่าง:</strong>
          <pre>เชื่อม {code}</pre>
        </div>
      </section>
    </main>
  );
}
