# News API — Search & Filter Documentation

## Overview
API สำหรับดึงรายการข่าวของ user พร้อมฟีเจอร์ **ค้นหา (search)** และ **กรอง (filter)** แบบ dynamic ด้วย query parameters

## Authentication
ทุก endpoint ต้องมี Bearer Token ใน Header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📰 GET `/api/news`

ดึงรายการข่าวของ user แบบ pagination พร้อมรองรับการค้นหาและกรอง

### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | integer | No | `1` | หน้าที่ต้องการ (เริ่มที่ 1) |
| `limit` | integer | No | `10` | จำนวนข่าวต่อหน้า (สูงสุด 100) |
| `days_range` | integer | No | `null` | กรองตามวัน (ดูรายละเอียดด้านล่าง) |
| `search` | string | No | `null` | คำค้นหา (สูงสุด 200 ตัวอักษร) |
| `min_view_count` | integer ≥ 0 | No | `null` | กรองยอดวิวขั้นต่ำ |
| `min_engagement` | integer ≥ 0 | No | `null` | กรอง engagement ขั้นต่ำ |

---

### Parameter Details

#### `days_range`
| ค่า | ผลลัพธ์ |
|---|---|
| `null` (ไม่ส่ง) | ดึงทั้งหมด ไม่กรองวัน |
| `1` | ข่าวย้อนหลัง 1 วัน |
| `7` | ข่าวย้อนหลัง 7 วัน |
| `30` | ข่าวย้อนหลัง 30 วัน |
| `-7` | ข่าวที่เก่ากว่า 7 วันขึ้นไป |

#### `search`
ค้นหาแบบ case-insensitive จาก 3 ฟิลด์พร้อมกัน:
- **`title`** — ชื่อบัญชี / หัวข้อโพสต์
- **`content`** — เนื้อหาข่าวที่ LLM วิเคราะห์แล้ว
- **`username`** — @username ของเจ้าของโพสต์

#### `min_engagement`
คำนวณจาก: `retweet_count + like_count + reply_count + quote_count`  
ตัวอย่าง: `min_engagement=100` = กรองเฉพาะโพสต์ที่มี engagement รวม ≥ 100

---

### Examples

**ดึงข่าวหน้าแรก (ค่า default)**
```
GET /api/news
```

**ค้นหาคำว่า "bitcoin"**
```
GET /api/news?search=bitcoin
```

**ค้นหาจากชื่อบัญชี "@elonmusk"**
```
GET /api/news?search=elonmusk
```

**กรองข่าว 7 วันล่าสุด พร้อมค้นหา**
```
GET /api/news?days_range=7&search=AI
```

**กรองข่าวยอดวิวสูง (≥ 10,000 views)**
```
GET /api/news?min_view_count=10000
```

**กรอง engagement สูง (≥ 500)**
```
GET /api/news?min_engagement=500
```

**ใช้ทุก filter พร้อมกัน**
```
GET /api/news?page=1&limit=20&days_range=7&search=crypto&min_view_count=5000&min_engagement=200
```

---

### Response

**Success (200):**
```json
{
  "items": [
    {
      "id": 42,
      "title": "elonmusk",
      "content": "อีลอน มัสก์ ประกาศเปิดตัว xAI รุ่นใหม่ที่แรงกว่าเดิม 3 เท่า...",
      "url": "https://x.com/elonmusk/status/1234567890",
      "user_id": 7,
      "tweet_profile_pic": "https://pbs.twimg.com/profile_images/...",
      "tweet_id": "1234567890",
      "retweet_count": 4200,
      "reply_count": 890,
      "like_count": 31500,
      "quote_count": 620,
      "view_count": 1800000,
      "tweet_created_at": "Mon Apr 27 08:30:00 +0000 2026",
      "trigger_news": 0,
      "created_at": "2026-04-27T08:35:10.123Z",
      "updated_at": "2026-04-27T08:35:10.123Z"
    }
  ],
  "total": 128,
  "page": 1,
  "limit": 20,
  "total_pages": 7,
  "has_next": true,
  "has_prev": false
}
```

**Response Fields:**

| Field | Type | Description |
|---|---|---|
| `items` | array | รายการข่าว |
| `total` | integer | จำนวนข่าวทั้งหมดที่ตรงกับ filter |
| `page` | integer | หน้าปัจจุบัน |
| `limit` | integer | จำนวนต่อหน้า |
| `total_pages` | integer | จำนวนหน้าทั้งหมด |
| `has_next` | boolean | มีหน้าถัดไปหรือไม่ |
| `has_prev` | boolean | มีหน้าก่อนหน้าหรือไม่ |

**News Item Fields:**

| Field | Type | Description |
|---|---|---|
| `id` | integer | ID ของข่าวใน database |
| `title` | string | ชื่อบัญชี / หัวข้อโพสต์ |
| `content` | string | เนื้อหาที่ LLM วิเคราะห์แล้ว |
| `url` | string \| null | URL โพสต์ต้นทางบน X (Twitter) |
| `tweet_id` | string \| null | Tweet ID ต้นทาง |
| `tweet_profile_pic` | string \| null | URL รูปโปรไฟล์ |
| `retweet_count` | integer | จำนวน retweet |
| `reply_count` | integer | จำนวน reply |
| `like_count` | integer | จำนวน like |
| `quote_count` | integer | จำนวน quote tweet |
| `view_count` | integer | จำนวนยอดวิว |
| `tweet_created_at` | string \| null | วันที่โพสต์ต้นฉบับบน X (Twitter date format) |
| `trigger_news` | integer | `0` = ข่าวปกติ, `1` = มาจาก SSE stream |
| `created_at` | datetime (ISO 8601) | วันที่บันทึกเข้า database |
| `updated_at` | datetime \| null | วันที่อัปเดตล่าสุด |

---

### Errors

| Status | Description |
|---|---|
| `401` | Unauthorized — token หมดอายุหรือไม่ถูกต้อง |
| `422` | Validation Error — ค่า parameter ไม่ถูกต้อง (เช่น `min_view_count=-1`) |
| `429` | Too Many Requests — เกิน 60 requests/minute |
| `500` | Internal Server Error |

---

## 📌 Frontend Implementation Notes

### Infinite Scroll / Pagination
```
page 1 → /api/news?page=1&limit=20
page 2 → /api/news?page=2&limit=20
...
```

### Search Bar (Debounce แนะนำ 300ms)
ส่ง request ใหม่ทุกครั้งที่ user หยุดพิมพ์:
```
/api/news?search=<input_value>&page=1&limit=20
```
> **Note:** เมื่อ search เปลี่ยน ให้ reset กลับ `page=1` เสมอ

### Filter Combinations
สามารถรวม filter หลายตัวพร้อมกันได้ เช่น filter panel ที่มี:
- ช่อง search text
- dropdown เลือก days_range (วันนี้ / 7 วัน / 30 วัน / ทั้งหมด)
- slider หรือ input สำหรับ min_view_count
- slider หรือ input สำหรับ min_engagement

ตัวอย่าง URL เมื่อ user ตั้งค่า filter ทั้งหมด:
```
/api/news?search=AI&days_range=7&min_view_count=1000&min_engagement=50&page=1&limit=20
```

### Rate Limit
- **60 requests/minute** ต่อ user
- รองรับ infinite scroll และ real-time search ได้สบาย
