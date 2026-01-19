import { useState } from 'react';
import { BsRobot } from 'react-icons/bs';
import { FaCopy, FaExternalLinkAlt, FaHome } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { HiMiniUsers } from 'react-icons/hi2';
import { IoIosMore, IoIosSettings } from 'react-icons/io';
import { LuLayoutDashboard } from 'react-icons/lu';

// Mock Data for the dashboard
const POSTS = [
    {
        id: 1,
        author: 'Tech News Thailand',
        handle: '@technewsth',
        avatarColor: 'bg-blue-600',
        content: 'เทคโนโลยี AI กำลังเปลี่ยนแปลงวงการธุรกิจไทย ด้วยการนำมาใช้ในการวิเคราะห์ข้อมูลและปรับปรุงประสบการณ์ลูกค้า',
        tags: ['AI', 'TechThailand', 'Innovation'],
        date: '2 ชั่วโมงที่แล้ว'
    },
    {
        id: 2,
        author: 'Digital Today',
        handle: '@digitaltoday',
        avatarColor: 'bg-purple-600',
        content: '5 เทรนด์ Digital Marketing ปี 2024 ที่นักการตลาดต้องรู้ เน้นการใช้ AI และ Personalization',
        tags: ['DigitalMarketing', 'Trends2024'],
        date: '5 ชั่วโมงที่แล้ว'
    },
    {
        id: 3,
        author: 'Startup Thailand',
        handle: '@startupth',
        avatarColor: 'bg-green-600',
        content: 'รวบรวมแหล่งทุนสำหรับ Startup ไทยในไตรมาสที่ 1 พร้อมเทคนิคการ Pitching ให้ผ่านฉลุย',
        tags: ['Startup', 'Investment', 'Funding'],
        date: '1 วันที่แล้ว'
    }
];

const CATEGORIES = ['หมวดรวม', 'เทคโนโลยี', 'การตลาด'];
const TIME_FILTERS = ['วันนี้', '7 วัน', '30 วัน'];

const Dashboard = () => {
    const [activeCategory, setActiveCategory] = useState('หมวดรวม');
    const [activeTime, setActiveTime] = useState('วันนี้');

    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 flex-shrink-0 bg-[#020a11] border-r border-[#1e293b] flex flex-col items-center lg:items-stretch py-6 px-2 lg:px-4 fixed h-full z-20">
                {/* Logo Area */}
                <div className="mb-8 flex justify-center lg:justify-start px-2">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <span className="font-bold text-xl text-white">F</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 w-full">
                    <NavItem icon={<HomeIcon />} label="หน้าแรก" active />
                    <NavItem icon={<UsersIcon />} label="กลุ่มเป้าหมาย" />
                    <NavItem icon={<SettingsIcon />} label="ตั้งค่า" />
                </nav>

                {/* User Profile (Bottom) */}
                <div className="mt-auto px-2 py-4">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1e293b] cursor-pointer transition-colors">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold">U</div>
                        <div className="hidden lg:block overflow-hidden">
                            <p className="text-sm font-medium truncate">User Name</p>
                            <p className="text-xs text-gray-400 truncate">user@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-20 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            แดชบอร์ดของคุณ
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">ติดตามกระแสและสรุปเนื้อหาที่คุณสนใจล่าสุด</p>
                    </div>

                    <div className="flex items-center gap-3 z-100">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#2d3b4e] border border-gray-700 transition-all text-sm font-medium">
                            <LayoutIcon />
                            <span className="hidden sm:inline">เลือกเลย์เอาต์</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all text-sm font-medium">
                            <PlusIcon />
                            <span>เพิ่มหมวดใหม่</span>
                        </button>
                    </div>
                </header>

                {/* Filters Section */}
                <div className="flex flex-col gap-6 mb-8">
                    {/* Categories - Centered Pills */}
                    <div className="flex justify-center flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${activeCategory === cat
                                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                    : 'bg-[#0f172a] border-[#1e293b] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Time Filters & Secondary Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
                        <div className="flex items-center gap-2 bg-[#0f172a] p-1 rounded-lg border border-[#1e293b]">
                            {TIME_FILTERS.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setActiveTime(time)}
                                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTime === time
                                        ? 'bg-[#1e293b] text-white shadow-sm'
                                        : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                        <h2 className="text-lg font-semibold text-white/90">
                            {activeCategory}
                        </h2>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="space-y-4">
                    {POSTS.map(post => (
                        <DashboardCard key={post.id} post={post} />
                    ))}
                </div>
            </main>
        </div>
    );
};

// Components
const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${active
        ? 'bg-blue-600/10 text-blue-400'
        : 'text-gray-400 hover:bg-[#1e293b] hover:text-gray-100'
        }`}>
        <div className={`${active ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'}`}>
            {icon}
        </div>
        <span className={`text-sm font-medium hidden lg:block`}>{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 hidden lg:block shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
    </div>
);

const DashboardCard = ({ post }: { post: any }) => (
    <div className="group bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 transition-all duration-200 hover:border-gray-600 hover:shadow-xl hover:shadow-black/20">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${post.avatarColor}`}>
                    {post.author.charAt(0)}
                </div>
                <div>
                    <h3 className="font-semibold text-white leading-tight">{post.author}</h3>
                    <p className="text-gray-500 text-xs">{post.handle} • {post.date}</p>
                </div>
            </div>
            {/* Options Icon */}
            <button className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors">
                <MoreHorizontalIcon />
            </button>
        </div>

        <p className="flex items-center gap-2 text-gray-300 text-base leading-relaxed mb-4 font-light">
            <BsRobot size={30} /> {post.content}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[#1e293b] border border-[#334155] text-xs text-blue-300 group-hover:border-blue-500/30 transition-colors">
                    #{tag}
                </span>
            ))}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-[#1e293b]">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-400 hover:text-blue-400 transition-all text-sm font-medium border border-transparent hover:border-blue-900/30">
                <ExternalLinkIcon />
                ดูโพสต์ต้นทาง
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-400 hover:text-green-400 transition-all text-sm font-medium border border-transparent hover:border-green-900/30">
                <CopyIcon />
                คัดลอกลิงก์
            </button>
        </div>
    </div>
)

const HomeIcon = () => (
    <FaHome />
)
const UsersIcon = () => (
    <HiMiniUsers />
)
const SettingsIcon = () => (
    <IoIosSettings />
)
const LayoutIcon = () => (
    <LuLayoutDashboard />
)
const PlusIcon = () => (
    <FaPlus />
)
const MoreHorizontalIcon = () => (
    <IoIosMore />
)
const ExternalLinkIcon = () => (
    <FaExternalLinkAlt />
)
const CopyIcon = () => (
    <FaCopy />
)

export default Dashboard;
