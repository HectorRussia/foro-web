# 📌 Bookmark API Documentation

## Overview

ระบบ Bookmark สำหรับบันทึกข่าวหรือคอนเทนต์ที่ชอบ  
รองรับทั้งข่าวที่อยู่ใน DB แล้ว (news) และคอนเทนต์จาก `/contents/search` ที่ยังไม่ได้ save

**Base URL:** `/api/v1/bookmarks`  
**Authentication:** Bearer Token (ทุก endpoint ต้อง login)

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/bookmarks` | Bookmark ข่าวที่มีอยู่ใน DB |
| `POST` | `/bookmarks/content-search` | Bookmark จาก content search (save + bookmark) |
| `GET` | `/bookmarks` | ดึง bookmarks ทั้งหมดของ user |
| `GET` | `/bookmarks/check/{news_id}` | เช็คว่า bookmark แล้วหรือยัง |
| `DELETE` | `/bookmarks/{bookmark_id}` | ลบ bookmark ตาม bookmark_id |
| `DELETE` | `/bookmarks/by-news/{news_id}` | Un-bookmark ตาม news_id |

---

## 1. สร้าง Bookmark (ข่าวที่อยู่ใน DB แล้ว)

สำหรับข่าวที่ fetch มาแล้วและอยู่ใน `news_items` table (เช่น จาก `/news`, `/news/trigger`)

### Request

```
POST /bookmarks
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**

```json
{
  "news_id": 123
}
```

### Response — `201 Created`

```json
{
  "id": 1,
  "news_id": 123,
  "user_id": 5,
  "news_item": {
    "id": 123,
    "item_type": "news",
    "title": "BBCBreaking",
    "username": null,
    "content": "นายกรัฐมนตรี Keir Starmer ของสหราชอาณาจักรกล่าวว่า...",
    "url": "https://x.com/...",
    "tweet_profile_pic": "https://pbs.twimg.com/...",
    "tweet_id": "1234567890",
    "retweet_count": 233,
    "reply_count": 671,
    "like_count": 78,
    "quote_count": 0,
    "view_count": 87700,
    "tweet_created_at": "2026-04-17T10:30:00",
    "trigger_news": 0,
    "has_video": false,
    "media_urls": null,
    "media_type": null,
    "created_at": "2026-04-17T12:00:00+07:00",
    "updated_at": null
  },
  "created_at": "2026-04-17T12:05:00+07:00"
}
```

### Error — `409 Conflict`

```json
{
  "detail": "Already bookmarked"
}
```

---

## 2. สร้าง Bookmark จาก Content Search

สำหรับผลจาก `/contents/search` ที่ยังไม่ได้ save ลง DB  
Endpoint นี้จะ **save ลง `news_items` ก่อน** แล้วค่อยสร้าง bookmark

### Request

```
POST /bookmarks/content-search
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**

```json
{
  "title": "Nukcyn",
  "username": "@Nukcyn",
  "content": "LOLFanFest ปี 2022 ธีม Love Out Loud, 2023 Lovolution...",
  "url": "https://x.com/Nukcyn/status/...",
  "tweet_id": "9876543210",
  "tweet_profile_pic": "https://pbs.twimg.com/...",
  "tweet_created_at": "2026-03-09T14:00:00",
  "has_video": false,
  "media_urls": ["https://pbs.twimg.com/media/..."],
  "media_type": "photo",
  "retweet_count": 3000,
  "reply_count": 5,
  "like_count": 2000,
  "quote_count": 0,
  "view_count": 80000,
  "source_type": "x_search",
  "ref_code": "F1",
  "search_query": "LOLFanFest"
}
```

### Response — `201 Created`

เหมือนกับ endpoint `POST /bookmarks` (BookmarkResponse)

### หมายเหตุ

- ถ้า `tweet_id` ซ้ำกับที่มีใน DB แล้ว จะใช้ news_item เดิม ไม่สร้างซ้ำ
- ถ้า bookmark ซ้ำจะ return bookmark เดิม (ไม่ error)

---

## 3. ดึง Bookmarks ทั้งหมด (Pagination)

### Request

```
GET /bookmarks?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 1 | หน้าที่ต้องการ (เริ่มจาก 1) |
| `limit` | int | 10 | จำนวนต่อหน้า (max 100) |

