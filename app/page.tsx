"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.badge}>MoneyFlow</span>
          <h1>ติดตามรายรับ–รายจ่ายแบบง่าย ด้วย LINE Bot</h1>
          <p>
            จดบันทึกรายรับ รายจ่าย และเช็คสรุปยอดได้ทุกวัน ผ่านแอป Next.js
            พร้อม Supabase และ LINE Messaging API
          </p>

          <div className={styles.actions}>
            <Link href="/dashboard" className={styles.primaryButton}>
              ดู Dashboard
            </Link>
            <Link href="/link" className={styles.secondaryButton}>
              เชื่อม LINE
            </Link>
          </div>

          <ul className={styles.highlightList}>
            <li>บันทึกรายรับ / รายจ่ายด้วยข้อความสั้น</li>
            <li>สรุปยอดรายวันและรายเดือน</li>
            <li>รองรับ webhook สำหรับ LINE Bot</li>
          </ul>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>

          <div className={styles.balanceBox}>
            <small>ยอดเงินปัจจุบัน</small>
            <strong>฿18,450</strong>
          </div>

          <div className={styles.list}>
            <div className={styles.listRow}>
              <span>รายรับ</span>
              <strong>+฿35,000</strong>
            </div>
            <div className={styles.listRow}>
              <span>รายจ่าย</span>
              <strong>-฿16,550</strong>
            </div>
            <div className={styles.listRow}>
              <span>รายจ่ายวันนี้</span>
              <strong>-฿520</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
