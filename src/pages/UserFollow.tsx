import { useState, useEffect } from 'react';
import { FaTwitter, FaUserMinus, FaEllipsis, FaTrash } from 'react-icons/fa6';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from '../components/Layouts/Sidebar';
import api from '../api/axiosInstance';
import type { FollowedUser } from '../interface/userTarget';

const BASE_URL = import.meta.env.VITE_API_URL;

export const UserFollow = () => {
    const [users, setUsers] = useState<FollowedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const [userToDelete, setUserToDelete] = useState<FollowedUser | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeMenuId &&
                !(event.target as Element).closest('.menu-trigger') &&
                !(event.target as Element).closest('.menu-dropdown')
            ) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenuId]);

    const fetchFollowedUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`${BASE_URL}/follow`);

            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else if (Array.isArray(response.data?.data)) {
                setUsers(response.data.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching followed users:", error);
            toast.error("Failed to load followed users");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (user: FollowedUser) => {
        setUserToDelete(user);
        setActiveMenuId(null);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {

            await api.delete(`${BASE_URL}/follow/users/${userToDelete.id}`);
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            toast.success(`Unfollowed ${userToDelete.name}`);

        } catch (error: any) {
            console.error("Error deleting user:", error);
            if (error.response) {
                console.error("Error response data:", error.response.data);
            }
            toast.error("Failed to unfollow user");
        } finally {
            setUserToDelete(null);
        }
    };

    useEffect(() => {
        fetchFollowedUsers();
    }, []);

    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100">
            <Sidebar />
            <div className="flex-1 ml-20 lg:ml-80 p-4 lg:p-8 overflow-y-auto relative">
                <header className="mb-6 animate-fade-in-down">
                    <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-gray-100 bg-linear-to-r ">
                        บัญชีที่คุณกำลังติดตาม
                    </h1>
                    <p className="text-gray-400 text-xs mt-1 font-light tracking-wide">
                        ผู้คนล่าสุดที่ติดตามข่าวสาร
                    </p>
                </header>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-[#0f172a] rounded-xl h-48 animate-pulse border border-[#1e293b]"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {users.map((user) => (
                            <div key={user.id} className="group relative bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col items-center text-center">
                                {/* Decorative Gradient */}
                                <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                {/* Option Menu Trigger */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(activeMenuId === user.id ? null : user.id);
                                    }}
                                    className="menu-trigger absolute top-2 right-2 text-gray-500 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10 z-20"
                                >
                                    <FaEllipsis />
                                </button>

                                {/* Dropdown Menu */}
                                {activeMenuId === user.id && (
                                    <div className="menu-dropdown absolute top-9 right-2 bg-[#1e293b] border border-[#334155] rounded-lg shadow-xl z-30 overflow-hidden animate-fade-in p-1 min-w-[100px]">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(user);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-medium transition-colors cursor-pointer text-left rounded-md"
                                        >
                                            <FaTrash size={12} />
                                            <span>Unfollow</span>
                                        </button>
                                    </div>
                                )}

                                {/* Avatar */}
                                <div className="relative mb-3">
                                    <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500 w-20 h-20 mx-auto"></div>
                                    <img
                                        src={user.profile_image_url_https}
                                        alt={user.name}
                                        className="relative w-15 h-15 rounded-full border-2 border-[#0f172a] shadow-lg object-cover mx-auto"
                                    />
                                </div>

                                {/* Names */}
                                <h2 className="text-base font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors truncate w-full">
                                    {user.name}
                                </h2>
                                <p className="text-gray-500 text-xs mb-3 truncate w-full">
                                    {user.x_account.startsWith('@') ? user.x_account : `@${user.x_account}`}
                                </p>

                                {/* Actions */}
                                <div className="mt-auto w-full">
                                    <a
                                        href={`https://twitter.com/${user.x_account.replace('@', '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-1.5 bg-[#1e293b] hover:bg-[#2ae0d6]/10 text-gray-400 hover:text-[#2ae0d6] py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border border-transparent hover:border-[#2ae0d6]/30"
                                    >
                                        <FaTwitter />
                                        Profile
                                    </a>
                                </div>
                            </div>
                        ))}

                        {!isLoading && users.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                                <FaUserMinus className="text-5xl mb-3 opacity-20" />
                                <p className="text-base">You are not following anyone yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-up">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUserMinus className="text-3xl text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Unfollow {userToDelete.name}?</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Are you sure you want to stop following @{userToDelete.x_account.replace('@', '')}? This action cannot be undone immediately.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setUserToDelete(null)}
                                    className="flex-1 px-4 py-2.5 bg-[#1e293b] hover:bg-[#334155] text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-red-500/20"
                                >
                                    Unfollow
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155',
                },
            }} />
        </div>
    )
}

export default UserFollow;
