# 🚀 Advanced Search + Bulk LLM Analysis API Documentation

## Endpoint: `/search-and-analyze-bulk`

### Method: `POST`
### Rate Limit: `10/minute`

---

## 📝 Description

**Advanced Search + True Bulk LLM Analysis** - endpoint ใหม่ที่เร็วที่สุดและประหยัดที่สุด โดย:### ⚡ TRUE BULK ANALYSIS FLOW:
1. **ค้นหา tweets** จาก advanced search ตาม criteria ที่กำหนด
2. **รวบรวมข่าวทั้งหมด** ส่งให้ LLM **ครั้งเดียว**
3. **LLM วิเคราะห์รวมทีเดียว** ในรอบเดียว (ไม่ทีละข่าว)
4. **บันทึกผลลัพธ์** ลง database ทั้งหมด
5. **ส่ง response กลับทันที** (ไม่ใช้ SSE streaming)

### 🔄 เปรียบเทียบกับ Endpoint อื่น:

| Endpoint | Analysis Method | LLM Calls | Speed | Cost | 
|----------|-----------------|-----------|-------|------|
| `/search-and-analyze-bulk` | **TRUE BULK** | **1 ครั้ง** | ⚡⚡⚡ **เร็วสุด** | 💰 **ประหยัดสุด** |
| `/search-and-analyze` | Individual | N ครั้ง | ⚡⚡ ช้ากว่า | 💸 แพงกว่า |
| `/search-and-analyze-stream` | Individual + SSE | N ครั้ง | ⚡ ช้าสุด | 💸💸 แพงสุด |

### 📈 ข้อดีของ TRUE Bulk Analysis:
- ⚡ **เร็วที่สุด** - LLM ประมวลผล 1 ครั้งสำหรับข่าวทั้งหมด
- 💰 **ประหยัดสุด** - ประหยัดต้นทุน LLM token อย่างมาก
- 🎯 **Frontend ได้ผลเสร็จทันที** ไม่ต้องจัดการ SSE หรือรอ stream
- 🔄 **Structure data เหมือนเดิม** รองรับ UI ที่มีอยู่
- 🚀 **Scalable** - ยิ่งข่าวเยอะยิ่งประหยัด (1 LLM call แทน N calls)
- 🛡️ **Reliable** - มี fallback กลับไปใช้ individual analysis ถ้าเกิดข้อผิดพลาด### 🔬 Technical Details:

**Input to LLM:**
```
คุณเป็น AI นักวิเคราะห์ข่าวที่สามารถวิเคราะห์ข่าวหลายข่าวพร้อมกันได้

ข้อมูลข่าวทั้งหมด (20 ข่าว):

**ข่าวที่ 1:**
📰 แหล่งข่าว: BBCBreaking
🔗 ลิงก์: https://x.com/BBCBreaking/status/...
📝 เนื้อหา: World War Two bomb that forced thousands to evacuate Plymouth homes detonated safely at sea

**ข่าวที่ 2:**
📰 แหล่งข่าว: BBCWorld  
🔗 ลิงก์: https://x.com/BBCWorld/status/...
📝 เนื้อหา: Jury finds NRA and former leader Wayne LaPierre liable for corruption

... (ข่าวอื่นๆ)
```

**Output from LLM:**
```json
[
  {
    "news_number": 1,
    "analysis": "ระเบิด WW2 ที่ทำให้ต้องอพยพคนนับพันใน Plymouth ถูกระเบิดทำลายที่ทะเลแล้ว"
  },
  {
    "news_number": 2, 
    "analysis": "คณะลูกขุนตัดสินว่า NRA และ Wayne LaPierre อดีตผู้นำ มีความรับผิดชอบต่อการทุจริต"
  }
]
```

---

## 📋 Request Body (AdvancedSearchRequest)

