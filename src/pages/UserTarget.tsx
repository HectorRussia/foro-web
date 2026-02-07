import { useState } from 'react';
import { FaMagnifyingGlass, FaTwitter, FaUserPlus } from 'react-icons/fa6';
import { Toaster, toast } from 'react-hot-toast';
import { HiCheckBadge } from 'react-icons/hi2';
import Sidebar from '../components/Layouts/Sidebar';
import api from '../api/axiosInstance';
import type { UserTweetSearch } from '../interface/userTarget';


const BASE_URL = import.meta.env.VITE_API_URL;
const UserTarget = () => {

    const [searchQuery, setSearchQuery] = useState("Donald J. Trump");
    const [users, setUsers] = useState<UserTweetSearch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
    }

    const fetchUsers = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const response = await api.get(`${BASE_URL}/news/users/search?query=${searchQuery}`);
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

    const handleFollow = async (user: UserTweetSearch) => {
        try {

            await api.post(`${BASE_URL}/news/users/search`, {
                query: searchQuery,
                x_account: user.screen_name,
                name: user.name,
                profile_image_url_https: user.profile_image_url_https
            });

            toast.success(`Followed ${user.name} successfully`);

        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                const serverMessage = error.response.data.data?.message;
                toast.success(serverMessage || `You are already following ${user.name}`);
            } else {
                toast.error(`Failed to follow ${user.name}`);
            }
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100">
            <Sidebar />
            <div className="flex-1 ml-20 lg:ml-80 p-4 lg:p-8 overflow-y-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                        ค้นหากลุ่มเป้าหมาย
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">ค้นหาและติดตามบัญชีที่คุณสนใจ</p>
                </header>

                {/* Search Bar */}
                <div className="w-full max-w-2xl mb-8 relative group">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-lg group-hover:bg-blue-500/20 transition-all duration-300" />

                    <form onSubmit={handleSearch} className="relative flex items-center w-full">
                        {/* Wrapper Input */}
                        <div className="flex-1 relative bg-[#0f172a] border border-[#1e293b] rounded-full shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all overflow-hidden flex items-center pr-32">
                            <FaMagnifyingGlass className="absolute left-4 text-gray-400 text-lg z-10" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาชื่อผู้ใช้..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 pl-12 pr-4 py-3 font-light outline-none"
                            />
                        </div>

                        {/* Button Floating absolute or just nicely positioned */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-1.5 top-1.5 bottom-1.5 bg-linear-to-r cursor-pointer from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
                        </button>
                    </form>
                </div>

                {/* Results List */}
                <div className="grid gap-4">
                    {users.map((user) => (
                        <div key={user.id} className="group flex flex-col md:flex-row items-center gap-6 bg-[#0f172a] border border-[#1e293b] p-6 rounded-2xl hover:border-gray-600 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
                            {/* Avatar & Info */}
                            <div className="shrink-0 relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src={user.profile_image_url_https}
                                    alt={user.name}
                                    className="relative w-auto h-auto rounded-full border-4 border-[#1e293b] shadow-xl object-cover"
                                />
                                {user.isBlueVerified && (
                                    <div className="absolute bottom-1 right-1 bg-white text-blue-500 rounded-full p-0.5" title="Verified">
                                        <HiCheckBadge size={15} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left min-w-0 w-full">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                                    <h2 className="text-xl font-bold text-white truncate">{user.name}</h2>
                                    <span className="text-gray-500 text-sm">@{user.screen_name}</span>
                                </div>
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2 font-light max-w-2xl">
                                    {user.description}
                                </p>

                                <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-lg">{formatNumber(user.followers_count)}</span>
                                        <span className="text-xs">Followers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-lg">{formatNumber(user.following_count)}</span>
                                        <span className="text-xs">Following</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-lg">{formatNumber(user.statuses_count)}</span>
                                        <span className="text-xs">Posts</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
                                <button
                                    onClick={() => handleFollow(user)}
                                    className="cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
                                >
                                    <FaUserPlus />
                                    <span>Follow</span>
                                </button>
                                <a
                                    href={`https://twitter.com/${user.screen_name}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-[#1e293b] hover:bg-blue-600/10 hover:text-blue-400 hover:border-blue-500/50 border border-gray-700 rounded-xl text-gray-300 font-medium transition-all duration-200"
                                >
                                    <FaTwitter />
                                    <span>View Profile</span>
                                </a>
                            </div>
                        </div>
                    ))}
                    {!isLoading && users.length === 0 && (
                        <div className="text-center text-gray-500 py-10">
                            ไม่มีข้อมูล
                        </div>
                    )}
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    )
}

export default UserTarget;