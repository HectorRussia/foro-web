export const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Foro AI News Summary",
    "operatingSystem": "Web",
    "applicationCategory": "ProductivityApplication",
    "description": "Foro คือเครื่องมือ AI ที่ช่วยสรุปข่าวสารจาก X (Twitter) อย่างอัจฉริยะ ให้คุณอ่านง่าย ได้ประเด็น ไม่พลาดทุกเรื่องราวที่สำคัญ",
    "keywords": "FORO AI สรุปข่าว,แอป AI สรุปข่าว, AI สรุปข่าว, เว็บ AI สรุปข่าว, AI สร้างคอนเทนต์, เว็บเอไอสรุปข่าว, เอไอสรุปข่าว, เอไอสร้างคอนเทนต์, สรุปข่าวทวิตเตอร์",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "THB"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1250"
    }
};

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Foro AI",
    "url": window.location.origin,
    "logo": `${window.location.origin}/images/LOGO-FORO/FORO_TP_W.png`,
    "sameAs": [
        "https://x.com/foro_ai"
    ]
};