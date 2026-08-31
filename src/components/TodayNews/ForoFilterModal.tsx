import type { Dispatch, SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LuFilter } from 'react-icons/lu';
import type { TodayNewsViewModel } from '../../hooks/useTodayNews';

type ForoFilterModalProps = Pick<
    TodayNewsViewModel,
    | 'isAIFilterOpen'
    | 'setIsAIFilterOpen'
    | 'isLoadingPresets'
    | 'foroPresets'
    | 'selectedPresetId'
    | 'homePresets'
    | 'handleSelectPreset'
    | 'toggleHomePreset'
    | 'aiPrompt'
    | 'setAiPrompt'
    | 'setSelectedPresetId'
    | 'handleDeletePreset'
    | 'handleSavePreset'
    | 'isSavingPreset'
    | 'handleAIFilter'
    | 'isAIProcessing'
    | 'newsResults'
>;

export const ForoFilterModal = ({
    isAIFilterOpen,
    setIsAIFilterOpen,
    isLoadingPresets,
    foroPresets,
    selectedPresetId,
    homePresets,
    handleSelectPreset,
    toggleHomePreset,
    aiPrompt,
    setAiPrompt,
    setSelectedPresetId,
    handleDeletePreset,
    handleSavePreset,
    isSavingPreset,
    handleAIFilter,
    isAIProcessing,
    newsResults,
}: ForoFilterModalProps & {
    setIsAIFilterOpen: Dispatch<SetStateAction<boolean>>;
    setAiPrompt: Dispatch<SetStateAction<string>>;
    setSelectedPresetId: Dispatch<SetStateAction<number | null>>;
}) => (
    <>
                    {/* FORO Filter Modal */}
                    <AnimatePresence>
                        {isAIFilterOpen && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsAIFilterOpen(false)}
                                    className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md"
                                />

                                {/* Modal Container */}
                                <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none sm:p-6">
                                    <motion.div
                                        role="dialog"
                                        aria-modal="true"
                                        aria-labelledby="foro-filter-title"
                                        initial={{ opacity: 0, scale: 0.94, y: 18 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.94, y: 18 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="app-workshop-dialog pointer-events-auto relative w-full max-w-140 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-4xl border border-white/8 border-t-2 border-t-blue-500/80 bg-[#121214]/95 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.82)] backdrop-blur-2xl sm:p-6"
                                    >
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_42%)]" />
                                        <div className="relative space-y-4 sm:space-y-5">
                                            {/* Header */}
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/35 bg-[#12203b] text-blue-400 shadow-[0_10px_30px_rgba(37,99,235,0.18)]">
                                                    <LuFilter className="text-[18px]" />
                                                </div>
                                                <div className="min-w-0 pt-0.5">
                                                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-400/70">ANALYSIS MODE</p>
                                                    <h2 id="foro-filter-title" className="mt-1 text-[24px] font-black leading-none tracking-tight text-white sm:text-[28px]">FORO Filter</h2>
                                                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">บอก FORO ว่าอยากให้ช่วยมองประเด็นนี้แบบไหน</p>
                                                </div>
                                            </div>

                                            {/* Quick Mode Select */}
                                            <section className="rounded-3xl border border-white/8 bg-white/3 p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] sm:p-5">
                                                <div className="mb-4">
                                                    <p className="text-[15px] font-black tracking-tight text-white">เลือกโหมดเร็ว</p>
                                                    <p className="mt-1 text-sm leading-relaxed text-slate-400">แตะเพื่อใช้ prompt ทันที แล้วเลือกตรง ๆ ได้เลยว่าอันไหนจะโชว์บนหน้า Home</p>
                                                </div>

                                                {isLoadingPresets ? (
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                        {[1, 2, 3, 4].map(i => (
                                                            <div key={i} className="h-28 rounded-[20px] border border-white/8 bg-white/5 animate-pulse" />
                                                        ))}
                                                    </div>
                                                ) : foroPresets.length === 0 ? (
                                                    <div className="rounded-[20px] border border-dashed border-white/10 bg-white/2 px-4 py-6 text-center">
                                                        <p className="text-[13px] font-bold text-gray-500">ยังไม่มี preset</p>
                                                        <p className="mt-1 text-[11px] text-gray-600">พิมพ์ prompt แล้วกด "บันทึก preset"</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                            {foroPresets.map(preset => {
                                                                const isActive = selectedPresetId === preset.id;
                                                                const isHomePreset = homePresets.has(preset.id);

                                                                return (
                                                                    <div
                                                                        key={preset.id}
                                                                        role="button"
                                                                        tabIndex={0}
                                                                        onClick={() => handleSelectPreset(preset)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                                e.preventDefault();
                                                                                handleSelectPreset(preset);
                                                                            }
                                                                        }}
                                                                        className={`flex min-h-31.5 cursor-pointer flex-col rounded-[20px] border p-4 text-left transition-all outline-none
                                                                            ${isActive
                                                                                ? 'border-blue-500/40 bg-blue-500/10 shadow-[0_0_0_1px_rgba(37,99,235,0.08)_inset]'
                                                                                : 'border-white/8 bg-white/3 hover:border-white/12 hover:bg-white/5'}`}
                                                                    >
                                                                        <span className="block text-[15px] font-bold leading-snug text-white line-clamp-2">
                                                                            {preset.name}
                                                                        </span>

                                                                        <div className="mt-auto pt-4">
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    toggleHomePreset(preset.id);
                                                                                }}
                                                                                disabled={!isHomePreset && homePresets.size >= 3}
                                                                                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-black transition-all
                                                                                    ${isHomePreset
                                                                                        ? 'border-blue-500/40 bg-blue-500/15 text-blue-200 shadow-[0_0_0_1px_rgba(59,130,246,0.12)_inset]'
                                                                                        : 'border-white/10 bg-white/3 text-slate-400 hover:border-white/15 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-white/2 disabled:text-slate-600'}`}
                                                                            >
                                                                                {isHomePreset ? 'ซ่อนจาก Home' : 'โชว์บน Home'}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        <p className="mt-3 text-[11px] text-slate-500">เลือกให้โชว์บนหน้า Home ได้สูงสุด 3 อัน</p>
                                                    </>
                                                )}

                                                {/* Delete preset */}
                                                {selectedPresetId && (
                                                    <button
                                                        onClick={handleDeletePreset}
                                                        className="mt-3 flex items-center gap-1.5 rounded-full border border-rose-500/10 bg-rose-500/5 px-3 py-1.5 text-[10px] font-black text-rose-400/70 transition-all hover:border-rose-500/30 hover:text-rose-400"
                                                    >
                                                        <span className="text-sm leading-none">×</span>
                                                        <span>ลบ preset นี้</span>
                                                    </button>
                                                )}
                                            </section>

                                            {/* Prompt Section */}
                                            <section className="rounded-3xl border border-white/8 bg-white/3 p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] sm:p-5">
                                                <div className="mb-3">
                                                    <p className="text-[15px] font-black tracking-tight text-white">Prompt</p>
                                                    <p className="mt-1 text-sm leading-relaxed text-slate-400">จะให้สรุป จับมุม จัดอันดับ หรือหัก angle จากข่าวที่คัดมาก็ได้</p>
                                                </div>

                                                <textarea
                                                    value={aiPrompt}
                                                    onChange={(e) => { setAiPrompt(e.target.value); setSelectedPresetId(null); }}
                                                    placeholder="เช่น สรุปข่าวที่น่าเอาไปเล่าต่อ หรือหาโพสต์ไหนน่าทำคอนเทนต์"
                                                    rows={4}
                                                    className="min-h-33 w-full resize-none rounded-[20px] border border-blue-500/15 bg-[#0b111d] px-4 py-4 text-[14px] leading-6 text-white placeholder:text-slate-600 focus:border-blue-500/35 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                />

                                                <div className="mt-3 flex items-center justify-between gap-3">
                                                    <p className="text-xs leading-relaxed text-slate-500">บันทึก preset แล้วค่อยกดปุ่ม "โชว์บน Home" ที่การ์ดนั้นได้เลย</p>
                                                    <button
                                                        onClick={handleSavePreset}
                                                        disabled={isSavingPreset || !aiPrompt.trim()}
                                                        className="shrink-0 text-xs font-semibold text-blue-400/80 transition-all hover:text-blue-300 disabled:cursor-not-allowed disabled:text-slate-600"
                                                    >
                                                        {isSavingPreset ? 'กำลังบันทึก...' : '+ บันทึก preset'}
                                                    </button>
                                                </div>
                                            </section>

                                            {/* Actions */}
                                            <div className="flex gap-3 pt-1">
                                                <button
                                                    onClick={() => setIsAIFilterOpen(false)}
                                                    className="flex-1 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-[14px] font-bold text-slate-300 transition-all hover:bg-white/7 hover:text-white"
                                                >
                                                    ยกเลิก
                                                </button>
                                                <button
                                                    onClick={() => handleAIFilter()}
                                                    disabled={isAIProcessing || newsResults.length === 0 || !aiPrompt.trim()}
                                                    className={`flex-1 rounded-2xl px-4 py-3 text-[14px] font-bold text-white transition-all shadow-[0_18px_40px_rgba(37,99,235,0.35)]
                                                        ${isAIProcessing || newsResults.length === 0 || !aiPrompt.trim()
                                                            ? 'cursor-not-allowed bg-slate-800 text-slate-500 shadow-none'
                                                            : 'bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-[0.99]'}`}
                                                >
                                                    {isAIProcessing ? 'กำลังวิเคราะห์...' : 'กรองฟีด'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </AnimatePresence>
    </>
);
