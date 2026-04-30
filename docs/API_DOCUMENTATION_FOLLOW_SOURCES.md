# Follow Sources API Documentation

เอกสารนี้อธิบายโครงสร้างผู้ติดตามแบบใหม่สำหรับ frontend หลังระบบรองรับทั้ง X account และ RSS feed ในตาราง `follow_user`

## Overview

`follow_user` ตอนนี้หมายถึง "แหล่งข่าวที่ user ติดตาม" ไม่ได้จำกัดแค่ X account แล้ว โดยแยกชนิดด้วย `follow_type`

```ts
type FollowType = "x" | "rss";

type FollowSource = {
  id: number;
  follow_type: FollowType;
  x_account: string | null;
  source_url: string | null;
  name: string | null;
  profile_image_url_https: string | null;
  status: number;
  user_id: number;
  created_at: string;
  updated_at: string;
};
```

## Source Types

### X Account

```json
{
  "id": 5,
  "follow_type": "x",
  "x_account": "elonmusk",
  "source_url": null,
  "name": "Elon Musk",
  "profile_image_url_https": "https://pbs.twimg.com/profile_images/...",
  "status": 1,
  "user_id": 123,
  "created_at": "2026-04-30T10:30:00Z",
  "updated_at": "2026-04-30T10:30:00Z"
}
```

Frontend mapping:

| UI field | value |
|---|---|
| title | `name || x_account` |
| subtitle | `@${x_account}` |
| avatar | `profile_image_url_https` |
| badge | `X` |
| source key | `x_account` |

### RSS Feed

```json
{
  "id": 12,
  "follow_type": "rss",
  "x_account": null,
  "source_url": "https://example.com/rss.xml",
  "name": "Example News",
  "profile_image_url_https": null,
  "status": 1,
  "user_id": 123,
  "created_at": "2026-04-30T10:30:00Z",
  "updated_at": "2026-04-30T10:30:00Z"
}
```

Frontend mapping:

| UI field | value |
|---|---|
| title | `name || source_url` |
| subtitle | `source_url` |
| avatar | `profile_image_url_https || fallback RSS icon` |
| badge | `RSS` |
| source key | `source_url` |

## Endpoints

ทุก endpoint ต้องส่ง Bearer token

```http
Authorization: Bearer <token>
```

### Get Follow Sources

```http
GET /api/follow
```

Response เป็น array ที่มี X และ RSS ปนกันได้

```json
[
  {
    "id": 5,
    "follow_type": "x",
    "x_account": "elonmusk",
    "source_url": null,
    "name": "Elon Musk",
    "profile_image_url_https": "https://pbs.twimg.com/profile_images/...",
    "status": 1,
    "user_id": 123,
    "created_at": "2026-04-30T10:30:00Z",
    "updated_at": "2026-04-30T10:30:00Z"
  },
  {
    "id": 12,
    "follow_type": "rss",
    "x_account": null,
    "source_url": "https://example.com/rss.xml",
    "name": "Example News",
    "profile_image_url_https": null,
    "status": 1,
    "user_id": 123,
    "created_at": "2026-04-30T10:35:00Z",
    "updated_at": "2026-04-30T10:35:00Z"
  }
]
```

### Add X Account

ใช้ flow เดิม

```http
POST /api/follow/users/search
Content-Type: application/json
```

Request:

```json
{
  "x_account": "elonmusk",
  "query": "elon",
  "name": "Elon Musk",
  "profile_image_url_https": "https://pbs.twimg.com/profile_images/..."
}
```

Record ที่ถูกสร้างจะมี:

```json
{
  "follow_type": "x",
  "source_url": null
}
```

### Preview RSS Feed

ใช้สำหรับ validate RSS URL และแสดงตัวอย่างก่อนกดติดตามจริง

```http
GET /api/follow/rss/preview?rss_url=https%3A%2F%2Fexample.com%2Frss.xml
```

Response:

```json
{
  "status": "success",
  "data": {
    "feed_url": "https://example.com/rss.xml",
    "feed_title": "Example News",
    "items": [
      {
        "title": "Article title",
        "url": "https://example.com/article",
        "summary": "Short summary from RSS",
        "source_item_id": "https://example.com/article",
        "published_at": "Thu, 30 Apr 2026 10:00:00 GMT",
        "author": null,
        "media_urls": []
      }
    ]
  }
}
```

