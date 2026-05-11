# Frontend Prototype UI Agent Instruction

ใช้ไฟล์นี้เป็น instruction สำหรับ agent เวลาให้ทำงานปรับหน้า frontend ของ web ให้หน้าตาเหมือน prototype โดยยังคง logic/data ของ web เดิมทั้งหมด

## จุดประสงค์

ให้ agent ทำ frontend new UI โดยใช้ codebase ฝั่ง web เป็นฐานหลัก และใช้ prototype เป็น reference ด้าน design/UI เท่านั้น

- ฝั่ง web คือ source of truth ของ code, dependency, data logic, API integration, routing, state management, auth, validation และ business behavior
- ฝั่ง prototype คือ source of truth ของหน้าตา, layout, spacing, typography, visual hierarchy, component vibe และ PM demo experience
- ห้ามเอา `package.json` หรือ dependencies จาก prototype มาใช้แทนของ web
- ห้ามแก้ data logic เดิมของ web ถ้า user ไม่ได้สั่งชัดเจน

## Prompt แนะนำสำหรับใช้งาน

```text
ใช้ instruction นี้ทำ frontend new UI ให้ web codebase โดยยึดหน้าตา UI จาก prototype เท่านั้น

ฝั่ง prototype เป็น design/demo frontend ไม่ใช่ implementation source of truth
ฝั่ง web เป็น codebase จริง ให้ใช้ package.json, dependency, routing, data logic, API, state และ business logic เดิมทั้งหมด

เปลี่ยนได้เฉพาะ design/UI layer, layout, styling และ component presentation
ห้ามแตะ data logic, API contract, state management, auth, validation, permission, calculation หรือ business behavior เดิม

ถ้า prototype มี feature ที่ web frontend ยังไม่มี ให้ทำ mock data ได้ แต่ต้องเก็บไว้ใน /api/mocks หรือ prototype/services/mock ตาม context ของงาน
ทุก mock ต้องมี docs อธิบายให้ backend หรือ web จริงนำไป implement ต่อได้ถูกต้อง
```

## กติกาหลัก

1. อ่าน web codebase ก่อนเสมอ โดยเฉพาะ `package.json`, routing, component structure, API layer และ state management
2. อ่าน prototype เพื่อดู visual target เช่น layout, spacing, typography, color, component shape, interaction และ PM vibe
3. ใช้ code/component/dependency ของ web เป็นหลัก ห้ามย้าย architecture จาก prototype มาแทน
4. ปรับเฉพาะ UI layer เช่น JSX/TSX presentation, CSS, Tailwind class, component composition, layout และ visual states
5. รักษา data flow เดิมของ web ทั้งหมดสำหรับ feature ที่มีอยู่แล้ว
6. ห้ามเปลี่ยน API client, query key, store/reducer, schema validation, auth check, permission rule, calculation หรือ backend contract เพื่อให้ UI ทำง่ายขึ้น
7. ถ้าต้องเพิ่ม feature ที่ web ยังไม่มี ให้ทำเป็น mock data พร้อมเอกสารประกอบ ห้ามผูกเป็น real backend behavior เอง
8. ใช้คำสั่ง build/test/lint ของฝั่ง web เท่านั้น ห้ามใช้ script จาก prototype เป็นตัวตัดสิน

## Source of Truth

### Web Codebase

ใช้เป็นแหล่งจริงของ:

- `package.json` และ dependencies
- build tooling
- routes/pages
- API integration
- state/query management
- auth/session/permission
- form validation
- business rules
- existing tests
- production behavior

### Prototype

ใช้เป็นแหล่งจริงของ:

- design direction
- screen composition
- layout pattern
- spacing rhythm
- color/typography feel
- card/table/form appearance
- dashboard/PM demo vibe
- empty/loading/error visual examples ถ้ามี

## Mock Data Policy

ใช้ mock data เฉพาะกรณี prototype มี feature หรือ UI section ที่ web frontend ยังไม่มีจริง

ตำแหน่งที่ใช้ได้:

- `/api/mocks` สำหรับ mock ที่ใช้กับ web frontend จริง
- `prototype/services/mock` สำหรับ mock ที่เป็น prototype-only หรือ PM demo

ห้ามใช้ mock ไปแทน API จริงของ feature ที่ web มีอยู่แล้ว

## Mock Docs Template

ทุก mock ต้องมี docs วางใกล้กับ mock file เช่น `README.md` หรือ `<feature>.md`

```md
# <Feature or Screen Name> Mock

## Purpose
Mock นี้ใช้กับ screen/component ไหน และเพราะอะไร backend จริงยังไม่มี

## Future Endpoint or Service
- Method:
- Path or service name:
- Auth/permission expectations:

## Request Shape
ระบุ query params, body fields, filters, pagination, sorting, date range หรือ input ที่ backend ควรรองรับ

## Response Shape
อธิบาย field ที่ UI ใช้ทุกตัว พร้อม type และ example value

## UI States
- Loading:
- Empty:
- Error:
- Partial data:

## Backend Notes
assumptions, open questions, validation rules และสิ่งที่ backend ต้อง confirm ก่อน implement จริง
```

## สิ่งที่ห้ามทำ

- ห้าม copy `package.json` จาก prototype มาแทน web
- ห้าม install dependency ใหม่จาก prototype ถ้า user ไม่ได้อนุมัติ
- ห้ามแก้ real API contract เพื่อให้เข้ากับ prototype
- ห้ามแทน data จริงด้วย mock ใน feature ที่ web มีอยู่แล้ว
- ห้ามเปลี่ยน business logic, auth, permission, validation หรือ calculation
- ห้ามลบ/ลด test ที่ปกป้อง logic เดิม
- ห้ามย้าย prototype code มาทั้งก้อนถ้าแค่ปรับ presentational layer ก็พอ

## Checklist ก่อนส่งงาน

- UI ใหม่ดูและให้ vibe ใกล้ prototype
- logic/data behavior เดิมของ web ยังอยู่ครบ
- ใช้ dependency และ scripts จาก web เท่านั้น
- feature ใหม่ที่ web ยังไม่มีใช้ mock data เท่านั้น
- mock data อยู่ใน `/api/mocks` หรือ `prototype/services/mock`
- mock ทุกตัวมี docs สำหรับ backend/web implementation ต่อ
- รัน lint/typecheck/test/build ของ web แล้ว หรืออธิบายได้ว่าทำไมรันไม่ได้