### Response — `200 OK`

```json
{
  "items": [
    {
      "id": 1,
      "news_id": 123,
      "user_id": 5,
      "news_item": {
        "id": 123,
        "title": "BBCBreaking",
        "content": "นายกรัฐมนตรี Keir Starmer...",
        "url": "https://x.com/...",
        "tweet_profile_pic": "https://pbs.twimg.com/...",
        "retweet_count": 233,
        "like_count": 78,
        "view_count": 87700,
        "created_at": "2026-04-17T12:00:00+07:00"
      },
      "created_at": "2026-04-17T12:05:00+07:00"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "pages": 3,
  "has_next": true,
  "has_prev": false
}
```

---

## 4. เช็คสถานะ Bookmark

ใช้สำหรับ frontend ตรวจสอบว่าข่าวนี้ bookmark อยู่หรือยัง (แสดงไอคอน bookmark เติม/ไม่เติม)

### Request

```
GET /bookmarks/check/123
Authorization: Bearer <token>
```

### Response — `200 OK`

**กรณี bookmark แล้ว:**

```json
{
  "is_bookmarked": true,
  "bookmark_id": 1
}
```

**กรณียังไม่ bookmark:**

```json
{
  "is_bookmarked": false,
  "bookmark_id": null
}
```

---

## 5. ลบ Bookmark (by bookmark_id)

### Request

```
DELETE /bookmarks/1
Authorization: Bearer <token>
```

### Response — `204 No Content`

(ไม่มี body)

### Error — `404 Not Found`

```json
{
  "detail": "Bookmark not found"
}
```

---

## 6. Un-bookmark (by news_id)

สะดวกสำหรับ frontend ที่รู้แค่ `news_id` ไม่ต้องเก็บ `bookmark_id`

### Request

```
DELETE /bookmarks/by-news/123
Authorization: Bearer <token>
```

### Response — `204 No Content`

(ไม่มี body)

### Error — `404 Not Found`

```json
{
  "detail": "Bookmark not found"
}
```

---

## Flow Diagrams

### Flow 1: Bookmark ข่าวปกติ (news / trigger)

```
Client กดปุ่ม bookmark
    ↓
POST /bookmarks { news_id: 123 }
    ↓
ตรวจสอบว่า bookmark ซ้ำไหม
    ↓ (ไม่ซ้ำ)
สร้าง bookmark record
    ↓
Return BookmarkResponse (201)
```

### Flow 2: Bookmark จาก Content Search

```
Client เห็นผลจาก /contents/search
    ↓
Client กดปุ่ม bookmark
    ↓
POST /bookmarks/content-search { title, content, url, ... }
    ↓
เช็ค tweet_id ว่ามีใน news_items หรือยัง
    ↓ (ยังไม่มี)
Save ลง news_items (item_type = "content_search")
    ↓
สร้าง bookmark record
    ↓
Return BookmarkResponse (201)
```

### Flow 3: Toggle Bookmark (frontend)

```
กดปุ่ม bookmark
    ↓
GET /bookmarks/check/{news_id}
    ↓
is_bookmarked = true?
    ├── YES → DELETE /bookmarks/by-news/{news_id}  (un-bookmark)
    └── NO  → POST /bookmarks { news_id }          (bookmark)
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `POST /bookmarks` | 30/minute |
| `POST /bookmarks/content-search` | 15/minute |
| `GET /bookmarks` | 60/minute |
| `GET /bookmarks/check/{news_id}` | 60/minute |
| `DELETE /bookmarks/{bookmark_id}` | 30/minute |
| `DELETE /bookmarks/by-news/{news_id}` | 30/minute |

---

## Database Schema

```sql
CREATE TABLE bookmarks (
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    news_id     INTEGER NOT NULL REFERENCES news_items(id) ON DELETE CASCADE,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (news_id, user_id)  -- ป้องกัน bookmark ซ้ำ
);
```