```json
{
  "query": "string",                    // คำค้นหา (optional)
  "query_type": "string",              // ประเภทการค้นหา (optional, default: "Latest")
  "cursor": "string",                  // Twitter cursor สำหรับ pagination (optional)
  "since_date": "YYYY-MM-DD",         // วันที่เริ่มต้น (optional)
  "until_date": "YYYY-MM-DD",         // วันที่สิ้นสุด (optional)
  
  // 🔥 Users Source Options (Priority Order):
  "post_list_id": 123,                 // 🚀 NEW: ใช้ users จาก post_list_user (priority สูงสุด)
  "use_followed_users": true,          // ใช้ users ที่ติดตาม (default behavior)
  "specific_users": ["username1", "username2"],  // users เฉพาะ (priority ต่ำสุด)

  // RSS options:
  "fetch_rss_first": true,             // default true: fetch RSS ก่อน แล้วค่อยทำ X
  "rss_limit_per_feed": 20,            // default 20, max 100
  "analyze_rss_with_ai": true          // default true: แปล/สรุป RSS เป็นไทยก่อน save
}
```

### 🎯 Users Source Priority:

1. **`post_list_id`** (สูงสุด) - ถ้าส่งมา จะใช้ users จาก `post_list_user` แทน
2. **`use_followed_users`** (กลาง) - ใช้ users ที่ติดตามทั่วไป (default)
3. **`specific_users`** (ต่ำสุด) - ระบุ users เฉพาะ

### 🔍 Query Types:
- `"latest"` หรือ `"Latest"` - ข่าวล่าสุด
- `"top"` หรือ `"Top"` - ข่าวยอดนิยม
- `"people"` หรือ `"People"` - ค้นหาจากผู้คน
- `"media"` หรือ `"Media"` - ข่าวที่มีสื่อ

Backend จะ normalize `query_type` ให้เอง ดังนั้น frontend ส่ง lowercase ได้

---

## ✅ Response Format (AdvancedSearchNewsResponse)

```json
{
  "items": [
    {
      "id": 123,
      "news_number": 1,
      "tweet_name": "@elonmusk",
      "url": "https://x.com/elonmusk/status/123456789",
      "llm_analysis": "🎯 หัวข้อ: SpaceX ประกาศภารกิจดาวอังคาร\n\n📝 สรุป: Elon Musk ประกาศแผนภารกิจไปดาวอังคารในปี 2026...",
      "tweet_profile_pic": "https://pbs.twimg.com/profile_images/...",
      "tweet_id": "1234567890123456789",
      "created_at": "2024-03-24T10:30:00Z",
      "user_id": 456,
      
      "retweet_count": 1250,
      "reply_count": 340,
      "like_count": 5600,
      "quote_count": 180,
      "view_count": 150000,
      "tweet_created_at": "2024-03-24T09:15:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 50,
  "has_next": true,
  "has_previous": false,
  
  // 🔥 Twitter-specific fields สำหรับ load more
  "twitter_cursor": "DAABCgABF...",
  "twitter_has_next": true,
  "search_query": "SpaceX Mars mission"
}
```

---

## 🔐 Authentication

```bash
# Header Authorization จำเป็น
Authorization: Bearer <your_jwt_token>
```

---

## 📝 Example Usage

### 1. 🚀 NEW: Using Post List Users (Recommended)

```javascript
// ใช้ users จาก post_list_user (เช่น listการติดตาม "Tech News")  
const response = await fetch('/search-and-analyze-bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: "AI development",
    query_type: "latest", 
    post_list_id: 1,  // 🔥 ใช้ users จาก post_list_id = 1
    since_date: "2024-03-20"
  })
});
```

### 2. 📋 Using Followed Users (Default)

```javascript
// ใช้ users ที่ติดตามทั่วไป
const response = await fetch('/search-and-analyze-bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: "Tesla Cybertruck",
    query_type: "latest", 
    use_followed_users: true,  // default behavior
    since_date: "2024-03-20"
  })
});
```

### 3. 🎯 Using Specific Users

```javascript
// ใช้ users เฉพาะ
const response = await fetch('/search-and-analyze-bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: "cryptocurrency",
    query_type: "top", 
    use_followed_users: false,
    specific_users: ["elonmusk", "naval", "coinbase"]  // ระบุ users เฉพาะ
  })
});
```

### JavaScript Complete Example:

```javascript
const response = await fetch('/search-and-analyze-bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: "Tesla Cybertruck",
    query_type: "latest", 
    use_followed_users: true,
    since_date: "2024-03-20",
    until_date: "2024-03-24"
  })
});

const result = await response.json();

if (response.ok) {
  console.log(`Found ${result.total} analyzed news items`);
  result.items.forEach(news => {
    console.log(`${news.tweet_name}: ${news.llm_analysis}`);
  });
  
  // Load more ถ้ามี
  if (result.twitter_has_next && result.twitter_cursor) {
    // Call API อีกรอบด้วย cursor
  }
} else {
  console.error('Error:', result.detail);
}
```

