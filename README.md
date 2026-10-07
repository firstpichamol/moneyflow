# MoneyFlow

MoneyFlow เป็น starter project สำหรับเว็บบันทึกรายรับ–รายจ่ายส่วนบุคคล โดยใช้ Next.js + Supabase + LINE Messaging API

## คุณสมบัติ
- Dashboard สรุปยอดเงิน รายรับ รายจ่าย
- หน้าเชื่อมบัญชี LINE
- LINE webhook API สำหรับรับข้อความ
- ตัวแยกข้อความเพื่อบันทึกรายรับ/รายจ่าย
- รองรับ mock data เมื่อยังไม่มี Supabase credentials

## เริ่มต้น
1. `npm install`
2. คัดลอก `.env.example` เป็น `.env.local`
3. ตั้งค่า Supabase URL และ anon key
4. รัน schema ใน Supabase SQL Editor
5. `npm run dev`

## Environment
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LINE_CHANNEL_SECRET=
LINE_CHANNEL_ACCESS_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## LINE Webhook
Webhook URL:
```bash
https://YOUR-DOMAIN/api/line/webhook
```

## ตัวอย่างข้อความ
- รายจ่าย 150 อาหาร ข้าวมันไก่
- รายรับ 15000 เงินเดือน
- ยอดเงิน
- ยอดวันนี้
- รายการล่าสุด
- เชื่อม CODE

## โครงสร้าง
- `app/` = หน้าเว็บและ API routes
- `lib/` = helper functions
- `supabase/` = SQL schema สำหรับ Supabase

## หมายเหตุ
โค้ดนี้ถูกออกแบบให้รันได้ทันทีแม้ยังไม่มี credentials ของ Supabase หรือ LINE และจะใช้งาน mock data ในโหมด local/dev
