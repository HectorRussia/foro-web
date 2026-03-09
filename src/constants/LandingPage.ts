export const newsBatches = [
    [
        { id: 1, source: "NASA", handle: "@NASA", category: "Science", icon: "🚀", color: "bg-red-500", text: "ยานอวกาศส่งภาพดาวเคราะห์นอกระบบสุริยะใหม่ มีความเป็นไปได้ว่าจะมีน้ำ", likes: "350K", time: "4 ชม. ที่แล้ว" },
        { id: 2, source: "National Geographic", handle: "@NatGeo", category: "Science", icon: "🐘", color: "bg-yellow-500", text: "ค้นพบสิ่งมีชีวิตใหม่ในป่าแอมะซอน น่าจะเป็นยาสมุนไพรรักษาโรคร้ายได้", likes: "210K", time: "7 ชม. ที่แล้ว" },
        { id: 3, source: "Spotify", handle: "@Spotify", category: "Music", icon: "🎵", color: "bg-green-500", text: "เปิดตัว AI DJ ที่เลือกเพลงให้คุณตามอารมณ์และเวลาของวัน", likes: "180K", time: "2 ชม. ที่แล้ว" }
    ],
    [
        { id: 4, source: "Nike", handle: "@Nike", category: "Sports", icon: "👟", color: "bg-orange-500", text: "เปิดตัวรองเท้าวิ่งใหม่ที่เบาที่สุดในโลก นักกีฬาโอลิมปิกใช้แล้ว", likes: "280K", time: "5 ชม. ที่แล้ว" },
        { id: 5, source: "SpaceX", handle: "@SpaceX", category: "Tech", icon: "🛰️", color: "bg-blue-400", text: "Starship ทดสอบบินสำเร็จ บูสเตอร์ดีดตัวแม่นยำ ก้าวสำคัญสู่ดาวอังคาร", likes: "520K", time: "1 ชม. ที่แล้ว" },
        { id: 6, source: "Apple", handle: "@Apple", category: "Tech", icon: "🍎", color: "bg-gray-400", text: "Vision Pro รุ่นใหม่คาดว่าจะเปิดตัวเร็วๆ นี้ ในราคาที่ถูกกว่าเดิม", likes: "410K", time: "8 ชม. ที่แล้ว" }
    ]
];

export const categories = [
    { id: 'tech', label: 'เทคโนโลยี', icon: '⚙️', color: 'blue' },
    { id: 'marketing', label: 'การตลาด', icon: '🎯', color: 'orange' },
    { id: 'business', label: 'ธุรกิจ', icon: '🏢', color: 'teal' },
    { id: 'ai', label: 'AI', icon: '🪄', color: 'purple' },
    { id: 'finance', label: 'การเงิน', icon: '💰', color: 'emerald' },
    { id: 'lifestyle', label: 'ไลฟ์สไตล์', icon: '❤️', color: 'rose' },
    { id: 'health', label: 'สุขภาพ', icon: '🩺', color: 'cyan' },
    { id: 'investment', label: 'การลงทุน', icon: '📈', color: 'amber' },
    { id: 'crypto', label: 'คริปโต', icon: '📉', color: 'indigo' },
];