### Python Examples:

```python
import requests

# 🚀 Using Post List Users
def analyze_post_list_news(token, post_list_id, query=""):
    """วิเคราะห์ข่าวจาก users ใน post_list_user"""
    url = "http://localhost:8080/search-and-analyze-bulk"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "query": query,
        "query_type": "latest",
        "post_list_id": post_list_id,  # 🔥 ใช้ post_list_id
        "since_date": "2024-03-01"
    }
    
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# 📋 Using Followed Users (Default)  
def analyze_followed_news(token, query=""):
    """วิเคราะห์ข่าวจาก users ที่ติดตามทั่วไป"""
    url = "http://localhost:8080/search-and-analyze-bulk"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "query": query,
        "query_type": "top",
        "use_followed_users": True,  # ใช้ users ที่ติดตาม
        "since_date": "2024-03-01"
    }
    
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage examples:
result1 = analyze_post_list_news(token, post_list_id=1, query="AI news")
result2 = analyze_followed_news(token, query="crypto market")

print(f"✅ Post List Analysis: {result1['total']} items")
print(f"✅ Followed Users Analysis: {result2['total']} items")
```

### Python Requests Example (Original):

```python
import requests

url = "http://localhost:8080/search-and-analyze-bulk"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}
data = {
    "query": "AI development 2024",
    "query_type": "top",
    "use_followed_users": True,
    "since_date": "2024-03-01"
}

response = requests.post(url, json=data, headers=headers)
result = response.json()

if response.status_code == 200:
    print(f"✅ Success: {result['total']} items analyzed")
    for item in result['items']:
        print(f"📰 {item['tweet_name']}: {item['llm_analysis'][:100]}...")
else:
    print(f"❌ Error {response.status_code}: {result['detail']}")
```

---

## 🚨 Error Responses

### 400 Bad Request - ค้นหาไม่สำเร็จ
```json
{
  "detail": "ไม่สามารถค้นหา tweets ได้: Invalid query format"
}
```

หมายเหตุ: ถ้า `fetch_rss_first` เป็น `true` และมี RSS feed อยู่ใน scope (`post_list_id` หรือ followed users) แล้ว X/Twitter search ล้มหลัง RSS fetch สำเร็จ endpoint จะ fallback เป็น `200` พร้อม news list ล่าสุดแทน `400` ดังนั้น `400` จาก X search จะเกิดกับเคสที่ไม่มี RSS fallback หรือปิด RSS ด้วย `fetch_rss_first: false` เป็นหลัก

### 403 Forbidden - API Key ไม่มีสิทธิ์
```json
{
  "detail": "API key ไม่มีสิทธิ์ใช้งาน กรุณาตรวจสอบการตั้งค่า API key"
}
```

### 404 Not Found - ไม่พบ users 
```json
// ไม่พบ users ใน post_list_user
{
  "items": [],
  "total": 0,
  "twitter_cursor": null,
  "search_query": "your search query"
}

// ไม่พบ users ที่ติดตาม
{
  "items": [],
  "total": 0,
  "twitter_cursor": null,
  "search_query": "your search query"  
}
```

### 🔐 Post List Access Issues
```json
// ไม่มีสิทธิ์เข้าถึง post_list_id
{
  "items": [],
  "total": 0,
  "message": "ไม่พบ users ใน post_list ที่ระบุ"
}

// post_list_id ไม่ถูกต้องหรือไม่เป็นเจ้าของ
{
  "items": [],
  "total": 0,
  "twitter_cursor": null,
  "search_query": "your search query"
}
```

### 429 Too Many Requests - Rate Limit
```json
{
  "detail": "Rate limit exceeded. Try again later."
}
```

### 500 Internal Server Error
```json
{
  "detail": "เกิดข้อผิดพลาดในการค้นหาและวิเคราะห์ tweets: <error_message>"
}
```

---

## 🔄 Pagination & Load More

