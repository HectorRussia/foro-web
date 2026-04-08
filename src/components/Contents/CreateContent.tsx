"use client";

import React, { useMemo, useState } from "react";
import {
    LuPencilLine,
    LuFileText,
    LuSmile,
    LuExpand,
    LuChevronDown,
    LuPlus,
    LuCircleCheck,
    LuX,
} from "react-icons/lu";

type Option = {
    value: string;
    label: string;
    icon?: React.ReactNode;
};

function FieldRow({
    label,
    value,
    icon,
    options,
    open,
    onToggle,
    onSelect,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    options: Option[];
    open: boolean;
    onToggle: () => void;
    onSelect: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400">{label}</div>

            <div className="relative">
                <button
                    type="button"
                    onClick={onToggle}
                    className={[
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
                        open
                            ? "border-[#2d6cff] bg-[#101a2a] shadow-[0_0_0_1px_rgba(45,108,255,0.25)_inset]"
                            : "border-white/8 bg-white/4 hover:border-white/14 hover:bg-white/6",
                    ].join(" ")}
                >
                    <span className="flex min-w-0 items-center gap-2">
                        <span className="text-slate-400">{icon}</span>
                        <span className="truncate text-sm font-semibold text-white">
                            {value}
                        </span>
                    </span>

                    <LuChevronDown
                        className={[
                            "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                            open ? "rotate-180" : "",
                        ].join(" ")}
                    />
                </button>

                {open ? (
                    <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-2xl border border-white/8 bg-[#111214] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                        {options.map((option, idx) => {
                            const active = option.value === value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onSelect(option.value)}
                                    className={[
                                        "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition",
                                        active
                                            ? "bg-[#0f2440] text-[#2f8cff]"
                                            : "text-slate-200 hover:bg-white/5 hover:text-white",
                                        idx === 0 ? "mt-0" : "mt-1",
                                    ].join(" ")}
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        {option.icon ? (
                                            <span className={active ? "text-[#2f8cff]" : "text-slate-400"}>
                                                {option.icon}
                                            </span>
                                        ) : null}
                                        <span className="truncate text-sm font-semibold">
                                            {option.label}
                                        </span>
                                    </span>

                                    {active ? (
                                        <LuCircleCheck className="h-4 w-4 shrink-0 text-[#2f8cff]" />
                                    ) : (
                                        <span className="h-4 w-4" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default function CreateContentPage() {
    const formatOptions = useMemo<Option[]>(
        () => [
            {
                value: "โพสต์โซเชียล",
                label: "โพสต์โซเชียล",
                icon: <LuFileText className="h-4 w-4" />,
            },
            {
                value: "วิดีโอสั้น / Reels",
                label: "วิดีโอสั้น / Reels",
                icon: <span className="text-xs">▤</span>,
            },
            {
                value: "บทความ Blog/SEO",
                label: "บทความ Blog/SEO",
                icon: <span className="text-xs">◫</span>,
            },
            {
                value: "X Thread",
                label: "X Thread",
                icon: <span className="text-xs">#</span>,
            },
        ],
        []
    );

    const toneOptions = useMemo<Option[]>(
        () => [
            {
                value: "ให้ข้อมูล/ปกติ",
                label: "ให้ข้อมูล/ปกติ",
                icon: <LuSmile className="h-4 w-4" />,
            },
            {
                value: "กระตือรือร้น/จริงจัง",
                label: "กระตือรือร้น/จริงจัง",
                icon: <span className="text-xs">◎</span>,
            },
            {
                value: "ทางการ/วิชาการ",
                label: "ทางการ/วิชาการ",
                icon: <span className="text-xs">✦</span>,
            },
            {
                value: "เป็นกันเอง/เพื่อนเล่าให้ฟัง",
                label: "เป็นกันเอง/เพื่อนเล่าให้ฟัง",
                icon: <span className="text-xs">☺</span>,
            },
            {
                value: "ตลก/ขำรายวัน",
                label: "ตลก/ขำรายวัน",
                icon: <span className="text-xs">◌</span>,
            },
            {
                value: "ดุดัน/วิจารณ์เชิงลึก",
                label: "ดุดัน/วิจารณ์เชิงลึก",
                icon: <span className="text-xs">◈</span>,
            },
        ],
        []
    );

    const lengthOptions = useMemo<Option[]>(
        () => [
            {
                value: "ขนาดกลาง (มาตรฐาน)",
                label: "ขนาดกลาง (มาตรฐาน)",
                icon: <LuExpand className="h-4 w-4" />,
            },
            {
                value: "สั้น กระชับ",
                label: "สั้น กระชับ",
                icon: <span className="text-xs">—</span>,
            },
            {
                value: "ยาว แบบเจาะลึก",
                label: "ยาว แบบเจาะลึก",
                icon: <span className="text-xs">⇱</span>,
            },
        ],
        []
    );

    const [openField, setOpenField] = useState<null | "format" | "tone" | "length">(null);
    const [format, setFormat] = useState("โพสต์โซเชียล");
    const [tone, setTone] = useState("ให้ข้อมูล/ปกติ");
    const [length, setLength] = useState("ขนาดกลาง (มาตรฐาน)");

    const [showExtraOptions, setShowExtraOptions] = useState(false);
    const [extraPrompt, setExtraPrompt] = useState("");

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-12">
            <div className="mb-10 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
                        <LuPencilLine className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        สร้างคอนเทนต์
                    </h1>
                </div>
                <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
                    เริ่มจากหัวข้อเดียว แล้วค่อยกำหนดรูปแบบ น้ำเสียง และความยาวภายหลัง
                </p>
            </div>

            <div className="overflow-hidden rounded-[40px] border border-white/5 bg-[#151516] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
                <div className="grid lg:grid-cols-[1.5fr_1fr]">
                    {/* Left side */}
                    <section className="min-h-[600px] p-6 sm:p-10">
                        <div className="flex h-full flex-col">
                            <div className="space-y-6">
                                <div className="text-sm font-black tracking-widest text-[#2f8cff]/80 uppercase">
                                    หัวข้อ / ไอเดีย
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        rows={12}
                                        placeholder="เริ่มจากหัวข้อเดียวหรือไอเดียสั้น ๆ แล้วระบบจะช่วยต่อยอดให้"
                                        className="w-full resize-none bg-transparent text-[28px] font-black leading-tight text-white outline-none placeholder:text-slate-600 sm:text-[32px] sm:leading-[1.1]"
                                    />
                                </div>
                            </div>

                            <div className="mt-auto pt-6">
                                {showExtraOptions && (
                                    <div className="flex items-center gap-3 rounded-2xl border border-[#2d6cff] bg-[#101a2a]/50 p-4 shadow-[0_0_0_1px_rgba(45,108,255,0.2)_inset]">
                                        <input
                                            value={extraPrompt}
                                            onChange={(e) => setExtraPrompt(e.target.value)}
                                            placeholder="คำสั่งเพิ่มเติม เช่น โทนที่ต้องการ, มุมเล่าเรื่อง, ข้อห้าม"
                                            className="min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowExtraOptions(false);
                                                setExtraPrompt("");
                                            }}
                                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white"
                                        >
                                            <LuX className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Right side - Sidebar style */}
                    <aside className="border-l border-white/5 bg-[#1a1a1b]/50 p-6 backdrop-blur-sm sm:p-10">
                        <div className="flex h-full flex-col space-y-8">
                            <FieldRow
                                label="รูปแบบงาน"
                                value={format}
                                icon={<LuFileText className="h-4 w-4" />}
                                options={formatOptions}
                                open={openField === "format"}
                                onToggle={() =>
                                    setOpenField(openField === "format" ? null : "format")
                                }
                                onSelect={(value) => {
                                    setFormat(value);
                                    setOpenField(null);
                                }}
                            />

                            <FieldRow
                                label="น้ำเสียง"
                                value={tone}
                                icon={<LuSmile className="h-4 w-4" />}
                                options={toneOptions}
                                open={openField === "tone"}
                                onToggle={() => setOpenField(openField === "tone" ? null : "tone")}
                                onSelect={(value) => {
                                    setTone(value);
                                    setOpenField(null);
                                }}
                            />

                            <FieldRow
                                label="ความยาว"
                                value={length}
                                icon={<LuExpand className="h-4 w-4" />}
                                options={lengthOptions}
                                open={openField === "length"}
                                onToggle={() =>
                                    setOpenField(openField === "length" ? null : "length")
                                }
                                onSelect={(value) => {
                                    setLength(value);
                                    setOpenField(null);
                                }}
                            />

                            <div className="space-y-4">
                                {!showExtraOptions && (
                                    <button
                                        type="button"
                                        onClick={() => setShowExtraOptions(true)}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white"
                                    >
                                        <LuPlus className="h-4 w-4" />
                                        ตัวเลือกเพิ่มเติม
                                    </button>
                                )}

                                <div className="mt-auto space-y-4 pt-4">
                                    <p className="text-xs font-medium leading-relaxed text-slate-500">
                                        เป็นข้อความอ่านลื่นไหลแบบโพสต์จริง ไม่ใช่หัวข้อย่อย
                                    </p>

                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/3 px-6 py-4 text-base font-black text-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition hover:bg-white/10"
                                    >
                                        <LuPencilLine className="h-5 w-5" />
                                        สร้างคอนเทนต์
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
