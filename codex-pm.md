# PM Prototype Vibe Agent Instruction

ใช้ไฟล์นี้เมื่อ Codex ถูกขอให้ช่วย PM ใช้, ลอง, ตรวจ, หรือปรับ vibe ของ FORO prototype

## Mission

ช่วย PM ทำงานกับ prototype ให้ไว เห็นภาพ product flow ชัด และเก็บ feedback กลับไปให้ dev ทำต่อได้ โดยโฟกัสที่ `prototype/` เท่านั้น

## Hard Scope

- ทำงานใน `prototype/` เป็นหลัก
- คำสั่ง run, test, build, preview ให้เข้า `prototype` ก่อนเสมอ
- ห้ามแก้ main web app ที่ root เช่น `src/`, root `package.json`, root `vite.config.ts`, API contract, auth, หรือ production logic ถ้าผู้ใช้ไม่ได้สั่งชัด
- ห้ามแก้ `codex-dev.md` เพราะไฟล์นั้นเป็น instruction สำหรับ dev
- `codex.md` เป็น role router เท่านั้น แก้เฉพาะตอนต้องเปลี่ยน logic การเลือก agent mode
- ห้าม copy หรือเปิดเผยค่า `.env`, API key, token, secret
- ถ้างานเริ่มกลายเป็น production implementation ให้บอกให้ชัดว่าอยู่นอก PM vibe mode และค่อยใช้ `codex-dev.md`

## Files To Read First

1. `PM_README.md` สำหรับคู่มือ PM ว่ารัน prototype ยังไง
2. `.agents/skills/pm-prototype-vibe/SKILL.md` สำหรับ workflow ของ agent
3. `prototype/package.json` เพื่อดู command ที่ใช้ได้จริง
4. ไฟล์ใน `prototype/src/`, `prototype/server/`, หรือ `prototype/public/` เฉพาะส่วนที่เกี่ยวกับคำขอ

## Default Run Flow

ใช้คำสั่งเหล่านี้จาก root repo:

```powershell
cd prototype
pnpm install --ignore-workspace
pnpm dev
```

หลังจาก dev server รันแล้ว ให้เปิด URL ที่ terminal แสดง โดยปกติคือ:

```text
http://127.0.0.1:5173/test/
```

ถ้า port เปลี่ยน ให้ใช้ URL ที่ terminal แสดงแทน

## PM Vibe Work

งานที่เหมาะกับ mode นี้:

- ช่วย PM เปิด prototype และไล่ flow
- ปรับ copy, label, microcopy, empty state, loading state, หรือ demo wording
- ปรับ layout หรือ UI เฉพาะใน prototype เพื่อทดลอง product direction
- เพิ่ม mock/demo state สำหรับคุย product
- จด feedback ให้ dev ทำต่อเป็น issue หรือ implementation note

งานที่ไม่ควรทำใน mode นี้:

- ย้าย prototype เข้า main web app
- เปลี่ยน dependency ของ main web app
- เปลี่ยน API contract, auth, permission, validation, business logic
- แก้ production routing หรือ data flow
- ทำ deploy production

## Editing Rules

- ถ้าแก้ code ให้แก้เฉพาะ path ใต้ `prototype/`
- ถ้าเพิ่ม mock ให้ทำให้เห็นชัดว่าเป็น prototype/demo data
- ถ้าต้องแตะไฟล์นอก `prototype/` ให้ทำเฉพาะเอกสาร PM หรือ skill เช่น `PM_README.md`, `codex-pm.md`, `.agents/skills/pm-prototype-vibe/SKILL.md`
- ถ้า user ขอให้แก้นอก scope ให้ยืนยันขอบเขตก่อนลงมือ

## Verification

เลือกเท่าที่เหมาะกับงาน:

```powershell
cd prototype
pnpm test
pnpm build
```

ถ้างานเป็น UI/flow ให้เปิด browser เช็กหน้า prototype ด้วย ถ้าเช็กไม่ได้ให้บอกเหตุผลชัดเจน

## Final Response Style

ตอบ PM แบบสั้นและชัด:

- บอกว่าแก้อะไร
- บอกว่าไปลองที่ไหน
- บอกไฟล์ prototype ที่แตะ
- บอก caveat หรือ dev follow-up ถ้ามี

อย่าทิ้งท้ายด้วยรายละเอียดเชิง dev ยาว ๆ ถ้า PM ไม่ได้ถาม
