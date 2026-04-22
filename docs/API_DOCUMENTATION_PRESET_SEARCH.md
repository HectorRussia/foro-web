# 🔍 Preset Search API Documentation

## Overview

ระบบ Preset Search สำหรับบันทึก "การตั้งค่าค้นหา" ที่ใช้บ่อย เพื่อให้หน้าบ้านโหลดมาพร้อมใช้งานได้ทันที  
แต่ละ preset ผูกกับ **user** คนนั้น และแบ่งตาม **type** เป็น 2 ประเภท

| Type | ใช้กับ |
|------|--------|
| `content` | Content Search (`/contents/search`) |
| `forofilter` | Foro Filter / Advanced Search |

**Base URL:** `/api/v1/preset-searches`  
**Authentication:** Bearer Token (ทุก endpoint ต้อง login)

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/preset-searches/` | สร้าง preset ใหม่ |
| `GET` | `/preset-searches/` | ดึง preset ทั้งหมด (กรองตาม type ได้) |
| `GET` | `/preset-searches/{id}` | ดึง preset ตาม ID |
| `PUT` | `/preset-searches/{id}` | แก้ไข preset |
| `DELETE` | `/preset-searches/{id}` | ลบ preset |

---

## Data Model

```ts
interface PresetSearch {
  id: number
  name: string           // ชื่อ preset ที่ตั้งเอง
  type: "content" | "forofilter"
  user_id: number
  created_at: string     // ISO 8601
  updated_at: string | null
}
```

---

## 1. สร้าง Preset ใหม่

### Request

```
POST /preset-searches/
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**

```json
{
  "name": "ค้นหาข่าวการเมืองไทย",
  "type": "content"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ✅ | ชื่อ preset (1–255 ตัวอักษร) |
| `type` | `"content" \| "forofilter"` | ✅ | ประเภทของ preset |

### Response — `201 Created`

```json
{
  "id": 1,
  "name": "ค้นหาข่าวการเมืองไทย",
  "type": "content",
  "user_id": 5,
  "created_at": "2026-04-22T10:00:00+07:00",
  "updated_at": null
}
```

### Error — `400 Bad Request` (ชื่อซ้ำในประเภทเดียวกัน)

```json
{
  "detail": "Preset นี้มีอยู่แล้ว (ชื่อและประเภทซ้ำ)"
}
```

---

## 2. ดึง Preset ทั้งหมด

รองรับการกรองตาม `type` และ pagination

### Request

```
GET /preset-searches/
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | `"content" \| "forofilter"` | — | กรองตามประเภท (ไม่ใส่ = ดึงทั้งหมด) |
| `skip` | `number` | `0` | offset |
| `limit` | `number` | `100` | สูงสุด 100 |

**ตัวอย่าง — ดึงเฉพาะ content:**

```
GET /preset-searches/?type=content
```

**ตัวอย่าง — ดึงเฉพาะ forofilter:**

```
GET /preset-searches/?type=forofilter
```

### Response — `200 OK`

```json
[
  {
    "id": 2,
    "name": "ข่าวต่างประเทศ",
    "type": "content",
    "user_id": 5,
    "created_at": "2026-04-22T11:00:00+07:00",
    "updated_at": null
  },
  {
    "id": 1,
    "name": "ค้นหาข่าวการเมืองไทย",
    "type": "content",
    "user_id": 5,
    "created_at": "2026-04-22T10:00:00+07:00",
    "updated_at": null
  }
]
```

> ผลลัพธ์เรียงตาม `created_at` ใหม่สุดก่อน

---

## 3. ดึง Preset ตาม ID

### Request

```
GET /preset-searches/{id}
Authorization: Bearer <token>
```

### Response — `200 OK`

```json
{
  "id": 1,
  "name": "ค้นหาข่าวการเมืองไทย",
  "type": "content",
  "user_id": 5,
  "created_at": "2026-04-22T10:00:00+07:00",
  "updated_at": null
}
```

### Error — `404 Not Found`

```json
{
  "detail": "ไม่พบ preset search ที่ระบุ"
}
```

---

## 4. แก้ไข Preset

ส่งเฉพาะ field ที่ต้องการแก้ไข (PATCH-style body แม้จะเป็น PUT)

### Request

```
PUT /preset-searches/{id}
Content-Type: application/json
Authorization: Bearer <token>
```

**Body (ส่งเฉพาะที่จะแก้):**

```json
{
  "name": "การเมืองไทย 2026"
}
```

หรือแก้ทั้ง name และ type:

```json
{
  "name": "ฟิลเตอร์หลัก",
  "type": "forofilter"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | — | ชื่อใหม่ (1–255 ตัวอักษร) |
| `type` | `"content" \| "forofilter"` | — | ประเภทใหม่ |

### Response — `200 OK`

```json
{
  "id": 1,
  "name": "การเมืองไทย 2026",
  "type": "content",
  "user_id": 5,
  "created_at": "2026-04-22T10:00:00+07:00",
  "updated_at": "2026-04-22T12:00:00+07:00"
}
```

### Errors

| Status | Detail |
|--------|--------|
| `404` | `"ไม่พบ preset search ที่ระบุ"` |
| `400` | `"Preset นี้มีอยู่แล้ว (ชื่อและประเภทซ้ำ)"` |

---

## 5. ลบ Preset

### Request

```
DELETE /preset-searches/{id}
Authorization: Bearer <token>
```

### Response — `204 No Content`

(ไม่มี body)

### Error — `404 Not Found`

```json
{
  "detail": "ไม่พบ preset search ที่ระบุ"
}
```

---

## Business Rules

- Preset ผูกกับ user — user อื่นไม่สามารถเห็น/แก้ไข/ลบได้
- **ชื่อ + type** ต้องไม่ซ้ำกันในแต่ละ user (name `"ข่าวไทย"` type `content` ≠ name `"ข่าวไทย"` type `forofilter`)
- ผลลัพธ์เรียงจากใหม่ไปเก่าเสมอ

---

## TypeScript Usage Example

```ts
// ดึง preset ทั้งหมดของ user แยกตาม type
async function fetchPresets(token: string, type?: "content" | "forofilter") {
  const params = type ? `?type=${type}` : ""
  const res = await fetch(`/api/v1/preset-searches/${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json() as Promise<PresetSearch[]>
}

// สร้าง preset ใหม่
async function createPreset(token: string, name: string, type: "content" | "forofilter") {
  const res = await fetch("/api/v1/preset-searches/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, type }),
  })
  if (!res.ok) throw new Error((await res.json()).detail)
  return res.json() as Promise<PresetSearch>
}

// ลบ preset
async function deletePreset(token: string, id: number) {
  await fetch(`/api/v1/preset-searches/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
}
```
