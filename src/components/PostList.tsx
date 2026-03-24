import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineShare, HiBars3BottomLeft } from 'react-icons/hi2';
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
    '#3B82F6', // Blue
    '#06B6D4', // Cyan
    '#22C55E', // Green
    '#EF4444', // Red
    '#F59E0B', // Orange
    '#A855F7', // Purple
    '#EC4899', // Pink
];

const PostList = ({ 
    showBorder = true, 
    activeId, 
    onSelect 
}: { 
    showBorder?: boolean,
    activeId?: number | null,
    onSelect?: (list: PostListWithMembers | null) => void
}) => {
    const [lists, setLists] = useState<PostListWithMembers[]>([]);
    const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListColor, setNewListColor] = useState(colors[0]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);

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

            // Fetch followed users
            const followResponse = await api.get(`${BASE_URL}/follow`);
            if (Array.isArray(followResponse.data)) {
                setFollowedUsers(followResponse.data);
            } else if (Array.isArray(followResponse.data?.data)) {
                setFollowedUsers(followResponse.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleCreateList = async () => {
        if (!newListName.trim()) return;
        try {
            await postListApi.createPostList(newListName, newListColor);
            setNewListName('');
            setNewListColor(colors[0]);
            setIsCreating(false);
            fetchAllData();
            toast.success('สร้างรายการสำเร็จ');
        } catch (error) {
            toast.error('ไม่สามารถสร้างรายการได้');
        }
    };

    const handleColorChange = async (listId: number, color: string) => {
        try {
            await postListApi.updatePostList(listId, { color_list: color });
            setLists(prev => prev.map(l => l.id === listId ? { ...l, color_list: color } : l));
            toast.success('อัพเดตสีสำเร็จ');
        } catch (error) {
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
            if (activeId === id && onSelect) onSelect(null);
            toast.success('ลบรายการสำเร็จ');
        } catch (error) {
            toast.error('ไม่สามารถลบรายการได้');
        }
    };

    const handleAddMember = async (listId: number, followerUserId: number) => {
        try {
            await postListApi.createPostListUser(listId, followerUserId);
            fetchAllData();
            toast.success('เพิ่มสมาชิกสำเร็จ');
        } catch (error) {
            console.error('Failed to add member:', error);
            toast.error('ไม่สามารถเพิ่มสมาชิกได้');
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        try {
            await postListApi.deletePostListUser(memberId);
            fetchAllData();
            toast.success('ลบสมาชิกแล้ว');
        } catch (error) {
            toast.error('ไม่สามารถลบสมาชิกได้');
        }
    };

    const getAvailableUsers = (currentMembers: PostListUser[]) => {
        const memberUserIds = new Set(currentMembers.map(m => m.follower_user_id));
        return followedUsers.filter(u => !memberUserIds.has(u.id));
    };

    return (
        <div className={`flex flex-col h-full bg-[#0d0d0e] ${showBorder ? 'border-l border-white/5' : ''} w-full max-w-full lg:max-w-xl mx-auto shrink-0 transition-all duration-500`}>

            {/* Header */}
            <div className="px-6 py-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-end gap-[3px] mb-1">
                        <div className="w-[3px] h-3 bg-white/80 rounded-full" />
                        <div className="w-[3px] h-5 bg-white rounded-full" />
                        <div className="w-[3px] h-4 bg-white/60 rounded-full" />
                        <div className="w-[3px] h-[18px] bg-white/40 rounded-full ml-0.5 transform rotate-20 origin-bottom" />
                    </div>
                    <span className="font-black text-lg tracking-[0.15em] text-gray-200">POST LIST</span>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="p-1 hover:bg-white/5 rounded-lg text-gray-400 group transition-all"
                >
                    <HiOutlinePlus className="text-2xl group-hover:text-white" />
                </button>
            </div>

            <div className="px-6">
                <div className="h-px w-full bg-white/5 mb-6" />
                <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase mb-4">YOUR LISTS</h3>
            </div>

            {/* Create Section */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 mb-4 overflow-hidden"
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
            <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-3">
                {isLoading && lists.length === 0 ? (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    lists.map((list) => {
                        const currentActiveId = activeId !== undefined ? activeId : selectedListId;
                        const isSelected = currentActiveId === list.id;
                        const availableUsers = getAvailableUsers(list.members);

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


                                className={`group bg-[#111112] border transition-all duration-300 cursor-pointer overflow-hidden ${isSelected ? 'border-white/20 rounded-4xl' : 'border-white/5 rounded-3xl hover:bg-[#1a1a1b]'}`}
                            >
                                <div className="p-3.5 flex items-center gap-4">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative transition-all duration-300"
                                        style={{
                                            backgroundColor: list.color_list || colors[0],
                                            boxShadow: isSelected ? `0 0 20px ${(list.color_list || colors[0])}40` : 'none'
                                        }}
                                    >
                                        <HiBars3BottomLeft className="text-2xl text-white transform -rotate-90" />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-white/10 rounded-2xl" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`font-extrabold text-sm truncate pr-2 tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-blue-400'}`}>
                                                {list.name}
                                            </h4>
                                            {isSelected && (
                                                <div className="flex items-center gap-1">
                                                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                                        <HiOutlineShare className="text-lg" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteList(e, list.id)}
                                                        className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                                                    >
                                                        <HiOutlineTrash className="text-lg" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-[11px] text-gray-500 font-bold mt-0.5">
                                            List • {list.members.length} accounts
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="px-6 pb-6 pt-2 space-y-6"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* Color Picker */}
                                            <div className="flex items-center gap-3">
                                                {colors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleColorChange(list.id, color)}
                                                        className={`w-6 h-6 rounded-full transition-all duration-200 ${(list.color_list || colors[0]) === color ? 'ring-2 ring-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'hover:scale-110'}`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>

                                            {/* Search/Watchlist */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search your watchlist or type @handle"
                                                    className="w-full bg-[#1c1c1e] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                                                />
                                            </div>

                                            <div className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                                Browse all {availableUsers.length} available accounts from your saved people and lists.
                                            </div>

                                            {/* Members Section */}
                                            <div>
                                                <h5 className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">MEMBERS</h5>
                                                {list.members.length === 0 ? (
                                                    <p className="text-[11px] text-gray-600 italic">
                                                        ยังไม่มีสมาชิกในลิสต์นี้ ลองพิมพ์ชื่อหรือ @handle เพื่อเพิ่มได้เลย
                                                    </p>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {list.members.map((member) => {
                                                            // Try to find avatar from followedUsers
                                                            const followedMatch = followedUsers.find(u => u.id === member.follower_user_id);
                                                            return (
                                                                <div key={member.id} className="flex items-center justify-between group/member animate-in slide-in-from-left duration-300">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/5 overflow-hidden">
                                                                            {followedMatch ? (
                                                                                <img src={followedMatch.profile_image_url_https} alt="" className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 capitalize">
                                                                                    {member.follow_user_name.charAt(0)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <div className="text-xs font-bold text-white truncate">{member.follow_user_name}</div>
                                                                            <div className="text-[10px] text-gray-500 truncate">@{member.follow_user_x_account}</div>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleRemoveMember(member.id)}
                                                                        className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-black text-gray-400 hover:text-rose-500 hover:border-rose-500 transition-all"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Available accounts */}
                                            <div>
                                                <h5 className="text-[10px] font-black tracking-widest text-gray-200 uppercase mb-4 border-t border-white/5 pt-4">
                                                    Available accounts ({availableUsers.length})
                                                </h5>
                                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {availableUsers.map((user) => (
                                                        <div key={user.id} className="flex items-center justify-between group/user animate-in slide-in-from-right duration-300">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={user.profile_image_url_https}
                                                                    alt={user.name}
                                                                    className="w-10 h-10 rounded-full border border-white/5 object-cover"
                                                                />
                                                                <div className="min-w-0">
                                                                    <div className="text-xs font-bold text-white truncate">{user.name}</div>
                                                                    <div className="text-[10px] text-gray-500 truncate">@{user.x_account}</div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleAddMember(list.id, user.id)}
                                                                className="px-5 py-1.5 rounded-full bg-white text-black text-[10px] font-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-lg"
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })
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
