import React from "react";
import {
    LuCopy,
    LuExternalLink,
    LuBookmark,
    LuCirclePlay,
    LuSearch,
    LuSparkles,
    LuX,
    LuFileText
} from "react-icons/lu";
import { FiBarChart } from "react-icons/fi";


const filters = [
    { label: "ทั้งหมด", active: true },
    { label: "วิดีโอ", active: false },
];


type Bullet = {
    text: string;
    tag: string;
};

type FeedCard = {
    id: string;
    name: string;
    handle: string;
    badge: string;
    age: string;
    avatar: string;
    image: string;
    title: string;
    stats: { views: string; comments: string; likes: string; shares: string };
};

const summaryBullets: Bullet[] = [
    {
        text: "CEO OpenAI Sam Altman เตือนว่า AI อาจถูกใช้ในการออกแบบเชื้อโรคระบาดครั้งต่อไป",
        tag: "F3",
    },
    {
        text: "Sam Altman ได้รับการจัดอันดับ Forbes250 จากผลงาน ChatGPT ที่สร้างบริษัทมูลค่า 500 พันล้านดอลลาร์",
        tag: "F4",
    },
    {
        text: "Take-Two Interactive เลิกจ้างหัวหน้าแผนก AI และพนักงานที่ทำงานด้าน AI",
        tag: "F10",
    },
    {
        text: "รัฐบาลประเทศ ลงนาม MoU 25,000 ล้านรูปี กับ Puch AI เพื่อสร้าง AI Parks, Data Center, และ AI University",
        tag: "F8",
    },
];

const feedCards: FeedCard[] = [
    {
        id: "F1",
        name: "Nicolas Hulscher, MPH",
        handle: "@NicHulscher",
        badge: "VIDEO",
        age: "2d",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
        title:
            "ระบบ artificial intelligence หลักกำหนดอย่าง SuperGrok, ChatGPT-5 และ Google Gemini สรุปว่าจิตวิญญาณ autism หลังวิเคราะห์งานวิจัย 82 ชิ้นทำให้มีจุดมุ่งเปลี่ยนมองเรา การโดนโหด 30 ปีว่าออทิสซึ่มไม่ได้มี autism สิ้นสุดลงแล้ว",
        stats: { views: "1M", comments: "37K", likes: "15K", shares: "663" },
    },
    {
        id: "F2",
        name: "Shruti Codes",
        handle: "@Shruti_0810",
        badge: "",
        age: "7d",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
        title:
            "แจกคอร์สเรียนแบบเสียเงินฟรีสำหรับ 4500 คนแรก รวม Artificial Intelligence, Machine Learning, Prompt Engineering, Claude, ChatGPT, Grok, Data Analytics, AWS Certified, Data Science, BIG DATA, Python และ Ethical Hacking ภายใน 72 ชั่วโมง โดยต้อง follow เพื่อ DM, like + RT และ reply 'All'",
        stats: { views: "345K", comments: "3K", likes: "1K", shares: "2K" },
    },
    {
        id: "F3",
        name: "The General",
        handle: "@GeneralMCNews",
        badge: "",
        age: "5d",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
        title:
            "Sam Altman CEO ของ OpenAI ระบุว่า artificial intelligence อาจถูกใช้ในการออกแบบเพาะเชื้อที่ก่อให้เกิดการระบาดครั้งต่อไป",
        stats: { views: "12K", comments: "283", likes: "107", shares: "124" },
    },
    {
        id: "F4",
        name: "Forbes",
        handle: "@Forbes",
        badge: "",
        age: "9d",
        avatar: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
        title:
            "Sam Altman ในฐานะ CEO ของ OpenAI ได้เปิดตัว ChatGPT ทำให้ artificial intelligence เป็นกระแสหลักและสร้างบริษัทมูลค่า 500 พันล้านดอลลาร์ แต่ผลงานนั้นก็มีด้านมืดที่ทำให้เขาได้อันดับ Forbes250 รายชื่อบุคคลที่น่าจับของนรกที่มีชีวิต",
        stats: { views: "30K", comments: "337", likes: "57", shares: "101" },
    },
];

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
            {children}
        </span>
    );
}