### Add RSS Feed

```http
POST /api/follow/rss
Content-Type: application/json
```

Request:

```json
{
  "rss_url": "https://example.com/rss.xml",
  "name": "Example News",
  "profile_image_url_https": null
}
```

Response:

```json
{
  "id": 12,
  "follow_type": "rss",
  "x_account": null,
  "source_url": "https://example.com/rss.xml",
  "name": "Example News",
  "profile_image_url_https": null,
  "status": 1,
  "user_id": 123,
  "created_at": "2026-04-30T10:30:00Z",
  "updated_at": "2026-04-30T10:30:00Z"
}
```

### Delete Follow Source

ใช้ endpoint เดิมร่วมกันทั้ง X และ RSS

```http
DELETE /api/follow/users/{follow_id}
```

Frontend ส่ง `follow.id` ได้เลย ไม่ต้องแยก type ตอนลบ

## Post List Integration

`post_list_user.follower_user_id` ยังอ้างถึง `follow_user.id` เหมือนเดิม ดังนั้น Post List หนึ่งมี X และ RSS ปนกันได้

### Add To Post List

```http
POST /api/post-list-users/
Content-Type: application/json
```

```json
{
  "post_list_id": 1,
  "follower_user_id": 12
}
```

### Get Follow Sources In Post List

```http
GET /api/post-list-users/post-list/{post_list_id}
```

Response item มี field เพิ่มสำหรับแยก type:

```json
{
  "id": 10,
  "post_list_id": 1,
  "follower_user_id": 12,
  "created_at": "2026-04-30T10:30:00Z",
  "updated_at": "2026-04-30T10:30:00Z",
  "post_list_name": null,
  "follow_user_name": "Example News",
  "follow_user_x_account": null,
  "follow_user_type": "rss",
  "follow_user_source_url": "https://example.com/rss.xml"
}
```

Frontend mapping ใน post list:

| field | X account | RSS feed |
|---|---|---|
| `follow_user_type` | `"x"` | `"rss"` |
| `follow_user_name` | account name | feed title |
| `follow_user_x_account` | username | `null` |
| `follow_user_source_url` | `null` | feed URL |

## Fetch / Analyze Flow

| Source ใน list | Endpoint ที่ควรเรียก |
|---|---|
| X accounts | `POST /api/advanced-search/search-and-analyze-bulk` |
| RSS feeds | `POST /api/news/rss/fetch` หรือ `POST /api/advanced-search/search-and-analyze-bulk` |
| X และ RSS ปนกัน | แนะนำ `POST /api/advanced-search/search-and-analyze-bulk` เพราะ backend จะ fetch RSS ก่อน แล้วค่อยทำ X |

Backend แยก source ให้แล้ว:

- Advanced bulk analysis จะ fetch RSS ก่อนโดย default แล้วค่อยทำ X
- `fetch_rss_first` default เป็น `true`
- `rss_limit_per_feed` default เป็น `20`
- ถ้าไม่ต้องการ fetch RSS ในรอบนั้น ให้ส่ง `fetch_rss_first: false`
- RSS fetch ใช้เฉพาะ `follow_type = "rss"`
- X analysis ใช้เฉพาะ `follow_type = "x"`
- `trigger_news` ไม่ได้ใช้แยก X/RSS และยังเป็น logic หน้าบ้านเดิม

ตัวอย่าง request แบบ priority RSS -> X:

```json
{
  "query": "AI",
  "query_type": "latest",
  "post_list_id": 1,
  "fetch_rss_first": true,
  "rss_limit_per_feed": 20
}
```

## UI Notes

- อย่า assume ว่า follow source ทุกตัวมี `x_account`
- ถ้า `follow_type === "rss"` ให้ใช้ `source_url` เป็น source หลัก
- ถ้า `profile_image_url_https` เป็น `null` ให้ใช้ fallback icon
- Post List เดียวกันมี source ปนกันได้
- ตอนลบใช้ `id` เดียวกัน ไม่ต้องแยก endpoint