export const categoryNews: Record<string, any[]> = {
    tech: [
        { id: 't1', source: "SpaceX", handle: "@SpaceX", text: "Starship ทดสอบบินได้สำเร็จ ก้าวสำคัญสู่ดาวอังคาร", time: "2 ชม. ที่แล้ว", color: "bg-blue-500", icon: "S" },
        { id: 't2', source: "Elon Musk", handle: "@elonmusk", text: "Tesla Bot พัฒนาความสามารถใหม่ สามารถชงกาแฟได้อัตโนมัติ", time: "5 ชม. ที่แล้ว", color: "bg-blue-400", icon: "EM" },
        { id: 't3', source: "Apple", handle: "@Apple", text: "เปิดตัว Vision Pro 2 ที่บางและเบากว่าเดิม", time: "8 ชม. ที่แล้ว", color: "bg-gray-500", icon: "A" },
    ],
    marketing: [
        { id: 'm1', source: "Neil Patel", handle: "@neilpatel", text: "Intragram ผลักดันการช้อปปิ้งออนไลน์มากขึ้นในปี 2026", time: "3 ชม. ที่แล้ว", color: "bg-blue-600", icon: "NP" },
        { id: 'm2', source: "Gary Vee", handle: "@garyvee", text: "การตลาดแบบ Authenticity คือกุญแจสำคัญ", time: "6 ชม. ที่แล้ว", color: "bg-purple-600", icon: "GV" },
        { id: 'm3', source: "Marketing Land", handle: "@MarketingLand", text: "TikTok Shopping เติบโต 400%", time: "1 วันที่แล้ว", color: "bg-green-600", icon: "ML" },
    ],
    business: [
        { id: 'b1', source: "Forbes", handle: "@Forbes", text: "10 ธุรกิจดาวรุ่งที่น่าจับตามองที่สุดในปีนี้", time: "1 ชม. ที่แล้ว", color: "bg-emerald-600", icon: "F" },
        { id: 'b2', source: "Business Insider", handle: "@BusinessInsider", text: "Work from Anywhere กลายเป็นมาตรฐานใหม่ของบริษัทระดับโลก", time: "4 ชม. ที่แล้ว", color: "bg-slate-700", icon: "BI" },
        { id: 'b3', source: "Bloomberg", handle: "@Bloomberg", text: "เศรษฐกิจโลกเริ่มส่งสัญญาณฟื้นตัวอย่างต่อเนื่อง", time: "7 ชม. ที่แล้ว", color: "bg-black", icon: "B" },
    ],
    ai: [
        { id: 'ai1', source: "OpenAI", handle: "@OpenAI", text: "เปิดตัวโมเดลใหม่ที่ฉลาดขึ้นและประมวลผลได้เร็วขึ้น 10 เท่า", time: "30 นาทีที่แล้ว", color: "bg-teal-600", icon: "AI" },
        { id: 'ai2', source: "Google AI", handle: "@GoogleAI", text: "AI รุ่นล่าสุดสามารถช่วยวินิจฉัยโรคได้อย่างแม่นยำสูง", time: "3 ชม. ที่แล้ว", color: "bg-blue-500", icon: "G" },
        { id: 'ai3', source: "MIT Tech Review", handle: "@techreview", text: "อนาคตของ AI ในด้านการศึกษาจะเปลี่ยนโฉมการเรียนรู้", time: "5 ชม. ที่แล้ว", color: "bg-red-700", icon: "MIT" },
    ],
    finance: [
        { id: 'f1', source: "Wall Street Journal", handle: "@WSJ", text: "ธนาคารกลางเตรียมปรับอัตราดอกเบี้ยเพื่อควบคุมอัตราเงินเฟ้อ", time: "2 ชม. ที่แล้ว", color: "bg-zinc-800", icon: "WSJ" },
        { id: 'f2', source: "CNBC", handle: "@CNBC", text: "ตลาดหุ้นเอเชียพุ่งขานรับข่าวดีด้านการส่งออก", time: "4 ชม. ที่แล้ว", color: "bg-blue-800", icon: "CNBC" },
        { id: 'f3', source: "Yahoo Finance", handle: "@YahooFinance", text: "หุ้นเทคโนโลยีเริ่มกลับมาเป็นที่นิยมของนักลงทุนอีกครั้ง", time: "6 ชม. ที่แล้ว", color: "bg-purple-800", icon: "YF" },
    ],
    lifestyle: [
        { id: 'l1', source: "Vogue", handle: "@voguemagazine", text: "เทรนด์แฟชั่นปีนี้เน้นความยั่งยืนและรักษ์โลก", time: "2 ชม. ที่แล้ว", color: "bg-black", icon: "V" },
        { id: 'l2', source: "Travel + Leisure", handle: "@TravelLeisure", text: "5 สถานที่ท่องเที่ยวลับๆ ที่คุณต้องไปให้ได้สักครั้ง", time: "5 ชม. ที่แล้ว", color: "bg-sky-500", icon: "TL" },
        { id: 'l3', source: "Food Network", handle: "@FoodNetwork", text: "สูตรลับการทำอาหารเฮลตี้แต่รสชาติระดัับเชฟ", time: "1 วันที่แล้ว", color: "bg-amber-600", icon: "FN" },
    ],
    health: [
        { id: 'h1', source: "Healthline", handle: "@healthline", text: "การนอนที่มีคุณภาพส่งผลต่อสมองมากกว่าที่คิด", time: "3 ชม. ที่แล้ว", color: "bg-cyan-600", icon: "H" },
        { id: 'h2', source: "WebMD", handle: "@WebMD", text: "อาหารเช้าที่ช่วยเพิ่มพลังงานให้คุณได้ตลอดทั้งวัน", time: "8 ชม. ที่แล้ว", color: "bg-indigo-700", icon: "W" },
        { id: 'h3', source: "Mayo Clinic", handle: "@MayoClinic", text: "นวัตกรรมการรักษาใหม่ช่วยยืดอายุขัยของผู้ป่วยเรื้อรัง", time: "1 วันที่แล้ว", color: "bg-sky-700", icon: "MC" },
    ],
    investment: [
        { id: 'i1', source: "Investopedia", handle: "@Investopedia", text: "เทคนิคการกระจายความเสี่ยงสำหรับนักลงทุนมือใหม่", time: "1 ชม. ที่แล้ว", color: "bg-green-700", icon: "IP" },
        { id: 'i2', source: "The Economist", handle: "@TheEconomist", text: "วิกฤตพลังงานส่งผลกระทบต่อตลาดการเงินทั่วโลกอย่างไร", time: "4 ชม. ที่แล้ว", color: "bg-red-600", icon: "TE" },
        { id: 'i3', source: "Financial Times", handle: "@FT", text: "นักลงทุนเริ่มหันมาสนใจสินทรัพย์ทางเลือกมากขึ้น", time: "7 ชม. ที่แล้ว", color: "bg-rose-100", icon: "FT" },
    ],
    crypto: [
        { id: 'c1', source: "CoinDesk", handle: "@CoinDesk", text: "Bitcoin พุ่งทะลุแนวต้านสำคัญ นักวิเคราะห์คาดไปต่อ", time: "30 นาทีที่แล้ว", color: "bg-orange-500", icon: "CD" },
        { id: 'c2', source: "Cointelegraph", handle: "@Cointelegraph", text: "Ethereum อัปเกรดใหม่ช่วยลดค่าแก๊สลงอย่างมหาศาล", time: "2 ชม. ที่แล้ว", color: "bg-gray-400", icon: "CT" },
        { id: 'c3', source: "Binance", handle: "@binance", text: "เปิดตัวเหรียญใหม่ที่เน้นการใช้งานในโลก Metaverse", time: "5 ชม. ที่แล้ว", color: "bg-yellow-500", icon: "BN" },
    ]
};

