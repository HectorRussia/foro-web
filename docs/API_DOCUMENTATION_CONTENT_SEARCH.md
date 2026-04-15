# Content Search API — Frontend Documentation

## Base URL

```
{API_V1_STR}/contents
```

> ทุก endpoint ต้องส่ง `Authorization: Bearer <token>` ใน header

---

## 1. POST `/contents/search`

ค้นหาคอนเทนต์แบบ pipeline (ไม่ save ลง DB)

**Rate Limit:** 15 requests/minute

### Request Body

```json
{
  "query": "AI ปัญญาประดิษฐ์",
  "max_results": 15,
  "include_video_only": false
}
```

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | `string` | ✅ | — | คำค้นหา (ภาษาไทย/อังกฤษ) |
| `max_results` | `int` | ❌ | `15` | จำนวนผลลัพธ์สูงสุด |
| `include_video_only` | `bool` | ❌ | `false` | กรองเฉพาะโพสต์ที่มีวิดีโอ |

### Response

```json
{
  "success": true,
  "query": "AI ปัญญาประดิษฐ์",
  "intent": "news",
  "total_results": 10,
  "summary": {
    "title": "พัฒนาการสำคัญด้านปัญญาประดิษฐ์จากโพสต์บน X",
    "subtitle": "EDITORIAL DIGEST FROM 10 KEY SIGNALS",
    "date_range": "สรุปจากข้อมูลช่วง 12 เม.ย. 2569 - 13 เม.ย. 2569",
    "main_summary": "พัฒนาการสำคัญด้านปัญญาประดิษฐ์จากโพสต์บนโซเชียลมีเดีย",
    "bullet_points": [
      "ญี่ปุ่นก่อตั้งบริษัทใหม่ชื่อ Japan AI Foundation Model Development โดย SoftBank, NEC, Honda, Sony  F8",
      "Terence Tao เสนอมุมมอง \"Copernican view of intelligence\" ที่มองการพัฒนา AI ในภาพรวมกว้าง  F2",
      "บริษัทเทคโนโลยีสร้างศูนย์ข้อมูล AI ขนาดใหญ่กว่า 4,000 แห่งทั่วสหรัฐฯ  F7"
    ],
    "foro_note": "FORO ตรวจสอบข้อมูลแล้ว คาดว่าจะมีความเคลื่อนไหวเพิ่มเติมใน 24-48 ชั่วโมง",
    "confidence_score": 0.92
  },
  "results": [
    {
      "id": null,
      "ref_code": "F1",
      "title": "RCBTweets",
      "username": "@RCBTweets",
      "content": "Krunal Pandya ได้รับรางวัล ChatGPT Match IQ Award อีกครั้ง จากการโบว์ลลาว 4 โอเวอร์ ได้ 1 วิคเก็ต เสียแค่ 26 รัน",
      "url": "https://x.com/RCBTweets/status/...",
      "tweet_id": "1911399533818614267",
      "tweet_profile_pic": "https://pbs.twimg.com/profile_images/...",
      "created_at": "Sun Apr 13 16:40:18 +0000 2025",
      "has_video": true,
      "view_count": 7000,
      "like_count": 564,
      "retweet_count": 42,
      "reply_count": 6
    }
  ],
  "evidence_pack": {
    "key_claims": [
      {
        "claim": "ญี่ปุ่นก่อตั้ง Japan AI Foundation Model Development",
        "supporting_sources": ["https://x.com/..."],
        "confidence": 0.95
      }
    ],
    "conflicting_claims": [],
    "gaps": ["ยังไม่มีข้อมูลเรื่องงบประมาณ"]
  },
  "fact_sheet": {
    "verified_facts": ["SoftBank, NEC, Honda, Sony ร่วมก่อตั้ง Japan AI Foundation"],
    "reported_claims": ["Terence Tao เสนอมุมมองใหม่เรื่อง intelligence"],
    "named_entities": ["SoftBank", "Terence Tao", "Honda", "Sony", "NEC"],
    "source_count": 10
  },
  "search_plan": {
    "keywords": ["AI", "ปัญญาประดิษฐ์", "artificial intelligence"],
    "query_variants": ["AI news 2026", "ปัญญาประดิษฐ์ ล่าสุด", "AI development"],
    "search_mode": "latest",
    "time_window_hours": 48
  },
  "timings": {
    "intent": 1.23,
    "planner": 1.45,
    "retrieval": 2.10,
    "normalize": 0.01,
    "rank": 0.01,
    "evidence": 2.30,
    "fact_sheet": 1.80,
    "summary": 2.50,
    "writer": 3.20,
    "verifier": 0.01
  }
}
```

---

## 2. POST `/contents/search-and-save`

ค้นหาคอนเทนต์ + **บันทึกลง DB** (`news_items` table) — ใช้เมื่อ user กด "สร้างคอนเทนต์"

**Rate Limit:** 10 requests/minute

### Request Body

เหมือน `/contents/search` ทุกประการ

### Response

เหมือน `/contents/search` ทุกประการ — แต่ผลลัพธ์จะถูก save ลง `news_items` ด้วย `trigger_news=2`

