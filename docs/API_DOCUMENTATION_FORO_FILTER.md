# FORO Filter Backend Notes

## Purpose
หน้า Home ใช้ `POST /news/filter` เพื่อคัดข่าวจากการ์ดที่แสดงอยู่ตาม prompt ของผู้ใช้ โดยการล้างฟิลเตอร์เป็น frontend state เท่านั้น ไม่ควรล้างข่าวหรือเปลี่ยน trigger ของ feed

## Endpoint
- Method: `POST`
- Path: `/news/filter`
- Auth: Bearer token เหมือน news endpoints อื่น

## Request Shape
```json
{
  "prompt": "สรุปข่าวที่น่าเอาไปเล่าต่อ",
  "news_items": [
    {
      "id": 123,
      "title": "News title",
      "content": "summary or content",
      "source": "CNBC",
      "url": "https://example.com/news",
      "tweet_id": "1234567890",
      "source_item_id": "rss-item-id",
      "created_at": "2026-05-11T10:00:00Z",
      "metrics": {
        "retweet_count": 0,
        "reply_count": 0,
        "like_count": 0,
        "quote_count": 0,
        "view_count": 0
      }
    }
  ]
}
```

## Response Shape
```json
{
  "status": "success",
  "message": "กรองข่าวสำเร็จ พบข่าวที่เกี่ยวข้อง 3 รายการจาก 8 รายการ",
  "prompt": "สรุปข่าวที่น่าเอาไปเล่าต่อ",
  "total_news_input": 8,
  "filtered_news_count": 3,
  "filtered_news": [
    {
      "id": 123,
      "title": "News title",
      "content": "summary or content",
      "source": "CNBC",
      "tweet_id": "1234567890",
      "source_item_id": "rss-item-id",
      "url": "https://example.com/news",
      "citation_id": "[F1]",
      "created_at": "2026-05-11T10:00:00Z",
      "metrics": {
        "retweet_count": 0,
        "reply_count": 0,
        "like_count": 0,
        "quote_count": 0,
        "view_count": 0
      }
    }
  ],
  "summary": {
    "outputLabel": "สรุปภาพรวม",
    "dateLabel": "ข้อมูล ณ วันที่ 11 พ.ค. 2569",
    "title": "ภาพรวมโพสต์ที่ถูกคัดตามโจทย์",
    "headline": "ภาพรวมโพสต์ที่ถูกคัดตามโจทย์",
    "subtitle": "ช่วยเห็นประเด็นหลักจากข่าวชุดนี้",
    "bullet_points": [
      "ประเด็นสำคัญจากข่าวแรก [F1]",
      "อีกประเด็นที่ควรดูต่อ [F2][F3]"
    ],
    "foro_note": "สรุปโดย FORO จากรายการที่คัดแล้ว"
  }
}
```

## Backend Requirements
- `filtered_news` ต้องส่ง stable identifier กลับมาอย่างน้อยหนึ่งค่าใน `id`, `tweet_id`, `source_item_id`, หรือ `url` เพื่อให้ frontend match การ์ดเดิมได้ทั้ง X และ RSS
- เรียง `filtered_news` ตามลำดับอ้างอิงที่ต้องการให้แสดงบน UI และส่ง `citation_id` เป็น `[F1]`, `[F2]`, `[F3]` มาด้วยทุก item
- Frontend มี fallback สำหรับ legacy response ที่ไม่มี `citation_id` แต่ contract backend ปัจจุบันต้องส่ง `citation_id` กลับมาแล้ว
- ถ้าไม่พบข่าวที่ตรงเงื่อนไข ให้ส่ง `filtered_news: []` ได้ แต่ห้ามลบข่าวใน DB
- Endpoint นี้ไม่ควรเรียกหรือ mutate `/news/trigger`; `trigger=0` ใช้เฉพาะ flow ล้างข่าวทั้งหมดเท่านั้น
- `summary` เป็น structured object ตามตัวอย่าง เพื่อให้ UI แสดงหัวข้อ, pill, bullet และปุ่ม copy ได้ครบ
- `summary.bullet_points` ควรเป็น 4-6 bullet ภาษาไทย และทุก bullet ที่กล่าวถึงข่าวต้องลงท้าย citation เช่น `[F1]`, `[F2][F3]`; frontend จะตัด citation ออกจากข้อความแล้วแสดงเป็น badge ขวามือ
- `summary.title` หรือ `summary.headline` ไม่ควรใส่ citation เพื่อให้หัวข้ออ่านสะอาดเหมือน prototype
