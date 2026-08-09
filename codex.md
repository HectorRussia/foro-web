# Cowork Agent Router

ใช้ไฟล์นี้เป็น entrypoint กลางสำหรับ Codex ใน repo นี้ ก่อนเริ่มงานให้เลือก instruction ตาม role จาก env หรือจาก context ของคำขอ

## Resolve Agent Mode

1. อ่านค่า `VITE_COWORK_AGENT` จาก environment ถ้าเข้าถึงได้
2. ถ้าไม่มีใน process env ให้อ่านจาก root `.env`, root `.env.local`, `prototype/.env`, หรือ `prototype/.env.local` แบบระวัง ไม่ต้องแสดงค่าทั้งไฟล์ และห้ามเปิดเผย secret/API key
3. แปลงค่าเป็นตัวพิมพ์ใหญ่และ trim ช่องว่าง
4. ถ้าผู้ใช้ระบุ role ชัดเจนใน prompt ให้ยึด prompt ล่าสุดก่อน env

## Mode Map

- `VITE_COWORK_AGENT=DEV` ให้โหลดและทำตาม `codex-dev.md`
- `VITE_COWORK_AGENT=PM` ให้โหลดและทำตาม `codex-pm.md`

ถ้าเป็น `PM` และมีงานเกี่ยวกับ prototype ให้โหลด skill นี้เพิ่มด้วย:

```text
.agents/skills/pm-prototype-vibe/SKILL.md
```

## Fallback

ถ้าไม่มี `VITE_COWORK_AGENT` หรือค่าที่ตั้งไว้ไม่รู้จัก:

- ถ้าคำขอพูดถึง PM, prototype, vibe, demo, feedback, product flow ให้ใช้ `PM`
- นอกนั้นให้ใช้ `DEV`

## Rules

- ต้องอ่าน instruction file ของ mode ที่เลือกก่อนลงมือ
- ห้ามเดา mode จากไฟล์ที่เปิดอยู่ใน editor เพียงอย่างเดียว
- ห้ามเปิดเผยค่า `.env`, token, API key, หรือ secret ในคำตอบ
- ถ้า mode กับคำขอขัดกัน ให้ยึดคำขอผู้ใช้ล่าสุด และบอกสั้น ๆ ว่าเลือก mode ไหน
- ถ้าต้องสลับ mode ระหว่างงาน ให้บอกผู้ใช้ก่อนว่ากำลังเปลี่ยนจาก mode ไหนไป mode ไหน

## Quick Examples

```env
VITE_COWORK_AGENT=DEV
```

Codex ต้องอ่าน `codex-dev.md`

```env
VITE_COWORK_AGENT=PM
```

Codex ต้องอ่าน `codex-pm.md` และใช้ PM prototype skill เมื่อเกี่ยวข้องกับ prototype
