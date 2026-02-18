import { useState } from 'react';
import { FaMagnifyingGlass, FaTwitter, FaUserPlus, FaRobot, FaWandMagicSparkles, FaArrowRight } from 'react-icons/fa6';
import { Toaster, toast } from 'react-hot-toast';
import { HiCheckBadge } from 'react-icons/hi2';
import Sidebar from '../components/Layouts/Sidebar';
import api from '../api/axiosInstance';
import type { UserTweetSearch, Recommendation } from '../interface/userTarget';


const BASE_URL = import.meta.env.VITE_API_URL;
const UserTarget = () => {

    const [searchQuery, setSearchQuery] = useState("Donald J. Trump");
    const [users, setUsers] = useState<UserTweetSearch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // AI Recommendation states
    const [activeTab, setActiveTab] = useState<'search' | 'recommend'>('search');
    const [recommendQuery, setRecommendQuery] = useState("ฉันอยากติดตามเรื่องเทคโนโลยีมีแนะนำไหมว่าควรติดตามใคร");
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isRecommending, setIsRecommending] = useState(false);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
    }

    const fetchUsers = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const response = await api.get(`${BASE_URL}/follow/users/search?query=${searchQuery}`);
            if (response.data?.data?.users?.users) {
                setUsers(response.data.data.users.users);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFollow = async (name: string, x_account: string, profile_image: string) => {
        try {
            await api.post(`${BASE_URL}/follow/users/search`, {
                query: activeTab === 'search' ? searchQuery : recommendQuery,
                x_account: x_account,
                name: name,
                profile_image_url_https: profile_image
            });

            toast.success(`Followed ${name} successfully`);

        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                const detail = error.response.data.detail;
                if (detail?.data?.message) {
                    toast.error(detail.data.message);
                } else {
                    toast.error(`เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ`);
                }
            } else {
                toast.error(`ไม่สามารถติดตาม ${name} ได้`);
                console.error("Follow error:", error);
            }
        }
    };

    const fetchRecommendations = async () => {
        if (!recommendQuery.trim()) return;

        setIsRecommending(true);
        try {
            const response = await api.post(`${BASE_URL}/follow/users/llm_recommend`, {
                query: recommendQuery
            });
            if (response.data?.data?.recommendations) {
                setRecommendations(response.data.data.recommendations);
            } else {
                setRecommendations([]);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setRecommendations([]);
            toast.error("ไม่สามารถดึงข้อมูลแนะนำได้");
        } finally {
            setIsRecommending(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === 'search') {
            fetchUsers();
        } else {
            fetchRecommendations();
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100 overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 ml-16 md:ml-20 lg:ml-80 p-3 md:p-6 lg:p-8 min-w-0">

                {/* ── Tabs ── */}
                <div className="flex items-center gap-2 mb-5">
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${activeTab === 'search'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-[#0f172a] text-gray-400 border border-[#1e293b] hover:border-gray-600'
                            }`}
                    >
                        <FaMagnifyingGlass />
                        <span>ค้นหาทั่วไป</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('recommend')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${activeTab === 'recommend'
                            ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-[#0f172a] text-gray-400 border border-[#1e293b] hover:border-gray-600'
                            }`}
                    >
                        <FaRobot className={activeTab === 'recommend' ? 'animate-pulse' : ''} />
                        <span>แนะนำโดย AI</span>
                    </button>
                </div>

                {/* ── AI Header ── */}
                {activeTab === 'recommend' && (
                    <div className="mb-5">
                        <h2 className="text-base md:text-xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 flex items-center gap-2">
                            <FaWandMagicSparkles className="text-yellow-400/80 animate-pulse" />
                            <span>Smart Target Discovery</span>
                        </h2>
                    </div>
                )}

                {/* ── Search Bar ── */}
                <div className="w-full max-w-2xl mb-6">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        {/* Input */}
                        <div className={`flex-1 flex items-center gap-2 bg-[#0f172a] border-2 rounded-xl px-3 py-2.5 transition-all duration-300 ${activeTab === 'search'
                            ? 'border-[#1e293b] focus-within:border-blue-500'
                            : 'border-indigo-500/40 focus-within:border-indigo-500'
                            }`}>
                            {activeTab === 'search'
                                ? <FaMagnifyingGlass className="text-gray-500 text-sm shrink-0" />
                                : <FaRobot className="text-indigo-400 text-sm shrink-0 animate-pulse" />
                            }
                            <input
                                type="text"
                                value={activeTab === 'search' ? searchQuery : recommendQuery}
                                onChange={(e) => activeTab === 'search' ? setSearchQuery(e.target.value) : setRecommendQuery(e.target.value)}
                                placeholder={activeTab === 'search' ? "ค้นหาบัญชี X..." : "บอก AI ว่าอยากติดตามอะไร..."}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 outline-none text-xs md:text-sm min-w-0"
                            />
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || isRecommending}
                            className={`shrink-0 flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-black text-xs md:text-sm text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide ${activeTab === 'search'
                                ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                                : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/20'
                                }`}
                        >
                            {(isLoading || isRecommending) ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Search</span>
                                    <FaArrowRight className="text-[10px] hidden md:block" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* ── Results ── */}
                {activeTab === 'search' ? (
                    /* Search: single-col on mobile, 2-col on lg */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {users.map((user) => (
                            <div key={user.id} className="group flex items-center gap-3 bg-[#0f172a]/80 border border-[#1e293b] p-3 md:p-4 rounded-2xl hover:border-blue-500/40 hover:bg-[#0f172a] transition-all duration-300">

                                {/* Avatar */}
                                <div className="shrink-0 relative">
                                    <img
                                        src={user.profile_image_url_https}
                                        alt={user.name}
                                        className="w-11 h-11 md:w-14 md:h-14 rounded-full border-2 border-[#1e293b] group-hover:border-blue-500/50 object-cover transition-all duration-300"
                                    />
                                    {user.isBlueVerified && (
                                        <div className="absolute -bottom-0.5 -right-0.5 bg-white text-blue-500 rounded-full p-0.5 ring-2 ring-[#0f172a]">
                                            <HiCheckBadge className="text-[10px] md:text-[12px]" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5 min-w-0">
                                        <h2 className="text-xs md:text-sm font-black text-white truncate group-hover:text-blue-400 transition-colors">{user.name}</h2>
                                        <span className="text-gray-500 bg-[#1e293b] px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0">@{user.screen_name}</span>
                                    </div>
                                    <p className="text-gray-500 text-[9px] md:text-[10px] line-clamp-1 mb-1.5 leading-relaxed">
                                        {user.description}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <span className="font-black text-white text-[10px] md:text-xs">{formatNumber(user.followers_count)}</span>
                                            <span className="text-gray-600 text-[7px] uppercase tracking-widest font-bold ml-0.5">F</span>
                                        </div>
                                        <div>
                                            <span className="font-black text-white text-[10px] md:text-xs">{formatNumber(user.following_count)}</span>
                                            <span className="text-gray-600 text-[7px] uppercase tracking-widest font-bold ml-0.5">Fw</span>
                                        </div>
                                        <div>
                                            <span className="font-black text-white text-[10px] md:text-xs">{formatNumber(user.statuses_count)}</span>
                                            <span className="text-gray-600 text-[7px] uppercase tracking-widest font-bold ml-0.5">P</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="shrink-0 flex flex-col gap-1.5">
                                    <button
                                        onClick={() => handleFollow(user.name, user.screen_name, user.profile_image_url_https)}
                                        className="flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-wide transition-all duration-200 active:scale-95 shadow-md shadow-blue-600/30 whitespace-nowrap"
                                    >
                                        <FaUserPlus className="text-[8px]" />
                                        <span>Follow</span>
                                    </button>
                                    <a
                                        href={`https://twitter.com/${user.screen_name}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-1 px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] border border-gray-700/50 rounded-lg text-gray-400 hover:text-white font-black text-[9px] md:text-[10px] uppercase tracking-wide transition-all duration-200 whitespace-nowrap"
                                    >
                                        <FaTwitter className="text-[8px]" />
                                        <span>Profile</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Recommend: 1-col mobile, 2-col md, 3-col lg */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.map((rec, idx) => (
                            <div key={idx} className="group flex flex-col bg-[#0f172a]/80 border border-indigo-500/20 p-5 rounded-2xl hover:border-indigo-500/60 hover:shadow-[0_15px_30px_rgba(99,102,241,0.1)] transition-all duration-500 relative overflow-hidden">
                                <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-600/10 blur-2xl rounded-full group-hover:bg-indigo-600/20 transition-all duration-500" />

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                        <FaRobot className="text-indigo-400 text-[9px] animate-pulse" />
                                        <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">AI Pick</span>
                                    </div>
                                </div>

                                <h3 className="text-sm md:text-base font-black text-white group-hover:text-indigo-400 transition-colors truncate tracking-tight uppercase mb-0.5">
                                    {rec.name}
                                </h3>
                                <span className="text-indigo-400/80 font-bold text-xs tracking-tight italic mb-3">@{rec.x_account}</span>

                                <div className="mt-auto border-t border-indigo-500/10 pt-3 relative">
                                    <div className="absolute top-0 left-0 w-8 h-0.5 bg-indigo-500 rounded-full" />
                                    <p className="text-gray-400 text-xs leading-relaxed italic line-clamp-5 group-hover:text-gray-300 transition-colors">
                                        "{rec.reason}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Empty State ── */}
                {((activeTab === 'search' && !isLoading && users.length === 0) ||
                    (activeTab === 'recommend' && !isRecommending && recommendations.length === 0)) && (
                        <div className="text-center py-16 md:py-24 bg-[#0f172a]/40 rounded-3xl border-2 border-dashed border-[#1e293b] mt-6">
                            <div className="mb-6 flex justify-center text-gray-800">
                                {activeTab === 'search'
                                    ? <FaMagnifyingGlass size={48} className="animate-pulse" />
                                    : <FaRobot size={48} className="animate-bounce" />
                                }
                            </div>
                            <h3 className="text-lg md:text-2xl font-black text-gray-500 uppercase tracking-tighter">No results found</h3>
                            <p className="text-gray-600 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
                                {activeTab === 'search'
                                    ? "ลองค้นหาด้วยคำอื่น"
                                    : "บอก AI ว่าคุณสนใจเรื่องอะไร"}
                            </p>
                        </div>
                    )}
            </div>

            <Toaster position="bottom-right" />
        </div>
    );
};

export default UserTarget;