### การใช้ Twitter Cursor:
```javascript
// First call
const firstCall = await fetch('/search-and-analyze-bulk', {
  method: 'POST',
  body: JSON.stringify({
    query: "crypto news",
    query_type: "latest"
  })
});

const firstResult = await firstCall.json();

// Load more ด้วย cursor
if (firstResult.twitter_has_next) {
  const secondCall = await fetch('/search-and-analyze-bulk', {
    method: 'POST', 
    body: JSON.stringify({
      query: "crypto news",
      query_type: "latest",
      cursor: firstResult.twitter_cursor  // 🔥 ใช้ cursor จาก response ก่อนหน้า
    })
  });
}
```

---

## ⚡ Performance Notes

### Bulk vs Individual เปรียบเทียบ:

| Feature | `/search-and-analyze-bulk` | `/search-and-analyze` | `/search-and-analyze-stream` |
|---------|----------------------------|----------------------|------------------------------|
| **Analysis Method** | ⚡ **TRUE BULK** | 🔄 Individual Loop | 🔄 Individual + SSE |
| **LLM Calls** | **1 ครั้ง** | N ครั้ง | N ครั้ง |
| **Speed** | ⚡⚡⚡ **เร็วสุด** | ⚡⚡ ช้ากว่า | ⚡ ช้าสุด |
| **Cost** | 💰 **ประหยัดสุด** | 💸 แพงกว่า | 💸💸 แพงสุด |
| **UI/UX** | 🎯 ได้ผลเสร็จทันที | 🎯 ได้ผลเสร็จทันที | 🔄 Stream แบบ realtime |
| **Error Handling** | ✅ ง่าย + Fallback | ✅ ง่าย | ⚠️ ซับซ้อน |
| **Scalability** | 🚀 **ยิ่งเยอะยิ่งประหยัด** | 📈 เชิงเส้น | 📈 ช้าลง |

### 💡 Recommended Usage:
- ✅ **ใช้ `/search-and-analyze-bulk`** สำหรับ production (แนะนำ)
- 🔄 ใช้ `/search-and-analyze` เมื่อต้องการ individual analysis เฉพาะ  
- 🔄 ใช้ `/search-and-analyze-stream` เมื่อต้องการ realtime UI feedback เท่านั้น

---

## Frontend Update: RSS Source Support

ส่วนนี้เป็นสิ่งที่ frontend ต้องปรับหลัง backend รองรับข่าวจาก RSS/Atom feed เพิ่มเติม โดยไม่เปลี่ยน logic `trigger_news` เดิม

### 1. Follow item มี type แล้ว

`GET /follow` จะคืน field เพิ่ม:

```json
{
  "id": 12,
  "x_account": null,
  "follow_type": "rss",
  "source_url": "https://example.com/rss.xml",
  "name": "Example News",
  "profile_image_url_https": null,
  "status": 1,
  "user_id": 456,
  "created_at": "2026-04-30T10:00:00Z",
  "updated_at": "2026-04-30T10:00:00Z"
}
```

Frontend ต้องแยก display จาก `follow_type`:

| `follow_type` | ใช้ field ไหน | หมายเหตุ |
|---|---|---|
| `"x"` | `x_account`, `name`, `profile_image_url_https` | behavior เดิม |
| `"rss"` | `source_url`, `name`, `profile_image_url_https` | `x_account` จะเป็น `null` |

### 2. เพิ่ม RSS follow

ใช้ endpoint นี้เพื่อเพิ่ม RSS feed เข้า follow list:

```http
POST /follow/rss
Authorization: Bearer <token>
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

Response: `FollowUserResponse` เหมือน `GET /follow` โดย `follow_type` จะเป็น `"rss"` และ `source_url` จะเป็น feed URL

ก่อนเพิ่มจริงสามารถ preview feed ได้:

```http
GET /follow/rss/preview?rss_url=https%3A%2F%2Fexample.com%2Frss.xml
Authorization: Bearer <token>
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

### 3. Fetch RSS news เข้า `news_items`

หลัง user follow RSS แล้ว ให้เรียก:

```http
POST /news/rss/fetch
Authorization: Bearer <token>
Content-Type: application/json
```

Request:

```json
{
  "post_list_id": 1,
  "limit_per_feed": 20,
  "analyze_with_ai": true
}
```

Field:

| field | required | default | notes |
|---|---:|---:|---|
| `post_list_id` | no | `null` | ถ้าส่งมา จะ fetch เฉพาะ RSS follows ใน post list นั้น |
| `limit_per_feed` | no | `20` | 1-100 |
| `analyze_with_ai` | no | `true` | ให้ RSS ผ่าน LLM เพื่อแปล/สรุปไทยก่อน save ลง `news_items` |