export const filterCategories = [
    { id: 'top', label: 'Top Posts วันนี้', icon: '🔥', color: 'orange' },
    { id: 'content', label: 'น่าไปทำคอนเทนต์', icon: '🎬', color: 'purple' },
    { id: 'economy', label: 'ส่งผลต่อเศรษฐกิจ', icon: '📈', color: 'cyan' },
    { id: 'viral', label: 'กำลังไวรัล', icon: '⚡', color: 'rose' },
];

export const filterResults: Record<string, any> = {
    top: {
        query: "ขอโพสต์ที่ได้รับความนิยมสูงสุดวันนี้",
        found: "เจอแล้ว 3 โพสต์:",
        items: [
            { id: 'f1', source: "SpaceX", handle: "@SpaceX", text: "Starship บินสำเร็จ - ทะลุ 500K likes", likes: "520K likes", color: "bg-blue-500", icon: "S" },
            { id: 'f2', source: "OpenAI", handle: "@OpenAI", text: "GPT-5 ประกาศอย่างเป็นทางการ", likes: "380K likes", color: "bg-emerald-600", icon: "O" },
            { id: 'f3', source: "Bitcoin", handle: "@Bitcoin", text: "BTC ทะลุ $100K ครั้งแรก", likes: "290K likes", color: "bg-orange-500", icon: "B" },
        ]
    },
    content: {
        query: "หาโพสต์ที่น่าเอาไปทำคอนเทนต์ต่อ",
        found: "ไอเดียทำคอนเทนต์ 3 เรื่อง:",
        items: [
            { id: 'c1', source: "MrBeast", handle: "@MrBeast", text: "เบื้องหลังการทำคลิปที่ใช้งบเยอะที่สุด", likes: "1.2M likes", color: "bg-blue-400", icon: "MB" },
            { id: 'c2', source: "MKBHD", handle: "@MKBHD", text: "รีวิว Gadget สุดล้ำที่ไม่มีใครเคยเห็น", likes: "150K likes", color: "bg-red-600", icon: "M" },
            { id: 'c3', source: "CaseyNeistat", handle: "@Casey", text: "วิธีเล่าเรื่องให้น่าสนใจใน 60 วินาที", likes: "85K likes", color: "bg-zinc-800", icon: "CN" },
        ]
    },
    economy: {
        query: "ขอโพสต์ที่ส่งผลต่อเศรษฐกิจ",
        found: "เจอแล้ว 3 โพสต์:",
        items: [
            { id: 'e1', source: "Financial Times", handle: "@FT", text: "Fed ประกาศดอกเบี้ยคงที่ - ผลกระทบตลาดโลก", likes: "ผลกระทบตลาดโลก", color: "bg-rose-800", icon: "FT" },
            { id: 'e2', source: "Bloomberg", handle: "@business", text: "ภาพรวมเศรษฐกิจโลก Q1 - ข้อมูลสำคัญนักลงทุน", likes: "ข้อมูลสำคัญนักลงทุน", color: "bg-black", icon: "B" },
            { id: 'e3', source: "Reuters", handle: "@Reuters", text: "คาดการณ์ GDP ปีหน้า - วิเคราะห์เชิงลึก", likes: "วิเคราะห์เชิงลึก", color: "bg-orange-600", icon: "R" },
        ]
    },
    viral: {
        query: "ขอโพสต์ที่กำลังไวรัลตอนนี้",
        found: "เจอแล้ว 3 โพสต์:",
        items: [
            { id: 'v1', source: "Elon Musk", handle: "@elonmusk", text: "โพสต์ลึกลับ - ทวีตเดียวล้านไลค์", likes: "1.2M likes", color: "bg-blue-500", icon: "EM" },
            { id: 'v2', source: "MrBeast", handle: "@MrBeast", text: "ชาเลนจ์ใหม่กำลังมาแรง", likes: "800K likes", color: "bg-green-600", icon: "MB" },
            { id: 'v3', source: "Taylor Swift", handle: "@taylorswift13", text: "ประกาศทัวร์ใหม่", likes: "650K likes", color: "bg-orange-700", icon: "TS" },
        ]
    }
};

