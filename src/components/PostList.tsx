import { useState, useEffect, useRef } from 'react';
import { HiOutlineChartBar, HiOutlinePlus, HiOutlineTrash, HiOutlineShare, HiBars3, HiOutlineUsers, HiXMark } from 'react-icons/hi2';
import { FaRegFileCode } from 'react-icons/fa6';
import * as postListApi from '../api/postList';
import type { PostList as IPostList, PostListUser } from '../api/postList';
import api from '../api/axiosInstance';
import type { FollowedUser } from '../interface/userTarget';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export interface PostListWithMembers extends IPostList {
    members: PostListUser[];
}


const BASE_URL = import.meta.env.VITE_API_URL;

const colors = [
    '#3B82F6',
    '#06B6D4',
    '#22C55E',
    '#EF4444',
    '#F59E0B',
    '#A855F7',
    '#EC4899',
    '#FACC15',
    '#6366F1',
    '#8B5E3C',
    '#9CA3AF',
];

const getContrastColor = (hexColor: string) => {
    const normalized = hexColor.replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(normalized)) return '#171313';

    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);
    const perceivedBrightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return perceivedBrightness >= 145 ? '#171313' : '#fff8e8';
};

const PostList = ({
    showBorder = true,
    activeId,
    onSelect,
    refreshKey
}: {
    showBorder?: boolean,
    activeId?: number | null,
    onSelect?: (list: PostListWithMembers | null) => void,
    refreshKey?: unknown
}) => {
    const [lists, setLists] = useState<PostListWithMembers[]>([]);
    const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListColor, setNewListColor] = useState(colors[0]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [expandedListId, setExpandedListId] = useState<number | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    const fetchAllData = async () => {
        try {
            setIsLoading(true);
            const postLists = await postListApi.getPostLists();

            const listsWithMembers = await Promise.all(
                postLists.map(async (list) => {
                    const members = await postListApi.getPostListUsers(list.id);
                    return { ...list, members };
                })
            );

            setLists(listsWithMembers);
            if (onSelect && activeId !== undefined) {
                onSelect(activeId === null
                    ? null
                    : listsWithMembers.find(list => list.id === activeId) || null
                );
            }

            // Fetch followed users
            const followResponse = await api.get(`${BASE_URL}/follow`);
            if (Array.isArray(followResponse.data)) {
                setFollowedUsers(followResponse.data);
            } else if (Array.isArray(followResponse.data?.data)) {
                setFollowedUsers(followResponse.data.data);
            }
            return listsWithMembers;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [refreshKey]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setIsActionMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsActionMenuOpen(false);
            }
        };

        if (isActionMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isActionMenuOpen]);

    const handleCreateList = async () => {
        if (!newListName.trim()) return;
        try {
            await postListApi.createPostList(newListName, newListColor);
            setNewListName('');
            setNewListColor(colors[0]);
            setIsCreating(false);
            setIsActionMenuOpen(false);
            fetchAllData();
            toast.success('สร้างรายการสำเร็จ');
        } catch {
            toast.error('ไม่สามารถสร้างรายการได้');
        }
    };

    const handleOpenCreateList = () => {
        setIsActionMenuOpen(false);
        setIsCreating(true);
    };

    const handleImportByCode = () => {
        setIsActionMenuOpen(false);
        toast('ฟีเจอร์นำเข้าด้วยรหัสยังไม่พร้อมใช้งาน');
    };

    const handleColorChange = async (listId: number, color: string) => {
        try {
            await postListApi.updatePostList(listId, { color_list: color });
            setLists(prev => prev.map(l => l.id === listId ? { ...l, color_list: color } : l));
            toast.success('อัพเดตสีสำเร็จ');
        } catch {
            toast.error('ไม่สามารถอัพเดตสีได้');
        }
    };

    const handleDeleteList = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;
        try {
            await postListApi.deletePostList(id);
            fetchAllData();
            if (selectedListId === id) setSelectedListId(null);
            if (expandedListId === id) setExpandedListId(null);
            if (activeId === id && onSelect) onSelect(null);
            toast.success('ลบรายการสำเร็จ');
        } catch {
            toast.error('ไม่สามารถลบรายการได้');
        }
    };

    const handleAddMember = async (listId: number, followerUserId: number) => {
        try {
            await postListApi.createPostListUser(listId, followerUserId);
            await fetchAllData();
            toast.success('เพิ่มสมาชิกสำเร็จ');
        } catch (error) {
            console.error('Failed to add member:', error);
            toast.error('ไม่สามารถเพิ่มสมาชิกได้');
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        try {
            await postListApi.deletePostListUser(memberId);
            await fetchAllData();
            toast.success('ลบสมาชิกแล้ว');
        } catch {
            toast.error('ไม่สามารถลบสมาชิกได้');
        }
    };

    const getAvailableUsers = (currentMembers: PostListUser[]) => {
        const memberUserIds = new Set(currentMembers.map(m => m.follower_user_id));
        return followedUsers.filter(u => !memberUserIds.has(u.id));
    };

    const isRssFollowedUser = (user: FollowedUser) =>
        user.follow_type === 'rss' || Boolean(user.source_url);

    const getHostname = (value?: string | null) => {
        const raw = String(value || '').trim();
        if (!raw) return '';

        try {
            const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
            return url.hostname.replace(/^www\./, '');
        } catch {
            return raw.replace(/^https?:\/\//i, '').replace(/^www\./, '').split('/')[0];
        }
    };

    const getFaviconUrl = (value?: string | null) => {
        const hostname = getHostname(value);
        return hostname ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128` : '';
    };

    const getInitial = (value?: string | null) => (value || 'N').charAt(0);

    const getFollowedAvatar = (user?: FollowedUser | null) => {
        if (!user) return '';
        if (user.profile_image_url_https) return user.profile_image_url_https;
        if (user.x_account) return `https://unavatar.io/twitter/${user.x_account.replace('@', '')}`;
        if (user.source_url) return getFaviconUrl(user.source_url);
        return '';
    };

    const getFollowedSourceLabel = (user: FollowedUser) => {
        if (isRssFollowedUser(user)) return getHostname(user.source_url) || 'RSS feed';
        return `@${(user.x_account || '').replace('@', '')}`;
    };

    const getFollowedTitle = (user: FollowedUser) =>
        user.name || user.x_account || user.source_url || 'Follow source';

    const getMemberSourceLabel = (member: PostListUser) => {
        if ((member.follow_user_type || member.follow_user_follow_type) === 'rss') return getHostname(member.follow_user_source_url) || 'RSS feed';
        return `@${(member.follow_user_x_account || '').replace('@', '')}`;
    };

    const getMemberAvatar = (member: PostListUser, followedMatch?: FollowedUser | null) => {
        if (followedMatch) return getFollowedAvatar(followedMatch);
        if (member.follow_user_profile_image_url_https) return member.follow_user_profile_image_url_https;
        if ((member.follow_user_type || member.follow_user_follow_type) === 'rss') {
            return getFaviconUrl(member.follow_user_source_url);
        }
        if (member.follow_user_x_account) {
            return `https://unavatar.io/twitter/${member.follow_user_x_account.replace('@', '')}`;
        }
        return '';
    };

    return (
        <div className={`post-list-rail flex h-full w-full shrink-0 flex-col bg-[var(--bg-900)] ${showBorder ? 'border-l border-white/5' : ''} transition-all duration-500`}>

            {/* Header */}
            <div
                ref={actionMenuRef}
                className="post-list-header relative border-b border-white/6"
            >
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <HiOutlineChartBar className="post-list-header-mark" aria-hidden="true" />
                        <span className="font-black text-[12px] tracking-[0.18em] text-slate-400 uppercase">
                            POST LIST
                        </span>
                    </div>

                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={isActionMenuOpen}
                        onClick={() => setIsActionMenuOpen((prev) => !prev)}
                        className="group flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-white/5 hover:text-white"
                    >
                        <HiOutlinePlus className="text-[22px] transition-transform duration-200 group-hover:rotate-90" />
                    </button>
                </div>

                <AnimatePresence>
                    {isActionMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.96 }}
                            transition={{ duration: 0.16, ease: 'easeOut' }}
                            className="app-popover absolute right-4 top-[calc(100%+10px)] z-30 w-53.5 overflow-hidden rounded-[18px] border border-white/8 bg-[#111112]/98 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl"
                        >
                            <button
                                type="button"
                                onClick={handleOpenCreateList}
                                className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition-colors hover:bg-white/5"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-white">
                                    <HiOutlinePlus className="text-lg" />
                                </span>
                                <span className="text-sm font-bold text-white">สร้าง Post List</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleImportByCode}
                                className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition-colors hover:bg-white/5"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-white/90">
                                    <FaRegFileCode className="text-[16px]" />
                                </span>
                                <span className="text-sm font-bold text-gray-300">นำเข้าด้วยรหัส</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legacy shortcut hidden in favor of the dropdown menu */}
            <div className="hidden px-5 py-5">
                <button
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[20px] bg-[#1a1a1c] border border-white/6 text-gray-300 hover:text-white hover:bg-[#242427] transition-all font-bold text-[13px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                >
                    <HiOutlinePlus className="text-lg text-gray-400" />
                    <span>สร้าง Post List</span>
                </button>
            </div>

            {/* Create Section */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 mb-4 overflow-hidden"
                    >
                        <div className="bg-[#1a1a1b] border border-white/10 rounded-2xl p-4 space-y-3">
                            <input
                                autoFocus
                                type="text"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateList();
                                    if (e.key === 'Escape') setIsCreating(false);
                                }}
                                placeholder="ชื่อโพสต์ลิสต์..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white"
                            />
                            {/* Color Picker for Create */}
                            <div className="flex items-center gap-2 px-1">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setNewListColor(color)}
                                        className={`w-5 h-5 rounded-full transition-all duration-200 ${newListColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewListColor(colors[0]);
                                    }}
                                    className="flex-1 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-white/5 transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleCreateList}
                                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                                >
                                    ตกลง
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lists */}
            <div className="post-list-scroll flex-1 overflow-y-auto px-4 pb-32 space-y-1 lg:pb-10">
                {isLoading && lists.length === 0 ? (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : lists.length === 0 ? (
                    /* Empty State - Redesigned */
                    <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="flex items-end gap-1.5 mb-8 opacity-20">
                            <div className="w-1.5 h-8 bg-white rounded-full" />
                            <div className="w-1.5 h-12 bg-white rounded-full" />
                            <div className="w-1.5 h-10 bg-white rounded-full" />
                        </div>
                        <h4 className="text-white font-black text-lg mb-2">ไม่มีรายการ Post list</h4>
                        <p className="text-gray-500 text-[13px] font-bold leading-relaxed mb-8 opacity-80">
                            สร้างใหม่เพื่อจัดระเบียบแหล่งข้อมูลของคุณ
                        </p>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-10 py-3.5 rounded-full bg-linear-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            สร้างลิสต์
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="post-list-section-label px-3 pt-4 pb-2">
                            <span className="text-[11px] font-black tracking-[0.12em] uppercase text-[var(--text-dim)]">Your lists</span>
                        </div>
                        {lists.map((list) => {
                            const currentActiveId = activeId !== undefined ? activeId : selectedListId;
                            const isSelected = currentActiveId === list.id;
                            const isExpanded = expandedListId === list.id;
                            const availableUsers = getAvailableUsers(list.members);
                            const availableSources = availableUsers.filter(isRssFollowedUser);
                            const availableAccounts = availableUsers.filter(user => !isRssFollowedUser(user));

                            return (
                                <div
                                    key={list.id}
                                    onClick={() => {
                                        const nextList = isSelected ? null : list;
                                        if (onSelect) {
                                            onSelect(nextList);
                                        } else {
                                            setSelectedListId(nextList ? nextList.id : null);
                                        }
                                    }}
                                    className="post-list-row group overflow-hidden rounded-[12px] transition-all duration-300"
                                >
                                    <div
                                        className={`post-list-row-main flex items-center gap-3 rounded-[12px] border p-2 transition-all duration-300 ${isSelected
                                            ? 'border-white/5 bg-white/8'
                                            : 'border-transparent bg-transparent hover:bg-white/4'}`}
                                        style={isSelected ? { borderColor: list.color_list || colors[0] } : undefined}
                                    >
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const nextExpandedId = isExpanded ? null : list.id;
                                                setExpandedListId(nextExpandedId);
                                                const nextList = nextExpandedId === null ? null : list;
                                                if (onSelect) {
                                                    onSelect(nextList);
                                                } else {
                                                    setSelectedListId(nextList ? nextList.id : null);
                                                }
                                            }}
                                            className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-[8px] transition-all duration-200 hover:scale-105 active:scale-95"
                                            style={{
                                                backgroundColor: list.color_list || colors[0],
                                                boxShadow: `0 4px 12px ${(list.color_list || colors[0])}44`,
                                                color: getContrastColor(list.color_list || colors[0]),
                                            }}
                                        >
                                            <HiBars3 className="text-[23px]" />
                                            {isSelected && (
                                                <div className="absolute inset-0 rounded-[8px] bg-white/10" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1 pr-1">
                                            <div className="flex items-center justify-between">
                                                <h4
                                                    className="truncate pr-2 text-[15px] font-bold leading-tight text-white"
                                                >
                                                    {list.name}
                                                </h4>
                                                {isSelected && (
                                                    <div className="flex shrink-0 items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-dim)] transition-colors hover:bg-white/6 hover:text-[var(--accent-blue)]"
                                                        >
                                                            <HiOutlineShare className="text-[16px]" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteList(e, list.id)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-dim)] transition-colors hover:bg-white/6 hover:text-rose-500"
                                                        >
                                                            <HiOutlineTrash className="text-[16px]" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-[var(--text-muted)]">
                                                <HiOutlineUsers className="text-[12px] opacity-70" />
                                                {list.members.length}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-4 px-3 pb-5 pt-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Color Picker */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
                                                    {colors.map((color) => (
                                                        <button
                                                            key={color}
                                                            onClick={() => handleColorChange(list.id, color)}
                                                            className={`h-4 w-4 rounded-full transition-all duration-200 ${(list.color_list || colors[0]) === color ? 'scale-110 ring-2 ring-white shadow-[0_0_12px_rgba(255,255,255,0.45)]' : 'hover:scale-110'}`}
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Search/Watchlist */}
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Search accounts, sources, or type @handle"
                                                        className="w-full rounded-[4px] border-0 bg-white/7 px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-white/12"
                                                    />
                                                </div>

                                                <div className="px-0.5 text-[11px] font-medium leading-relaxed text-[var(--text-dim)]">
                                                    Browse {availableAccounts.length} accounts and {availableSources.length} sources from your saved watchlist.
                                                </div>

                                                {/* Members Section */}
                                                <div>
                                                    <h5 className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--text-dim)]">MEMBERS</h5>
                                                    {list.members.length === 0 ? (
                                                        <p className="px-2 text-[12px] leading-relaxed text-[var(--text-dim)]">
                                                            ยังไม่มีสมาชิกในลิสต์นี้ ลองพิมพ์ชื่อหรือ @handle เพื่อเพิ่มได้เลย
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-0.5">
                                                            {list.members.map((member) => {
                                                                const followedMatch = followedUsers.find(u => u.id === member.follower_user_id);
                                                                const memberAvatar = getMemberAvatar(member, followedMatch);
                                                                return (
                                                                    <div key={member.id} className="flex items-center gap-3 rounded-[8px] px-2 py-2 transition-colors hover:bg-white/5">
                                                                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#1c1c1c]">
                                                                            {memberAvatar ? (
                                                                                <img src={memberAvatar} alt="" className="h-full w-full object-cover" />
                                                                            ) : (
                                                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--text-dim)] capitalize">
                                                                                    {getInitial(member.follow_user_name)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <div className="truncate text-[14px] font-semibold leading-tight text-white">{member.follow_user_name}</div>
                                                                            <div className="truncate text-[12px] text-[var(--text-dim)]">{getMemberSourceLabel(member)}</div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleRemoveMember(member.id)}
                                                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--text-dim)] transition-colors hover:bg-white/6 hover:text-rose-500"
                                                                        >
                                                                            <HiXMark className="text-[17px]" />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Available accounts */}
                                                {availableAccounts.length > 0 && (
                                                    <div>
                                                        <h5 className="mb-2 border-t border-white/6 px-2 pt-4 text-[14px] font-extrabold text-white">
                                                            Available accounts ({availableAccounts.length})
                                                        </h5>
                                                        <div className="max-h-72 space-y-0.5 overflow-y-auto pr-1 custom-scrollbar">
                                                            {availableAccounts.map((user) => (
                                                                <div key={user.id} className="flex items-center gap-3 rounded-[8px] px-2 py-2 transition-colors hover:bg-white/5">
                                                                    {getFollowedAvatar(user) ? (
                                                                        <img
                                                                            src={getFollowedAvatar(user)}
                                                                            alt={getFollowedTitle(user)}
                                                                            className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover opacity-90"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-blue-600/20 text-[10px] font-black text-blue-300">
                                                                            {getInitial(getFollowedTitle(user))}
                                                                        </div>
                                                                    )}
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="truncate text-[14px] font-semibold leading-tight text-white">{getFollowedTitle(user)}</div>
                                                                        <div className="truncate text-[12px] text-[var(--text-dim)]">{getFollowedSourceLabel(user)}</div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleAddMember(list.id, user.id)}
                                                                        className="h-[30px] min-w-[56px] shrink-0 rounded-full border border-[var(--text-dim)] bg-transparent px-3 text-[12px] font-bold leading-none text-white transition-all hover:border-white hover:bg-white/10"
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Available sources */}
                                                {availableSources.length > 0 && (
                                                    <div>
                                                        <h5 className="mb-2 px-2 text-[14px] font-extrabold text-white">
                                                            Available sources ({availableSources.length})
                                                        </h5>
                                                        <div className="max-h-72 space-y-0.5 overflow-y-auto pr-1 custom-scrollbar">
                                                            {availableSources.map((user) => (
                                                                <div key={user.id} className="flex items-center gap-3 rounded-[8px] px-2 py-2 transition-colors hover:bg-white/5">
                                                                    {getFollowedAvatar(user) ? (
                                                                        <img
                                                                            src={getFollowedAvatar(user)}
                                                                            alt={getFollowedTitle(user)}
                                                                            className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover opacity-90"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[10px] font-black text-white">
                                                                            {getInitial(getFollowedTitle(user))}
                                                                        </div>
                                                                    )}
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="truncate text-[14px] font-semibold leading-tight text-white">{getFollowedTitle(user)}</div>
                                                                        <div className="truncate text-[12px] text-[var(--text-dim)]">{getFollowedSourceLabel(user)}</div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleAddMember(list.id, user.id)}
                                                                        className="h-[30px] min-w-[56px] shrink-0 rounded-full border border-[var(--text-dim)] bg-transparent px-3 text-[12px] font-bold leading-none text-white transition-all hover:border-white hover:bg-white/10"
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}} />
        </div>
    );
};

export default PostList;