function FeedCardItem({ card }: { card: FeedCard }) {
    return (
        <article className="group flex h-full flex-col rounded-[24px] border border-white/10 bg-[#1a1a1a] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.32)] transition hover:border-white/15 hover:bg-[#1c1c1c]">
            {/* header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <img
                        src={card.avatar}
                        alt={card.name}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                    />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-extrabold text-white">{card.name}</span>
                            <Badge>{card.id}</Badge>
                        </div>
                        <div className="text-xs text-slate-400">{card.handle}</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    {card.badge ? (
                        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-blue-200">
                            {card.badge}
                        </span>
                    ) : null}
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300">
                        {card.age}
                    </span>
                    <button className="grid h-6 w-6 place-items-center rounded-full hover:bg-white/5">
                        <LuBookmark className="h-3.5 w-3.5" />
                    </button>
                    <button className="grid h-6 w-6 place-items-center rounded-full hover:bg-white/5">
                        <LuExternalLink className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* body */}
            <div className="mt-4 flex gap-4">
                <div className="relative shrink-0">
                    <img
                        src={card.image}
                        alt=""
                        className="h-24 w-24 rounded-[14px] object-cover ring-1 ring-white/10 sm:h-28 sm:w-28"
                    />
                    <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                        <span className="inline-flex items-center gap-1">
                            <LuCirclePlay className="h-3 w-3" />
                            9:36
                        </span>
                        <span className="text-slate-300">4K</span>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="line-clamp-4 text-sm font-semibold leading-6 text-slate-100 sm:text-[15px]">
                        {card.title}
                    </p>
                </div>
            </div>

            {/* footer */}
            <div className="mt-auto pt-4">
                <div className="flex items-center justify-between border-t border-white/8 pt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="inline-flex items-center gap-1">
                            <FiBarChart className="h-3.5 w-3.5" />
                            {card.stats.views}
                        </span>
                        <span>◎ {card.stats.comments}</span>
                        <span>❤ {card.stats.likes}</span>
                        <span>↻ {card.stats.shares}</span>
                    </div>

                    <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:bg-white/10">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        สร้างคอนเทนต์
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function BottomCardsSection() {
    return (
        <>
            {/* Hero Section */}
            <section className="mx-auto max-w-4xl px-2 pb-10 pt-10 text-center sm:pt-14">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
                    ค้นหาคอนเทนต์
                </h1>
                <p className="mt-4 text-base font-medium text-slate-400 sm:text-lg">
                    สำรวจเทรนด์และเจาะลึกข้อมูลจากทั่วโลก
                </p>

                {/* Search bar */}
                <div className="mt-8 rounded-[32px] border border-white/12 bg-[#171717] px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[24px] px-3 py-2">
                            <LuSearch className="h-5 w-5 shrink-0 text-slate-400" />
                            <input
                                defaultValue="Artificial Intelligence"
                                className="w-full bg-transparent text-base font-semibold text-white outline-none placeholder:text-slate-500"
                                placeholder="ค้นหา..."
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <button className="grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white">
                                <LuSparkles className="h-4 w-4" />
                            </button>
                            <button className="grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white">
                                <LuX className="h-4 w-4" />
                            </button>
                            <button className="h-12 rounded-full bg-white px-7 text-sm font-bold text-black transition hover:bg-slate-200">
                                ค้นหา
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters / actions */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        {filters.map((item) => (
                            <button
                                key={item.label}
                                className={[
                                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                                    item.active
                                        ? "border-[#3163ff]/50 bg-[#13223e] text-[#d9e7ff] shadow-[0_0_0_1px_rgba(65,110,255,0.2)_inset]"
                                        : "border-white/10 bg-white/0 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
                                ].join(" ")}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
                        <button className="inline-flex items-center gap-2 rounded-full border border-white/0 px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-4 w-4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M4 4v5h5" />
                                <path d="M20 20v-5h-5" />
                                <path d="M19 9a8 8 0 0 0-13-3L4 9" />
                                <path d="M5 15a8 8 0 0 0 13 3l2-3" />
                            </svg>
                            ล้างผลลัพธ์
                        </button>

                        <button className="inline-flex items-center gap-2 rounded-full border border-[#1f4b82] bg-[#0f1720] px-4 py-2 text-sm font-semibold text-white transition hover:border-[#2f74ca] hover:bg-[#111b28]">
                            <LuBookmark className="h-4 w-4" />
                            บันทึกเป็น Preset
                        </button>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
                {/* summary card */}
                <div className="rounded-[32px] border border-white/5 bg-[#171718] px-5 py-6 shadow-[0_32px_100px_rgba(0,0,0,0.5)] sm:px-8 sm:py-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#2d8eff] text-white shadow-[0_0_30px_rgba(45,142,255,0.3)]">
                                <LuFileText className="h-6 w-6" />
                            </div>

                            <div>
                                <div className="text-sm font-black tracking-wider text-[#2d8eff]">
                                    FORO SUMMARY
                                </div>
                                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                    Editorial digest from 10 key signals
                                </div>
                            </div>
                        </div>

                        <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <LuCopy className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-[22px] font-extrabold leading-tight text-white sm:text-2xl">
                            ปัญญาประดิษฐ์ มีพัฒนาการเด่นจากคำเตือนของผู้นำและการลงทุนภาครัฐ
                        </h2>

                        <ul className="mt-8 space-y-5">
                            {summaryBullets.map((item) => (
                                <li key={item.tag} className="flex items-start gap-3.5">
                                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#3fa0ff] shadow-[0_0_12px_rgba(63,160,255,0.5)]" />
                                    <div className="flex items-baseline gap-2.5">
                                        <p className="text-base font-bold leading-relaxed text-slate-200">
                                            {item.text}
                                        </p>
                                        <Badge>{item.tag}</Badge>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-10 border-t border-white/5 pt-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-sky-400/40 text-[10px] shadow-[0_0_10px_rgba(56,189,248,0.1)]">
                                    ✓
                                </span>
                                สรุปโดย FORO อ้างอิงจากผลการค้นหาและสัญญาณสำคัญที่เกี่ยวข้อง
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-[#0d2a1d] px-4 py-2 text-[13px] font-bold text-[#4ade80] ring-1 ring-[#4ade80]/20">
                                <FiBarChart className="h-3.5 w-3.5" />
                                อัตราความแม่นยำ (Confidence) 80%
                            </div>
                        </div>
                    </div>
                </div>
                {/* grid cards */}
                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    {feedCards.map((card) => (
                        <FeedCardItem key={card.id} card={card} />
                    ))}
                </div>
            </section>
        </>

    );
}