export const newsData = [
    {
        id: 1,
        name: "SpaceX",
        handle: "@SpaceX",
        time: "2h",
        icon: "S",
        color: "bg-blue-500",
        engText: "Starship successfully completed its test flight today! The booster caught by the tower arms — a major step toward making humanity multi-planetary.",
        thaiText: "SpaceX ทดสอบ Starship สำเร็จ บูสเตอร์ติดเครนจับ ก้าวสำคัญสู่ดาวอังคาร"
    },
    {
        id: 2,
        name: "OpenAI",
        handle: "@OpenAI",
        time: "5h",
        icon: "O",
        color: "bg-emerald-600",
        engText: "Announcing GPT-5 — our most capable model yet. Significant improvements in reasoning, coding, and following complex instructions.",
        thaiText: "OpenAI เปิดตัว GPT-5 พัฒนาการใช้เหตุผลและเขียนโค้ดที่ดีขึ้นมาก"
    },
    {
        id: 3,
        name: "Bitcoin",
        handle: "@Bitcoin",
        time: "8h",
        icon: "B",
        color: "bg-orange-500",
        engText: "$BTC breaks $100,000 for the first time in history. Institutional adoption continues to accelerate with new ETF approvals.",
        thaiText: "Bitcoin ทะลุ $100,000 ครั้งแรก สถาบันการเงินหลั่งไหลผ่าน ETF"
    }
];