---

## Response Types Reference

### `ContentSearchResponse`

| Field | Type | Description |
|---|---|---|
| `success` | `bool` | สำเร็จหรือไม่ |
| `query` | `string` | query เดิมที่ส่งมา |
| `intent` | `string` | intent ที่ AI ตรวจจับได้ (ดูตาราง intent) |
| `total_results` | `int` | จำนวนผลลัพธ์ทั้งหมด |
| `summary` | `ContentSearchSummary \| null` | FORO SUMMARY section (ด้านบนของหน้า) |
| `results` | `ContentResultItem[]` | ผลลัพธ์แต่ละ card |
| `evidence_pack` | `EvidencePack \| null` | หลักฐานและข้อขัดแย้ง |
| `fact_sheet` | `FactSheet \| null` | สรุปข้อเท็จจริง |
| `search_plan` | `object \| null` | แผนการค้นหาที่ AI สร้าง (debug) |
| `timings` | `object \| null` | เวลาที่ใช้แต่ละ step (debug) |

### `ContentSearchSummary` (กล่อง FORO SUMMARY)

| Field | Type | Description |
|---|---|---|
| `title` | `string` | หัวข้อหลัก เช่น `"พัฒนาการสำคัญด้านปัญญาประดิษฐ์..."` |
| `subtitle` | `string` | เช่น `"EDITORIAL DIGEST FROM 10 KEY SIGNALS"` |
| `date_range` | `string` | เช่น `"สรุปจากข้อมูลช่วง 12 เม.ย. 2569 - 13 เม.ย. 2569"` |
| `main_summary` | `string` | สรุป 1 ประโยค |
| `bullet_points` | `string[]` | จุดสำคัญ 3-5 ข้อ (มี ref code `F1`, `F2` กำกับ) |
| `foro_note` | `string \| null` | หมายเหตุจาก FORO |
| `confidence_score` | `float \| null` | `0.0` - `1.0` ความมั่นใจ |

### `ContentResultItem` (แต่ละ card)

| Field | Type | Description |
|---|---|---|
| `id` | `int \| null` | DB id (มีเมื่อ save แล้ว) |
| `ref_code` | `string` | `"F1"`, `"F2"`, ... ใช้อ้างอิงกับ bullet_points |
| `title` | `string` | ชื่อ author/account |
| `username` | `string` | `"@username"` |
| `content` | `string` | สรุปจาก LLM (ภาษาไทย) |
| `url` | `string \| null` | ลิงก์ต้นทาง |
| `tweet_id` | `string \| null` | ID ของ tweet |
| `tweet_profile_pic` | `string \| null` | URL รูป profile |
| `created_at` | `string \| null` | เวลาที่โพสต์ |
| `has_video` | `bool` | มีวิดีโอหรือไม่ |
| `view_count` | `int` | จำนวนวิว |
| `like_count` | `int` | จำนวนถูกใจ |
| `retweet_count` | `int` | จำนวน retweet |
| `reply_count` | `int` | จำนวน reply |

### `EvidencePack`

| Field | Type | Description |
|---|---|---|
| `key_claims` | `EvidenceClaim[]` | ประเด็นสำคัญ + แหล่งอ้างอิง |
| `conflicting_claims` | `string[]` | ข้อขัดแย้งระหว่างแหล่ง |
| `gaps` | `string[]` | สิ่งที่ยังไม่ชัดเจน/ข้อมูลขาด |

### `EvidenceClaim`

| Field | Type | Description |
|---|---|---|
| `claim` | `string` | ประเด็น |
| `supporting_sources` | `string[]` | URLs/refs ที่สนับสนุน |
| `confidence` | `float` | `0.0` - `1.0` |

### `FactSheet`

| Field | Type | Description |
|---|---|---|
| `verified_facts` | `string[]` | ข้อเท็จจริงที่ยืนยันได้ |
| `reported_claims` | `string[]` | ข้อกล่าวอ้าง (ยังไม่ยืนยัน) |
| `named_entities` | `string[]` | ชื่อคน, องค์กร, สถานที่ (อังกฤษ) |
| `source_count` | `int` | จำนวนแหล่งที่ใช้ |

---

## Intent Types

| Intent | Description | ตัวอย่าง query |
|---|---|---|
| `news` | ข่าวสาร/เหตุการณ์ล่าสุด | "สงครามยูเครน", "OpenAI ล่าสุด" |
| `broad_discovery` | สำรวจทั่วไป | "AI", "crypto" |
| `trending` | สิ่งที่กำลังมาแรง | "trending tech", "กำลังฮิต" |
| `person_expert` | หาคน/ผู้เชี่ยวชาญ | "Elon Musk", "นักวิจัย AI ไทย" |
| `local_thai` | บริบทไทย/อาเซียน | "เศรษฐกิจไทย", "สตาร์ทอัพไทย" |
| `comparison_opinion` | เปรียบเทียบ/ความเห็น | "GPT vs Claude", "iPhone ดีไหม" |
| `research` | วิจัย/เจาะลึก | "quantum computing research", "วิจัย AI" |

