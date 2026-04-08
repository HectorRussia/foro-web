import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { FaMagnifyingGlass, FaUserPlus, FaRobot, FaWandMagicSparkles, FaCopy, FaTrash } from 'react-icons/fa6';
import { HiCheckBadge, HiOutlinePlus, HiXMark, HiArrowTopRightOnSquare } from 'react-icons/hi2';

import Sidebar from '../components/Layouts/Sidebar';
import PostList from '../components/PostList';
import PresetUserTarget from '../components/PresetUserTarget';
import AILoader from '../components/AILoader';

import api from '../api/axiosInstance';
import * as postListApi from '../api/postList';
import type { PostList as IPostList, PostListUser } from '../api/postList';
import type { UserTweetSearch, Recommendation, FollowedUser } from '../interface/userTarget';


const BASE_URL = import.meta.env.VITE_API_URL;
const UserTarget = () => {

    const [searchQuery, setSearchQuery] = useState("Donald J. Trump");
    const [users, setUsers] = useState<UserTweetSearch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // AI Recommendation states
    const [activeTab, setActiveTab] = useState<'search' | 'recommend'>('recommend');
    const [recommendQuery, setRecommendQuery] = useState("ฉันอยากติดตามเรื่องเทคโนโลยีมีแนะนำไหมว่าควรติดตามใคร");
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isRecommending, setIsRecommending] = useState(false);
    const [isSearchingMore, setIsSearchingMore] = useState(false);

    // Followed users state
    const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
    const [isFetchingFollowed, setIsFetchingFollowed] = useState(false);

    // Post List state for options
    const [selectedUserForOptions, setSelectedUserForOptions] = useState<number | null>(null);
    const [postLists, setPostLists] = useState<(IPostList & { members: PostListUser[] })[]>([]);
    const [isFetchingLists, setIsFetchingLists] = useState(false);
    const [refreshSidebar, setRefreshSidebar] = useState(0);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
    }

    const fetchUsers = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const response = await api.get(`${BASE_URL}/follow/users/search?query=${searchQuery}`);
            if (response.data?.data?.users?.users) {
                setUsers(response.data.data.users.users.slice(0, 10));
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
            fetchFollowedUsers();
            setRefreshSidebar(prev => prev + 1);

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
        setRecommendations([]); // Clear for a fresh search
        try {
            const response = await api.post(`${BASE_URL}/follow/users/llm_recommend`, {
                query: recommendQuery
            });
            if (response.data?.data?.recommendations) {
                setRecommendations(response.data.data.recommendations.slice(0, 10));
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

    const fetchFollowedUsers = async () => {
        setIsFetchingFollowed(true);
        try {
            const response = await api.get(`${BASE_URL}/follow`);

            if (Array.isArray(response.data)) {
                setFollowedUsers(response.data);
            } else if (Array.isArray(response.data?.data)) {
                setFollowedUsers(response.data.data);
            } else {
                setFollowedUsers([]);
            }
        } catch (error) {
            console.error("Error fetching followed users:", error);
        } finally {
            setIsFetchingFollowed(false);
        }
    };

    const handleUnfollow = async (userId: number, name: string) => {
        try {
            await api.delete(`${BASE_URL}/follow/users/${userId}`);
            toast.success(`Unfollowed ${name}`);
            setFollowedUsers(prev => prev.filter(u => u.id !== userId));
            setRefreshSidebar(prev => prev + 1);
        } catch (error) {
            console.error("Error unfollowing:", error);
            toast.error("ไม่สามารถยกเลิกการติดตามได้");
        }
    };

    const fetchPostLists = async () => {
        try {
            setIsFetchingLists(true);
            const lists = await postListApi.getPostLists();
            const listsWithMembers = await Promise.all(
                lists.map(async (list) => {
                    const members = await postListApi.getPostListUsers(list.id);
                    return { ...list, members };
                })
            );
            setPostLists(listsWithMembers);
        } catch (error) {
            console.error('Failed to fetch post lists:', error);
        } finally {
            setIsFetchingLists(false);
        }
    };

    const handleToggleList = async (listId: number, userId: number, isMember: boolean) => {
        try {
            if (isMember) {
                await postListApi.deletePostListUserRelation(listId, userId);
                toast.success('นำออกจากรายการแล้ว');
            } else {
                await postListApi.createPostListUser(listId, userId);
                toast.success('เพิ่มเข้าในรายการแล้ว');
            }
            fetchPostLists(); // Refresh lists to show update
            setRefreshSidebar(prev => prev + 1); // Refresh sidebar count
        } catch (error) {
            console.error('Failed to toggle list membership:', error);
            toast.error('ไม่สามารถดำเนินการได้');
        }
    };

    useEffect(() => {
        fetchFollowedUsers();
        fetchPostLists();
    }, []);

    const handleSearchMore = async () => {
        if (!recommendQuery.trim() || isRecommending || isSearchingMore) return;

        setIsSearchingMore(true);
        try {
            // Prepare the structure as requested: current names and the query
            const existingData = recommendations.map(rec => ({
                name: rec.name,
                x_account: rec.x_account
            }));

            const response = await api.post(`${BASE_URL}/follow/users/llm_recommend`, {
                query: recommendQuery,
                existing_recommendations: existingData
            });

            if (response.data?.data?.recommendations && response.data.data.recommendations.length > 0) {
                const newRecs = response.data.data.recommendations;
                // Append the new recommendations
                setRecommendations(prev => [...prev, ...newRecs]);
                toast.success(`พบเพิ่มอีก ${newRecs.length} บัญชี`);
            } else {
                toast.error("ไม่พบข้อมูลเพิ่มเติมในขณะนี้");
            }
        } catch (error) {
            console.error("Error fetching more recommendations:", error);
            toast.error("เกิดข้อผิดพลาดในการค้นหาเพิ่มเติม");
        } finally {
            setIsSearchingMore(false);
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
        <div className="flex min-h-screen w-full gap-3 bg-[#121212] p-3 font-sans text-gray-100 overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 flex min-w-0 overflow-hidden">
                <main className="flex-1 p-3 md:p-6 lg:p-10 min-w-0 overflow-y-auto h-screen no-scrollbar">

                    {/* ── Header ── */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-2">
                            <span className="text-yellow-400">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5 12H7L10 4L14 20L17 12H20.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            Smart Target Discovery
                        </h1>
                        <p className="text-gray-500 text-sm font-bold opacity-80">
                            ค้นหาและเพิ่มแหล่งข้อมูลที่ตรงกับความสนใจของคุณ
                        </p>
                    </div>

                    {/* ── Tabs (Segmented Control) ── */}
                    <div className="flex sm:inline-flex items-center p-1.5 bg-[#1a1a1c] border border-white/5 rounded-[22px] mb-8 w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('recommend')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-[18px] font-bold text-xs transition-all duration-300 ${activeTab === 'recommend'
                                ? 'bg-[#111112] text-white shadow-xl border border-white/5'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <FaWandMagicSparkles className={`text-[14px] ${activeTab === 'recommend' ? 'text-gray-300' : 'text-gray-600'}`} />
                            <span>แนะนำโดย FORO</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-[18px] font-bold text-xs transition-all duration-300 ${activeTab === 'search'
                                ? 'bg-[#111112] text-white shadow-xl border border-white/5'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <FaMagnifyingGlass className={`text-[14px] ${activeTab === 'search' ? 'text-gray-300' : 'text-gray-600'}`} />
                            <span>ค้นหาชื่อ</span>
                        </button>
                    </div>

                    {/* ── Search Category Label ── */}
                    <div className={`mb-3 ${activeTab === 'search' ? 'block' : 'hidden'}`}>
                        <h4 className="text-[12px] font-black text-white uppercase tracking-widest opacity-90">
                            {activeTab === 'search' ? 'ค้นหาด้วย X USERNAME โดยตรง' : ''}
                        </h4>
                    </div>

                    {/* ── Search Bar ── */}
                    <div className="w-full max-w-3xl mb-3">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {/* Input */}
                            <div className="flex-1 flex items-center gap-4 bg-[#111112] border border-white/5 rounded-[22px] px-6 py-4 transition-all duration-300 focus-within:border-white/10 focus-within:bg-[#1a1a1c]">
                                <FaMagnifyingGlass className="text-gray-500 text-lg" />
                                <input
                                    type="text"
                                    value={activeTab === 'search' ? searchQuery : recommendQuery}
                                    onChange={(e) => activeTab === 'search' ? setSearchQuery(e.target.value) : setRecommendQuery(e.target.value)}
                                    placeholder={activeTab === 'search' ? "กรอก X Username (เช่น elonmusk)..." : "เช่น ฉันอยากติดตามเรื่องเทคโนโลยี..."}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-700 outline-none text-sm font-bold min-w-0"
                                />
                            </div>
                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || isRecommending || isSearchingMore}
                                className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-10 py-5 rounded-[22px] font-black text-sm text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-xl shadow-blue-600/30 whitespace-nowrap`}
                            >
                                {(isLoading || isRecommending) ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span>ค้นหา</span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* ── Results ── */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {activeTab === 'search' ? (
                                /* Search Results */
                                <motion.div
                                    key="search-results"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4"
                                >
                                    {users.map((user, idx) => (
                                        <motion.div
                                            key={user.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group flex items-center gap-3 bg-[#111112] border border-white/5 p-3 md:p-4 rounded-2xl hover:border-blue-500/40 hover:bg-[#1a1a1c] transition-all duration-300"
                                        >
                                            {/* Avatar */}
                                            {user.profile_image_url_https && (
                                                <div className="shrink-0 relative">
                                                    <img
                                                        src={user.profile_image_url_https}
                                                        alt={user.name}
                                                        className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/5 group-hover:border-blue-500/50 object-cover transition-all duration-300"
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                    {user.isBlueVerified && (
                                                        <div className="absolute -bottom-0.5 -right-0.5 bg-white text-blue-500 rounded-full p-0.5 ring-2 ring-[#0f172a]">
                                                            <HiCheckBadge className="text-[10px] md:text-[12px]" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 ml-2">
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1 min-w-0">
                                                    <h2 className="text-sm md:text-base font-black text-white truncate uppercase tracking-tight">{user.name}</h2>
                                                    <span className="text-gray-400 font-bold text-xs">@{user.screen_name}</span>
                                                </div>

                                                <div className="text-blue-500 font-bold text-xs mb-2">
                                                    @{user.screen_name.toLowerCase()}
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="font-black text-white text-xs md:text-sm">{formatNumber(user.followers_count)}</span>
                                                        <span className="text-gray-600 text-[8px] uppercase tracking-widest font-black">F</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="font-black text-white text-xs md:text-sm">{formatNumber(user.following_count)}</span>
                                                        <span className="text-gray-600 text-[8px] uppercase tracking-widest font-black">Fw</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="font-black text-white text-xs md:text-sm">{formatNumber(user.statuses_count)}</span>
                                                        <span className="text-gray-600 text-[8px] uppercase tracking-widest font-black">P</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="shrink-0 ml-4">
                                                <button
                                                    onClick={() => handleFollow(user.name, user.screen_name, user.profile_image_url_https)}
                                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-wide transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] whitespace-nowrap"
                                                >
                                                    <FaUserPlus className="text-xs" />
                                                    <span>+ เพิ่มเข้า Watchlist</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                /* AI Recommendation Results */
                                <motion.div
                                    key="recommend-results"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isRecommending && recommendations.length === 0 && (
                                        <div className="py-20">
                                            <AILoader />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {recommendations.map((rec, idx) => (
                                            <motion.div
                                                key={`${rec.x_account}-${idx}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                whileHover={{ y: -4 }}
                                                className="group flex flex-col p-6 rounded-[24px] transition-all duration-500 relative overflow-hidden h-full"
                                                style={{
                                                    backgroundColor: 'rgba(13, 17, 23, 0.4)',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)'
                                                }}
                                            >
                                                {/* Top Right Glow */}
                                                <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                                    style={{
                                                        background: 'radial-gradient(circle at top right, rgba(0, 112, 243, 0.15), transparent 70%)'
                                                    }}
                                                />

                                                {/* Hover Border Overlay (To avoid border jumping) */}
                                                <div className="absolute inset-0 rounded-[24px] border border-transparent group-hover:border-[#0070f3]/50 transition-colors duration-500 pointer-events-none" />

                                                <div className="flex items-center justify-between mb-5 relative z-10">
                                                    <div className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                                                        <FaRobot className="text-[#8b5cf6] text-[10px]" />
                                                        <span className="text-[9px] font-black text-[#8b5cf6] uppercase tracking-widest">AI Pick</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(rec.x_account);
                                                                toast.success(`คัดลอก @${rec.x_account} แล้ว`);
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-gray-500 hover:text-white transition-all shadow-sm group/btn"
                                                            title="คัดลอกชื่อผู้ใช้"
                                                        >
                                                            <FaCopy className="text-sm group-hover/btn:scale-110 transition-transform" />
                                                        </button>
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-gray-500 hover:text-white transition-all shadow-sm"
                                                            title="Options"
                                                        >
                                                            <HiOutlinePlus className="text-sm" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Header with Avatar */}
                                                <div className="flex items-start gap-4 mb-5 relative z-10">
                                                    <div className="relative group/avatar shrink-0">
                                                        <img
                                                            src={`https://unavatar.io/twitter/${rec.x_account}`}
                                                            alt={rec.name}
                                                            className="w-14 h-14 rounded-full border border-white/10 group-hover:border-[#0070f3]/30 object-cover transition-all"
                                                            onError={(e) => {
                                                                e.currentTarget.parentElement?.classList.add('hidden');
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="min-w-0 pt-1">
                                                        <h3 className="text-base font-black text-white group-hover:text-blue-400 transition-colors truncate tracking-tight uppercase mb-0.5">
                                                            {rec.name}
                                                        </h3>
                                                        <span className="text-gray-500 font-black text-sm tracking-tight truncate block opacity-70">@{rec.x_account}</span>
                                                    </div>
                                                </div>

                                                <div className="mb-8 flex-1 relative z-10">
                                                    <p className="text-gray-400 text-sm leading-relaxed italic line-clamp-4 group-hover:text-gray-300 transition-colors">
                                                        "{rec.reason}"
                                                    </p>
                                                </div>

                                                {/* Action Button */}
                                                <button
                                                    onClick={() => handleFollow(rec.name, rec.x_account, `https://unavatar.io/twitter/${rec.x_account}`)}
                                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 group-hover:border-[#0070f3]/30 transition-all font-bold text-xs uppercase tracking-widest mt-auto shadow-sm relative z-10"
                                                >
                                                    <span>+ เพิ่มเข้า Watchlist</span>
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* ── Additional Loader ── */}
                                    {isSearchingMore && (
                                        <div className="py-12">
                                            <AILoader />
                                        </div>
                                    )}

                                    {/* ── Search More Button ── */}
                                    {recommendations.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-start mt-10 mb-10"
                                        >
                                            <button
                                                onClick={handleSearchMore}
                                                disabled={isRecommending || isSearchingMore}
                                                className="group relative flex items-center gap-3 px-8 py-3 bg-[#111112] border border-white/5 rounded-full font-black text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSearchingMore ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <FaWandMagicSparkles className="text-gray-400 group-hover:rotate-12 transition-transform" />
                                                )}
                                                <span className="tracking-widest uppercase text-xs">
                                                    {isSearchingMore ? "กำลังค้นหาเพิ่ม..." : "ค้นหาเพิ่มเติม"}
                                                </span>
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* ── Empty State / Presets ── */}
                                    {!isRecommending && recommendations.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-4"
                                        >
                                            <PresetUserTarget onFollow={handleFollow} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Followed Accounts Section ── */}
                    {activeTab === 'search' && (
                        <div className="mt-20">
                            <hr className="border-t border-white/5 mb-10 w-full" />

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-white/20 rounded-sm" />
                                    <h3 className="text-base font-black text-white/80 uppercase tracking-widest flex items-center gap-2">
                                        บัญชีที่ติดตามอยู่
                                        <span className="text-gray-600">({followedUsers.length})</span>
                                    </h3>
                                </div>
                            </div>

                            {isFetchingFollowed && followedUsers.length === 0 ? (
                                <div className="py-12 flex justify-center">
                                    <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                </div>
                            ) : followedUsers.length > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {followedUsers.map((fuser, idx) => {
                                        const isSelected = selectedUserForOptions === fuser.id;

                                        return (
                                            <motion.div
                                                key={fuser.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group relative bg-[#161617] border border-white/5 rounded-[24px] p-4 hover:border-white/10 transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div className="shrink-0 relative">
                                                        <img
                                                            src={fuser.profile_image_url_https}
                                                            alt={fuser.name}
                                                            className="w-12 h-12 rounded-full border-2 border-white/5 object-cover"
                                                            onError={(e) => (e.currentTarget.src = `https://unavatar.io/twitter/${fuser.x_account}`)}
                                                        />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-black text-white truncate leading-tight uppercase tracking-tight">
                                                            {fuser.name}
                                                        </h4>
                                                        <p className="text-xs font-bold text-gray-500 truncate mt-0.5">
                                                            @{fuser.x_account.replace('@', '')}
                                                        </p>
                                                        <a
                                                            href={`https://x.com/${fuser.x_account.replace('@', '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-blue-500 font-bold text-[10px] mt-1.5 hover:underline group/link"
                                                        >
                                                            X Profile
                                                            <HiArrowTopRightOnSquare className="text-[9px] transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                                        </a>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 self-center">
                                                        <button
                                                            onClick={() => handleUnfollow(fuser.id, fuser.name)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#251818] text-red-500 hover:bg-[#2d1c1c] transition-all"
                                                            title="Unfollow"
                                                        >
                                                            <FaTrash className="text-[11px]" />
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedUserForOptions(isSelected ? null : fuser.id)}
                                                            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isSelected ? 'bg-white/10 text-white' : 'bg-[#1a1c22] text-gray-300 hover:text-white'
                                                                }`}
                                                        >
                                                            {isSelected ? <HiXMark className="text-lg" /> : <HiOutlinePlus className="text-lg" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Dropdown Menu */}
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute right-0 top-12 z-50 w-52 bg-[#0D0D0E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-black/50"
                                                        >
                                                            <div className="px-4 py-2.5 border-b border-white/5">
                                                                <h5 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                                                                    ADD TO POST LIST
                                                                </h5>
                                                            </div>
                                                            <div className="p-2 max-h-60 overflow-y-auto no-scrollbar space-y-1">
                                                                {isFetchingLists ? (
                                                                    <div className="flex justify-start py-4 px-4">
                                                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                                    </div>
                                                                ) : postLists.length > 0 ? (
                                                                    postLists.map((list: any) => {
                                                                        const isMember = list.members.some((m: any) => m.follower_user_id === fuser.id);
                                                                        return (
                                                                            <button
                                                                                key={list.id}
                                                                                onClick={() => handleToggleList(list.id, fuser.id, isMember)}
                                                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all hover:bg-white/5 group/list-item"
                                                                            >
                                                                                <span className={`text-[13px] font-black transition-colors ${isMember ? 'text-blue-500' : 'text-white/70 group-hover/list-item:text-white'
                                                                                    }`}>
                                                                                    {list.name}
                                                                                </span>
                                                                                {isMember && (
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                                                                )}
                                                                            </button>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <div className="px-4 py-3">
                                                                        <p className="text-[12px] text-gray-700 font-bold italic">ไม่มีรายการที่สร้างไว้</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            ) : (
                                <div className="py-20 bg-[#111112]/50 rounded-[32px] border border-dashed border-white/5 flex flex-col items-center justify-center text-center px-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                        <FaUserPlus className="text-gray-600 text-xl" />
                                    </div>
                                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest">
                                        ยังไม่มีบัญชีที่ติดตามอยู่
                                    </p>
                                    <p className="text-[10px] text-gray-700 mt-2 font-bold italic">
                                        ค้นหาชื่อหรือขอคำแนะนำจาก AI เพื่อเริ่มติดตาม
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                <div className="hidden xl:block">
                    <PostList refreshKey={refreshSidebar} />
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default UserTarget;
