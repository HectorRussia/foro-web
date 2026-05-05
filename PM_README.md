# FORO Prototype - คู่มือสำหรับ PM

README นี้ทำไว้สำหรับ PM ที่ต้องการเปิดดูและตรวจ prototype เท่านั้น
ทุกคำสั่งด้านล่างให้รันในโฟลเดอร์ `prototype` เท่านั้น ไม่ต้องรันจาก root ของโปรเจกต์

## สิ่งที่ต้องมีก่อนเริ่ม

- Node.js เวอร์ชัน 20.19 ขึ้นไป หรือ 22.12 ขึ้นไป
- pnpm ผ่าน Corepack
- โค้ดโปรเจกต์นี้อยู่ในเครื่องแล้ว

ถ้ายังไม่เคยเปิดใช้ pnpm บนเครื่องนี้ ให้รันครั้งเดียว:

```powershell
corepack enable
```

## เปิด prototype ครั้งแรก

เริ่มจากเข้าโฟลเดอร์ `prototype` ก่อนเสมอ:

```powershell
cd prototype
```

ติดตั้ง dependency:

```powershell
pnpm install
```

เปิด prototype:

```powershell
pnpm dev
```

หลังรันสำเร็จ terminal จะแสดง URL สำหรับเปิดใน browser โดยปกติจะเป็น:

```text
http://127.0.0.1:5173/test/
```

ถ้าเครื่องใช้ port อื่น ให้เปิด URL ที่ terminal แสดงแทน

## เปิดใช้งานครั้งถัดไป

ถ้าเคย `pnpm install` แล้ว ให้ทำแค่นี้:

```powershell
cd prototype
pnpm dev
```

ถ้า dev แจ้งว่ามีการเพิ่ม package หรือเพิ่ง pull โค้ดใหม่แล้วเปิดไม่ขึ้น ให้รัน:

```powershell
pnpm install
pnpm dev
```

## หยุด server

กลับไปที่ terminal ที่รัน `pnpm dev` แล้วกด:

```text
Ctrl + C
```

ถ้า terminal ถามให้ยืนยัน ให้พิมพ์ `Y` แล้วกด Enter

## คำสั่งที่ PM อาจใช้เป็นครั้งคราว

ใช้คำสั่งเหล่านี้ในโฟลเดอร์ `prototype` เท่านั้น:

```powershell
pnpm test
```

รันชุดทดสอบพื้นฐาน เหมาะตอน dev ขอให้ช่วยเช็กว่า logic สำคัญยังผ่านอยู่

```powershell
pnpm build
```

เช็กว่า prototype build ผ่านสำหรับส่งต่อหรือ deploy ได้

```powershell
pnpm preview
```

ใช้ดู build หลังจากรัน `pnpm build` แล้ว

## เวลาตรวจงานใน prototype

ให้ PM โฟกัสสิ่งเหล่านี้:

- เปิดหน้าแรกได้หรือไม่
- กดเมนูหลักแล้วหน้าเปลี่ยนถูกต้องหรือไม่
- ฟีเจอร์ค้นหา อ่านข่าว สรุปข่าว bookmark และ workspace ต่าง ๆ ทำงานตาม flow ที่ตกลงกันหรือไม่
- ข้อความ สี layout และ responsive บนหน้าจอที่ใช้ตรวจดูโอเคหรือไม่
- ถ้ามี error ให้จดว่ากดอะไร ก่อนหน้าไหน และเกิดอะไรขึ้น

## วิธีแจ้ง issue ให้ dev

เวลาพบปัญหา แนะนำให้ส่งข้อมูลแบบนี้:

```text
หน้า/URL:
ขั้นตอนที่ทำ:
ผลที่คาดหวัง:
ผลที่เกิดจริง:
รูปหรือวิดีโอประกอบ:
เวลาที่เจอ:
```

ตัวอย่าง:

```text
หน้า/URL: http://127.0.0.1:5173/test/
ขั้นตอนที่ทำ: เปิดหน้า Home > กดค้นหา keyword "AI"
ผลที่คาดหวัง: ควรเห็นรายการข่าวเกี่ยวกับ AI
ผลที่เกิดจริง: หน้าขึ้น loading ค้าง
รูปหรือวิดีโอประกอบ: แนบ screenshot
เวลาที่เจอ: 6 พ.ค. 2026 เวลา 10:30
```

## ปัญหาที่พบบ่อย

### `pnpm` ไม่รู้จักคำสั่ง

ลองรัน:

```powershell
corepack enable
```

แล้วปิด terminal เปิดใหม่ จากนั้นกลับเข้า `prototype` และรัน `pnpm dev` อีกครั้ง

### เปิด URL แล้วไม่เจอหน้าเว็บ

- เช็กว่า terminal ที่รัน `pnpm dev` ยังเปิดอยู่
- ใช้ URL ที่ terminal แสดง ไม่จำเป็นต้องเป็น port 5173 เสมอ
- ถ้ายังไม่ได้ ให้กด `Ctrl + C` แล้วรัน `pnpm dev` ใหม่

### ฟีเจอร์ AI, ค้นหา หรือดึงข่าวบางอย่างใช้ไม่ได้

prototype บางส่วนต้องพึ่ง API key และ internet ถ้าเจอ error กลุ่มนี้ให้ส่ง screenshot/error ให้ dev ตรวจต่อ
ไม่ควร copy หรือส่งต่อค่าในไฟล์ `.env` ออกไปนอกทีม

### หน้าตาเว็บไม่อัปเดตหลัง pull โค้ดใหม่

ให้หยุด server แล้วรันใหม่:

```powershell
pnpm install
pnpm dev
```

## ถ้าให้ Codex ช่วย PM

ให้บอก Codex ว่า:

```text
ใช้ codex-pm.md และ skill pm-prototype-vibe ช่วย PM vibe on prototype เท่านั้น
```

Codex ควรอ่านไฟล์เหล่านี้ก่อนเริ่ม:

- `codex-pm.md`
- `.codex/skills/pm-prototype-vibe/SKILL.md`
- `prototype/package.json`

## ข้อควรจำ

- ทำงานเฉพาะในโฟลเดอร์ `prototype`
- คำสั่งหลักที่ใช้บ่อยคือ `pnpm dev`
- อย่าแชร์ไฟล์ `.env` หรือ API key
- ถ้า terminal มี error ให้ capture ข้อความ error ส่งให้ dev ด้วย