Response:

```json
{
  "status": "success",
  "total_feeds": 3,
  "saved_count": 12,
  "updated_count": 2,
  "skipped_count": 8,
  "error_count": 0,
  "items": [
    {
      "id": 1001,
      "title": "สรุปหัวข้อภาษาไทยจาก AI",
      "url": "https://example.com/article",
      "feed_url": "https://example.com/rss.xml",
      "source_item_id": "https://example.com/article",
      "published_at": "Thu, 30 Apr 2026 10:00:00 GMT",
      "media_urls": ["https://example.com/article-image.jpg"],
      "analyzed_with_ai": true
    }
  ],
  "updated_items": [],
  "errors": []
}
```

`skipped_count` คือข่าวที่ backend เจอซ้ำจาก `source_item_id` หรือ `url` เดิม จึงไม่ insert ซ้ำ
`updated_count` คือข่าว RSS เดิมที่ถูก update เพิ่ม เช่น แปล/สรุปไทยย้อนหลัง หรือเติมรูปที่ parser รอบใหม่หาเจอ

หลัง fetch สำเร็จ ให้ frontend refresh news list ด้วย endpoint เดิม เช่น `GET /news` เพราะข่าว RSS ถูก save ลง `news_items` แล้ว

### 4. News item response มี RSS metadata เพิ่ม

`GET /news` และ news response อื่น ๆ จะมี field เพิ่ม:

```json
{
  "id": 1001,
  "title": "สรุปหัวข้อภาษาไทยจาก AI",
  "content": "สรุปข่าวภาษาไทย 1-2 ประโยคจาก AI",
  "url": "https://example.com/article",
  "source_type": "rss",
  "source_item_id": "https://example.com/article",
  "published_at": "Thu, 30 Apr 2026 10:00:00 GMT",
  "tweet_id": null,
  "tweet_profile_pic": null,
  "media_urls": ["https://example.com/article-image.jpg"],
  "media_type": "photo",
  "tweet_created_at": null,
  "retweet_count": 0,
  "reply_count": 0,
  "like_count": 0,
  "quote_count": 0,
  "view_count": 0,
  "trigger_news": 0
}
```

Frontend card ควร handle ตามนี้:

| case | UI behavior |
|---|---|
| `source_type === "rss"` | แสดงเป็น article/RSS card, ใช้ `published_at`, ซ่อน X metrics ถ้าเป็น 0/null |
| RSS card title/body | ใช้ `title` และ/หรือ `content` ที่ผ่าน AI แล้วเป็นภาษาไทย เมื่อ `analyze_with_ai=true` |
| RSS article image | ใช้รูปแรกจาก `media_urls` เป็น thumbnail/cover ของ card ถ้ามี |
| `source_type !== "rss"` หรือ `null` | ใช้ UI X/news เดิม |
| `tweet_id === null` | ห้าม assume ว่าเปิด x.com/status ได้ |
| `tweet_profile_pic === null` | ใช้ fallback icon/avatar ของ source |

### 5. Advanced bulk analysis ทำ RSS ก่อน แล้วค่อย X

`/advanced-search/search-and-analyze-bulk` ตอนนี้ทำงานแบบ priority:

1. Fetch RSS feeds ใน scope เดียวกันก่อน (`post_list_id` หรือ `use_followed_users`)
2. Save ข่าว RSS ใหม่ลง `news_items` โดย dedupe ด้วย `source_item_id`/`url`
3. ต่อด้วย X/Twitter bulk analysis จาก follows ที่ `follow_type === "x"`
4. ถ้า X query แบบรวมหลาย account ล้ม backend จะ retry แบบแบ่ง account เป็นกลุ่มเล็ก ๆ ก่อน fallback
5. Response สุดท้ายยังเป็น news list format เดิม และสามารถมีข่าว RSS ที่เพิ่ง save รวมอยู่ด้วย

#### X search fallback หลัง RSS

ถ้า request มี RSS feed ใน scope และระบบ fetch RSS ก่อนแล้ว แต่ขั้นตอน X/Twitter search ล้ม backend จะไม่ตอบ `400` ทันที แต่จะ fallback เป็น `200` พร้อม `AdvancedSearchNewsResponse` จากข่าวล่าสุดแทน เพื่อให้ frontend ยังแสดงข่าว RSS/ข่าวล่าสุดได้

