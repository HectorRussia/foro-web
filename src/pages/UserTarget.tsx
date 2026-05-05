import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { FaMagnifyingGlass, FaUserPlus, FaWandMagicSparkles, FaTrash } from 'react-icons/fa6';
import { HiCheckBadge, HiOutlinePlus, HiXMark, HiArrowTopRightOnSquare, HiOutlineUsers, HiOutlineNewspaper } from 'react-icons/hi2';

import Sidebar from '../components/Layouts/Sidebar';
import PostList from '../components/PostList';
import PresetUserTarget from '../components/PresetUserTarget';
import AILoader from '../components/AILoader';
import NewsSourcesTab from '../components/NewsSourcesTab';

import api from '../api/axiosInstance';
import * as postListApi from '../api/postList';
import { followRssSource } from '../api/rssFollow';
import { RSS_CATALOG, type RssSource } from '../config/rssCatalog';
import type { PostList as IPostList, PostListUser } from '../api/postList';
import type { UserTweetSearch, Recommendation, FollowedUser } from '../interface/userTarget';


const BASE_URL = import.meta.env.VITE_API_URL;
const UserTarget = () => {

    const [searchQuery, setSearchQuery] = useState("Donald J. Trump");
    const [users, setUsers] = useState<UserTweetSearch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // AI Recommendation states
    const [activeTab, setActiveTab] = useState<'search' | 'recommend' | 'sources'>('recommend');
    const [recommendQuery, setRecommendQuery] = useState("");
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isRecommending, setIsRecommending] = useState(false);
    const [isSearchingMore, setIsSearchingMore] = useState(false);
    const [rssActionSourceId, setRssActionSourceId] = useState<string | null>(null);
    const [rssPostListActionKey, setRssPostListActionKey] = useState<string | null>(null);

    // Followed users state
    const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
    const [isFetchingFollowed, setIsFetchingFollowed] = useState(false);

    // Post List state for options
    const [selectedUserForOptions, setSelectedUserForOptions] = useState<number | null>(null);
    const [selectedRecommendationForList, setSelectedRecommendationForList] = useState<string | null>(null);
    const [addingRecommendationToList, setAddingRecommendationToList] = useState<string | null>(null);
    const [postLists, setPostLists] = useState<(IPostList & { members: PostListUser[] })[]>([]);
    const [isFetchingLists, setIsFetchingLists] = useState(false);
    const [refreshSidebar, setRefreshSidebar] = useState(0);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
    }

    const normalizeXAccount = (account?: string | null) => (account || '').replace(/^@/, '').trim().toLowerCase();
    const normalizeRssUrl = (url?: string | null) => String(url || '').trim().toLowerCase().replace(/\/$/, '');

    const allRssSources = useMemo(() => Object.values(RSS_CATALOG).flat(), []);
    const rssSourcesByUrl = useMemo(
        () => new Map(allRssSources.map(source => [normalizeRssUrl(source.url), source])),
        [allRssSources]
    );
    const rssFollowedUsers = useMemo(
        () => followedUsers.filter(user => user.follow_type === 'rss' || Boolean(user.source_url)),
        [followedUsers]
    );
    const subscribedSources = useMemo<RssSource[]>(() => (
        rssFollowedUsers
            .filter(user => Boolean(user.source_url))
            .map(user => rssSourcesByUrl.get(normalizeRssUrl(user.source_url)) || {
                id: `follow-${user.id}`,
                name: user.name,
                url: user.source_url || '',
                siteUrl: user.source_url || '',
                description: 'แหล่งข่าว RSS ที่ติดตามอยู่',
                frequency: 'RSS feed',
                lang: 'th',
                type: 'news',
                topic: 'news',
            })
    ), [rssFollowedUsers, rssSourcesByUrl]);

    const getRecommendationAvatar = (rec: Recommendation) => {
        return rec.profile_image_url_https || rec.profile_image || `https://unavatar.io/twitter/${normalizeXAccount(rec.x_account)}`;
    };

    const getRecommendationFollowerLabel = (rec: Recommendation) => {
        if (typeof rec.followers_count === 'number') return `${formatNumber(rec.followers_count)} followers`;
        if (rec.followers) return rec.followers.toLowerCase().includes('followers') ? rec.followers : `${rec.followers} followers`;
        return 'FORO match';
    };

    const findFollowedUserByAccount = (account: string, list = followedUsers) => {
        const normalized = normalizeXAccount(account);
        return list.find(user => user.follow_type !== 'rss' && normalizeXAccount(user.x_account) === normalized) || null;
    };

    const findFollowedRssBySource = (source: RssSource, list = followedUsers) => {
        const normalized = normalizeRssUrl(source.url);
        return list.find(user => normalizeRssUrl(user.source_url) === normalized) || null;
    };

    const getListMembershipForRssSource = (
        source: RssSource,
        list: IPostList & { members: PostListUser[] },
        followedUser?: FollowedUser | null
    ) => {
        const normalized = normalizeRssUrl(source.url);
        return list.members.some(member =>
            (followedUser && member.follower_user_id === followedUser.id) ||
            normalizeRssUrl(member.follow_user_source_url) === normalized
        );
    };

    const findRssPostListMember = (
        source: RssSource,
        list: IPostList & { members: PostListUser[] }
    ) => {
        const normalized = normalizeRssUrl(source.url);
        return list.members.find(member => normalizeRssUrl(member.follow_user_source_url) === normalized) || null;
    };

    const getFollowedAvatar = (user: FollowedUser) => {
        if (user.profile_image_url_https) return user.profile_image_url_https;
        if (user.x_account) return `https://unavatar.io/twitter/${normalizeXAccount(user.x_account)}`;
        return '';
    };

    const getFollowedSourceLabel = (user: FollowedUser) => {
        if (user.follow_type === 'rss') return user.source_url || 'RSS feed';
        return `@${normalizeXAccount(user.x_account)}`;
    };

    const getFollowedSourceHref = (user: FollowedUser) => {
        if (user.follow_type === 'rss') return user.source_url || '#';
        return `https://x.com/${normalizeXAccount(user.x_account)}`;
    };

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

    const handleFollow = async (name: string, x_account: string, profile_image: string): Promise<FollowedUser | null> => {
        try {
            await api.post(`${BASE_URL}/follow/users/search`, {
                query: activeTab === 'search' ? searchQuery : recommendQuery,
                x_account: x_account,
                name: name,
                profile_image_url_https: profile_image
            });

            toast.success(`Followed ${name} successfully`);
            const refreshedUsers = await fetchFollowedUsers();
            setRefreshSidebar(prev => prev + 1);
            return findFollowedUserByAccount(x_account, refreshedUsers);

        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                const detail = error.response.data.detail;
                if (detail?.data?.message) {
                    toast.error(detail.data.message);
                    const refreshedUsers = await fetchFollowedUsers();
                    return findFollowedUserByAccount(x_account, refreshedUsers);
                } else {
                    toast.error(`เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ`);
                }
            } else {
                toast.error(`ไม่สามารถติดตาม ${name} ได้`);
                console.error("Follow error:", error);
            }
            return null;
        }
    };

    const fetchRecommendations = async (queryOverride?: string) => {
        const query = (queryOverride ?? recommendQuery).trim();
        if (!query) return;

        setIsRecommending(true);
        setSelectedRecommendationForList(null);
        setRecommendations([]); // Clear for a fresh search
        try {
            const response = await api.post(`${BASE_URL}/follow/users/llm_recommend`, {
                query
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

    const fetchFollowedUsers = async (): Promise<FollowedUser[]> => {
        setIsFetchingFollowed(true);
        try {
            const response = await api.get(`${BASE_URL}/follow`);
            const nextUsers = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];

            setFollowedUsers(nextUsers);
            return nextUsers;
        } catch (error) {
            console.error("Error fetching followed users:", error);
            return [];
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

    const ensureRssSourceInWatchlist = async (source: RssSource) => {
        const existing = findFollowedRssBySource(source);
        if (existing) return existing;

        const followed = await followRssSource(source);
        const refreshedUsers = await fetchFollowedUsers();
        return findFollowedRssBySource(source, refreshedUsers) || followed;
    };

    const handleToggleRssSource = async (source: RssSource) => {
        const existing = findFollowedRssBySource(source);
        setRssActionSourceId(source.id);

        try {
            if (existing) {
                await api.delete(`${BASE_URL}/follow/users/${existing.id}`);
                setFollowedUsers(prev => prev.filter(user => user.id !== existing.id));
                await fetchPostLists();
                toast.success(`นำ ${source.name} ออกจาก Watchlist แล้ว`);
            } else {
                await followRssSource(source);
                await fetchFollowedUsers();
                toast.success(`เพิ่ม ${source.name} เข้า Watchlist แล้ว`);
            }
            setRefreshSidebar(prev => prev + 1);
        } catch (error: any) {
            console.error('Failed to toggle RSS source:', error);
            const detailMessage = error.response?.data?.detail?.data?.message || error.response?.data?.detail;
            toast.error(detailMessage || 'ไม่สามารถอัปเดตแหล่งข่าวได้');
            fetchFollowedUsers();
        } finally {
            setRssActionSourceId(null);
        }
    };

    const fetchPostLists = async (): Promise<(IPostList & { members: PostListUser[] })[]> => {
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
            return listsWithMembers;
        } catch (error) {
            console.error('Failed to fetch post lists:', error);
            return [];
        } finally {
            setIsFetchingLists(false);
        }
    };

    const handleToggleRssPostList = async (
        source: RssSource,
        list: IPostList & { members: PostListUser[] }
    ) => {
        const actionKey = `${source.id}-${list.id}`;
        setRssPostListActionKey(actionKey);

        try {
            const existingMember = findRssPostListMember(source, list);
            const existingFollowedUser = findFollowedRssBySource(source);
            const isMember = Boolean(existingMember) || getListMembershipForRssSource(source, list, existingFollowedUser);

            if (isMember) {
                const followerUserId = existingMember?.follower_user_id || existingFollowedUser?.id;
                if (!followerUserId) {
                    toast.error('ไม่พบข้อมูลสมาชิก RSS ใน Post List นี้');
                    return;
                }
                await postListApi.deletePostListUserRelation(list.id, followerUserId);
                toast.success(`นำ ${source.name} ออกจาก ${list.name} แล้ว`);
            } else {
                const followedUser = await ensureRssSourceInWatchlist(source);
                if (!followedUser?.id) {
                    toast.error('ต้องเพิ่มแหล่งข่าวเข้า Watchlist ก่อนจึงจะเพิ่มเข้า Post List ได้');
                    return;
                }
                await postListApi.createPostListUser(list.id, followedUser.id);
                toast.success(`เพิ่ม ${source.name} เข้า ${list.name} แล้ว`);
            }

            await fetchPostLists();
            setRefreshSidebar(prev => prev + 1);
        } catch (error) {
            console.error('Failed to toggle RSS source in post list:', error);
            toast.error('ไม่สามารถอัปเดต Post List ได้');
        } finally {
            setRssPostListActionKey(null);
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

    const handleCategorySearch = (categoryName: string) => {
        setActiveTab('recommend');
        setRecommendQuery(categoryName);
        fetchRecommendations(categoryName);
    };

    const getListMembershipForRecommendation = (
        rec: Recommendation,
        list: IPostList & { members: PostListUser[] },
        followedUser?: FollowedUser | null
    ) => {
        const normalized = normalizeXAccount(rec.x_account);
        return list.members.some(member =>
            (followedUser && member.follower_user_id === followedUser.id) ||
            normalizeXAccount(member.follow_user_x_account) === normalized
        );
    };

    const ensureRecommendationInWatchlist = async (rec: Recommendation) => {
        const existing = findFollowedUserByAccount(rec.x_account);
        if (existing) return existing;

        const followed = await handleFollow(rec.name, rec.x_account, getRecommendationAvatar(rec));
        if (followed) return followed;

        const refreshedUsers = await fetchFollowedUsers();
        return findFollowedUserByAccount(rec.x_account, refreshedUsers);
    };

    const handleAddRecommendationToList = async (
        rec: Recommendation,
        list: IPostList & { members: PostListUser[] }
    ) => {
        const actionKey = `${normalizeXAccount(rec.x_account)}-${list.id}`;
        setAddingRecommendationToList(actionKey);

        try {
            const followedUser = await ensureRecommendationInWatchlist(rec);
            if (!followedUser) {
                toast.error('ต้องเพิ่มเข้า Watchlist ก่อนจึงจะเพิ่มเข้า Post List ได้');
                return;
            }

            if (getListMembershipForRecommendation(rec, list, followedUser)) {
                toast.success(`${rec.name} อยู่ใน ${list.name} แล้ว`);
                setSelectedRecommendationForList(null);
                return;
            }

            await postListApi.createPostListUser(list.id, followedUser.id);
            await fetchPostLists();
            setRefreshSidebar(prev => prev + 1);
            setSelectedRecommendationForList(null);
            toast.success(`เพิ่ม ${rec.name} เข้า ${list.name} แล้ว`);
        } catch (error) {
            console.error('Failed to add recommendation to list:', error);
            toast.error('ไม่สามารถเพิ่มเข้า Post List ได้');
        } finally {
            setAddingRecommendationToList(null);
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
        } else if (activeTab === 'recommend') {
            fetchRecommendations();
        }
    };

    return (
        <div className="foro-page-shell">
            <Sidebar />
            <div className="foro-center-stage">
                <section className="foro-workspace-panel relative p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* ── Header ── */}
                    <div className="mb-6">
                        <h1 className="text-[28px] font-black text-white flex items-center gap-3 mb-2 leading-tight">
                            <span className="text-yellow-400">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5 12H7L10 4L14 20L17 12H20.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            Smart Target Discovery
                        </h1>
                        <p className="text-gray-500 text-[13px] font-bold opacity-80">
                            ค้นหาและเพิ่มแหล่งข้อมูลที่ตรงกับความสนใจของคุณ
                        </p>
                    </div>

                    {/* ── Tabs (Segmented Control) ── */}
                    <div className="flex max-w-full flex-wrap items-center gap-2 p-1.5 bg-[#181819] border border-white/8 rounded-2xl mb-3 w-fit shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <button
                            onClick={() => setActiveTab('recommend')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${activeTab === 'recommend'
                                ? 'bg-linear-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-600/25 border border-white/15'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <HiOutlineUsers className={`text-lg transition-colors ${activeTab === 'recommend' ? 'text-white' : 'text-gray-600'}`} />
                            <span>แนะนำโดย FORO</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('sources')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${activeTab === 'sources'
                                ? 'bg-linear-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-600/25 border border-white/15'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <HiOutlineNewspaper className={`text-lg transition-colors ${activeTab === 'sources' ? 'text-white' : 'text-gray-600'}`} />
                            <span>แหล่งข่าว</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'sources' ? 'bg-white/20 text-white' : 'bg-blue-600/20 text-blue-400'}`}>
                                {rssFollowedUsers.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('search')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${activeTab === 'search'
                                ? 'bg-linear-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-600/25 border border-white/15'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <FaMagnifyingGlass className={`text-sm transition-colors ${activeTab === 'search' ? 'text-white' : 'text-gray-600'}`} />
                            <span>ค้นหาชื่อ</span>
                        </button>
                    </div>

                    {activeTab !== 'sources' && (
                        <>
                            {/* ── Search Bar ── */}
                            <div className="w-full max-w-[620px] mb-7">
                                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    {/* Input Container */}
                                    <div className="flex min-h-[52px] flex-1 items-center gap-4 bg-[#1a1a1b] border border-white/8 rounded-2xl px-5 py-3.5 transition-all duration-300 focus-within:border-white/15 focus-within:bg-[#202021]">
                                        <FaMagnifyingGlass className="text-gray-500 text-base" />
                                        <input
                                            type="text"
                                            value={activeTab === 'search' ? searchQuery : recommendQuery}
                                            onChange={(e) => activeTab === 'search' ? setSearchQuery(e.target.value) : setRecommendQuery(e.target.value)}
                                            placeholder={activeTab === 'search' ? "กรอก X Username (เช่น elonmusk)..." : "เช่น นักวิเคราะห์ตลาดเกม, ครีเอเตอร์สาย AI, ผู้ก่อตั้งสตาร์ทอัพสุขภาพ"}
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 outline-none text-sm font-bold min-w-0"
                                        />
                                        {activeTab === 'recommend' && recommendQuery && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setRecommendQuery("");
                                                    setRecommendations([]);
                                                    setSelectedRecommendationForList(null);
                                                }}
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition-all hover:bg-white/5 hover:text-white"
                                                title="ล้างคำค้นหา"
                                            >
                                                <HiXMark className="text-base" />
                                            </button>
                                        )}
                                    </div>
                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading || isRecommending || isSearchingMore}
                                        className={`flex min-h-[49px] w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-8 py-3.5 font-black text-sm text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-blue-500 to-violet-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 whitespace-nowrap sm:w-[132px]`}
                                    >
                                        {(isLoading || isRecommending) ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <span>ค้นหา</span>
                                        )}
                                    </button>
                                </form>
                                <p className="mt-3 text-[11px] font-bold text-gray-500">
                                    {activeTab === 'search'
                                        ? 'ค้นหาจากชื่อบัญชี X แล้วเพิ่มเข้า Watchlist ได้ทันที'
                                        : 'ยังไม่มีอินฟลูฯที่ใกล้เคียงกัน ลองเพิ่มคำเฉพาะหรือเปลี่ยนมุมค้นหา'}
                                </p>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {recommendations.map((rec, idx) => {
                                            const recKey = normalizeXAccount(rec.x_account);
                                            const followedUser = findFollowedUserByAccount(rec.x_account);
                                            const isListMenuOpen = selectedRecommendationForList === recKey;

                                            return (
                                                <motion.div
                                                    key={`${rec.x_account}-${idx}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    whileHover={{ y: -3 }}
                                                    className="group relative flex min-h-[290px] flex-col overflow-visible rounded-[22px] border border-[#1d3555]/75 bg-[#0c121b] p-4 shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition-all duration-300 hover:border-blue-500/60"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-[10px] font-black text-blue-100">
                                                            {recommendQuery || 'FORO'}
                                                        </div>

                                                        <div className="relative">
                                                            <button
                                                                type="button"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setSelectedRecommendationForList(isListMenuOpen ? null : recKey);
                                                                }}
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/6 text-gray-400 transition-all hover:border-blue-400/40 hover:bg-blue-500/15 hover:text-white"
                                                                title="เพิ่มเข้า Post List"
                                                            >
                                                                <HiOutlinePlus className="text-base" />
                                                            </button>

                                                            <AnimatePresence>
                                                                {isListMenuOpen && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                                                                        transition={{ duration: 0.16, ease: 'easeOut' }}
                                                                        className="absolute right-0 top-[calc(100%+8px)] z-40 w-48 overflow-hidden rounded-[12px] border border-white/10 bg-[#101011]/98 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                                                                    >
                                                                        <div className="border-b border-white/7 px-3 pb-2 text-[9px] font-black uppercase tracking-widest text-blue-400">
                                                                            Add to list
                                                                        </div>

                                                                        <div className="max-h-56 overflow-y-auto py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                                            {isFetchingLists ? (
                                                                                <div className="px-3 py-4">
                                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                                                                </div>
                                                                            ) : postLists.length > 0 ? (
                                                                                postLists.map((list) => {
                                                                                    const isMember = getListMembershipForRecommendation(rec, list, followedUser);
                                                                                    const actionKey = `${recKey}-${list.id}`;

                                                                                    return (
                                                                                        <button
                                                                                            key={list.id}
                                                                                            type="button"
                                                                                            onClick={() => handleAddRecommendationToList(rec, list)}
                                                                                            disabled={addingRecommendationToList === actionKey}
                                                                                            className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[12px] font-bold text-gray-300 transition-all hover:bg-white/5 hover:text-white disabled:cursor-wait disabled:opacity-60"
                                                                                        >
                                                                                            <span className="truncate">{list.name}</span>
                                                                                            {addingRecommendationToList === actionKey ? (
                                                                                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                                                                            ) : isMember ? (
                                                                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                                                                            ) : null}
                                                                                        </button>
                                                                                    );
                                                                                })
                                                                            ) : (
                                                                                <div className="px-3 py-3 text-[12px] font-bold text-gray-500">
                                                                                    ยังไม่มี Post List
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex items-start gap-3">
                                                        <img
                                                            src={getRecommendationAvatar(rec)}
                                                            alt={rec.name}
                                                            className="h-12 w-12 shrink-0 rounded-xl border border-white/10 bg-white/5 object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = `https://unavatar.io/twitter/${recKey}`;
                                                            }}
                                                        />

                                                        <div className="min-w-0 pt-0.5">
                                                            <h3 className="truncate text-base font-black uppercase tracking-tight text-white">
                                                                {rec.name}
                                                            </h3>
                                                            <p className="truncate text-sm font-bold text-blue-400">@{recKey}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-black text-gray-300">
                                                            {getRecommendationFollowerLabel(rec)}
                                                        </span>
                                                        <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-black text-gray-300">
                                                            Active this week
                                                        </span>
                                                    </div>

                                                    <p className="mt-4 line-clamp-4 flex-1 text-[13px] font-semibold leading-relaxed text-gray-300">
                                                        {rec.reason}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleFollow(rec.name, rec.x_account, getRecommendationAvatar(rec))}
                                                        disabled={!!followedUser}
                                                        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black transition-all active:scale-95 ${followedUser
                                                            ? 'cursor-default border-blue-400/20 bg-blue-500/10 text-blue-200'
                                                            : 'border-white/8 bg-white/6 text-white hover:border-blue-400/40 hover:bg-blue-600'
                                                            }`}
                                                    >
                                                        <span>{followedUser ? 'อยู่ใน Watchlist แล้ว' : '+ เพิ่มเข้า Watchlist'}</span>
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
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
                                            <PresetUserTarget
                                                onSelectCategory={handleCategorySearch}
                                                selectedCategoryName={recommendQuery}
                                                isLoading={isRecommending}
                                            />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                                </AnimatePresence>
                            </div>
                        </>
                    )}

                    {activeTab === 'sources' && (
                        <NewsSourcesTab
                            subscribedSources={subscribedSources}
                            postLists={postLists}
                            isFetchingPostLists={isFetchingLists}
                            busySourceId={rssActionSourceId}
                            busyPostListKey={rssPostListActionKey}
                            onToggleSource={handleToggleRssSource}
                            onTogglePostList={handleToggleRssPostList}
                        />
                    )}

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
                                                        {getFollowedAvatar(fuser) ? (
                                                            <img
                                                                src={getFollowedAvatar(fuser)}
                                                                alt={fuser.name}
                                                                className="w-12 h-12 rounded-full border-2 border-white/5 object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full border-2 border-white/5 bg-blue-600/20 flex items-center justify-center text-sm font-black text-blue-400">
                                                                {fuser.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-black text-white truncate leading-tight uppercase tracking-tight">
                                                            {fuser.name}
                                                        </h4>
                                                        <p className="text-xs font-bold text-gray-500 truncate mt-0.5">
                                                            {getFollowedSourceLabel(fuser)}
                                                        </p>
                                                        <a
                                                            href={getFollowedSourceHref(fuser)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-blue-500 font-bold text-[10px] mt-1.5 hover:underline group/link"
                                                        >
                                                            {fuser.follow_type === 'rss' ? 'RSS Source' : 'X Profile'}
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
                </section>
                <aside className="foro-right-rail">
                    <PostList refreshKey={refreshSidebar} />
                </aside>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default UserTarget;
