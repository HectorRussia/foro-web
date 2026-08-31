
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
        <div className="foro-page-shell foro-content-page">
            <Sidebar />
            <div className="foro-center-stage">
                <section className="foro-workspace-panel [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                <aside className="foro-right-rail">
                    <PostList showBorder={false} />
                </aside>
            </div>
        </div>
    );
}
