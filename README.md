# MoneyFlow

MoneyFlow เป็น starter project สำหรับเว็บบันทึกรายรับ–รายจ่ายส่วนบุคคล โดยใช้ Next.js + Supabase + LINE Messaging API

## คุณสมบัติ
- Dashboard สรุปยอดเงิน รายรับ รายจ่าย
- หน้าเพิ่มรายการรายรับ/รายจ่ายด้วยฟอร์มหรือ LINE Bot
- LINE webhook API สำหรับรับข้อความ
- ตัวแยกข้อความอัตโนมัติสำหรับบันทึกรายการ
- รองรับ mock data เมื่อยังไม่มี Supabase credentials

## เริ่มต้น

### 1. ติดตั้ง dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment
คัดลอก `.env.example` เป็น `.env.local`
```bash
cp .env.example .env.local
```

แล้วกรอก:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. สร้าง Supabase Project (optional)
- สร้างโปรเจกต์ที่ https://supabase.com
- รัน `supabase/schema.sql` ใน SQL Editor
- เปิด Email Auth
- คัดลอก URL และ keys ไปใน `.env.local`

### 4. รัน development server
```bash
npm run dev
```
เปิด http://localhost:3000

## LINE Webhook

### ตั้งค่า LINE Developers
1. เข้า https://developers.line.biz/console/
2. สร้าง Channel ใหม่หรือเลือกที่มีอยู่
3. ไปที่ Messaging API settings
4. ตั้ง Webhook URL:
   ```
   https://YOUR-DOMAIN/api/line/webhook
   ```
5. เปิด "Use webhook"
6. คัดลอก Channel Secret และ Access Token ไปใส่ใน `.env.local`

### คำสั่ง LINE Bot
- `รายจ่าย 150 อาหาร ข้าวมันไก่` - บันทึกรายจ่าย
- `รายรับ 15000 เงินเดือน` - บันทึกรายรับ
- `ยอดเงิน` - ดูยอดเงินปัจจุบัน
- `ยอดวันนี้` - ดูรายจ่ายวันนี้
- `รายการล่าสุด` - แสดงรายการ 3 อันดับแรก
- `เชื่อม CODE` - ยืนยันการเชื่อมบัญชี

## โครงสร้าง Project

```
moneyflow/
├── app/
│   ├── api/
│   │   ├── line/webhook/ - LINE webhook handler
│   │   ├── summary/ - API สำหรับ dashboard
│   │   └── transactions/ - API สำหรับบันทึกรายการ
│   ├── dashboard/ - หน้า dashboard
│   ├── transactions/ - หน้าเพิ่มรายการ
│   ├── link/ - หน้าเชื่อม LINE
│   ├── layout.tsx - root layout
│   ├── page.tsx - หน้าแรก
│   └── globals.css - styles
├── lib/
│   ├── mock-data.ts - mock transaction data
│   ├── line.ts - LINE parsing utilities
│   └── supabase.ts - Supabase client (optional)
├── supabase/
│   └── schema.sql - database schema
├── .env.example - environment template
└── package.json
```

## Development

### ใช้ Mock Data
โปรเจกต์ใช้ mock data ในหน่วยความจำตามค่าเริ่มต้น คุณสามารถบันทึก/ดูรายการได้เลยโดยไม่ต้องเชื่อม Supabase

### เชื่อม Supabase จริง
1. ตั้งค่า `.env.local` ด้วย Supabase credentials
2. แก้ไข API routes เพื่อใช้ Supabase client แทน mock data
3. รัน migrations/schema บน Supabase

## Deploy

### Deploy บน Vercel
1. Push code ไป GitHub
2. เข้า https://vercel.com
3. Connect repo และ deploy
4. ตั้ง Environment Variables ใน Vercel dashboard
5. อัปเดต LINE Webhook URL ไปเป็น Vercel URL

## หมายเหตุ
- ตอนนี้ใช้ mock data เก็บในหน่วยความจำ (data จะหายเมื่อ restart server)
- การใช้ Supabase จริงต้องการเพิ่มเติม code ในแต่ละ API route
- LINE webhook ต้องเป็น HTTPS และ accessible จากอินเทอร์เน็ต
- SECRET และ TOKEN ต้องเก็บใน environment variables ไม่ใช่ฮาร์ดโค้ด

## Support
หากพบปัญหา ให้ตรวจสอบ:
- Console logs ใน browser
- Server logs ใน terminal
- LINE webhook response ผ่าน LINE Developers console