---

## Frontend UI Mapping

### กล่อง FORO SUMMARY (ด้านบน)

```
┌─────────────────────────────────────────────┐
│  📋 FORO SUMMARY                            │
│  {summary.subtitle}                         │
│  {summary.date_range}                       │
│                                             │
│  {summary.main_summary}                     │
│                                             │
│  • {summary.bullet_points[0]}               │
│  • {summary.bullet_points[1]}               │
│  • {summary.bullet_points[2]}               │
│                                             │
│  ✓ {summary.foro_note}                      │
│  ✨ อัตราความแม่นยำ (Confidence) {score}%    │
└─────────────────────────────────────────────┘
```

- `confidence_score` → แสดงเป็น % (`0.92` → `92%`)
- `bullet_points` แต่ละข้อจะมี ref code เช่น `F8`, `F2` → link ไปยัง card ที่ตรงกัน

### Result Cards

```
┌──────────────────────────────┐
│  {ref_code}  {title}         │  ⊞ VIDEO  {relative_time}
│  {username}                  │
│                              │
│  {content}                   │
│                              │
│  👁 {view_count}  ♥ {like_count}  🔄 {retweet_count}  💬 {reply_count}
│                              │  📝 สร้างคอนเทนต์
└──────────────────────────────┘
```

- `has_video` → แสดง badge `VIDEO`
- `created_at` → แปลงเป็น relative time (`1h`, `3h`, `1d`)
- `tweet_profile_pic` → รูป avatar
- `ref_code` → match กับ bullet_points ใน summary

### Tab Filter

- **ทั้งหมด** → `include_video_only: false`
- **วิดีโอ** → `include_video_only: true`

### ปุ่ม "ล้างผลลัพธ์"

Reset state → clear results

### ปุ่ม ⚡ (Quick Search)

ส่ง query เดิมด้วย `max_results: 5` สำหรับผลลัพธ์เร็ว

---

## Example Usage (Fetch)

```typescript
const response = await fetch(`${API_BASE}/contents/search`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    query: 'AI ปัญญาประดิษฐ์',
    max_results: 15,
    include_video_only: false,
  }),
});

const data: ContentSearchResponse = await response.json();

// แสดง FORO SUMMARY
if (data.summary) {
  renderSummaryBox(data.summary);
}

// แสดง result cards
data.results.forEach((item) => {
  renderResultCard(item);
});

// แสดง confidence badge
if (data.summary?.confidence_score) {
  renderConfidenceBadge(data.summary.confidence_score * 100);
}
```

---

## TypeScript Types

```typescript
interface ContentSearchRequest {
  query: string;
  max_results?: number;   // default 15
  include_video_only?: boolean; // default false
}

interface ContentSearchSummary {
  title: string;
  subtitle: string;
  date_range: string;
  main_summary: string;
  bullet_points: string[];
  foro_note: string | null;
  confidence_score: number | null;
}

interface ContentResultItem {
  id: number | null;
  ref_code: string;       // "F1", "F2", ...
  title: string;
  username: string;       // "@username"
  content: string;
  url: string | null;
  tweet_id: string | null;
  tweet_profile_pic: string | null;
  created_at: string | null;
  has_video: boolean;
  view_count: number;
  like_count: number;
  retweet_count: number;
  reply_count: number;
}

interface EvidenceClaim {
  claim: string;
  supporting_sources: string[];
  confidence: number;
}

interface EvidencePack {
  key_claims: EvidenceClaim[];
  conflicting_claims: string[];
  gaps: string[];
}

interface FactSheet {
  verified_facts: string[];
  reported_claims: string[];
  named_entities: string[];
  source_count: number;
}

interface ContentSearchResponse {
  success: boolean;
  query: string;
  intent: string;
  total_results: number;
  summary: ContentSearchSummary | null;
  results: ContentResultItem[];
  evidence_pack: EvidencePack | null;
  fact_sheet: FactSheet | null;
  search_plan: Record<string, any> | null;
  timings: Record<string, number> | null;
}
```

---

## Error Responses

| Status | Description |
|---|---|
| `401` | ไม่ได้ login / token หมดอายุ |
| `429` | Rate limit exceeded (15/min search, 10/min save) |
| `500` | Server error / LLM timeout |

```json
{
  "detail": "Content search error: ..."
}
```

---

## Notes

- **Performance:** ค้นหาใช้เวลาประมาณ 10-20 วินาที (LLM processing หลาย layers) — แนะนำให้แสดง loading state
- **Ref Codes:** `F1`-`F{n}` ใน `bullet_points` ตรงกับ `ref_code` ของ `results` → สร้าง anchor link ได้
- **trigger_news=2:** เมื่อใช้ `/search-and-save` ข้อมูลจะ save ลง `news_items` ด้วย `trigger_news=2` เพื่อแยกจากข่าวปกติ (`0`) และ stream (`1`)
- **Tavily:** ถ้า backend มี `TAVILY_API_KEY` จะดึงข้อมูลจากเว็บด้วย ไม่ส่งผลต่อ request format
