# Media Fields — Advanced Search Bulk Analysis

## Overview

ทุก news item ที่ได้จาก `/advanced-search/search-and-analyze-bulk` ตอนนี้จะมีข้อมูล media ของ tweet ต้นทางแนบมาด้วย  
ถ้า user ที่ติดตามโพสต์รูปหรือวิดีโอ ฟิลด์เหล่านี้จะไม่เป็น `null`/`[]`

---

## New Fields in `NewsItemResponse`

| Field | Type | Description |
|-------|------|-------------|
| `media_urls` | `string[]` | Array ของ URL รูป/วิดีโอ thumbnail จาก tweet ต้นทาง (เปล่าถ้าไม่มี media) |
| `media_type` | `string \| null` | ประเภทของ media: `"photo"`, `"video"`, `"animated_gif"`, หรือ `null` |

---

## Response Example

```json
{
  "items": [
    {
      "id": 1234,
      "title": "BBCWorld",
      "content": "สรุปข่าว: ...",
      "url": "https://x.com/BBCWorld/status/...",
      "user_id": 42,
      "tweet_profile_pic": "https://pbs.twimg.com/profile_images/...",
      "tweet_id": "1912345678901234567",
      "retweet_count": 120,
      "reply_count": 45,
      "like_count": 890,
      "quote_count": 30,
      "view_count": 52000,
      "tweet_created_at": "Mon Apr 27 08:12:34 +0000 2026",
      "trigger_news": 0,
      "media_urls": [
        "https://pbs.twimg.com/media/AbCdEfGh.jpg"
      ],
      "media_type": "photo",
      "created_at": "2026-04-27T08:15:00Z",
      "updated_at": null
    },
    {
      "id": 1235,
      "title": "Reuters",
      "content": "สรุปข่าว: ...",
      "url": "https://x.com/Reuters/status/...",
      "user_id": 42,
      "tweet_profile_pic": "https://pbs.twimg.com/profile_images/...",
      "tweet_id": "1912345678901234568",
      "retweet_count": 0,
      "reply_count": 5,
      "like_count": 22,
      "quote_count": 1,
      "view_count": 1100,
      "tweet_created_at": "Mon Apr 27 07:55:10 +0000 2026",
      "trigger_news": 0,
      "media_urls": [],
      "media_type": null,
      "created_at": "2026-04-27T08:15:02Z",
      "updated_at": null
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 50,
  "twitter_cursor": "abc123xyz",
  "twitter_has_next": true,
  "search_query": "breaking news"
}
```

---

## Frontend Usage Guide

### แสดงรูปภาพ

```tsx
// ตรวจสอบก่อนว่ามี media และเป็น photo
if (item.media_type === 'photo' && item.media_urls.length > 0) {
  return (
    <img
      src={item.media_urls[0]}
      alt="tweet media"
      style={{ maxWidth: '100%', borderRadius: 8 }}
    />
  );
}
```

### แสดงวิดีโอ/GIF badge

```tsx
// Twitter API คืน thumbnail URL สำหรับวิดีโอ — ลิงก์ไปยัง tweet ต้นทาง
if (item.media_type === 'video' || item.media_type === 'animated_gif') {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer">
      <div style={{ position: 'relative' }}>
        <img src={item.media_urls[0]} alt="video thumbnail" />
        <span className="play-badge">▶</span>
      </div>
    </a>
  );
}
```

### Multiple images (carousel)

```tsx
// บาง tweet มีรูปหลายรูป (สูงสุด 4 รูป)
if (item.media_type === 'photo' && item.media_urls.length > 1) {
  return (
    <div className="media-grid">
      {item.media_urls.map((url, i) => (
        <img key={i} src={url} alt={`media ${i + 1}`} />
      ))}
    </div>
  );
}
```

---

## `media_type` Values

| Value | Description |
|-------|-------------|
| `"photo"` | รูปภาพ 1-4 รูป (`media_urls` มีได้หลาย URL) |
| `"video"` | วิดีโอ (`media_urls[0]` = thumbnail, คลิกไปดูที่ tweet ต้นทาง) |
| `"animated_gif"` | GIF (`media_urls[0]` = thumbnail) |
| `null` | ไม่มี media ใน tweet นี้ |

---

## Endpoints ที่รองรับ

| Endpoint | รองรับ media fields |
|----------|---------------------|
| `POST /advanced-search/search-and-analyze-bulk` | ✅ |
| `POST /advanced-search/search-and-analyze` | ✅ |
| `GET /news/` (get news list) | ✅ (ถ้า news ถูกบันทึกมาพร้อม media) |

---

## Notes

- `media_urls` เป็น `[]` (array ว่าง) ถ้า tweet ไม่มี media — **ไม่เป็น `null`**
- `media_type` เป็น `null` ถ้าไม่มี media
- สำหรับ `"video"` และ `"animated_gif"` Twitter API ไม่คืน stream URL โดยตรง ใช้ `media_urls[0]` เป็น thumbnail แล้วลิงก์ไปที่ `item.url` (tweet ต้นทาง)
