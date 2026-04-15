
import BottomCardsSection from "../components/Contents/SummaryBullets";
import PostList from "../components/PostList";
import Sidebar from "../components/Layouts/Sidebar";
import {
    LuSearch,
    LuSquarePen,
} from "react-icons/lu";
import { useState } from "react";
import CreateContent from "../components/Contents/CreateContent";

export default function ContentSearchPage() {
    const [isCreateContent, setIsCreateContent] = useState(false);
    return (
        <div className="flex h-screen w-full gap-3 overflow-hidden bg-[#0a0a0b] p-3 font-sans text-gray-100">
            <Sidebar />
            <div className="flex flex-1 min-w-0 gap-3">
                <section className="flex min-w-0 flex-1 flex-col overflow-y-auto rounded-4xl border border-white/5 bg-[#111112] shadow-[0_24px_90px_rgba(0,0,0,0.45)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex flex-col w-full px-4 py-4 sm:px-6 lg:px-8">
                        {/* Top bar */}
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <button
                                onClick={() => setIsCreateContent(false)}
                                className={[
                                    "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition",
                                    !isCreateContent
                                        ? "bg-linear-to-r from-[#6c63ff] to-[#4ea4ff] text-white shadow-[0_0_30px_rgba(95,118,255,0.35)]"
                                        : "border border-white/10 bg-white/3 text-white/90 backdrop-blur-sm hover:border-white/20 hover:bg-white/5",
                                ].join(" ")}
                            >
                                <LuSearch className="h-4 w-4" />
                                ค้นหา
                            </button>

                            <button
                                onClick={() => setIsCreateContent(true)}
                                className={[
                                    "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition",
                                    isCreateContent
                                        ? "bg-linear-to-r from-[#6c63ff] to-[#4ea4ff] text-white font-bold shadow-[0_4px_25px_rgba(95,118,255,0.3)]"
                                        : "border border-white/10 bg-white/3 text-white/90 backdrop-blur-sm hover:border-white/20 hover:bg-white/5",
                                ].join(" ")}
                            >
                                <LuSquarePen className="h-4 w-4" />
                                สร้างคอนเทนต์
                            </button>
                        </div>
                        {/* Result card */}
                        {isCreateContent ? <CreateContent /> : <BottomCardsSection />}
                    </div>
                </section>
                <aside className="hidden xl:flex w-[320px] shrink-0 overflow-hidden rounded-4xl border border-white/5 bg-[#111112] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
                    <PostList showBorder={false} />
                </aside>
            </div>
        </div>
    );
}