Frontend ควร handle แบบนี้:

- ถ้า response เป็น `200` ให้ render `items` ตามปกติ แม้ X search จะไม่ได้ข่าวใหม่ในรอบนั้น
- ใน fallback นี้ `twitter_cursor` จะเป็น `null` และ `twitter_has_next` จะเป็น `false`
- ใช้ `source_type` แยก card: `"rss"` คือ RSS article, `"x"` หรือ `null` คือ flow X/news เดิม
- อย่า assume ว่า `200` จาก endpoint นี้แปลว่ามี X analysis ใหม่เสมอ เพราะอาจเป็น latest news fallback หลัง RSS fetch
- ถ้า backend ต้อง retry X แบบแบ่งกลุ่ม account อาจไม่มี unified `twitter_cursor` ให้ load more แม้มี X item กลับมา

ถ้า post list มีทั้ง X และ RSS:

- `POST /advanced-search/search-and-analyze-bulk` จะทำ RSS ก่อน แล้วต่อ X
- `POST /news/rss/fetch` ยังใช้ได้ ถ้าต้องการ fetch RSS อย่างเดียว และจะ ignore X follows
- RSS ที่ save ใหม่จะผ่าน AI เป็นภาษาไทยโดย default (`analyze_rss_with_ai: true`)
- RSS ที่เคย save เป็นภาษาอังกฤษแล้ว ถ้า fetch รอบใหม่เจอ item เดิม จะ update ของเดิมให้เป็นสรุปไทยและเติมรูปได้ โดยไม่ insert ซ้ำ

ดังนั้น frontend สามารถให้ post list เดียวมี source ปนกันได้:

| action | endpoint |
|---|---|
| ทำทั้ง RSS -> X | `/advanced-search/search-and-analyze-bulk` |
| ดึงเฉพาะ RSS | `/news/rss/fetch` |
| ทำเฉพาะ X ไม่เอา RSS | `/advanced-search/search-and-analyze-bulk` พร้อม `fetch_rss_first: false` |

### 6. สิ่งที่ไม่เปลี่ยน

- `trigger_news` ยังใช้สำหรับการแสดงข่าวหน้าบ้านตาม flow เดิม ไม่ได้ใช้แยก RSS/X
- RSS dedupe ใช้ `source_item_id` ภายใน backend frontend ไม่ต้องสร้างเอง
- Endpoint อ่านข่าวหลักยังใช้ `GET /news` ได้เหมือนเดิม

---

## 🧪 Testing

### Test Endpoint ด้วย cURL:

```bash
curl -X POST "http://localhost:8080/search-and-analyze-bulk" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI technology 2024",
    "query_type": "latest",
    "use_followed_users": true,
    "since_date": "2024-03-20"
  }'
```

### Expected Response Time:
- **TRUE Bulk (20 ข่าว)**: 8-15 วินาที (1 LLM call)
- **Individual (20 ข่าว)**: 40-80 วินาที (20 LLM calls + delays)
- **Stream (20 ข่าว)**: 60-100 วินาที (20 LLM calls + SSE overhead)

### Cost Savings Examples:
```
🧮 Cost Comparison (20 ข่าว):

TRUE Bulk Analysis:
- Input tokens: ~8,000 tokens (ข่าวทั้งหมด + prompt)
- Output tokens: ~2,000 tokens (JSON response)
- Total: ~10,000 tokens

Individual Analysis:  
- Input tokens: ~400 tokens × 20 = ~8,000 tokens
- Output tokens: ~100 tokens × 20 = ~2,000 tokens  
- Total: ~10,000 tokens

💰 Cost เท่ากัน แต่ TRUE Bulk เร็วกว่ามาก!

🚀 สำหรับข่าว 50+ ข่าว:
TRUE Bulk จะประหยัด token overhead อย่างมาก
เพราะ prompt template ใช้ร่วมกัน แทนที่จะทำซ้ำ 50 ครั้ง
```

---

## 📞 Support

หากมีปัญหาหรือข้อสงสัย:
1. ตรวจสอบ API token ว่าถูกต้อง
2. ตรวจสอบ rate limit (10/minute)
3. ตรวจสอบ format ของ request body
4. ดู error logs ใน console 

**Happy Coding! 🚀**
