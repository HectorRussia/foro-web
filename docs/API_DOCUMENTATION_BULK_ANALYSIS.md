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
  "specific_users": ["username1", "username2"]  // users เฉพาะ (priority ต่ำสุด)
}
```

### 🎯 Users Source Priority:

1. **`post_list_id`** (สูงสุด) - ถ้าส่งมา จะใช้ users จาก `post_list_user` แทน
2. **`use_followed_users`** (กลาง) - ใช้ users ที่ติดตามทั่วไป (default)
3. **`specific_users`** (ต่ำสุด) - ระบุ users เฉพาะ

### 🔍 Query Types:
- `"latest"` - ข่าวล่าสุด
- `"top"` - ข่าวยอดนิยม
- `"people"` - ค้นหาจากผู้คน
- `"media"` - ข่าวที่มีสื่อ

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